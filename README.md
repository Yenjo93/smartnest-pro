# SmartNest

A Home Assistant dashboard panel: a house picture with live pins, energy, climate, favorite devices, scenes and a room panel. Light and dark themes, English and Arabic (RTL), and layouts for wall tablets, desktops and phones.

Integration domain: `smartnest_pro`, so it installs next to the original SmartNest (`smartnest`) without clashing.

## Install (HACS)

The built panel (`custom_components/smartnest_pro/frontend/`) is committed, so HACS needs no build step.

1. In HA: **HACS → ⋮ → Custom repositories**, add `https://github.com/Yenjo93/smartnest-pro`, type **Integration**.
2. Download **SmartNest**, restart Home Assistant.
3. **Settings → Devices & services → Add integration → SmartNest**. A "SmartNest" entry appears in the sidebar.

## Set it up

Open the panel as an admin on a tablet or computer and press **Edit** (editing is off on phones).

- **House picture**: *Change image* uploads your own PNG/JPG/WebP (saved under `<config>/smartnest_pro/house/`). Until then the panel shows an "add a picture" placeholder.
- **Pins**: *Add pin*, then drag it into place. Tap a pin to bind it to a room (selects that room in the side panel) or a device (toggles it, or opens HA's dialog). Positions are stored as percentages of the picture.
- **Cards**: each card's ⚙ picks its entities: energy meter (kWh, `total_increasing`) and solar sensors, thermostat and humidity, favorite devices, scene/script buttons.
- **Rooms** come from HA **Areas**. The room panel's ⚙ adds size, and which thermostat, temperature, humidity and occupancy sensor to use, and hides devices.
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
  websocket.py     smartnest_pro/config/get | save | subscribe
  upload.py        POST /api/smartnest_pro/upload (admins, raster images only)
  frontend/        built panel
src/
  app.ts           panel shell: loading, theme, layouts, edit mode
  cards/           house hero, energy, climate, devices, room panel, scenes
  pages/           rooms, climate, lights, robot, family, energy, security, media
  settings.ts      edit-mode sheets
  ha.ts            hass helpers (areas, room info, toggles)
  i18n.ts          English + Arabic strings
dev/               mock Home Assistant for local work
```

Pages: Home, Rooms, Climate, Lights, Robot, Family, Energy, Security, Media. Pages with no matching devices are hidden.
