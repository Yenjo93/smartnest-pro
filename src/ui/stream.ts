// Smooth camera video. WebRTC through Home Assistant (its built-in go2rtc, Frigate, Reolink…) when the camera
// offers it: full frame rate, low delay. Otherwise HA's MJPEG stream, and a refreshed snapshot as the last resort.
import type { Hass } from "../types";

export type StreamMode = "webrtc" | "mjpeg" | "snapshot";

const types = new Map<string, Promise<string[]>>();

/** The stream types HA can give for a camera ("web_rtc", "hls"), asked once per camera. */
export function streamTypes(hass: Hass, entity: string): Promise<string[]> {
  let p = types.get(entity);
  if (!p) {
    p = hass
      .callWS<{ frontend_stream_types: string[] }>({ type: "camera/capabilities", entity_id: entity })
      .then((r) => r.frontend_stream_types ?? [])
      .catch(() => []);
    types.set(entity, p);
  }
  return p;
}

/** HA's MJPEG stream address for a camera, or undefined when it has no picture. */
export function mjpegUrl(hass: Hass, entity: string): string | undefined {
  const pic = hass.states[entity]?.attributes.entity_picture as string | undefined;
  return pic?.includes("/api/camera_proxy/") ? pic.replace("/api/camera_proxy/", "/api/camera_proxy_stream/") : undefined;
}

/** A fresh snapshot address (the counter defeats the browser cache). */
export function snapshotUrl(hass: Hass, entity: string, n: number): string | undefined {
  const pic = hass.states[entity]?.attributes.entity_picture as string | undefined;
  return pic && `${pic}${pic.includes("?") ? "&" : "?"}t=${n}`;
}

/**
 * The lighter stream of the same camera for small tiles: Reolink and similar integrations add a second camera
 * entity on the same device ("…_fluent", "…_sub"). Falls back to the camera itself.
 */
export function subStream(hass: Hass, entity: string): string {
  const LOW = /fluent|_sub|sub_|substream|_low|_ext/i;
  if (LOW.test(entity)) return entity;
  const dev = hass.entities?.[entity]?.device_id;
  if (!dev) return entity;
  const sib = Object.values(hass.entities ?? {}).find(
    (e) => e.device_id === dev && e.entity_id !== entity && e.entity_id.startsWith("camera.") && LOW.test(e.entity_id) && hass.states[e.entity_id]?.state !== "unavailable",
  );
  return sib?.entity_id ?? entity;
}

/**
 * Plays a camera into a <video> over WebRTC. Resolves with a stop function once the first frame is in;
 * rejects (and cleans up) when the camera can't, or nothing arrives within 10 s. `onDrop` runs if the
 * connection dies later (Wi-Fi blip, HA restart), so the caller can start again.
 */
export async function startWebRtc(hass: Hass, entity: string, video: HTMLVideoElement, onDrop?: () => void): Promise<() => void> {
  const cfg = await hass
    .callWS<{ configuration?: RTCConfiguration; dataChannel?: string }>({ type: "camera/webrtc/get_client_config", entity_id: entity })
    .catch(() => ({}) as { configuration?: RTCConfiguration; dataChannel?: string });
  const pc = new RTCPeerConnection(cfg.configuration ?? {});
  if (cfg.dataChannel) pc.createDataChannel(cfg.dataChannel);
  pc.addTransceiver("video", { direction: "recvonly" });
  pc.addTransceiver("audio", { direction: "recvonly" });
  const media = new MediaStream();
  pc.ontrack = (e) => {
    media.addTrack(e.track);
    video.srcObject = media;
    video.play().catch(() => {});
  };

  let session: string | undefined;
  const pending: RTCIceCandidateInit[] = [];
  const send = (candidate: RTCIceCandidateInit) =>
    hass.callWS({ type: "camera/webrtc/candidate", entity_id: entity, session_id: session, candidate }).catch(() => {});
  pc.onicecandidate = (e) => {
    if (!e.candidate) return;
    const c = e.candidate.toJSON();
    if (session) send(c);
    else pending.push(c);
  };

  let fail!: (err: Error) => void;
  const failed = new Promise<never>((_, reject) => (fail = reject));
  failed.catch(() => {});
  let started = false;
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  let unsub: (() => void) | undefined;
  const stop = () => {
    unsub?.();
    unsub = undefined;
    pc.close();
    if (video.srcObject === media) video.srcObject = null;
  };
  try {
    unsub = await hass.connection.subscribeMessage<any>(
      async (msg) => {
        try {
          if (msg.type === "session") {
            session = msg.session_id;
            pending.splice(0).forEach(send);
          } else if (msg.type === "answer") await pc.setRemoteDescription({ type: "answer", sdp: msg.answer });
          else if (msg.type === "candidate")
            // Newer HA sends a candidate object, older a bare string.
            await pc.addIceCandidate(typeof msg.candidate === "string" ? { candidate: msg.candidate, sdpMLineIndex: 0 } : msg.candidate).catch(() => {});
          else if (msg.type === "error") fail(new Error(msg.message ?? "webrtc"));
        } catch (err: any) {
          fail(err);
        }
      },
      { type: "camera/webrtc/offer", entity_id: entity, offer: offer.sdp },
    );
    pc.onconnectionstatechange = () => {
      if (pc.connectionState !== "failed") return;
      if (started) {
        stop();
        onDrop?.();
      } else fail(new Error("webrtc failed"));
    };
    await Promise.race([
      new Promise<void>((res) => video.addEventListener("loadeddata", () => res(), { once: true })),
      failed,
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("webrtc timeout")), 10_000)),
    ]);
  } catch (err) {
    stop();
    throw err;
  }
  started = true;
  return stop;
}
