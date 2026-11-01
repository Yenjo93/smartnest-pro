"""SmartNest policy/storage tests with lightweight Home Assistant substitutes."""
import copy
import importlib.util
from pathlib import Path
import sys
import types
import unittest
from datetime import datetime, timedelta, timezone
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
package = types.ModuleType('smartnest_backend')
package.__path__ = [str(ROOT / 'custom_components/smartnest_pro')]
sys.modules.setdefault('smartnest_backend', package)
spec = importlib.util.spec_from_file_location('smartnest_backend.platform', ROOT / 'custom_components/smartnest_pro/platform.py')
platform = importlib.util.module_from_spec(spec)
spec.loader.exec_module(platform)
DOMAIN = 'smartnest_pro'


class Store:
    records = {}
    def __init__(self, hass, version, key): self.key = key
    async def async_load(self): return copy.deepcopy(self.records.get(self.key))
    async def async_save(self, data): self.records[self.key] = copy.deepcopy(data)


class User:
    def __init__(self, identifier='owner', admin=True, permissions=True):
        self.id, self.is_admin, self.is_active = identifier, admin, True
        self.permissions = types.SimpleNamespace(check_entity=lambda entity, operation: permissions)


class BackendTests(unittest.IsolatedAsyncioTestCase):
    async def asyncSetUp(self):
        Store.records = {}
        self.calls, self.armed = [], []
        self.owner = User()
        self.guest = User('guest', False)
        self.registry = {'light.kitchen': types.SimpleNamespace(area_id='kitchen', device_id=None), 'light.bedroom': types.SimpleNamespace(area_id='bedroom', device_id=None)}
        helpers = types.ModuleType('homeassistant.helpers')
        helpers.entity_registry = types.SimpleNamespace(async_get=lambda hass: types.SimpleNamespace(async_get=self.registry.get))
        helpers.device_registry = types.SimpleNamespace(async_get=lambda hass: types.SimpleNamespace(async_get=lambda identifier: None))
        storage = types.ModuleType('homeassistant.helpers.storage'); storage.Store = Store
        core = types.ModuleType('homeassistant.core'); core.Context = lambda **kwargs: types.SimpleNamespace(**kwargs)
        event = types.ModuleType('homeassistant.helpers.event')
        def arm(hass, callback, when):
            record = {'callback': callback, 'when': when, 'cancelled': False}; self.armed.append(record)
            return lambda: record.update(cancelled=True)
        event.async_track_point_in_utc_time = arm
        modules = {'homeassistant.helpers': helpers, 'homeassistant.helpers.storage': storage, 'homeassistant.core': core, 'homeassistant.helpers.event': event}
        self.patcher = patch.dict(sys.modules, modules); self.patcher.start(); self.addCleanup(self.patcher.stop)
        async def call(domain, service, data, **kwargs): self.calls.append((domain, service, data, kwargs))
        async def get_user(identifier): return self.owner if identifier == self.owner.id else self.guest
        self.config = {'hero': {'pins': []}, 'settings': {}, 'access': {'users': {'guest': {'areas': ['kitchen'], 'entities': ['scene.sleep']}}}}
        self.hass = types.SimpleNamespace(
            states=types.SimpleNamespace(get=lambda eid: object() if eid in {'light.kitchen', 'light.bedroom', 'scene.sleep', 'script.away'} else None),
            data={DOMAIN: {'config': self.config, 'store': Store(None, 1, 'dashboard'), 'license': types.SimpleNamespace(valid=True)}},
            services=types.SimpleNamespace(async_call=call), auth=types.SimpleNamespace(async_get_user=get_user),
        )
        self.runtime = platform.Platform(self.hass)

    async def test_action_scope_and_native_permissions(self):
        await self.runtime.action(self.guest, 'light', 'turn_on', {'entity_id': 'light.kitchen'})
        self.assertEqual(self.calls[0][3]['context'].user_id, 'guest')
        with self.assertRaises(platform.ActionDenied):
            await self.runtime.action(self.guest, 'light', 'turn_on', {'entity_id': 'light.bedroom'})
        denied = User('denied', False, False)
        with self.assertRaises(platform.ActionDenied):
            await self.runtime.action(denied, 'light', 'turn_on', {'entity_id': 'light.kitchen'})
        self.assertEqual(len(self.calls), 1)

    async def test_unsafe_actions_and_broad_targets_are_refused(self):
        for domain, service, data in [('homeassistant', 'stop', {'entity_id': 'light.kitchen'}), ('light', 'turn_on', {'area_id': 'kitchen'}), ('light', 'turn_on', {'entity_id': 'all'}), ('light', 'turn_on', {'entity_id': ['light.kitchen'], 'device_id': 'other'}), ('scene', 'turn_on', {'entity_id': 'light.kitchen'})]:
            with self.subTest(domain=domain, service=service, data=data), self.assertRaises(platform.ActionDenied):
                await self.runtime.action(self.owner, domain, service, data)
        self.assertEqual(self.calls, [])

    async def test_expired_guest_and_license_fail_closed(self):
        self.config['access']['users']['guest']['guest_until'] = 1
        with self.assertRaises(platform.ActionDenied):
            await self.runtime.action(self.guest, 'light', 'turn_off', {'entity_id': 'light.kitchen'})
        self.hass.data[DOMAIN]['license'].valid = False
        with self.assertRaises(platform.ActionDenied):
            await self.runtime.action(self.owner, 'light', 'turn_off', {'entity_id': 'light.kitchen'})

    async def test_history_keeps_ten_immutable_versions(self):
        for index in range(15):
            await self.runtime.async_save_config({'hero': {}, 'settings': {'index': index}})
        self.assertEqual(len(self.runtime.history), 10)
        self.assertEqual(self.runtime.history[0]['config']['settings']['index'], 4)
        self.assertEqual(self.runtime.history[-1]['config']['settings']['index'], 13)
        self.hass.data[DOMAIN]['config']['settings']['index'] = 999
        self.assertEqual(self.runtime.history[-1]['config']['settings']['index'], 13)
        loaded = platform.Platform(self.hass); await loaded.async_load()
        self.assertEqual(len(loaded.history), 10)

    async def test_audit_is_bounded_and_never_records_service_arguments(self):
        await self.runtime.action(self.owner, 'light', 'turn_on', {'entity_id': 'light.kitchen', 'secret': 'private'})
        for index in range(205): await self.runtime.audit('owner', 'light', 'turn_off', ['light.kitchen'], True)
        self.assertEqual(len(self.runtime.events), 200)
        self.assertNotIn('private', repr(Store.records))
        self.assertEqual(set(self.runtime.events[0]), {'at', 'user', 'domain', 'service', 'entities', 'success'})

    async def test_schedule_persists_runs_once_and_cancels(self):
        at = (datetime.now(timezone.utc) + timedelta(minutes=10)).isoformat()
        row = await self.runtime.add_schedule(self.owner, 'scene.sleep', at)
        self.assertEqual(len(self.armed), 1)
        self.runtime.unload(); self.assertTrue(self.armed[0]['cancelled'])
        restored = platform.Platform(self.hass); await restored.async_load()
        self.assertEqual(restored.schedules[0]['id'], row['id'])
        await self.armed[-1]['callback'](datetime.now(timezone.utc))
        self.assertEqual(restored.schedules, [])
        self.assertEqual(self.calls[0][0:2], ('scene', 'turn_on'))
        await restored.remove_schedule(row['id'])
        self.assertEqual(len(self.calls), 1)

    async def test_missed_schedules_are_not_replayed(self):
        Store.records['smartnest_pro.platform'] = {'schedules': [{'id': 'past', 'timestamp': 1}]}
        await self.runtime.async_load()
        self.assertEqual(self.runtime.schedules, [])
        self.assertEqual(self.armed, [])

    async def test_schedule_rejects_unsafe_targets_or_naive_dates(self):
        at = (datetime.now(timezone.utc) + timedelta(minutes=10)).isoformat()
        for entity, date in [('light.kitchen', at), ('scene.sleep', '2027-01-01T12:00:00'), ('scene.sleep', 'invalid')]:
            with self.subTest(entity=entity, date=date), self.assertRaises(ValueError): await self.runtime.add_schedule(self.owner, entity, date)

    async def test_restricted_config_scrubs_private_devices_and_geometry(self):
        self.config.update({'names': {'light.kitchen': 'Kitchen', 'light.bedroom': 'Bedroom'}, 'rooms': {'kitchen': {}, 'bedroom': {}}, 'plan': {'floors': [{'rooms': [{'area': 'kitchen'}, {'area': 'bedroom'}], 'furniture': [{'entity': 'light.kitchen'}, {'entity': 'light.bedroom'}, {'type': 'sofa'}], 'walls': [1], 'doors': [2], 'underlay': {'url': 'private'}}]}, 'hero': {'image': 'private', 'pins': [{'entity': 'light.bedroom'}]}})
        result = platform.config_for_user(self.hass, self.config, self.guest)
        self.assertNotIn('access', result)
        self.assertNotIn('light.bedroom', result['names'])
        self.assertEqual(list(result['rooms']), ['kitchen'])
        self.assertNotIn('image', result['hero'])
        self.assertEqual(result['plan']['floors'][0]['rooms'], [{'area': 'kitchen'}])
        self.assertEqual(len(result['plan']['floors'][0]['furniture']), 1)
        self.assertEqual(result['plan']['floors'][0]['walls'], [])
        self.assertIn('bedroom', self.config['rooms'])

    async def test_policy_validation_rejects_malformed_config(self):
        for access in [[], {'users': []}, {'users': {'u': []}}, {'users': {'u': {'entities': 'all'}}}, {'users': {'u': {'guest_until': float('nan')}}}]:
            self.assertFalse(platform.validate_access({'access': access}))
        self.assertTrue(platform.validate_access(self.config))

    async def test_preferences_are_isolated_persisted_and_merged(self):
        await self.runtime.save_preferences(self.owner, {"favorites": ["light.bedroom"], "start_page": "energy"})
        await self.runtime.save_preferences(self.guest, {"favorites": ["light.kitchen"], "simple_mode": True})
        await self.runtime.save_preferences(self.guest, {"font_scale": 1.2})
        loaded = platform.Platform(self.hass); await loaded.async_load()
        self.assertEqual(loaded.get_preferences(self.owner)["favorites"], ["light.bedroom"])
        self.assertEqual(loaded.get_preferences(self.guest), {"favorites": ["light.kitchen"], "simple_mode": True, "font_scale": 1.2})
        copy_of_preferences = loaded.get_preferences(self.guest)
        copy_of_preferences["favorites"].append("light.bedroom")
        self.assertEqual(loaded.get_preferences(self.guest)["favorites"], ["light.kitchen"])

    async def test_preferences_reject_invalid_fields_and_scope_changes(self):
        for changes in [{"user_id": "owner"}, {"favorites": ["light.bedroom"]}, {"favorites": ["light.kitchen", "light.kitchen"]}, {"page_order": ["home", "home"]}, {"page_order": ["unknown"]}, {"font_scale": True}, {"font_scale": float('nan')}, {"font_scale": 2}, {"high_contrast": "yes"}, {"start_page": "unknown"}]:
            with self.subTest(changes=changes), self.assertRaises(ValueError):
                await self.runtime.save_preferences(self.guest, changes)
        self.assertEqual(self.runtime.get_preferences(self.guest), {})
        await self.runtime.save_preferences(self.guest, {"favorites": ["light.kitchen"]})
        self.config['access']['users']['guest']['areas'] = []
        self.assertEqual(self.runtime.get_preferences(self.guest)["favorites"], [])

    async def test_expired_guest_cannot_read_or_write_preferences(self):
        self.config['access']['users']['guest']['guest_until'] = 1
        with self.assertRaises(platform.ActionDenied): self.runtime.get_preferences(self.guest)
        with self.assertRaises(platform.ActionDenied): await self.runtime.save_preferences(self.guest, {"font_scale": 1.2})

    async def test_state_activity_filters_and_never_retains_attributes(self):
        self.runtime._state_active = True
        def event(entity, before, after, user=None):
            state = lambda value: types.SimpleNamespace(state=value, attributes={"code": "private-alarm-code", "latitude": 31.123, "token": "private-token"})
            return types.SimpleNamespace(data={"entity_id": entity, "old_state": state(before), "new_state": state(after)}, context=types.SimpleNamespace(user_id=user))
        await self.runtime._state_changed(event('light.kitchen', 'off', 'on', 'owner'))
        await self.runtime._state_changed(event('alarm_control_panel.house', 'disarmed', 'armed_away'))
        for entity, before, after in [('light.kitchen', 'on', 'on'), ('person.owner', 'home', 'away'), ('sensor.location', 'a', 'b'), ('device_tracker.phone', 'a', 'b'), ('light.kitchen', None, 'on')]:
            await self.runtime._state_changed(event(entity, before, after))
        self.assertEqual(len(self.runtime.events), 2)
        self.assertEqual(self.runtime.events[0]['service'], 'state_changed')
        self.assertEqual(self.runtime.events[0]['user'], 'owner')
        self.assertEqual(self.runtime.events[1]['user'], 'homeassistant')
        self.assertEqual(self.runtime.events[0]['from_state'], 'off')
        self.assertEqual(self.runtime.events[0]['to_state'], 'on')
        self.assertNotIn('private-alarm-code', repr(Store.records))
        self.assertNotIn('private-token', repr(Store.records))
        self.assertNotIn('latitude', repr(Store.records))
        await self.runtime._state_changed(event('light.kitchen', 'a' * 100, 'b' * 100))
        self.assertEqual(len(self.runtime.events[-1]['from_state']), 80)

    async def test_state_listener_is_registered_once_and_cancelled_on_unload(self):
        calls = []
        def listen(event_type, callback):
            record = {"type": event_type, "callback": callback, "cancelled": False}
            calls.append(record)
            return lambda: record.update(cancelled=True)
        self.hass.bus = types.SimpleNamespace(async_listen=listen)
        constants = types.ModuleType('homeassistant.const'); constants.EVENT_STATE_CHANGED = 'state_changed'
        with patch.dict(sys.modules, {'homeassistant.const': constants}):
            self.runtime.listen_states(); self.runtime.listen_states()
        self.assertEqual(len(calls), 1)
        self.assertEqual(calls[0]['type'], 'state_changed')
        self.runtime.unload()
        self.assertTrue(calls[0]['cancelled'])
        event = types.SimpleNamespace(data={"entity_id": "light.kitchen", "old_state": types.SimpleNamespace(state='off'), "new_state": types.SimpleNamespace(state='on')}, context=None)
        await calls[0]['callback'](event)
        self.assertEqual(self.runtime.events, [])
        # A callback queued behind storage also checks the active flag inside audit.
        await self.runtime.audit('owner', 'light', 'state_changed', ['light.kitchen'], True, from_state='off', to_state='on', state_event=True)
        self.assertEqual(self.runtime.events, [])

    async def test_action_confirms_reported_state_and_persists_confirmation(self):
        states = {'light.kitchen': types.SimpleNamespace(state='off', attributes={})}
        self.hass.states.get = states.get
        async def call(domain, service, data, **kwargs):
            self.calls.append((domain, service, data, kwargs))
            states['light.kitchen'] = types.SimpleNamespace(state='on', attributes={})
        self.hass.services.async_call = call
        result = await self.runtime.action(self.owner, 'light', 'turn_on', {'entity_id': 'light.kitchen'})
        self.assertEqual(result, {'success': True, 'confirmation': 'confirmed', 'confirmed_entities': ['light.kitchen'], 'unconfirmed_entities': []})
        self.assertEqual(self.runtime.events[-1]['confirmation'], 'confirmed')
        self.assertEqual(self.runtime.events[-1]['user'], 'owner')

    async def test_service_ack_without_expected_state_is_unconfirmed_and_bounded(self):
        self.hass.states.get = lambda identifier: types.SimpleNamespace(state='off', attributes={})
        with patch.object(sys.modules['smartnest_backend.action_feedback'], 'CONFIRM_TIMEOUT', .02):
            result = await self.runtime.action(self.owner, 'light', 'turn_on', {'entity_id': 'light.kitchen'})
        self.assertEqual(result['confirmation'], 'unconfirmed')
        self.assertEqual(result['unconfirmed_entities'], ['light.kitchen'])
        self.assertEqual(len(self.calls), 1)
        self.assertFalse(self.runtime.events[-1]['success'])
        self.assertEqual(self.runtime.events[-1]['confirmation'], 'unconfirmed')

    async def test_scene_is_accepted_without_claiming_physical_confirmation(self):
        self.hass.states.get = lambda identifier: types.SimpleNamespace(state='off', attributes={})
        result = await self.runtime.action(self.owner, 'scene', 'turn_on', {'entity_id': 'scene.sleep'})
        self.assertEqual(result['confirmation'], 'accepted')
        self.assertEqual(result['confirmed_entities'], [])
        self.assertTrue(self.runtime.events[-1]['success'])

    async def test_attribute_commands_do_not_confirm_from_power_state_alone(self):
        state = types.SimpleNamespace(state='on', attributes={'brightness': 10})
        self.hass.states.get = lambda identifier: state
        with patch.object(sys.modules['smartnest_backend.action_feedback'], 'CONFIRM_TIMEOUT', .02):
            result = await self.runtime.action(self.owner, 'light', 'turn_on', {'entity_id': 'light.kitchen', 'brightness': 200})
        self.assertEqual(result['confirmation'], 'unconfirmed')
        state.attributes['brightness'] = 200
        result = await self.runtime.action(self.owner, 'light', 'turn_on', {'entity_id': 'light.kitchen', 'brightness': 200})
        self.assertEqual(result['confirmation'], 'confirmed')
        # Unsupported colour/effect state representations must not be guessed.
        result = await self.runtime.action(self.owner, 'light', 'turn_on', {'entity_id': 'light.kitchen', 'rgb_color': [1, 2, 3]})
        self.assertEqual(result['confirmation'], 'accepted')

    async def test_child_policy_blocks_sensitive_explicit_targets_and_keeps_light_control(self):
        policy = self.config['access']['users']['guest']
        policy.update(child_mode=True, entities=['scene.sleep', 'script.away', 'lock.front', 'alarm_control_panel.home', 'button.reset', 'remote.tv'])
        self.hass.states.get = lambda identifier: types.SimpleNamespace(state='off', attributes={})
        for domain, service, identifier in [('scene', 'turn_on', 'scene.sleep'), ('script', 'turn_on', 'script.away'), ('lock', 'unlock', 'lock.front'), ('alarm_control_panel', 'alarm_disarm', 'alarm_control_panel.home'), ('button', 'press', 'button.reset'), ('remote', 'send_command', 'remote.tv')]:
            with self.subTest(identifier=identifier), self.assertRaises(platform.ActionDenied):
                await self.runtime.action(self.guest, domain, service, {'entity_id': identifier})
        result = await self.runtime.action(self.guest, 'light', 'turn_off', {'entity_id': 'light.kitchen'})
        self.assertEqual(result['confirmation'], 'confirmed')
        self.assertTrue(platform.entity_allowed(self.hass, self.config, self.guest, 'lock.front'))
        policy['child_mode'] = 'yes'
        self.assertFalse(platform.validate_access(self.config))

    async def test_invalid_imports_never_replace_a_valid_layout(self):
        before = copy.deepcopy(self.config)
        cases = [
            {'version': 2, 'hero': {}, 'settings': {}},
            {'version': True, 'hero': {}, 'settings': {}},
            {'hero': {}, 'settings': {}, 'plan': {'floors': 'broken'}},
            {'hero': {}, 'settings': {}, 'home': {'devices': 'light.kitchen'}},
            {'hero': {}, 'settings': {}, 'plan': {'floors': [{'id': 'f', 'rooms': [{'id': 'r', 'x': 0, 'y': 0, 'w': -1, 'h': 4}]}]}},
            {'hero': {}, 'settings': {}, 'plan': {'floors': [{'id': 'f', 'walls': [{'id': 'w', 'x1': 0, 'y1': 0, 'x2': float('nan'), 'y2': 1}]}]}},
            {'hero': {}, 'settings': {}, 'plan': {'devices': {'light.kitchen': {'floor': 'f', 'x': 'bad', 'y': 0}}}},
            {'hero': {}, 'settings': {}, 'access': {'users': {'child': {'child_mode': 1}}}},
        ]
        for config in cases:
            with self.subTest(config=config), self.assertRaises(ValueError):
                await self.runtime.async_save_config(config, restore=True)
            self.assertEqual(self.hass.data[DOMAIN]['config'], before)
            self.assertEqual(self.runtime.history, [])

    async def test_restore_preserves_current_access_and_pin_and_snapshots_before_replace(self):
        self.config['settings']['kiosk_pin'] = 'current-pin'
        incoming = {'version': 1, 'hero': {}, 'settings': {'home_name': 'Restored', 'kiosk_pin': 'imported-pin'}, 'access': {'users': {}}, 'plan': {'floors': [], 'devices': {}, 'hidden': []}}
        await self.runtime.async_save_config(incoming, restore=True)
        saved = self.hass.data[DOMAIN]['config']
        self.assertEqual(saved['settings']['kiosk_pin'], 'current-pin')
        self.assertEqual(saved['access'], self.config['access'])
        self.assertEqual(self.runtime.history[-1]['reason'], 'before_restore')
        self.assertEqual(self.runtime.history[-1]['config']['settings']['kiosk_pin'], 'current-pin')
        self.assertEqual(incoming['settings']['kiosk_pin'], 'imported-pin')

    async def test_restore_cannot_install_access_or_pin_when_current_has_none(self):
        self.hass.data[DOMAIN]['config'] = {'hero': {}, 'settings': {}}
        await self.runtime.async_save_config({'hero': {}, 'settings': {'kiosk_pin': 'imported'}, 'access': {'users': {}}}, restore=True)
        self.assertNotIn('kiosk_pin', self.hass.data[DOMAIN]['config']['settings'])
        self.assertNotIn('access', self.hass.data[DOMAIN]['config'])

    async def test_version_upgrade_snapshot_is_persistent_and_once_per_version(self):
        await self.runtime.snapshot_version('0.17.0')
        self.assertEqual(self.runtime.history[-1]['reason'], 'before_update')
        self.assertEqual(self.runtime.history[-1]['version'], 'legacy')
        self.assertEqual(self.runtime.history[-1]['config'], self.config)
        restored = platform.Platform(self.hass)
        await restored.async_load()
        await restored.snapshot_version('0.17.0')
        self.assertEqual(len(restored.history), 1)
        await restored.snapshot_version('0.18.0')
        self.assertEqual(len(restored.history), 2)
        self.assertEqual(restored.history[-1]['version'], '0.17.0')

    async def test_new_feature_configuration_rejects_malformed_aliases_and_critical_lists(self):
        before = copy.deepcopy(self.config)
        invalid = [
            {'aliases': {'light.kitchen': 123}},
            {'aliases': {'light.kitchen': 'Kitchen'}},
            {'aliases': {'light.kitchen': ['a'] * 9}},
            {'aliases': {'light.kitchen': ['a' * 61]}},
            {'aliases': {'light.kitchen': ['']}},
            {'aliases': {'bad identifier': ['Kitchen']}},
            {'experience': {'critical_entities': 'light.kitchen'}},
            {'experience': {'critical_entities': [123]}},
            {'experience': {'critical_entities': ['bad identifier']}},
        ]
        for patch_config in invalid:
            candidate = {'hero': {}, 'settings': {}, **patch_config}
            with self.subTest(candidate=candidate), self.assertRaises(ValueError):
                await self.runtime.async_save_config(candidate)
            self.assertEqual(self.hass.data[DOMAIN]['config'], before)
        await self.runtime.async_save_config({'hero': {}, 'settings': {}, 'aliases': {'light.kitchen': ['المطبخ', 'Kitchen light']}, 'experience': {'critical_entities': ['light.kitchen']}})

    async def test_tariff_configuration_rejects_invalid_or_overlapping_hour_periods(self):
        invalid = [
            'bad',
            [{'start': '00:30', 'end': '06:00', 'rate': 1}],
            [{'start': '24:00', 'end': '06:00', 'rate': 1}],
            [{'start': '00:00', 'end': '00:00', 'rate': 1}],
            [{'start': '00:00', 'end': '06:00', 'rate': -1}],
            [{'start': '00:00', 'end': '06:00', 'rate': True}],
            [{'start': '00:00', 'end': '06:00', 'rate': float('nan')}],
            [{'start': '22:00', 'end': '06:00', 'rate': 1}, {'start': '05:00', 'end': '09:00', 'rate': 2}],
        ]
        for schedule in invalid:
            with self.subTest(schedule=schedule), self.assertRaises(ValueError):
                await self.runtime.async_save_config({'hero': {}, 'settings': {}, 'experience': {'tariff_schedule': schedule}})
        for schedule in [[{'start': '22:00', 'end': '06:00', 'rate': 0}, {'start': '06:00', 'end': '22:00', 'rate': 2}], [{'start': '00:00', 'end': '24:00', 'rate': 1}]]:
            await self.runtime.async_save_config({'hero': {}, 'settings': {}, 'experience': {'tariff_schedule': schedule}})

    async def test_usage_maintenance_fields_require_finite_numeric_values(self):
        for fields in [{'usage_interval': 0}, {'usage_interval': -1}, {'usage_interval': True}, {'usage_interval': float('inf')}, {'usage_baseline': '0'}, {'usage_baseline': float('nan')}, {'usage_entity': 123}]:
            with self.subTest(fields=fields), self.assertRaises(ValueError):
                await self.runtime.async_save_config({'hero': {}, 'settings': {}, 'experience': {'maintenance': [{'id': 'filter', **fields}]}})
        await self.runtime.async_save_config({'hero': {}, 'settings': {}, 'experience': {'maintenance': [{'id': 'filter', 'usage_entity': 'sensor.filter_hours', 'usage_interval': 100, 'usage_baseline': 0}]}})

if __name__ == '__main__': unittest.main()
