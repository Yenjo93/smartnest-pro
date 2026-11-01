import {test} from 'node:test';
import assert from 'node:assert/strict';
import {duplicateRoom,deviceTelemetry,temperatureColor,validCamera} from '../src/plan/upgrade.ts';

test('duplicate room clones geometry, contained furniture and doors without live bindings',()=>{
 let serial=0;const room={id:'r',x:0,y:0,w:4,h:3,area:'living',pts:[{x:0,y:0},{x:4,y:0},{x:4,y:3},{x:0,y:3}]};
 const floor={id:'f',name:'Floor',rooms:[room],doors:[{id:'d',axis:'h',line:0,at:2,width:1}],walls:[{id:'w',x1:0,y1:1,x2:1,y2:1}],furniture:[{id:'inside',type:'tv',x:2,y:1,rot:20,entity:'media_player.tv',source:'camera.live'},{id:'outside',type:'chair',x:10,y:10,rot:0}]};
 const result=duplicateRoom(floor,'r',()=>`copy${++serial}`);
 assert.equal(result.floor.rooms.length,2);const copy=result.floor.rooms[1];assert.equal(copy.area,undefined);assert.equal(copy.x,5);assert.deepEqual(copy.pts[0],{x:5,y:0});
 assert.equal(result.floor.furniture.length,3);const item=result.floor.furniture[2];assert.equal(item.entity,undefined);assert.equal(item.source,undefined);assert.equal(item.x,7);assert.equal(item.rot,20);
 assert.equal(result.floor.doors[1].line,0);assert.equal(result.floor.doors[1].at,7);
 assert.equal(result.floor.walls[1].x1,5);assert.equal(floor.rooms.length,1);assert.equal(room.area,'living');assert.equal(floor.furniture[0].entity,'media_player.tv');
 assert.equal(new Set([copy.id,item.id,result.floor.doors[1].id,result.floor.walls[1].id]).size,4);
});
test('telemetry only uses explicitly registry-linked same-device battery and power sensors',()=>{
 const h={states:{'light.a':{state:'on',attributes:{}},'sensor.battery':{state:'12',attributes:{device_class:'battery',unit_of_measurement:'%'}},'sensor.power':{state:'.42',attributes:{device_class:'power',unit_of_measurement:'kW'}},'sensor.other':{state:'1',attributes:{device_class:'battery',unit_of_measurement:'%'}}},entities:{'light.a':{entity_id:'light.a',device_id:'a'},'sensor.battery':{entity_id:'sensor.battery',device_id:'a'},'sensor.power':{entity_id:'sensor.power',device_id:'a'},'sensor.other':{entity_id:'sensor.other',device_id:'b'}}};
 assert.deepEqual(deviceTelemetry(h,'light.a'),{unavailable:false,battery:12,watts:420});
 assert.deepEqual(deviceTelemetry({...h,entities:{}},'light.a'),{unavailable:false});
 h.states['sensor.battery'].state='unavailable';h.states['light.a'].state='unavailable';
 assert.deepEqual(deviceTelemetry(h,'light.a'),{unavailable:true,watts:420});
});
test('telemetry ignores absent, invalid, negative and out-of-range battery data',()=>{
 const h={states:{'sensor.b':{state:'150',attributes:{device_class:'battery',unit_of_measurement:'%'}}}};
 assert.deepEqual(deviceTelemetry(h,'sensor.b'),{unavailable:false});assert.deepEqual(deviceTelemetry(h,'missing'),{unavailable:true});
});
test('camera snapshots validate persisted values and heatmap colors have bounded endpoints',()=>{
 assert.equal(validCamera({x:0,y:0,zoom:2,azimuth:35,elevation:52}),true);
 for(const value of [null,{x:0,y:0,zoom:999,azimuth:0,elevation:52},{x:NaN,y:0,zoom:1,azimuth:0,elevation:52},{x:0,y:0,zoom:1,azimuth:0,elevation:100}])assert.equal(validCamera(value),false);
 assert.equal(temperatureColor(-20),temperatureColor(16));assert.equal(temperatureColor(80),temperatureColor(30));assert.notEqual(temperatureColor(16),temperatureColor(30));
});
