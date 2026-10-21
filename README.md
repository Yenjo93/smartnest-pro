# SmartNest

A Home Assistant dashboard panel: a live 3D floor plan of your home, energy, climate, favorite devices, scenes and a room panel. Beige, dark and Night purple themes, English and Arabic (RTL), and layouts for wall tablets, desktops and phones.

Integration domain: `smartnest_pro`, so it installs next to the original SmartNest (`smartnest`) without clashing.

## Install (HACS)

The built panel (`custom_components/smartnest_pro/frontend/`) is committed, so HACS needs no build step.

1. In HA: **HACS → ⋮ → Custom repositories**, add `https://github.com/Yenjo93/smartnest-pro`, type **Integration**.
2. Download **SmartNest**, restart Home Assistant.
3. **Settings → Devices & services → Add integration → SmartNest**. A "SmartNest" entry appears in the sidebar.

## Set it up

Open the panel as an admin on a tablet or computer and press **Edit** (editing is off on phones).

- **Floor plan**: *Edit plan* on the Home plan.
  - *Rooms*: drag a rectangle on the grid, or select a room to move it, drag its corners to reshape it, or tap **+** on an edge to add a corner. Link each room to an HA Area.
  - *Shape*: tap the corners of a room of any shape; tap the first corner again to close it.
  - *Walls*: tap where a wall starts and ends, at any angle; it keeps going until you tap the last point again.
  - *Doors*: tap a wall to cut a doorway. *Open*: tap a wall to take it out (open-plan kitchen and living room); tap the dashed line to bring it back.
  - *Photo*: trace over a picture of your real plan. Add floors with **+**. Walls appear wherever rooms have edges, merged where rooms meet.
- **Furniture**: the *Furniture* tool in *Edit plan* has ~140 pieces (smart, living, bedroom, kitchen, bath, office, outdoor) with search. Tap one, tap the plan to place it, drag to move, rotate in 15°/90° steps, set its height above the floor (e.g. the AC above the TV) and its size. Each floor has its own wall height. Smart pieces link to a device and react: the AC glows and blows (blue cooling, orange heating), fans spin at their speed, lamps light up in the bulb's colour, the TV screen comes on, curtains open to their position, the robot drives around while cleaning, speakers pulse while playing. Tap a linked piece to switch its device; hold it for the ring.
- **Moving around the plan**: drag to pan, pinch or scroll to zoom, twist two fingers (or right-drag / Shift-drag with a mouse) or use the rotate buttons to turn it; the angle is remembered per screen. The crosshair button switches **zoom to device**: when on, tapping a device or a linked piece of furniture glides to it and opens its controls instead of switching it.
- **Home** is the floor plan: the scenes bar runs along the top, tapping a room glides the camera into it and slides its panel in, tapping outside zooms back out. Energy sensors are picked in *Settings*.
- **Devices on the plan** appear in their room automatically; in edit mode drag them to their real spot or tap ✕ to hide one. Outside edit mode a tap switches a device, a hold opens its ring: power, brightness, an off-timer (runs in HA), colour, details.
- **Live effects**: lights make a pool of light in their colour, running AC tints the floor blue or orange, occupied rooms pulse, and an open door or window sensor lights the room's doorways amber.
- **Cards**: each card's ⚙ picks its entities: energy meter (kWh, `total_increasing`) and solar sensors, thermostat and humidity, favorite devices, scene/script buttons.
- **Rooms** come from HA **Areas**. The room panel's ⚙ adds size, and which thermostat, temperature, humidity and occupancy sensor to use, and hides devices.
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
