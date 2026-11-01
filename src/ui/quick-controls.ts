import {LitElement,css,html,nothing} from 'lit';
import {customElement,property,state} from 'lit/decorators.js';
import type {Ctx} from '../ctx';
import {nameOf} from '../ha';

/** Explicit entity selection; no guessed scenes or background device actions. */
@customElement('sn-quick-controls')
export class QuickControls extends LitElement{
 @property({attribute:false}) ctx!:Ctx;
 @state() private area='';
 @state() private kind='light';
 @state() private selected:string[]=[];
 @state() private busy=false;
 @state() private result='';
 private tr(ar:string,en:string){return this.ctx.rtl?ar:en;}
 private rows(){return Object.values(this.ctx.hass.states).filter(entity=>{
  if(!entity.entity_id.startsWith(this.kind+'.')||['unavailable','unknown'].includes(entity.state))return false;
  const registry=this.ctx.hass.entities?.[entity.entity_id];
  const area=registry?.area_id??(registry?.device_id?this.ctx.hass.devices?.[registry.device_id]?.area_id:undefined);
  return !this.area||this.area===area;
 });}
 private reset(){this.selected=[];this.result='';}
 private async execute(on:boolean){
  if(this.busy||!this.selected.length)return;
  const ids=this.selected.filter(id=>this.rows().some(entity=>entity.entity_id===id));
  if(!ids.length)return;this.busy=true;this.result='';
  const service=this.kind==='cover'?(on?'open_cover':'close_cover'):(on?'turn_on':'turn_off');
  const outcomes=await Promise.allSettled(ids.map(async id=>{
   const result=await this.ctx.hass.callService(this.kind,service,{entity_id:id});
   return {id,result};
  }));
  let confirmed=0;const pending:string[]=[],failed:string[]=[];
  outcomes.forEach((outcome,index)=>{
   if(outcome.status==='rejected')failed.push(ids[index]);
   else if(outcome.value.result?.confirmation==='confirmed')confirmed++;
   else pending.push(ids[index]);
  });
  this.result=this.tr('تم تأكيد حالة ','Confirmed state for ')+confirmed+'/'+ids.length;
  if(pending.length)this.result+=this.tr('؛ لم تؤكد الحالة بعد: ','; state not confirmed: ')+pending.map(id=>nameOf(this.ctx.hass,id)).join('، ');
  if(failed.length)this.result+=this.tr('؛ تعذّر الطلب: ','; request failed: ')+failed.map(id=>nameOf(this.ctx.hass,id)).join('، ');
  this.busy=false;
 }
 render(){if(!this.ctx)return nothing;const rows=this.rows();return html`<section dir=${this.ctx.rtl?'rtl':'ltr'}><h4>${this.tr('تحكم سريع بالغرفة أو مجموعة أجهزة','Quick room and device-group controls')}</h4><div class="filters"><label>${this.tr('الغرفة','Room')}<select .value=${this.area} ?disabled=${this.busy} @change=${(event:Event)=>{this.area=(event.target as HTMLSelectElement).value;this.reset();}}><option value="">${this.tr('كل الغرف المسموحة','All permitted rooms')}</option>${Object.values(this.ctx.hass.areas??{}).map(area=>html`<option value=${area.area_id}>${area.name}</option>`)}</select></label><label>${this.tr('نوع الأجهزة','Device type')}<select .value=${this.kind} ?disabled=${this.busy} @change=${(event:Event)=>{this.kind=(event.target as HTMLSelectElement).value;this.reset();}}>${[['light',this.tr('الإضاءة','Lights')],['switch',this.tr('المفاتيح','Switches')],['climate',this.tr('التكييف','Climate')],['cover',this.tr('الستائر','Covers')]].map(([value,label])=>html`<option value=${value}>${label}</option>`)}</select></label></div><div class="devices">${rows.slice(0,80).map(entity=>html`<label class="check"><input type="checkbox" ?disabled=${this.busy} .checked=${this.selected.includes(entity.entity_id)} @change=${(event:Event)=>{const on=(event.target as HTMLInputElement).checked;this.selected=on?[...this.selected,entity.entity_id].slice(0,30):this.selected.filter(id=>id!==entity.entity_id);}}>${nameOf(this.ctx.hass,entity.entity_id)}<small>${entity.state}</small></label>`)}</div>${!rows.length?html`<p>${this.tr('لا توجد أجهزة متاحة ضمن الاختيار.','No available devices match this selection.')}</p>`:nothing}<p class="hint">${this.tr('اختر حتى ٣٠ جهازًا. لا يتم تشغيل أي شيء حتى تضغط أحد الأزرار.','Choose up to 30 devices. Nothing runs until you press an action button.')}</p><div class="actions"><button ?disabled=${this.busy||!this.selected.length} @click=${()=>this.execute(true)}>${this.kind==='cover'?this.tr('فتح المحدد','Open selected'):this.tr('تشغيل المحدد','Turn on selected')}</button><button ?disabled=${this.busy||!this.selected.length} @click=${()=>this.execute(false)}>${this.kind==='cover'?this.tr('إغلاق المحدد','Close selected'):this.tr('إطفاء المحدد','Turn off selected')}</button></div>${this.result?html`<p role="status">${this.result}</p>`:nothing}</section>`;}
 static styles=css`:host{display:block}*{box-sizing:border-box}h4{margin:18px 0 12px}section{border-top:1px solid #ffffff20;margin-top:20px;padding-top:8px}.filters{display:grid;grid-template-columns:1fr 1fr;gap:12px}label{display:grid;gap:6px;font-size:13px}select,button{font:inherit;color:inherit;background:#ffffff12;border:1px solid #ffffff35;border-radius:12px;padding:11px;min-height:44px}select option{color:#26352c;background:#ecebe3}.devices{max-height:220px;overflow:auto;margin:14px 0}.check{display:flex;align-items:center;gap:10px;padding:8px}.check input{width:18px;height:18px}.check small{margin-inline-start:auto}.hint,p{font-size:12px;line-height:1.8}.actions{display:flex;gap:10px;flex-wrap:wrap}button{cursor:pointer}button:disabled{opacity:.5;cursor:default}:focus-visible{outline:3px solid #bfd99c;outline-offset:3px}@media(max-width:500px){.filters{grid-template-columns:1fr}}`;
}
