"""Bounded confirmation of observable device state, without assuming service ACKs are state changes."""
from __future__ import annotations

import asyncio
import math
from typing import Any, Callable

CONFIRM_TIMEOUT = 5.0
POLL_INTERVAL = 0.1


def _number(value: Any) -> float | None:
    try:
        result = float(value)
        return result if math.isfinite(result) else None
    except (TypeError, ValueError):
        return None


def expectation(entity_id: str, service: str, data: dict, before: Any) -> Callable[[Any], bool] | None:
    """Return a predicate only for requested outcomes HA exposes reliably.

    Scenes, scripts, momentary buttons and unknown parameters are acknowledged,
    never advertised as physically confirmed. State is HA-reported, not an
    independent physical sensor guarantee.
    """
    domain = entity_id.split(".", 1)[0]
    previous = getattr(before, "state", None)
    if not isinstance(previous, str):
        return None
    wanted: str | None = None
    attributes: dict[str, Any] = {}
    supported = {"entity_id", "transition"}
    if domain in {"light", "switch", "input_boolean", "fan"} and service in {"turn_on", "turn_off", "toggle"}:
        wanted = "on" if service == "turn_on" else "off" if service == "turn_off" else "off" if previous == "on" else "on" if previous == "off" else None
        if domain == "light":
            if "brightness" in data:
                attributes["brightness"] = data["brightness"]
            if "brightness_pct" in data and _number(data["brightness_pct"]) is not None:
                attributes["brightness"] = round(float(data["brightness_pct"]) * 255 / 100)
            supported |= {"brightness", "brightness_pct"}
    elif domain == "lock" and service in {"lock", "unlock"}:
        wanted = "locked" if service == "lock" else "unlocked"
        supported |= {"code"}
    elif domain == "cover" and service in {"open_cover", "close_cover", "set_cover_position", "set_cover_tilt_position"}:
        if service == "set_cover_position":
            attributes["current_position"] = data.get("position")
            supported.add("position")
        elif service == "set_cover_tilt_position":
            attributes["current_tilt_position"] = data.get("tilt_position")
            supported.add("tilt_position")
        else:
            wanted = "open" if service == "open_cover" else "closed"
    elif domain == "climate" and service in {"set_temperature", "set_hvac_mode", "set_fan_mode", "set_swing_mode", "set_preset_mode", "set_humidity", "turn_off"}:
        if service == "turn_off":
            wanted = "off"
        elif service == "set_hvac_mode":
            wanted = data.get("hvac_mode")
            supported.add("hvac_mode")
        elif service == "set_temperature":
            attributes = {key: data[key] for key in ("temperature", "target_temp_high", "target_temp_low") if key in data}
            supported |= {"temperature", "target_temp_high", "target_temp_low", "hvac_mode"}
            wanted = data.get("hvac_mode")
        else:
            parameter = service.removeprefix("set_")
            attributes["humidity" if parameter == "humidity" else parameter] = data.get(parameter)
            supported.add(parameter)
    elif domain == "fan" and service == "set_percentage":
        attributes["percentage"] = data.get("percentage")
        supported.add("percentage")
    elif domain in {"select", "input_select"} and service == "select_option":
        wanted = data.get("option")
        supported.add("option")
    elif domain in {"number", "input_number"} and service == "set_value":
        supported.add("value")
        target = _number(data.get("value"))
        if target is None or set(data) - supported:
            return None
        return lambda state: state is not None and (value := _number(getattr(state, "state", None))) is not None and abs(value - target) < .001
    elif domain == "media_player" and service in {"media_play", "media_pause", "volume_set", "volume_mute"}:
        if service in {"media_play", "media_pause"}:
            wanted = "playing" if service == "media_play" else "paused"
        else:
            key = "volume_level" if service == "volume_set" else "is_volume_muted"
            attributes[key] = data.get(key)
            supported.add(key)
    if (wanted is None and not attributes) or set(data) - supported or any(value is None for value in attributes.values()):
        return None

    def matches(state: Any) -> bool:
        actual = getattr(state, "state", None)
        if not isinstance(actual, str) or actual in {"unavailable", "unknown"} or (wanted is not None and actual != wanted):
            return False
        current = getattr(state, "attributes", {})
        for key, value in attributes.items():
            observed = current.get(key)
            if type(value) in (int, float):
                number = _number(observed)
                tolerance = 2 if key == "brightness" else .02 if key == "volume_level" else .1
                if number is None or abs(number - value) > tolerance:
                    return False
            elif observed != value:
                return False
        return True
    return matches


async def confirm(hass: Any, predicates: dict[str, Callable[[Any], bool]], *, timeout: float = CONFIRM_TIMEOUT) -> dict:
    """Poll only the explicit action targets for at most five seconds in total."""
    if not predicates:
        return {"success": True, "confirmation": "accepted", "confirmed_entities": [], "unconfirmed_entities": []}
    pending = set(predicates)
    confirmed: set[str] = set()
    deadline = asyncio.get_running_loop().time() + max(0, min(timeout, CONFIRM_TIMEOUT))
    while pending:
        for identifier in tuple(pending):
            if predicates[identifier](hass.states.get(identifier)):
                pending.remove(identifier)
                confirmed.add(identifier)
        remaining = deadline - asyncio.get_running_loop().time()
        if not pending or remaining <= 0:
            break
        await asyncio.sleep(min(POLL_INTERVAL, remaining))
    return {"success": True, "confirmation": "unconfirmed" if pending else "confirmed", "confirmed_entities": sorted(confirmed), "unconfirmed_entities": sorted(pending)}
