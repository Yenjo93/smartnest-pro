import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getPreferences, savePreferences, planTemplate, scopedHass, lightweight, isPreviewMutation, searchText, searchMatches, setupSuggestions, favoriteIds, actionNeedsConfirmation } from '../src/experience.ts';
const memory = new Map();
globalThis.localStorage = { getItem: key => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value) };
globalThis.window = { dispatchEvent() {} };
const hass = id => ({ user: { id, is_admin: false }, states: {}, areas: { a: { area_id: 'a', name: 'A' }, b: { area_id: 'b', name: 'B' } }, entities: {}, devices: {}, async callWS() { return { success: true }; } });
test('preferences isolate users, persist empty favorites and keep screen start local', () => {
 memory.clear(); const a = hass('a'), b = hass('b'); const sent=[]; a.callWS = async message => {sent.push(message);};
 assert.equal(savePreferences(a, { favorites: [], screen_start_page: 'lights', font_scale: 1.3 }), true);
 assert.equal(getPreferences(a).favorites_configured, true);
 assert.equal(getPreferences(a).screen_start_page, 'lights');
 assert.equal(getPreferences(b).font_scale, 1);
 assert.equal(sent[0].preferences.screen_start_page, undefined);
 assert.equal(sent[0].preferences.favorites_configured, undefined);
});
test('templates differ, use existing areas only, and preserve empty setup', () => {
 const h = hass('a');
 assert.equal(planTemplate('empty',h,'ar').floors.length,0);
 assert.equal(planTemplate('apartment',h,'ar').floors[0].rooms.length,3);
 assert.equal(planTemplate('wall_tablet',h,'ar').floors[0].rooms.length,1);
 assert.equal(planTemplate('two_floors',h,'ar').floors.length,2);
 for(const f of planTemplate('two_floors',h,'ar').floors) for(const r of f.rooms) assert.ok(!r.area || h.areas[r.area]);
});
test('restricted view exposes only allowed rooms/devices and explicit scenes', () => {
 const h=hass('a');
 h.states={'light.a':{entity_id:'light.a'},'light.b':{entity_id:'light.b'},'scene.a':{entity_id:'scene.a'}};
 h.entities={'light.a':{entity_id:'light.a',area_id:'a'},'light.b':{entity_id:'light.b',area_id:'b'},'scene.a':{entity_id:'scene.a',area_id:'a'}};
 const scope={restricted:true,areas:['a'],entities:[],guest_expired:false};
 assert.deepEqual(Object.keys(scopedHass(h,scope).states),['light.a']);
 assert.deepEqual(Object.keys(scopedHass(h,{...scope,entities:['scene.a']}).states),['light.a','scene.a']);
 assert.equal(Object.keys(scopedHass(h,{...scope,guest_expired:true}).states).length,0);
 h.user.is_admin=true;assert.equal(scopedHass(h,scope),h);
});
test('performance explicit modes override hardware and auto honors limited devices', () => {
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{hardwareConcurrency:2,deviceMemory:2}});
 assert.equal(lightweight({settings:{performance:'auto'}}),true);
 assert.equal(lightweight({settings:{performance:'high'}}),false);
 assert.equal(lightweight({settings:{performance:'light'}}),true);
});

test('private preview blocks all control, timer and configuration mutation routes', () => {
 for(const type of ['call_service','smartnest_pro/action','smartnest_pro/timer/set','smartnest_pro/timer/cancel','smartnest_pro/schedule/add','smartnest_pro/schedule/cancel','smartnest_pro/config/save','smartnest_pro/preferences/save']) assert.equal(isPreviewMutation(type),true,type);
 for(const type of ['smartnest_pro/config/get','smartnest_pro/config/history','smartnest_pro/license/status','smartnest_pro/timer/list','camera/web_rtc_offer']) assert.equal(isPreviewMutation(type),false,type);
});

test('setup discovery uses actual areas and visible sensor classes without operating devices',()=>{
 const h=hass('discovery');h.entities={'light.a':{area_id:'a'},'sensor.t':{area_id:'a'},'sensor.energy':{area_id:'a'}};
 h.states={'light.a':{entity_id:'light.a',attributes:{friendly_name:'Lamp'}},'sensor.t':{entity_id:'sensor.t',attributes:{device_class:'temperature'}},'sensor.energy':{entity_id:'sensor.energy',attributes:{device_class:'energy',state_class:'total_increasing',unit_of_measurement:'kWh'}}};
 const suggested=setupSuggestions(h);assert.deepEqual(suggested.home.devices,['light.a']);assert.equal(suggested.home.energy,'sensor.energy');assert.equal(suggested.rooms.a.temperature,'sensor.t');
 const auto=planTemplate('auto',h,'ar');assert.equal(auto.floors[0].rooms.length,2);assert.equal(planTemplate('studio',h,'ar').floors[0].rooms.length,1);
});
test('search handles Arabic marks, entity IDs and explicit bilingual aliases',()=>{
 const h=hass('search');h.states={'light.a':{attributes:{friendly_name:'Living Lamp'}}};const c={names:{},aliases:{'light.a':['ضَوْء الصّالة']}};
 assert.equal(searchText('إِضَاءَة'),'اضاءه');assert.ok(searchMatches(h,c,'light.a','ضوء الصالة'));assert.ok(searchMatches(h,c,'light.a','living lamp'));assert.ok(!searchMatches(h,c,'light.a','bedroom'));
 assert.doesNotThrow(()=>searchMatches(h,{aliases:{'light.a':123}},'light.a','Lamp'));
});
test('screen favorites and wall display remain local while account favorites sync',()=>{
 memory.clear();const h=hass('screen');const sent=[];h.callWS=async message=>{sent.push(message);};
 savePreferences(h,{favorites:['light.a']});savePreferences(h,{screen_favorites:[],wall_display:true});
 assert.deepEqual(favoriteIds(getPreferences(h)),[]);assert.equal(sent[1].preferences.screen_favorites,undefined);assert.equal(sent[1].preferences.wall_display,undefined);
 savePreferences(h,{screen_favorites:undefined},false);assert.deepEqual(favoriteIds(getPreferences(h)),['light.a']);
});
test('critical-device confirmation covers explicit off values and security services',()=>{
 const critical=['light.a','climate.a','fan.a'];
 for(const [domain,service,data] of [['light','turn_off',{entity_id:'light.a'}],['light','turn_on',{entity_id:'light.a',brightness:0}],['climate','set_hvac_mode',{entity_id:'climate.a',hvac_mode:'off'}],['fan','set_percentage',{entity_id:'fan.a',percentage:0}],['lock','unlock',{entity_id:'lock.a'}]])assert.equal(actionNeedsConfirmation(domain,service,data,critical),true);
 assert.equal(actionNeedsConfirmation('light','turn_on',{entity_id:'light.a',brightness:100},critical),false);
 assert.equal(actionNeedsConfirmation('light','turn_off',{entity_id:'light.b'},critical),false);
});
