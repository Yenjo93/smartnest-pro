import type { Hass, PlanFloor, PlanRoom } from '../types';

export interface DeviceTelemetry { unavailable: boolean; battery?: number; watts?: number }
/** Registry linkage only: never attach a nearby/ similarly named sensor to the wrong device. */
export function deviceTelemetry(hass: Hass, entityId: string): DeviceTelemetry {
  const state = hass.states[entityId];
  const result: DeviceTelemetry = { unavailable: !state || ['unavailable','unknown'].includes(state.state) };
  const device = hass.entities?.[entityId]?.device_id;
  const candidates = device ? Object.values(hass.entities ?? {}).filter(e => e.device_id === device).map(e => hass.states[e.entity_id]).filter(Boolean) : [];
  if (state) candidates.unshift(state);
  for (const item of candidates) {
    if (['unavailable','unknown',''].includes(item.state)) continue;
    const value = Number(item.state), unit = item.attributes.unit_of_measurement;
    if (!Number.isFinite(value)) continue;
    if (result.battery === undefined && item.attributes.device_class === 'battery' && unit === '%' && value >= 0 && value <= 100) result.battery = value;
    if (result.watts === undefined && item.attributes.device_class === 'power' && ['W','kW'].includes(unit)) result.watts = value * (unit === 'kW' ? 1000 : 1);
  }
  return result;
}
export function temperatureColor(value: number): string {
  const t = Math.min(1, Math.max(0, (value - 16) / 14));
  return `hsl(${Math.round(215 * (1-t))}, 75%, 62%)`;
}
function contains(room: PlanRoom, x: number, y: number): boolean {
 const points = room.pts ?? [{x:room.x,y:room.y},{x:room.x+room.w,y:room.y},{x:room.x+room.w,y:room.y+room.h},{x:room.x,y:room.y+room.h}];
 let hit=false;
 for(let i=0,j=points.length-1;i<points.length;j=i++){
  const a=points[j],b=points[i],cross=(x-a.x)*(b.y-a.y)-(y-a.y)*(b.x-a.x);
  if(Math.abs(cross)<1e-7&&x>=Math.min(a.x,b.x)-1e-7&&x<=Math.max(a.x,b.x)+1e-7&&y>=Math.min(a.y,b.y)-1e-7&&y<=Math.max(a.y,b.y)+1e-7)return true;
  if((a.y>y)!==(b.y>y)&&x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)hit=!hit;
 }
 return hit;
}
/** Copy structure and contained furnishings, with no copied physical-device or room-area binding. */
export function duplicateRoom(floor: PlanFloor, roomId: string, id: () => string = () => crypto.randomUUID()): { floor: PlanFloor; roomId: string } | undefined {
 const source=floor.rooms.find(r=>r.id===roomId);if(!source)return;
 const dx=source.w+1,dy=0;
 const copied={...source,id:id(),x:source.x+dx,y:source.y+dy,area:undefined,locked:false,...(source.pts?{pts:source.pts.map(p=>({x:p.x+dx,y:p.y+dy}))}:{})};
 const furniture=(floor.furniture??[]).filter(f=>contains(source,f.x,f.y)).map(f=>({...f,id:id(),x:f.x+dx,y:f.y+dy,entity:undefined,source:undefined,locked:false}));
 const walls=(floor.walls??[]).filter(w=>contains(source,w.x1,w.y1)&&contains(source,w.x2,w.y2)).map(w=>({...w,id:id(),x1:w.x1+dx,x2:w.x2+dx,y1:w.y1+dy,y2:w.y2+dy}));
 const doors=floor.doors.filter(d=>{const x=d.x??(d.axis==='h'?d.at:d.line),y=d.y??(d.axis==='h'?d.line:d.at);return typeof x==='number'&&typeof y==='number'&&contains(source,x,y);}).map(d=>({...d,id:id(),...(d.x!==undefined?{x:d.x+dx}:{}),...(d.y!==undefined?{y:d.y+dy}:{}),...(d.line!==undefined?{line:d.line+(d.axis==='h'?dy:dx)}:{}),...(d.at!==undefined?{at:d.at+(d.axis==='h'?dx:dy)}:{})}));
 return {floor:{...floor,rooms:[...floor.rooms,copied],furniture:[...(floor.furniture??[]),...furniture],walls:[...(floor.walls??[]),...walls],doors:[...floor.doors,...doors]},roomId:copied.id};
}
export interface CameraSnapshot { x: number; y: number; zoom: number; azimuth: number; elevation: number }
export function validCamera(value: unknown): value is CameraSnapshot {
 if(!value||typeof value!=='object')return false;const v=value as CameraSnapshot;
 return [v.x,v.y,v.zoom,v.azimuth,v.elevation].every(Number.isFinite)&&Math.abs(v.x)<100000&&Math.abs(v.y)<100000&&v.zoom>=.6&&v.zoom<=5&&v.elevation>=0&&v.elevation<=90;
}
