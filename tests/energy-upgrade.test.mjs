import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validTariffSchedule, tariffAt, recordedCost, nightBaseline, deviceEnergyIds, longOpen, maintenanceUsage, backupIssues, missingConfigEntities } from '../src/energy-upgrade.ts';
const slots=[{start:'22:00',end:'06:00',rate:0.1},{start:'06:00',end:'22:00',rate:0.4}];
const date=(hour,day=2)=>new Date(2026,10,day,hour,0,0,0);
test('hourly tariff validates wraps, rejects overlaps and avoids ambiguous partial-hour pricing',()=>{
 assert.equal(validTariffSchedule(slots),true);
 assert.equal(validTariffSchedule([...slots,{start:'23:00',end:'00:00',rate:0.2}]),false);
 assert.equal(validTariffSchedule([{start:'00:30',end:'01:00',rate:1}]),false);
 assert.equal(validTariffSchedule([{start:'00:00',end:'24:00',rate:0}]),true);
 assert.equal(tariffAt(date(23),9,slots),0.1);assert.equal(tariffAt(date(6),9,slots),0.4);
 assert.equal(tariffAt(date(12),undefined,[]),undefined);
});
test('recorded cost uses actual distinct nonnegative hourly changes, flags rate gaps and never infers absent consumption',()=>{
 const rows=[{start:date(23).toISOString(),change:2},{start:date(6).getTime(),change:3},{start:date(6).getTime(),change:99},{start:'bad',change:5},{start:date(7).toISOString(),change:-2}];
 const result=recordedCost(rows,undefined,slots);assert.equal(result.energy,5);assert.ok(Math.abs(result.cost-1.4)<1e-9);assert.equal(result.points,2);
 assert.equal(recordedCost(rows,undefined,[slots[0]]).cost,undefined);assert.equal(recordedCost([],1).energy,undefined);
});
test('night baseline requires six completed distinct recorded hours and excludes partial nights',()=>{
 const rows=Array.from({length:6},(_,hour)=>({start:date(hour).toISOString(),change:0.2}));
 assert.equal(nightBaseline(rows,date(7)).nights,1);assert.ok(Math.abs(nightBaseline(rows,date(7)).averageKw-0.2)<1e-9);
 assert.equal(nightBaseline(rows.slice(0,5),date(7)).averageKw,undefined);
 assert.equal(nightBaseline(rows,date(4)).nights,0);
 assert.equal(nightBaseline([...rows,rows[0]],date(7)).nights,1);
});
test('device energy attribution uses registered devices and deduplicates same-device meters',()=>{
 const entity=(id,unit='kWh')=>({entity_id:id,state:'5',attributes:{device_class:'energy',state_class:'total_increasing',unit_of_measurement:unit}});
 const h={states:{'sensor.house':entity('sensor.house'),'sensor.a':entity('sensor.a'),'sensor.a2':entity('sensor.a2'),'sensor.unregistered':entity('sensor.unregistered'),'sensor.b':entity('sensor.b','Wh')},entities:{'sensor.a':{device_id:'a'},'sensor.a2':{device_id:'a'},'sensor.b':{device_id:'b'}}};
 assert.deepEqual(deviceEnergyIds(h,['sensor.house']),['sensor.a','sensor.b']);
});
test('elapsed-door threshold and maintenance counters handle resets and unavailable states',()=>{
 const now=Date.now();assert.equal(longOpen(new Date(now-11*60000).toISOString(),10,now),11);assert.equal(longOpen(new Date(now-2*60000).toISOString(),10,now),undefined);assert.equal(longOpen('bad',10,now),undefined);
 const task={usage_entity:'sensor.hours',usage_baseline:100,usage_interval:50};
 const h=state=>({states:{'sensor.hours':{state,attributes:{unit_of_measurement:'h'}}}});
 assert.equal(maintenanceUsage(task,h('151')).due,true);assert.equal(maintenanceUsage(task,h('120')).due,false);assert.equal(maintenanceUsage(task,h('10')),undefined);assert.equal(maintenanceUsage(task,h('unavailable')),undefined);
});
test('backup compatibility checks reject future versions and malformed nested geometry before normalization',()=>{
 const config={version:1,settings:{theme:'light'},hero:{pins:[]},home:{devices:[],scenes:[]},rooms:{},plan:{floors:[{id:'f',rooms:[{id:'r',x:0,y:0,w:3,h:4}],doors:[],furniture:[],walls:[]}],devices:{},hidden:[]}};
 assert.deepEqual(backupIssues(config),[]);assert.deepEqual(backupIssues({...config,version:2}),['version']);
 const bad=structuredClone(config);bad.plan.floors[0].rooms[0].w=-1;assert.ok(backupIssues(bad).includes('room'));
 const wall=structuredClone(config);wall.plan.floors[0].walls=[{id:'w',x1:'bad',y1:0,x2:2,y2:2}];assert.ok(backupIssues(wall).includes('wall'));
});

test('backup comparison finds furniture and experience links without scanning labels or URLs',()=>{
 const config={home:{devices:[],scenes:['scene.exists']},hero:{pins:[{entity:'light.pin'}]},rooms:{r:{name:'sensor.label',temperature:'sensor.temp'}},plan:{devices:{'light.marker':{}},hidden:[],floors:[{furniture:[{entity:'light.missing',source:'camera.missing'},{source:'https://example.com/video'},{source:'/local/screen.png'}]}]},experience:{power_entity:'sensor.power',critical_entities:['switch.critical'],maintenance:[{entity:'vacuum.robot',usage_entity:'sensor.hours',title:'sensor.title'}],quick_scenes:{leave:'scene.leave',sleep:'scene.exists'}}};
 assert.deepEqual(missingConfigEntities(config,{'scene.exists':{}}),['camera.missing','light.marker','light.missing','light.pin','scene.leave','sensor.hours','sensor.power','sensor.temp','switch.critical','vacuum.robot']);
});
