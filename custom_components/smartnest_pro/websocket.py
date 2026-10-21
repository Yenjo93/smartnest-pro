"""WebSocket API the panel talks to: read, save, and watch the layout."""
from __future__ import annotations

import json
import time
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect, async_dispatcher_send
from homeassistant.helpers.event import async_call_later

from .const import DOMAIN, MAX_CONFIG_BYTES, SIGNAL_CONFIG_UPDATED


@callback
def async_register_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_get_config)
    websocket_api.async_register_command(hass, ws_save_config)
    websocket_api.async_register_command(hass, ws_subscribe_config)
    websocket_api.async_register_command(hass, ws_timer_set)
    websocket_api.async_register_command(hass, ws_timer_cancel)
    websocket_api.async_register_command(hass, ws_timer_list)


@websocket_api.websocket_command({vol.Required("type"): "smartnest_pro/config/get"})
@callback
def ws_get_config(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Any signed-in user can read the layout. None means the panel uses its defaults."""
    data = hass.data.get(DOMAIN)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "SmartNest is not set up")
        return
    connection.send_result(msg["id"], {"config": data["config"]})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): "smartnest_pro/config/save", vol.Required("config"): dict}
)
@websocket_api.async_response
async def ws_save_config(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Only admins can change the layout."""
    data = hass.data.get(DOMAIN)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "SmartNest is not set up")
        return
    config = msg["config"]
    if len(json.dumps(config)) > MAX_CONFIG_BYTES:
        connection.send_error(msg["id"], "too_large", "Layout is too large")
        return
    if not isinstance(config.get("hero"), dict) or not isinstance(config.get("settings"), dict):
        connection.send_error(msg["id"], "invalid_format", "Layout is malformed")
        return
    await data["store"].async_save(config)
    data["config"] = config
    async_dispatcher_send(hass, SIGNAL_CONFIG_UPDATED, config)
    connection.send_result(msg["id"])


@websocket_api.websocket_command({vol.Required("type"): "smartnest_pro/config/subscribe"})
@callback
def ws_subscribe_config(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Push saved changes to every open screen, so the wall tablet updates without a reload."""

    @callback
    def forward(config: dict[str, Any]) -> None:
        connection.send_message(websocket_api.event_message(msg["id"], {"config": config}))

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(hass, SIGNAL_CONFIG_UPDATED, forward)
    connection.send_result(msg["id"])


# Off-timers from the plan's device ring: "turn this off in 30 minutes". They live in HA, so they fire even when
# every screen is closed. They don't survive an HA restart.


def _timers(hass: HomeAssistant) -> dict[str, tuple[Any, float]]:
    return hass.data.setdefault(f"{DOMAIN}_timers", {})


def _cancel(hass: HomeAssistant, entity_id: str) -> None:
    entry = _timers(hass).pop(entity_id, None)
    if entry:
        entry[0]()


@websocket_api.websocket_command(
    {
        vol.Required("type"): "smartnest_pro/timer/set",
        vol.Required("entity_id"): str,
        vol.Required("minutes"): vol.All(vol.Coerce(float), vol.Range(min=0.5, max=24 * 60)),
    }
)
@callback
def ws_timer_set(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    entity_id = msg["entity_id"]
    if hass.states.get(entity_id) is None:
        connection.send_error(msg["id"], "not_found", "Unknown entity")
        return
    _cancel(hass, entity_id)
    delay = msg["minutes"] * 60

    async def fire(_now: Any) -> None:
        _timers(hass).pop(entity_id, None)
        await hass.services.async_call("homeassistant", "turn_off", {"entity_id": entity_id}, blocking=False)

    _timers(hass)[entity_id] = (async_call_later(hass, delay, fire), time.time() + delay)
    connection.send_result(msg["id"])


@websocket_api.websocket_command({vol.Required("type"): "smartnest_pro/timer/cancel", vol.Required("entity_id"): str})
@callback
def ws_timer_cancel(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    _cancel(hass, msg["entity_id"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command({vol.Required("type"): "smartnest_pro/timer/list"})
@callback
def ws_timer_list(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Seconds left per entity."""
    now = time.time()
    connection.send_result(msg["id"], {eid: max(0, round(ends - now)) for eid, (_h, ends) in _timers(hass).items()})
