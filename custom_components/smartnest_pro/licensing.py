"""Online licensing. Never send Home Assistant credentials or device data."""
from __future__ import annotations

import asyncio
import hashlib
import math
import time
from typing import Any
from urllib.parse import urlsplit
from uuid import uuid4

MAX_LEASE_SECONDS = 3 * 24 * 60 * 60
CHECK_SECONDS = 60 * 60
CONF_LICENSE_KEY = "license_key"


class LicenseDenied(Exception):
    """The service explicitly rejected this license."""


class LicenseUnavailable(Exception):
    """The service could not provide a trustworthy response."""


def normalize_url(value: str) -> str:
    """Require TLS with no credentials, query or fragment."""
    value = value.strip().rstrip("/")
    try:
        parsed = urlsplit(value)
        port = parsed.port
    except ValueError as err:
        raise ValueError("invalid_url") from err
    if (parsed.scheme != "https" or not parsed.hostname or parsed.username is not None
            or parsed.password is not None or parsed.query or parsed.fragment
            or any(c.isspace() for c in value) or (port is not None and port < 1)):
        raise ValueError("invalid_url")
    return value


def lease_deadline(payload: Any, now: float) -> float:
    if not isinstance(payload, dict) or payload.get("valid") is not True:
        raise LicenseUnavailable()
    lease = payload.get("lease_seconds")
    expires = payload.get("expires_at")
    if (isinstance(lease, bool) or not isinstance(lease, (int, float))
            or not math.isfinite(lease) or lease <= 0):
        raise LicenseUnavailable()
    deadline = now + min(lease, MAX_LEASE_SECONDS)
    if expires is not None:
        if isinstance(expires, bool) or not isinstance(expires, (int, float)) or not math.isfinite(expires):
            raise LicenseUnavailable()
        deadline = min(deadline, expires)
    if deadline <= now:
        raise LicenseDenied("expired")
    return deadline


async def validate(session: Any, url: str, key: str, installation_id: str) -> dict:
    """Redirects are refused so a key cannot be forwarded to another host."""
    import aiohttp

    try:
        async with session.post(
            f"{normalize_url(url)}/v1/validate",
            json={"license_key": key.strip(), "installation_id": installation_id},
            timeout=aiohttp.ClientTimeout(total=15), allow_redirects=False,
        ) as response:
            if response.status in (400, 401, 403):
                raise LicenseDenied("invalid_license")
            if response.status != 200:
                raise LicenseUnavailable()
            chunks = []
            size = 0
            async for chunk in response.content.iter_chunked(4096):
                size += len(chunk)
                if size > 8192:
                    raise LicenseUnavailable()
                chunks.append(chunk)
            raw = b"".join(chunks)
            import json
            payload = json.loads(raw)
            lease_deadline(payload, time.time())
            return payload
    except (aiohttp.ClientError, asyncio.TimeoutError, ValueError, TypeError) as err:
        raise LicenseUnavailable() from err


async def installation_id(hass: Any) -> str:
    """Persist separately from config entries so reinstalling retains the binding."""
    from homeassistant.helpers.storage import Store

    store = Store(hass, 1, "smartnest_pro.installation")
    data = await store.async_load()
    if not data:
        data = {"id": str(uuid4())}
        await store.async_save(data)
    return data["id"]


class LicenseManager:
    """Persist a bounded lease; explicit denial clears it immediately."""

    def __init__(self, hass: Any, entry: Any, service_url: str) -> None:
        from homeassistant.helpers.storage import Store

        self.hass = hass
        self.entry = entry
        self.url = service_url
        self.store = Store(hass, 1, "smartnest_pro.license")
        self.deadline = 0.0
        self.checked_at = 0.0
        self.reason = "activation_required"
        self.identity = ""
        self.installation = ""
        self._lock = asyncio.Lock()

    @property
    def valid(self) -> bool:
        now = time.time()
        return self.checked_at <= now < self.deadline

    def status(self) -> dict:
        return {"valid": self.valid, "reason": "active" if self.valid else self.reason}

    async def async_initialize(self) -> None:
        self.installation = await installation_id(self.hass)
        key = self.entry.data.get(CONF_LICENSE_KEY, "")
        url = self.url
        self.identity = hashlib.sha256(f"{url}\0{key}\0{self.installation}".encode()).hexdigest()
        data = await self.store.async_load() or {}
        if data.get("identity") == self.identity:
            now = time.time()
            checked = data.get("checked_at", 0)
            deadline = data.get("deadline", 0)
            if (type(checked) in (int, float) and type(deadline) in (int, float)
                    and 0 < checked <= now and checked < deadline <= checked + MAX_LEASE_SECONDS):
                self.deadline, self.checked_at = deadline, checked
        await self.async_refresh()

    async def async_refresh(self) -> None:
        from homeassistant.helpers.aiohttp_client import async_get_clientsession

        async with self._lock:
            key = self.entry.data.get(CONF_LICENSE_KEY)
            url = self.url
            if not key or not url:
                self.deadline = 0
                self.reason = "activation_required"
                await self._save()
                return
            try:
                payload = await validate(async_get_clientsession(self.hass), url, key, self.installation)
                now = time.time()
                self.deadline = lease_deadline(payload, now)
                self.checked_at = now
                self.reason = "active"
            except LicenseDenied:
                self.deadline = 0
                self.reason = "invalid_license"
            except (LicenseUnavailable, ValueError):
                self.reason = "cannot_connect" if not self.valid else "offline_grace"
                return
            await self._save()

    async def _save(self) -> None:
        await self.store.async_save({"identity": self.identity, "deadline": self.deadline, "checked_at": self.checked_at})
