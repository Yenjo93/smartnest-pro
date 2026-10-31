# SmartNest

A Home Assistant dashboard panel: a live 3D floor plan of your home, energy, climate, favorite devices, scenes and a room panel. Beige, dark and Night purple themes, English and Arabic (RTL), and layouts for wall tablets, desktops and phones.

Integration domain: `smartnest_pro`, so it installs next to the original SmartNest (`smartnest`) without clashing.

## Install (HACS)

The built panel (`custom_components/smartnest_pro/frontend/`) is committed, so HACS needs no build step.

1. In HA: **HACS → ⋮ → Custom repositories**, add `https://github.com/Yenjo93/smartnest-pro`, type **Integration**.
2. Download **SmartNest**, restart Home Assistant.
3. **Settings → Devices & services → Add integration → SmartNest**. Enter the customer license key. A "SmartNest" entry appears in the sidebar.

## Online licensing

Owners can create, copy/download and revoke keys at [the private administration page](https://licenses.smartnest.pro/admin). Plans: 3 calendar months, 6 calendar months, 1 year or lifetime, starting at issuance. The panel password is stored privately on the owner device and never committed.

For the smartnest.pro Cloudflare deployment, see [Cloudflare setup](license-service/cloudflare/README.md).

SmartNest requires an online license from the service in [license-service/README.md](license-service/README.md). This build uses the deployed Cloudflare service at `https://licenses.smartnest.pro`. Issue a customer key using the owner CLI, then give the customer only that key. For a different deployment, run `python3 scripts/configure-license-service.py https://YOUR-REAL-LICENSE-DOMAIN` before distributing the integration. Keep the owner admin token on the server only.

- Each key binds to one installation identity stored in `.storage/smartnest_pro.installation`. Multiple tablets/phones on the same HA installation share that license. No HA tokens, entities or layouts are sent to the service.
- Validation happens on startup and every hour. Explicit rejection immediately invalidates the cached license; connected screens lock within about one minute after HA receives it. Revocation is therefore not instantaneous.
- After a successful validation, network outages permit up to 72 hours offline, never beyond license expiration. Restarting does not extend this grace. Blocking the license server can defer revocation only until the existing lease expires.
- Existing installations must use **Settings → Devices & services → SmartNest → Reconfigure** to enter the key. Their saved layout stays intact. Reconfigure also replaces an expired key. Only the provider changes the service address using the configuration script and redistributes the updated integration.
- Invalid licenses block the dashboard and its config/upload/timer APIs. Home Assistant and previously scheduled off-timers continue operating; uploaded files and frontend assets are not a digital-rights boundary.
- Installation identity is persisted separately from the integration entry. Removing/readding the integration does not release its binding. For a replacement HA installation, reset the binding from the owner CLI and immediately activate the replacement. Full HA backup clones can share the identity; local code and storage remain accessible to the machine owner.

Verification: `python3 -m unittest discover -s tests -v`, then `(cd license-service && python3 -m unittest -v)` and `npm run build`. The Python client tests use lightweight HA substitutes; deployment must still be checked on a real Home Assistant installation.

## Set it up

Open the panel as an admin on a tablet or computer and press **Edit** (editing is off on phones).

- **Floor plan**: *Edit plan* on the Home plan.
  - *Rooms*: drag a rectangle on the grid, or select a room to move it, drag its corners to reshape it, or tap **+** on an edge to add a corner. Link each room to an HA Area.
  - *Shape*: tap the corners of a room of any shape; tap the first corner again to close it.
  - *Walls*: tap where a wall starts and ends, at any angle; it keeps going until you tap the last point again.
  - *Doors*: tap a wall to cut a doorway. *Open*: tap a wall to take it out (open-plan kitchen and living room); tap the dashed line to bring it back.
  - *Photo*: trace over a picture of your real plan. Add floors with **+**. Walls appear wherever rooms have edges, merged where rooms meet.
- **Furniture**: the *Furniture* tool in *Edit plan* has ~195 pieces (smart, living, bedroom, kitchen, bath, office, outdoor, structure) with search. Tap one, tap the plan to place it, drag to move, rotate in 15°/90° steps, set its height above the floor (e.g. the AC above the TV), its size, and its length (stretch a counter or wardrobe to fit the wall). Each floor has its own wall height. Smart pieces link to a device and react: the AC glows and blows (blue cooling, orange heating), fans spin at their speed, lamps light up in the bulb's colour, the TV screen comes on, curtains open to their position, the robot drives around while cleaning, speakers pulse while playing. Tap a linked piece to switch its device; hold it for the ring.
- **Moving around the plan**: drag to pan, pinch or scroll to zoom, twist two fingers (or right-drag / Shift-drag with a mouse) or use the rotate buttons to turn it; the angle is remembered per screen. The 👁 button picks the view height: from above, high, normal, low or eye level. The crosshair button switches **zoom to device**: when on, tapping a device or a linked piece of furniture glides to it and opens its controls instead of switching it.
- **Home** is the floor plan: the scenes bar runs along the top, tapping a room glides the camera into it and slides its panel in, tapping outside zooms back out. Energy sensors are picked in *Settings*.
- **Devices on the plan** appear in their room automatically; in edit mode drag them to their real spot or tap ✕ to hide one. Outside edit mode a tap switches a device, a hold opens its ring: power, brightness, an off-timer (runs in HA), colour, details.
- **Live effects**: lights make a pool of light in their colour, running AC tints the floor blue or orange, occupied rooms pulse, and an open door or window sensor lights the room's doorways amber.
- **Cards**: each card's ⚙ picks its entities: energy meter (kWh, `total_increasing`) and solar sensors, thermostat and humidity, favorite devices, scene/script buttons.
- **Rooms** come from HA **Areas**. The room panel's ⚙ adds size, and which thermostat, temperature, humidity and occupancy sensor to use, and hides devices.
- **Robot rooms**: on the Robot page (or the robot's popup), tap rooms on the dashboard's own 3D floor plan (picked rooms light up), pick suction, mop mode and passes, then *Clean*. The first time, an admin taps ⚙ and *Read rooms from the robot* (Roborock): rooms are matched to the plan by name, or picked by hand. Sends `vacuum.send_command` `app_segment_clean` with `[{segments, repeat}]`.
- **Colour lights**: their popup has brightness next to a colour wheel with quick colours, and a warm-to-cool white slider for lights with colour temperature.
- **Names at the top and room names**: as an admin, tap the greeting name on Home to set the greeting name and the dashboard title. Tap a room's name in its panel (or use the room's settings) to rename it on the dashboard or hide it.
- **Smooth cameras**: cameras play over WebRTC when Home Assistant offers it (Frigate, Reolink, go2rtc…), at the camera's full frame rate, falling back to the MJPEG stream and then to snapshots. The Security page plays every visible camera live on its lighter stream (Reolink's *Fluent* entity, or any camera entity on the same device named `…_sub`/`…_fluent`); the popup plays the full one. Streams stop when they scroll out of view or the screen sleeps.
- **What's on the TV**: in *Edit plan*, select a TV (or monitor) and pick a camera under *Picture (camera)*, e.g. a capture card through Hyperion or go2rtc. While the TV is on, its screen on the plan shows a frame every 5 s, live video while you're zoomed into its room, and the TV's popup plays it live above the remote.
- **Cameras on the plan**: the *Security camera* piece (Furniture → Smart) links to a camera, shows a faint cone where it looks (rotate the piece to aim it), and a tap opens it live. With Frigate, when the camera sees a person (`binary_sensor.<camera>_person_occupancy`) the camera pulses red, its room turns red and a card with the latest snapshot (`image.<camera>_person`) appears; tap it for live video. Outdoor cameras (outside every room) always alert; indoor ones only while nobody is home.
- **Door popup**: in *Edit → Settings → Front door*, pick the doorbell (a binary sensor that turns on, or an event entity), the door camera, and what opens the door (lock, script, button or switch). When the bell rings, kiosk screens show the door camera live with *Hold to open*; it closes after 90 s. *Try the popup* shows it straight away.
- **Screensaver**: kiosk screens rest after 2 minutes untouched on a big clock with the date, the weather and who's home. It drifts every minute so nothing burns in, and dims at night (22:00–06:00). A tap goes back to Home; a doorbell press wakes it straight to the door camera.
- **Weather**: the temperature and sky sit in the top bar (the first `weather.` entity, or the one in *Settings*); a tap shows now plus the next five days.
- **Power on the plan**: place the *Electric panel* piece (Furniture → Smart) on an outside wall, link it to your grid power sensor (W or kW), and turn it so its back faces outside. Dots flow in along a line, faster and from green to orange to red as the house draws more, with the number next to it. Animations run at 30 fps to go easy on a wall tablet.
- **Kiosk mode**: in *Edit → Settings*, set a PIN and tick *Kiosk mode on this screen*. That screen hides Home Assistant's sidebar, and the Edit button becomes a 🔒: editing, renaming and leaving kiosk mode need the PIN. It is per screen, so your phone stays normal. For a wall tablet signed in as a non-admin user, open the dashboard with `?kiosk` at the end of the address (`?kiosk=0` turns it off).
- **Device names**: as an admin, open any device and tap ✏️ *Rename* to give it a dashboard name (Home Assistant's own name stays as it is; the ↺ button goes back to it).
- **Settings**: home name, language, theme, default room, reduce effects.

**Save** stores the layout in HA (`.storage/smartnest_pro.dashboard`) and pushes it to every open screen. Anyone can view; only admins can save.

## Develop

```bash
npm install
```

```bash
npm run dev
```

Opens `dev/index.html` with a fake Home Assistant (`dev/mock.ts`). The demo house picture is local only (`custom_components/smartnest_pro/frontend/static/house-default.jpg`, git-ignored); without it the demo shows the placeholder. The dev bar switches English/Arabic, dark, an empty setup, and a non-admin user.

```bash
npm run build
```

Typechecks, builds the panel into `custom_components/smartnest_pro/frontend/`, and copies the version from `package.json` into `manifest.json`. Bump `version` in `package.json` before each release so browsers fetch the new build.

## Layout

```
custom_components/smartnest_pro/   the integration HACS installs
  __init__.py      registers the panel, static paths, upload view
  websocket.py     smartnest_pro/config/get | save | subscribe, timer/set | cancel | list
  upload.py        POST /api/smartnest_pro/upload (admins, raster images only)
  frontend/        built panel
src/
  app.ts           panel shell: loading, theme, layouts, edit mode
  plan/            3D floor plan: geometry, three.js scene, live effects, editor
  cards/           energy, climate, devices, room panel, scenes
  pages/           rooms, climate, lights, robot, family, energy, security, media
  settings.ts      edit-mode sheets
  ha.ts            hass helpers (areas, room info, toggles)
  i18n.ts          English + Arabic strings
dev/               mock Home Assistant for local work
```

Pages: Home, Rooms, Climate, Lights, Robot, Family, Energy, Security, Media. Pages with no matching devices are hidden.
