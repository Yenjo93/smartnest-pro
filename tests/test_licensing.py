"""License policy tests without a Home Assistant installation."""
import asyncio
import importlib.util
from pathlib import Path
import sys
import types
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location("smartnest_licensing", Path(__file__).resolve().parents[1] / "custom_components/smartnest_pro/licensing.py")
lic = importlib.util.module_from_spec(spec)
spec.loader.exec_module(lic)


class Store:
    data = {}

    def __init__(self, hass, version, key):
        self.key = key

    async def async_load(self):
        return self.data.get(self.key)

    async def async_save(self, data):
        self.data[self.key] = data.copy()


class PolicyTests(unittest.TestCase):
    def test_https_only(self):
        self.assertEqual(lic.normalize_url(" https://licenses.example.com/ "), "https://licenses.example.com")
        for url in ["http://localhost", "https://u:p@host", "https://host?a=1", "https://host/#x", "https://host:bad", "https://a b"]:
            with self.subTest(url=url), self.assertRaises(ValueError):
                lic.normalize_url(url)

    def test_deadline_capped_by_expiry_and_maximum(self):
        self.assertEqual(lic.lease_deadline({"valid": True, "lease_seconds": 999999, "expires_at": None}, 100), 100 + lic.MAX_LEASE_SECONDS)
        self.assertEqual(lic.lease_deadline({"valid": True, "lease_seconds": 999999, "expires_at": 200}, 100), 200)
        with self.assertRaises(lic.LicenseDenied):
            lic.lease_deadline({"valid": True, "lease_seconds": 100, "expires_at": 99}, 100)

    def test_bad_response_never_authorizes(self):
        for payload in [None, [], {}, {"valid": False}, {"valid": True, "lease_seconds": True}, {"valid": True, "lease_seconds": float('nan')}, {"valid": True, "lease_seconds": 100, "expires_at": "never"}]:
            with self.subTest(payload=payload), self.assertRaises(lic.LicenseUnavailable):
                lic.lease_deadline(payload, 100)


class ManagerTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        Store.data = {}
        storage = types.ModuleType("homeassistant.helpers.storage")
        storage.Store = Store
        client = types.ModuleType("homeassistant.helpers.aiohttp_client")
        client.async_get_clientsession = lambda hass: None
        self.modules = patch.dict(sys.modules, {"homeassistant.helpers.storage": storage, "homeassistant.helpers.aiohttp_client": client})
        self.modules.start()
        self.addCleanup(self.modules.stop)
        self.entry = types.SimpleNamespace(data={"license_key": "secret-key-1234567890", "license_url": "https://license.example.com"})
        self.clock = patch.object(lic.time, 'time', return_value=1000)
        self.now = self.clock.start()
        self.addCleanup(self.clock.stop)
        async def success(*args):
            return {"valid": True, "lease_seconds": lic.MAX_LEASE_SECONDS, "expires_at": None}
        self.validation = patch.object(lic, 'validate', side_effect=success)
        self.mock = self.validation.start()
        self.addCleanup(self.validation.stop)

    async def manager(self):
        manager = lic.LicenseManager(None, self.entry, "https://license.example.com")
        await manager.async_initialize()
        return manager

    async def test_outage_survives_restart_but_never_renews_deadline(self):
        original = await self.manager()
        deadline = original.deadline
        self.mock.side_effect = lic.LicenseUnavailable()
        self.now.return_value = 2000
        restored = await self.manager()
        self.assertTrue(restored.valid)
        self.assertEqual(restored.deadline, deadline)
        self.now.return_value = deadline
        self.assertFalse(restored.valid)
        await restored.async_refresh()
        self.assertFalse(restored.valid)
        self.assertEqual(restored.deadline, deadline)

    async def test_explicit_denial_erases_cache_even_after_restart(self):
        manager = await self.manager()
        self.mock.side_effect = lic.LicenseDenied()
        await manager.async_refresh()
        self.assertFalse(manager.valid)
        self.mock.side_effect = lic.LicenseUnavailable()
        self.assertFalse((await self.manager()).valid)

    async def test_changed_key_or_service_does_not_inherit_lease(self):
        await self.manager()
        self.entry.data['license_key'] = 'other-key-123456789'
        self.mock.side_effect = lic.LicenseUnavailable()
        self.assertFalse((await self.manager()).valid)

    async def test_clock_rollback_fails_closed(self):
        manager = await self.manager()
        self.now.return_value = 999
        self.assertFalse(manager.valid)
        self.mock.side_effect = lic.LicenseUnavailable()
        self.assertFalse((await self.manager()).valid)

    async def test_existing_unlicensed_entry_is_blocked_and_keeps_install_id(self):
        first = await self.manager()
        self.entry.data = {}
        second = await self.manager()
        self.assertFalse(second.valid)
        self.assertEqual(first.installation, second.installation)

    async def test_finite_license_cannot_use_grace_after_expiry(self):
        self.mock.side_effect = None
        self.mock.return_value = {"valid": True, "lease_seconds": lic.MAX_LEASE_SECONDS, "expires_at": 1100}
        manager = await self.manager()
        self.assertEqual(manager.deadline, 1100)
        self.now.return_value = 1100
        self.assertFalse(manager.valid)


class TransportTests(unittest.IsolatedAsyncioTestCase):
    async def test_fragmented_json_and_oversized_body(self):
        class ClientError(Exception):
            pass
        aiohttp = types.ModuleType("aiohttp")
        aiohttp.ClientError = ClientError
        aiohttp.ClientTimeout = lambda **kwargs: None

        class Content:
            def __init__(self, chunks):
                self.chunks = chunks

            async def iter_chunked(self, size):
                for chunk in self.chunks:
                    yield chunk

        class Response:
            status = 200
            def __init__(self, chunks):
                self.content = Content(chunks)
            async def __aenter__(self):
                return self
            async def __aexit__(self, *args):
                pass

        class Session:
            def __init__(self, chunks):
                self.chunks = chunks
            def post(self, url, **kwargs):
                assert kwargs['allow_redirects'] is False
                return Response(self.chunks)

        with patch.dict(sys.modules, {"aiohttp": aiohttp}):
            data = await lic.validate(Session([b'{"valid":', b'true,"lease_seconds":', b'100,"expires_at":null}']), 'https://license.example.com', 'key', 'id')
            self.assertTrue(data['valid'])
            with self.assertRaises(lic.LicenseUnavailable):
                await lic.validate(Session([b'x' * 4096, b'x' * 4096, b'x']), 'https://license.example.com', 'key', 'id')


if __name__ == '__main__':
    unittest.main()
