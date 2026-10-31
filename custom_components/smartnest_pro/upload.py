"""House image upload."""
from __future__ import annotations

from http import HTTPStatus
import os
import secrets

from aiohttp import web

from homeassistant.components.http import KEY_HASS_USER, HomeAssistantView
from homeassistant.core import HomeAssistant

from .const import DOMAIN, FILES_URL, MAX_UPLOAD_BYTES

# Raster formats only. SVG is refused: served from HA's own origin it could carry script.
_SIGNATURES: list[tuple[bytes, str]] = [
    (b"\x89PNG\r\n\x1a\n", ".png"),
    (b"\xff\xd8\xff", ".jpg"),
]


def _detect(head: bytes) -> str | None:
    for sig, ext in _SIGNATURES:
        if head.startswith(sig):
            return ext
    if head[:4] == b"RIFF" and head[8:12] == b"WEBP":
        return ".webp"
    return None


class SmartNestProUploadView(HomeAssistantView):
    """POST /api/smartnest_pro/upload with a multipart `file`; admins only."""

    url = "/api/smartnest_pro/upload"
    name = "api:smartnest_pro:upload"
    requires_auth = True

    def __init__(self, hass: HomeAssistant, files_dir: str) -> None:
        self._hass = hass
        self._dir = os.path.join(files_dir, "house")

    async def post(self, request: web.Request) -> web.Response:
        user = request[KEY_HASS_USER]
        if not user.is_admin:
            return self.json_message("Admin only", HTTPStatus.FORBIDDEN)

        manager = self._hass.data.get(DOMAIN, {}).get("license")
        if manager is None or not manager.valid:
            return self.json_message("Activate SmartNest in integration settings", HTTPStatus.FORBIDDEN)

        reader = await request.multipart()
        field = await reader.next()
        while field is not None and getattr(field, "name", None) != "file":
            field = await reader.next()
        if field is None:
            return self.json_message("Missing file", HTTPStatus.BAD_REQUEST)

        chunks: list[bytes] = []
        size = 0
        while chunk := await field.read_chunk(256 * 1024):
            size += len(chunk)
            if size > MAX_UPLOAD_BYTES:
                return self.json_message("File too large", HTTPStatus.REQUEST_ENTITY_TOO_LARGE)
            chunks.append(chunk)
        body = b"".join(chunks)

        # Trust the bytes, not the filename or the declared content type.
        ext = _detect(body[:16])
        if ext is None:
            return self.json_message("Use a PNG, JPG or WebP image", HTTPStatus.UNSUPPORTED_MEDIA_TYPE)

        name = f"{secrets.token_hex(16)}{ext}"
        await self._hass.async_add_executor_job(self._write, name, body)
        return self.json({"url": f"{FILES_URL}/house/{name}"})

    def _write(self, name: str, body: bytes) -> None:
        os.makedirs(self._dir, exist_ok=True)
        with open(os.path.join(self._dir, name), "wb") as fh:
            fh.write(body)
