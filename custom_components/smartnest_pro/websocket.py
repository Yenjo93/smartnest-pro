"""WebSocket API the panel talks to: read, save, and watch the layout."""
from __future__ import annotations

import json
import functools
import inspect
import time
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, Context, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect, async_dispatcher_send
from homeassistant.helpers.event import async_call_later

from .const import DOMAIN, MAX_CONFIG_BYTES, SIGNAL_CONFIG_UPDATED
from .platform import ActionDenied, config_for_user, entity_allowed, user_policy, validate_access


def require_license(func):
    """Check every request, including requests from already-open screens."""
    def allowed(hass, connection, msg):
        manager = hass.data.get(DOMAIN, {}).get("license")
        if manager is None or not manager.valid:
            connection.send_error(msg["id"], "license_required", "Activate SmartNest in integration settings")
            return False
        return True

    if inspect.iscoroutinefunction(func):
        @functools.wraps(func)
        async def async_wrapper(hass, connection, msg):
            if allowed(hass, connection, msg):
                return await func(hass, connection, msg)
        return async_wrapper

    @functools.wraps(func)
    def wrapper(hass, connection, msg):
        if allowed(hass, connection, msg):
            return func(hass, connection, msg)
    return wrapper


@websocket_api.websocket_command({vol.Required("type"): "smartnest_pro/license/status"})
@callback
def ws_license_status(hass, connection, msg):
    manager = hass.data.get(DOMAIN, {}).get("license")
    connection.send_result(msg["id"], manager.status() if manager else {"valid": False, "reason": "activation_required"})


@websocket_api.websocket_command({vol.Required("type"): "smartnest_pro/license/subscribe"})
@callback
def ws_license_subscribe(hass, connection, msg):
    @callback
    def forward(status):
        connection.send_message(websocket_api.event_message(msg["id"], status))

    connection.subscriptions[msg["id"]] = async_dispatcher_connect(hass, f"{DOMAIN}_license_updated", forward)
    connection.send_result(msg["id"])
    manager = hass.data.get(DOMAIN, {}).get("license")
    forward(manager.status() if manager else {"valid": False, "reason": "activation_required"})


@callback
def async_register_commands(hass: HomeAssistant) -> None:
    for command in (ws_access_get, ws_preferences_get, ws_preferences_save, ws_config_history, ws_action, ws_activity_list, ws_schedule_add, ws_schedule_list, ws_schedule_cancel):
        websocket_api.async_register_command(hass, command)
    websocket_api.async_register_command(hass, ws_license_status)
    websocket_api.async_register_command(hass, ws_license_subscribe)
    websocket_api.async_register_command(hass, ws_get_config)
    websocket_api.async_register_command(hass, ws_save_config)
    websocket_api.async_register_command(hass, ws_subscribe_config)
    websocket_api.async_register_command(hass, ws_timer_set)
    websocket_api.async_register_command(hass, ws_timer_cancel)
    websocket_api.async_register_command(hass, ws_timer_list)


@websocket_api.websocket_command({vol.Required("type"): "smartnest_pro/config/get"})
@callback
@require_license
def ws_get_config(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Any signed-in user can read the layout. None means the panel uses its defaults."""
    data = hass.data.get(DOMAIN)
    if data is None:
        connection.send_error(msg["id"], "not_loaded", "SmartNest is not set up")
        return
    connection.send_result(msg["id"], {"config": config_for_user(hass, data["config"], connection.user)})


@websocket_api.require_admin
@websocket_api.websocket_command(
    {vol.Required("type"): "smartnest_pro/config/save", vol.Required("config"): dict, vol.Optional("restore", default=False): bool}
)
@websocket_api.async_response
@require_license
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
    if not validate_access(config):
        connection.send_error(msg["id"], "invalid_format", "Access settings are malformed")
        return
    try:
        await data["platform"].async_save_config(config, restore=msg.get("restore", False))
    except ValueError as err:
        connection.send_error(msg["id"], "invalid_format", str(err))
        return
    async_dispatcher_send(hass, SIGNAL_CONFIG_UPDATED, data["config"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command({vol.Required("type"): "smartnest_pro/config/subscribe"})
@callback
@require_license
def ws_subscribe_config(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Push saved changes to every open screen, so the wall tablet updates without a reload."""

    @callback
    def forward(config: dict[str, Any]) -> None:
        manager = hass.data.get(DOMAIN, {}).get("license")
        if manager and manager.valid:
            connection.send_message(websocket_api.event_message(msg["id"], {"config": config_for_user(hass, config, connection.user)}))

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
@require_license
def ws_timer_set(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    entity_id = msg["entity_id"]
    if not entity_allowed(hass, hass.data[DOMAIN].get("config"), connection.user, entity_id, True):
        connection.send_error(msg["id"], "unauthorized", "You cannot control this device")
        return
    if hass.states.get(entity_id) is None:
        connection.send_error(msg["id"], "not_found", "Unknown entity")
        return
    _cancel(hass, entity_id)
    delay = msg["minutes"] * 60

    async def fire(_now: Any) -> None:
        _timers(hass).pop(entity_id, None)
        user = await hass.auth.async_get_user(connection.user.id)
        if user and user.is_active and entity_allowed(hass, hass.data.get(DOMAIN, {}).get("config"), user, entity_id, True):
            await hass.services.async_call("homeassistant", "turn_off", {"entity_id": entity_id}, blocking=False, context=Context(user_id=user.id))

    _timers(hass)[entity_id] = (async_call_later(hass, delay, fire), time.time() + delay)
    connection.send_result(msg["id"])


@websocket_api.websocket_command({vol.Required("type"): "smartnest_pro/timer/cancel", vol.Required("entity_id"): str})
@callback
@require_license
def ws_timer_cancel(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    if not entity_allowed(hass, hass.data[DOMAIN].get("config"), connection.user, msg["entity_id"], True):
        connection.send_error(msg["id"], "unauthorized", "You cannot control this device")
        return
    _cancel(hass, msg["entity_id"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command({vol.Required("type"): "smartnest_pro/timer/list"})
@callback
@require_license
def ws_timer_list(hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> None:
    """Seconds left per entity."""
    now = time.time()
    connection.send_result(msg["id"], {eid: max(0, round(ends - now)) for eid, (_h, ends) in _timers(hass).items() if entity_allowed(hass, hass.data[DOMAIN].get("config"), connection.user, eid, True)})


@websocket_api.websocket_command({vol.Required("type"): "smartnest_pro/access/get"})
@callback
@require_license
def ws_access_get(hass, connection, msg):
    policy = user_policy(hass.data[DOMAIN].get("config"), connection.user)
    expired = bool(policy and policy.get("expired"))
    connection.send_result(msg["id"], {
        "restricted": policy is not None,
        "areas": [] if policy is None or expired else policy.get("areas", []),
        "entities": [] if policy is None or expired else policy.get("entities", []),
        "guest_expired": expired,
        "child_mode": bool(policy and policy.get("child_mode")),
        "guest_until": (hass.data[DOMAIN].get("config") or {}).get("access", {}).get("users", {}).get(connection.user.id, {}).get("guest_until") if not connection.user.is_admin else None,
    })


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "smartnest_pro/config/history"})
@callback
@require_license
def ws_config_history(hass, connection, msg):
    connection.send_result(msg["id"], {"versions": list(reversed(hass.data[DOMAIN]["platform"].history))})


@websocket_api.websocket_command({
    vol.Required("type"): "smartnest_pro/action",
    vol.Required("domain"): str, vol.Required("service"): str, vol.Required("data"): dict,
})
@websocket_api.async_response
@require_license
async def ws_action(hass, connection, msg):
    if len(json.dumps(msg["data"])) > 16384:
        connection.send_error(msg["id"], "too_large", "Action is too large")
        return
    try:
        result = await hass.data[DOMAIN]["platform"].action(connection.user, msg["domain"], msg["service"], msg["data"])
    except ActionDenied as err:
        connection.send_error(msg["id"], "unauthorized", str(err))
    except Exception:
        connection.send_error(msg["id"], "action_failed", "The device did not complete the action")
    else:
        connection.send_result(msg["id"], result)


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "smartnest_pro/activity/list"})
@callback
@require_license
def ws_activity_list(hass, connection, msg):
    connection.send_result(msg["id"], {"events": list(reversed(hass.data[DOMAIN]["platform"].events))})


@websocket_api.require_admin
@websocket_api.websocket_command({
    vol.Required("type"): "smartnest_pro/schedule/add",
    vol.Required("entity_id"): str, vol.Required("at"): str,
})
@websocket_api.async_response
@require_license
async def ws_schedule_add(hass, connection, msg):
    try:
        row = await hass.data[DOMAIN]["platform"].add_schedule(connection.user, msg["entity_id"], msg["at"])
    except (ValueError, OverflowError) as err:
        connection.send_error(msg["id"], "invalid_schedule", str(err))
    else:
        connection.send_result(msg["id"], row)


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "smartnest_pro/schedule/list"})
@callback
@require_license
def ws_schedule_list(hass, connection, msg):
    connection.send_result(msg["id"], {"schedules": hass.data[DOMAIN]["platform"].schedules})


@websocket_api.require_admin
@websocket_api.websocket_command({vol.Required("type"): "smartnest_pro/schedule/cancel", vol.Required("id"): str})
@websocket_api.async_response
@require_license
async def ws_schedule_cancel(hass, connection, msg):
    await hass.data[DOMAIN]["platform"].remove_schedule(msg["id"])
    connection.send_result(msg["id"], {"success": True})


@websocket_api.websocket_command({vol.Required("type"): "smartnest_pro/preferences/get"})
@callback
@require_license
def ws_preferences_get(hass, connection, msg):
    try:
        preferences = hass.data[DOMAIN]["platform"].get_preferences(connection.user)
    except ActionDenied as err:
        connection.send_error(msg["id"], "unauthorized", str(err))
    else:
        connection.send_result(msg["id"], {"preferences": preferences})


@websocket_api.websocket_command({vol.Required("type"): "smartnest_pro/preferences/save", vol.Required("preferences"): dict})
@websocket_api.async_response
@require_license
async def ws_preferences_save(hass, connection, msg):
    try:
        await hass.data[DOMAIN]["platform"].save_preferences(connection.user, msg["preferences"])
    except ActionDenied as err:
        connection.send_error(msg["id"], "unauthorized", str(err))
    except ValueError as err:
        connection.send_error(msg["id"], "invalid_preferences", str(err))
    else:
        connection.send_result(msg["id"], {"success": True})
