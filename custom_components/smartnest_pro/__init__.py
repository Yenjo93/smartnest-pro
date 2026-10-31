"""SmartNest: a custom panel plus the storage and upload API behind it."""
from __future__ import annotations

import logging
import os
import time
from datetime import timedelta

from homeassistant.components import frontend, panel_custom
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.storage import Store
from homeassistant.loader import async_get_integration

from .const import (
    DOMAIN,
    FILES_DIR,
    FILES_URL,
    FRONTEND_DIR,
    PANEL_COMPONENT,
    PANEL_ICON,
    PANEL_TITLE,
    PANEL_URL_PATH,
    STATIC_URL,
    STORAGE_KEY,
    STORAGE_VERSION,
)
from .license_server import LICENSE_SERVICE_URL
from .licensing import LicenseManager, CHECK_SECONDS
from .upload import SmartNestProUploadView
from .websocket import async_register_commands

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

# Routes and WebSocket commands can't be unregistered, so they're added once per HA run.
_REGISTERED = f"{DOMAIN}_registered"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Load the saved layout and show the panel."""
    store: Store[dict] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
    hass.data[DOMAIN] = {"store": store, "config": await store.async_load()}

    license_manager = LicenseManager(hass, entry, LICENSE_SERVICE_URL)
    await license_manager.async_initialize()
    hass.data[DOMAIN]["license"] = license_manager
    next_check = time.monotonic() + (CHECK_SECONDS if license_manager.valid else 300)
    last_status = license_manager.status()

    async def check_license(_now):
        nonlocal next_check, last_status
        if time.monotonic() >= next_check:
            await license_manager.async_refresh()
            next_check = time.monotonic() + (CHECK_SECONDS if license_manager.valid else 300)
        status = license_manager.status()
        if status != last_status:
            last_status = status
            async_dispatcher_send(hass, f"{DOMAIN}_license_updated", status)

    entry.async_on_unload(async_track_time_interval(hass, check_license, timedelta(minutes=1)))

    files_dir = hass.config.path(FILES_DIR)
    await hass.async_add_executor_job(os.makedirs, files_dir, 0o755, True)

    if not hass.data.get(_REGISTERED):
        await hass.http.async_register_static_paths(
            [
                # No caching: after a HACS update, a reload is enough to pick up the new build.
                StaticPathConfig(STATIC_URL, str(FRONTEND_DIR), False),
                # Upload names are random and never reused, so these can be cached.
                StaticPathConfig(FILES_URL, files_dir, True),
            ]
        )
        hass.http.register_view(SmartNestProUploadView(hass, files_dir))
        async_register_commands(hass)
        hass.data[_REGISTERED] = True

    integration = await async_get_integration(hass, DOMAIN)
    version = str(integration.version)
    stamp = await hass.async_add_executor_job(_build_stamp)

    await panel_custom.async_register_panel(
        hass,
        frontend_url_path=PANEL_URL_PATH,
        webcomponent_name=PANEL_COMPONENT,
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        module_url=f"{STATIC_URL}/smartnest-pro-panel.js?v={version}-{stamp}",
        embed_iframe=False,
        require_admin=False,
        config={"asset_base": f"{STATIC_URL}/static/", "version": version},
    )
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Remove the panel; the saved layout stays on disk."""
    frontend.async_remove_panel(hass, PANEL_URL_PATH)
    for cancel, _ends in hass.data.pop(f"{DOMAIN}_timers", {}).values():
        cancel()
    hass.data.pop(DOMAIN, None)
    return True


def _build_stamp() -> int:
    """Changes whenever a new panel build is copied in, so browsers fetch it fresh."""
    js = FRONTEND_DIR / "smartnest-pro-panel.js"
    try:
        return int(js.stat().st_mtime)
    except OSError:
        _LOGGER.error("SmartNest panel build missing at %s", js)
        return 0
