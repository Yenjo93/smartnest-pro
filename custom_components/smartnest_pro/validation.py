"""Validate saved/imported layouts before replacing the active dashboard."""
from __future__ import annotations

import math
import re
from typing import Any


def validate_config(config: Any) -> None:
    """Accept legacy version-one layouts; reject incompatible or unsafe shapes.

    Unknown optional fields remain forward-compatible within schema version one.
    No normalization is performed here: a malformed import must not silently
    replace a good layout with an empty/default one.
    """
    def fail(detail: str) -> None:
        raise ValueError(detail)

    def number(value: Any, label: str, *, positive: bool = False) -> None:
        if type(value) not in (int, float) or not math.isfinite(value) or abs(value) > 1e9 or (positive and value <= 0):
            fail(f"Invalid {label}")

    def text(value: Any, label: str) -> None:
        if not isinstance(value, str) or len(value) > 10000:
            fail(f"Invalid {label}")

    def strings(value: Any, label: str) -> None:
        if not isinstance(value, list) or len(value) > 10000 or any(not isinstance(item, str) for item in value):
            fail(f"Invalid {label}")

    def tree(value: Any, depth: int = 0) -> None:
        if depth > 30:
            fail("Layout nesting is too deep")
        if value is None or type(value) in (str, bool, int):
            return
        if type(value) is float:
            if not math.isfinite(value):
                fail("Layout contains a non-finite number")
            return
        if isinstance(value, list):
            if len(value) > 20000:
                fail("Layout list is too large")
            for item in value:
                tree(item, depth + 1)
            return
        if isinstance(value, dict):
            if len(value) > 20000 or any(not isinstance(key, str) for key in value):
                fail("Invalid layout object")
            for item in value.values():
                tree(item, depth + 1)
            return
        fail("Layout contains an unsupported value")

    if not isinstance(config, dict):
        fail("Layout must be an object")
    tree(config)
    version = config.get("version", 1)
    if type(version) is not int or version != 1:
        fail("Unsupported layout version; export a compatible version-one backup")
    if not isinstance(config.get("settings"), dict) or not isinstance(config.get("hero"), dict):
        fail("Layout requires settings and hero objects")
    for key in ("home", "rooms", "pages", "names", "robots", "experience", "access", "door"):
        if key in config and not isinstance(config[key], dict):
            fail(f"Invalid {key} settings")
    aliases = config.get("aliases", {})
    if not isinstance(aliases, dict) or len(aliases) > 10000:
        fail("Invalid entity aliases")
    for identifier, values in aliases.items():
        if not re.fullmatch(r"[a-z_][a-z0-9_]*\.[a-z0-9_]+", identifier) or not isinstance(values, list) or len(values) > 8:
            fail("Invalid entity aliases")
        if any(not isinstance(value, str) or not value.strip() or len(value) > 60 for value in values):
            fail("Aliases must be up to eight non-empty strings of at most 60 characters")
    experience = config.get("experience", {})
    if "critical_entities" in experience:
        strings(experience["critical_entities"], "critical entities")
        if len(experience["critical_entities"]) > 1000 or any(not re.fullmatch(r"[a-z_][a-z0-9_]*\.[a-z0-9_]+", identifier) for identifier in experience["critical_entities"]):
            fail("Invalid critical entities")
    if "tariff_schedule" in experience:
        schedule = experience["tariff_schedule"]
        if not isinstance(schedule, list) or len(schedule) > 24:
            fail("Invalid tariff schedule")
        covered = set()
        for slot in schedule:
            if not isinstance(slot, dict):
                fail("Invalid tariff period")
            start, end = slot.get("start"), slot.get("end")
            def hour(value):
                if isinstance(value, str) and re.fullmatch(r"(?:[01]\d|2[0-3]):00", value):
                    return int(value[:2])
                return 24 if value == "24:00" else None
            first, last = hour(start), hour(end)
            if first is None or last is None or first == 24 or first == last:
                fail("Tariff periods must use distinct whole-hour boundaries")
            number(slot.get("rate"), "tariff rate")
            if slot["rate"] < 0:
                fail("Tariff rate cannot be negative")
            length = (last - first + 24) % 24 or 24
            for index in range(length):
                current = (first + index) % 24
                if current in covered:
                    fail("Tariff periods cannot overlap")
                covered.add(current)
    if "maintenance" in experience:
        tasks = experience["maintenance"]
        if not isinstance(tasks, list) or len(tasks) > 1000:
            fail("Invalid maintenance tasks")
        for task in tasks:
            if not isinstance(task, dict):
                fail("Invalid maintenance task")
            if "usage_entity" in task:
                identifier = task["usage_entity"]
                if not isinstance(identifier, str) or not re.fullmatch(r"[a-z_][a-z0-9_]*\.[a-z0-9_]+", identifier):
                    fail("Invalid maintenance usage entity")
            if "usage_interval" in task:
                number(task["usage_interval"], "maintenance usage interval", positive=True)
            if "usage_baseline" in task:
                number(task["usage_baseline"], "maintenance usage baseline")
    for field in ("devices", "scenes"):
        if field in config.get("home", {}):
            strings(config["home"][field], f"home {field}")
    if "pins" in config["hero"]:
        if not isinstance(config["hero"]["pins"], list):
            fail("Invalid image markers")
        for pin in config["hero"]["pins"]:
            if not isinstance(pin, dict):
                fail("Invalid image marker")
            for key in ("x", "y"):
                number(pin.get(key), "image marker position")
    for room in config.get("rooms", {}).values():
        if not isinstance(room, dict):
            fail("Invalid room settings")
    for page in config.get("pages", {}).values():
        if not isinstance(page, dict):
            fail("Invalid page settings")
        if "hidden" in page:
            strings(page["hidden"], "hidden page devices")
    if "plan" not in config:
        return
    plan = config["plan"]
    if not isinstance(plan, dict) or not isinstance(plan.get("floors", []), list) or len(plan.get("floors", [])) > 64:
        fail("Invalid plan floors")
    if "hidden" in plan:
        strings(plan["hidden"], "hidden plan devices")
    if not isinstance(plan.get("devices", {}), dict):
        fail("Invalid plan devices")
    for marker in plan.get("devices", {}).values():
        if not isinstance(marker, dict):
            fail("Invalid plan device position")
        text(marker.get("floor"), "plan device floor")
        for key in ("x", "y"):
            number(marker.get(key), "plan device position")
    floor_ids = set()
    for floor in plan.get("floors", []):
        if not isinstance(floor, dict):
            fail("Invalid floor")
        identifier = floor.get("id")
        text(identifier, "floor identifier")
        if not identifier or identifier in floor_ids:
            fail("Floor identifiers must be unique")
        floor_ids.add(identifier)
        if "name" in floor:
            text(floor["name"], "floor name")
        if "wallHeight" in floor:
            number(floor["wallHeight"], "wall height", positive=True)
        for key in ("rooms", "doors", "walls", "furniture"):
            items = floor.get(key, [])
            if not isinstance(items, list) or len(items) > 5000:
                fail(f"Invalid floor {key}")
            identifiers = set()
            for item in items:
                if not isinstance(item, dict):
                    fail(f"Invalid {key} entry")
                identifier = item.get("id")
                text(identifier, f"{key} identifier")
                if not identifier or identifier in identifiers:
                    fail(f"Duplicate or empty {key} identifier")
                identifiers.add(identifier)
                coords = ("x", "y", "w", "h") if key == "rooms" else ("x1", "y1", "x2", "y2") if key == "walls" else ("x", "y", "rot") if key == "furniture" else ()
                for name in coords:
                    number(item.get(name), f"{key} {name}", positive=name in ("w", "h"))
                if key == "furniture":
                    text(item.get("type"), "furniture type")
                if key == "doors":
                    number(item.get("width"), "door width", positive=True)
                    if "x" in item or "y" in item:
                        number(item.get("x"), "door position")
                        number(item.get("y"), "door position")
                    elif item.get("axis") not in ("h", "v"):
                        fail("Invalid legacy door axis")
                    else:
                        number(item.get("line"), "legacy door line")
                        number(item.get("at"), "legacy door position")
                if "pts" in item:
                    points = item["pts"]
                    if not isinstance(points, list) or not 3 <= len(points) <= 5000:
                        fail("Invalid room polygon")
                    for point in points:
                        if not isinstance(point, dict):
                            fail("Invalid polygon point")
                        number(point.get("x"), "polygon position")
                        number(point.get("y"), "polygon position")
        if "underlay" in floor:
            underlay = floor["underlay"]
            if not isinstance(underlay, dict):
                fail("Invalid plan image")
            text(underlay.get("url"), "plan image URL")
            for key in ("x", "y", "width", "opacity"):
                number(underlay.get(key), f"plan image {key}", positive=key == "width")
