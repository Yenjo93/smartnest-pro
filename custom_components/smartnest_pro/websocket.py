"""WebSocket API the panel talks to: read, save, and watch the layout."""
from __future__ import annotations

import json
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect, async_dispatcher_send

from .const import DOMAIN, MAX_CONFIG_BYTES, SIGNAL_CONFIG_UPDATED


@callback
def async_register_commands(hass: HomeAssistant) -> None:
    websocket_api.async_register_command(hass, ws_get_config)
    websocket_api.async_register_command(hass, ws_save_config)
    websocket_api.async_register_command(hass, ws_subscribe_config)


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
