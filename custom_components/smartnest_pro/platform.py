"""SmartNest-owned history, action policy, activity and persistent scene schedules.

These restrictions apply to SmartNest only. They do not change Home Assistant user
permissions or hide states exposed by Home Assistant's own API.
"""
from __future__ import annotations

import asyncio
import copy
import logging
from datetime import datetime, timezone
import re
import time
from typing import Any
from uuid import uuid4

_LOGGER = logging.getLogger(__name__)
STATE_DOMAINS = {"light", "switch", "climate", "cover", "lock", "fan", "vacuum", "media_player", "input_boolean", "alarm_control_panel"}

ENTITY = re.compile(r"^[a-z_][a-z0-9_]*\.[a-z0-9_]+$")
SERVICES = {
    "homeassistant": {"turn_on", "turn_off", "toggle"},
    "light": {"turn_on", "turn_off", "toggle"},
    "switch": {"turn_on", "turn_off", "toggle"},
    "input_boolean": {"turn_on", "turn_off", "toggle"},
    "climate": {"turn_on", "turn_off", "set_temperature", "set_hvac_mode", "set_fan_mode", "set_swing_mode", "set_preset_mode", "set_humidity"},
    "fan": {"turn_on", "turn_off", "toggle", "set_percentage", "set_preset_mode", "oscillate", "set_direction"},
    "cover": {"open_cover", "close_cover", "stop_cover", "toggle", "set_cover_position", "open_cover_tilt", "close_cover_tilt", "stop_cover_tilt", "set_cover_tilt_position"},
    "lock": {"lock", "unlock", "open"},
    "alarm_control_panel": {"alarm_arm_home", "alarm_arm_away", "alarm_arm_night", "alarm_arm_vacation", "alarm_arm_custom_bypass", "alarm_disarm", "alarm_trigger"},
    "scene": {"turn_on"}, "script": {"turn_on", "turn_off", "toggle"},
    "button": {"press"}, "input_button": {"press"},
    "media_player": {"turn_on", "turn_off", "toggle", "media_play", "media_pause", "media_play_pause", "media_stop", "media_next_track", "media_previous_track", "volume_set", "volume_up", "volume_down", "volume_mute", "select_source", "select_sound_mode", "shuffle_set", "repeat_set", "play_media", "media_seek"},
    "vacuum": {"start", "stop", "pause", "return_to_base", "locate", "clean_spot", "set_fan_speed", "send_command"},
    "lawn_mower": {"start_mowing", "pause", "dock"},
    "humidifier": {"turn_on", "turn_off", "set_humidity", "set_mode"},
    "water_heater": {"set_temperature", "set_operation_mode", "set_away_mode"},
    "select": {"select_option", "select_next", "select_previous"},
    "input_select": {"select_option", "select_next", "select_previous"},
    "number": {"set_value"}, "input_number": {"set_value"},
    "remote": {"send_command", "turn_on", "turn_off", "toggle"},
}


class ActionDenied(ValueError):
    """An action is not authorized by SmartNest or Home Assistant."""


def user_policy(config: dict | None, user: Any, now: float | None = None) -> dict | None:
    if user.is_admin:
        return None
    access = (config or {}).get("access", {})
    policy = access.get("users", {}).get(user.id) if isinstance(access, dict) else None
    if policy is None:
        return None
    if not isinstance(policy, dict):
        return {"expired": True}
    expiry = policy.get("guest_until")
    if expiry is not None and (type(expiry) not in (float, int) or expiry <= (time.time() if now is None else now)):
        return {"expired": True}
    return policy


def validate_access(config: dict) -> bool:
    access = config.get("access")
    if access is None:
        return True
    if not isinstance(access, dict) or not isinstance(access.get("users", {}), dict):
        return False
    for uid, policy in access.get("users", {}).items():
        if not isinstance(uid, str) or not isinstance(policy, dict):
            return False
        for key in ("areas", "entities"):
            if key in policy and (not isinstance(policy[key], list) or len(policy[key]) > 1000 or any(not isinstance(item, str) for item in policy[key])):
                return False
        if "guest_until" in policy and (type(policy["guest_until"]) not in (float, int) or not 0 < policy["guest_until"] < 1e12):
            return False
    return True


def entity_area(hass: Any, entity_id: str) -> str | None:
    from homeassistant.helpers import device_registry as dr, entity_registry as er
    entity = er.async_get(hass).async_get(entity_id)
    if not entity:
        return None
    if entity.area_id:
        return entity.area_id
    device = dr.async_get(hass).async_get(entity.device_id) if entity.device_id else None
    return device.area_id if device else None


def entity_allowed(hass: Any, config: dict | None, user: Any, entity_id: str, control: bool = False) -> bool:
    if not isinstance(entity_id, str) or not ENTITY.fullmatch(entity_id):
        return False
    if not user.is_admin and not user.permissions.check_entity(entity_id, "control" if control else "read"):
        return False
    policy = user_policy(config, user)
    if policy is None:
        return True
    if policy.get("expired"):
        return False
    if entity_id in policy.get("entities", []):
        return True
    # A scene/script can control entities outside its area. Restricted users must
    # be granted that scene/script explicitly by the owner.
    if entity_id.split(".", 1)[0] in {"scene", "script"}:
        return False
    return entity_area(hass, entity_id) in policy.get("areas", [])


def action_targets(hass: Any, config: dict | None, user: Any, domain: str, service: str, data: dict) -> list[str]:
    if service not in SERVICES.get(domain, set()):
        raise ActionDenied("Action is not supported by SmartNest")
    if any(key in data for key in ("area_id", "device_id", "floor_id", "label_id", "target", "entity_ids")):
        raise ActionDenied("Choose explicit entities")
    targets = data.get("entity_id")
    targets = [targets] if isinstance(targets, str) else targets
    if not isinstance(targets, list) or not 1 <= len(targets) <= 100:
        raise ActionDenied("Choose explicit entities")
    if not all(isinstance(eid, str) and entity_allowed(hass, config, user, eid, True) for eid in targets):
        raise ActionDenied("You cannot control this device")
    if domain != "homeassistant" and any(eid.split(".", 1)[0] != domain for eid in targets):
        raise ActionDenied("Entity domain does not match action")
    if any(hass.states.get(eid) is None for eid in targets):
        raise ActionDenied("A selected device no longer exists")
    return list(dict.fromkeys(targets))


def config_for_user(hass: Any, config: dict | None, user: Any) -> dict | None:
    if config is None or user.is_admin:
        return config
    result = copy.deepcopy(config)
    result.pop("access", None)
    policy = user_policy(config, user)
    if policy is None:
        return result
    permitted = lambda eid: entity_allowed(hass, config, user, eid)
    def scrub(value):
        if isinstance(value, str) and ENTITY.fullmatch(value):
            return value if permitted(value) else None
        if isinstance(value, list):
            return [clean for child in value if (clean := scrub(child)) is not None]
        if isinstance(value, dict):
            if isinstance(value.get("entity"), str) and not permitted(value["entity"]):
                return None
            return {key: clean for key, child in value.items()
                    if not (ENTITY.fullmatch(key) and not permitted(key)) and (clean := scrub(child)) is not None}
        return value
    result = scrub(result)
    allowed_areas = policy.get("areas", []) if not policy.get("expired") else []
    result["rooms"] = {area: settings for area, settings in result.get("rooms", {}).items() if area in allowed_areas}
    result.get("hero", {}).pop("image", None)
    for floor in result.get("plan", {}).get("floors", []):
        floor["rooms"] = [room for room in floor.get("rooms", []) if room.get("area") in allowed_areas]
        floor["furniture"] = [item for item in floor.get("furniture", []) if item.get("entity") and permitted(item["entity"])]
        floor["walls"], floor["doors"] = [], []
        floor.pop("underlay", None)
    return result


class Platform:
    def __init__(self, hass: Any) -> None:
        from homeassistant.helpers.storage import Store
        self.hass = hass
        self.store = Store(hass, 1, "smartnest_pro.platform")
        self.history: list[dict] = []
        self.events: list[dict] = []
        self.schedules: list[dict] = []
        self.preferences: dict[str, dict] = {}
        self.cancels: dict[str, Any] = {}
        self.lock = asyncio.Lock()
        self._state_cancel = None
        self._state_active = False

    async def async_load(self) -> None:
        data = await self.store.async_load() or {}
        self.history = data.get("history", [])[-10:]
        self.events = data.get("events", [])[-200:]
        self.preferences = data.get("preferences", {}) if isinstance(data.get("preferences", {}), dict) else {}
        now = time.time()
        # Missed schedules are not replayed on startup: an old scene must not run unexpectedly.
        self.schedules = [row for row in data.get("schedules", []) if row.get("timestamp", 0) > now]
        for row in self.schedules:
            self._arm(row)
        await self._persist()

    async def _persist(self) -> None:
        await self.store.async_save({"history": self.history[-10:], "events": self.events[-200:], "schedules": self.schedules, "preferences": self.preferences})

    def get_preferences(self, user: Any) -> dict:
        from .const import DOMAIN
        config = self.hass.data.get(DOMAIN, {}).get("config")
        policy = user_policy(config, user)
        if policy and policy.get("expired"):
            raise ActionDenied("Guest access has expired")
        result = copy.deepcopy(self.preferences.get(user.id, {}))
        if "favorites" in result:
            result["favorites"] = [eid for eid in result["favorites"] if entity_allowed(self.hass, config, user, eid)]
        return result

    async def save_preferences(self, user: Any, changes: dict) -> None:
        from .const import DOMAIN
        pages = {"home", "rooms", "climate", "lights", "robot", "family", "energy", "security", "media"}
        allowed = {"favorites", "start_page", "page_order", "simple_mode", "font_scale", "high_contrast"}
        if not isinstance(changes, dict) or set(changes) - allowed:
            raise ValueError("Unknown preference")
        # This also validates guest expiry before any preference is changed.
        self.get_preferences(user)
        config = self.hass.data.get(DOMAIN, {}).get("config")
        for name, value in changes.items():
            if name == "favorites":
                if not isinstance(value, list) or len(value) > 100 or any(not isinstance(eid, str) or not entity_allowed(self.hass, config, user, eid) for eid in value) or len(set(value)) != len(value):
                    raise ValueError("Choose up to 100 permitted favorite entities")
            elif name == "start_page":
                if not isinstance(value, str) or value not in pages:
                    raise ValueError("Unknown start page")
            elif name == "page_order":
                if not isinstance(value, list) or len(value) > len(pages) or any(not isinstance(page, str) or page not in pages for page in value) or len(set(value)) != len(value):
                    raise ValueError("Page order must contain distinct valid pages")
            elif name in {"simple_mode", "high_contrast"}:
                if type(value) is not bool:
                    raise ValueError("Preference must be true or false")
            elif name == "font_scale":
                if type(value) not in (int, float) or not .9 <= value <= 1.5:
                    raise ValueError("Font scale must be between 0.9 and 1.5")
        async with self.lock:
            current = self.preferences.get(user.id, {})
            self.preferences[user.id] = {**current, **copy.deepcopy(changes)}
            await self._persist()

    async def async_save_config(self, config: dict) -> None:
        from .const import DOMAIN
        async with self.lock:
            data = self.hass.data[DOMAIN]
            old = data.get("config")
            if old is not None and old != config:
                self.history.append({"id": str(uuid4()), "created_at": time.time(), "config": copy.deepcopy(old)})
                self.history = self.history[-10:]
                await self._persist()
            await data["store"].async_save(config)
            data["config"] = config

    async def audit(self, user: str, domain: str, service: str, entities: list[str], success: bool, *, from_state: str | None = None, to_state: str | None = None, state_event: bool = False) -> None:
        async with self.lock:
            if state_event and not self._state_active:
                return
            record = {"at": time.time(), "user": user, "domain": domain, "service": service, "entities": entities, "success": success}
            if from_state is not None and to_state is not None:
                record.update(from_state=from_state[:80], to_state=to_state[:80])
            self.events.append(record)
            self.events = self.events[-200:]
            await self._persist()

    def listen_states(self) -> None:
        """Listen once per integration entry; HA owns listener coroutine tasks."""
        from homeassistant.const import EVENT_STATE_CHANGED
        if self._state_cancel is not None:
            return
        self._state_active = True
        self._state_cancel = self.hass.bus.async_listen(EVENT_STATE_CHANGED, self._state_changed)

    async def _state_changed(self, event: Any) -> None:
        if not self._state_active:
            return
        identifier = event.data.get("entity_id")
        if not isinstance(identifier, str) or not ENTITY.fullmatch(identifier):
            return
        domain = identifier.split(".", 1)[0]
        if domain not in STATE_DOMAINS:
            return
        old, new = event.data.get("old_state"), event.data.get("new_state")
        # Ignore entity registration/removal and attribute-only updates. Never
        # retain complete State objects, attributes, names, codes or locations.
        previous, current = getattr(old, "state", None), getattr(new, "state", None)
        if not isinstance(previous, str) or not isinstance(current, str) or previous == current:
            return
        user = getattr(getattr(event, "context", None), "user_id", None)
        user = user[:80] if isinstance(user, str) and user else "homeassistant"
        try:
            await self.audit(user, domain, "state_changed", [identifier], True, from_state=previous, to_state=current, state_event=True)
        except Exception:
            _LOGGER.warning("SmartNest state activity could not be saved")

    async def action(self, user: Any, domain: str, service: str, data: dict) -> None:
        from homeassistant.core import Context
        from .const import DOMAIN
        state = self.hass.data.get(DOMAIN, {})
        manager = state.get("license")
        if not manager or not manager.valid:
            raise ActionDenied("Activate SmartNest to control devices")
        entities = action_targets(self.hass, state.get("config"), user, domain, service, data)
        try:
            await self.hass.services.async_call(domain, service, data, blocking=True, context=Context(user_id=user.id))
        except Exception:
            try:
                await self.audit(user.id, domain, service, entities, False)
            except Exception:
                _LOGGER.warning("SmartNest action audit could not be saved")
            raise
        try:
            await self.audit(user.id, domain, service, entities, True)
        except Exception:
            # The device already received its command. Do not report failure and
            # encourage a duplicate command only because local audit storage failed.
            _LOGGER.warning("SmartNest action audit could not be saved")

    async def add_schedule(self, user: Any, entity_id: str, at: str) -> dict:
        from .const import DOMAIN
        if len(at) > 64:
            raise ValueError("Invalid scheduled time")
        if entity_id.split(".", 1)[0] not in {"scene", "script"}:
            raise ValueError("Choose a scene or script")
        parsed = datetime.fromisoformat(at.replace("Z", "+00:00"))
        if parsed.tzinfo is None:
            raise ValueError("Schedule must include a time zone")
        stamp = parsed.timestamp()
        if not time.time() + 5 <= stamp <= time.time() + 366 * 86400:
            raise ValueError("Choose a future time within one year")
        action_targets(self.hass, self.hass.data[DOMAIN].get("config"), user, entity_id.split(".", 1)[0], "turn_on", {"entity_id": entity_id})
        row = {"id": str(uuid4()), "entity_id": entity_id, "at": parsed.astimezone(timezone.utc).isoformat(), "timestamp": stamp, "user_id": user.id}
        async with self.lock:
            if len(self.schedules) >= 100:
                raise ValueError("Schedule limit reached")
            self.schedules.append(row)
            await self._persist()
            self._arm(row)
        return row

    async def remove_schedule(self, identifier: str) -> None:
        async with self.lock:
            cancel = self.cancels.pop(identifier, None)
            if cancel:
                cancel()
            self.schedules = [row for row in self.schedules if row["id"] != identifier]
            await self._persist()

    def _arm(self, row: dict) -> None:
        from homeassistant.helpers.event import async_track_point_in_utc_time
        async def fire(_now):
            await self.remove_schedule(row["id"])
            user = await self.hass.auth.async_get_user(row["user_id"])
            if not user or not user.is_active or not user.is_admin:
                return
            try:
                await self.action(user, row["entity_id"].split(".", 1)[0], "turn_on", {"entity_id": row["entity_id"]})
            except Exception:
                # action records service failures. Avoid logging data or credentials.
                return
        self.cancels[row["id"]] = async_track_point_in_utc_time(self.hass, fire, datetime.fromtimestamp(row["timestamp"], timezone.utc))

    def unload(self) -> None:
        self._state_active = False
        if self._state_cancel is not None:
            self._state_cancel()
            self._state_cancel = None
        for cancel in self.cancels.values():
            cancel()
        self.cancels.clear()
