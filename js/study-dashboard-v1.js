(()=>{"use strict";
const LOG_KEY="central-estudos:study-log-v1";
const SOURCE_FRESH_MS=45*60*1000;
const state={
  projects:[
    {id:"seedf",name:"SEEDF",code:"P1"},
    {id:"tjdft",name:"TJDFT",code:"P2"},
    {id:"prf-adm",name:"PRF Administrativo",code:"P3"}
  ],
  integrity:new Map()
};
const $=id=>document.getElementById(id);
const node=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el};
const api=()=>window.CentralStudyLogV1;
const today=()=>api()?.today?.()||new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo"}).format(new Date());
const duration=m=>api()?.duration?.(m)||(`${Math.floor(m/60)}h ${m%60}min`);
const shift=(date,days)=>{const d=new Date(date+"T00:00:00Z");d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10)};
const total=rows=>rows.reduce((sum,row)=>sum+(Number(row.minutes)||0),0);

function entries(){
  const ids=new Set(state.projects.map(p=>p.id));
  if(api()?.read)return api().read(ids);
  try{
    const raw=JSON.parse(localStorage.getItem(LOG_KEY)||"[]");
    return Array.isArray(raw)?raw.filter(row=>ids.has(row?.projectId)&&row?.confirmed===true):[];
  }catch{return[]}
}
function weekRange(date){
  if(api()?.weekRange)return api().weekRange(date);
  const d=new Date(date+"T00:00:00Z"),n=(d.getUTCDay()+6)%7;
  d.setUTCDate(d.getUTCDate()-n);const from=d.toISOString().slice(0,10);
  d.setUTCDate(d.getUTCDate()+6);return{from,to:d.toISOString().slice(0,10)};
}
function setText(id,value){const el=$(id);if(el)el.textContent=value}
function renderKpis(rows){
  const d=today(),range=weekRange(d),todayRows=rows.filter(x=>x.date===d),weekRows=rows.filter(x=>x.date>=range.from&&x.date<=range.to);
  const activeDays=new Set(rows.map(x=>x.date)).size;
  setText("dashboard-total",duration(total(rows)));
  setText("dashboard-today",duration(total(todayRows)));
  setText("dashboard-week",duration(total(weekRows)));
  setText("dashboard-days",String(activeDays));
  setText("home-study-total",duration(total(rows)));
  setText("home-study-today",duration(total(todayRows)));
  setText("home-study-week",duration(total(weekRows)));
}
function renderProjects(rows){
  const host=$("dashboard-projects");if(!host)return;
  host.replaceChildren();
  const grand=total(rows);
  for(const project of state.projects){
    const minutes=total(rows.filter(x=>x.projectId===project.id));
    const share=grand?Math.round(minutes/grand*100):0;
    const row=node("div","dashboard-project-row");
    const top=node("div","dashboard-project-row-head");
    const label=node("span","dashboard-project-label");label.append(node("b","",project.code||""),document.createTextNode(" "+project.name));
    top.append(label,node("strong","",duration(minutes)));
    const meter=node("progress","dashboard-progress");
    meter.max=100;meter.value=share;
    meter.setAttribute("aria-label",`${project.name}: ${share}% do tempo confirmado`);
    row.append(top,meter,node("small","",grand?`${share}% do tempo confirmado`:"Sem tempo confirmado"));
    host.append(row);
  }
}
function renderSevenDays(rows){
  const host=$("dashboard-seven-days");if(!host)return;
  host.replaceChildren();
  const end=today(),days=Array.from({length:7},(_,i)=>shift(end,i-6));
  const values=days.map(date=>({date,minutes:total(rows.filter(x=>x.date===date))}));
  const max=Math.max(60,...values.map(x=>x.minutes));
  const fmt=new Intl.DateTimeFormat("pt-BR",{weekday:"short",timeZone:"UTC"});
  for(const item of values){
    const col=node("div","dashboard-day");
    const value=node("span","dashboard-day-value",item.minutes?duration(item.minutes):"0");
    const barWrap=node("div","dashboard-day-bar-wrap"),bar=node("progress","dashboard-day-progress");
    bar.max=max;bar.value=item.minutes;
    bar.setAttribute("aria-label",`${item.date}: ${duration(item.minutes)}`);
    barWrap.append(bar);
    const date=new Date(item.date+"T00:00:00Z");
    col.append(value,barWrap,node("span","dashboard-day-label",fmt.format(date).replace(".","")));
    host.append(col);
  }
}
function renderComposition(rows){
  const reading=rows.filter(x=>/^Leitura ·/i.test(String(x.topic||""))),readingMinutes=total(reading),grand=total(rows),studyMinutes=Math.max(0,grand-readingMinutes);
  const readingShare=grand?Math.round(readingMinutes/grand*100):0;
  const studyShare=grand?100-readingShare:0;
  setText("dashboard-reading",duration(readingMinutes));
  setText("dashboard-study",duration(studyMinutes));
  setText("dashboard-reading-share",grand?`${readingShare}%`:"—");
  setText("dashboard-study-share",grand?`${studyShare}%`:"—");
  const meter=$("dashboard-composition-progress");
  if(meter){meter.max=100;meter.value=readingShare;meter.setAttribute("aria-valuetext",`Leitura ${readingShare}% · outros estudos ${studyShare}%`)}
}
function integrityFresh(info){
  const checked=Date.parse(info?.checkedAt||"");
  return Number.isFinite(checked)&&Date.now()-checked<=SOURCE_FRESH_MS;
}
function integrityAge(info){
  const checked=Date.parse(info?.checkedAt||"");
  if(!Number.isFinite(checked))return null;
  const minutes=Math.max(0,Math.floor((Date.now()-checked)/60000));
  if(minutes<60)return minutes<=1?"agora":`há ${minutes} min`;
  const hours=Math.floor(minutes/60);
  return hours===1?"há 1h":`há ${hours}h`;
}
function integrityLabel(info){
  const status=info?.status;
  if(status==="aligned"&&!integrityFresh(info))return["Conferência antiga","warn"];
  if(status==="aligned")return["Alinhado","ok"];
  if(status==="source-newer")return["Origem mais recente","warn"];
  if(status==="partial-check")return["Conferência parcial","warn"];
  if(status==="public-unavailable")return["Contrato indisponível","bad"];
  if(status==="unverifiable")return["Não verificável","warn"];
  return["Aguardando","idle"];
}
function renderIntegrity(){
  const host=$("dashboard-integrity");if(!host)return;
  host.replaceChildren();
  let aligned=0;
  for(const project of state.projects){
    const info=state.integrity.get(project.id);
    const status=info?.status||null,[label,tone]=integrityLabel(info),age=integrityAge(info);
    if(status==="aligned"&&integrityFresh(info))aligned++;
    const card=node("div","dashboard-source");
    const top=node("div","dashboard-source-head");
    top.append(node("strong","",project.name),node("span","dashboard-source-status "+tone,label));
    const meta=info?.coverage?info.coverage+" pontos conferidos"+(age?" · "+age:""):"Aguardando contrato publicado";
    card.append(top,node("small","",meta));
    host.append(card);
  }
  setText("dashboard-integrity-summary",`${aligned}/${state.projects.length} fontes recentes e alinhadas`);
}
function render(){
  const rows=entries();
  renderKpis(rows);renderProjects(rows);renderSevenDays(rows);renderComposition(rows);renderIntegrity();
  setText("dashboard-updated","Atualizado com os registros confirmados deste navegador.");
}
function setProjects(list){
  if(!Array.isArray(list))return;
  const active=list.filter(p=>p?.status==="active"||p?.code&&["P1","P2","P3"].includes(p.code));
  if(active.length)state.projects=active.map(p=>({id:p.id,name:p.name,code:p.code||""}));
  render();
}
document.addEventListener("central:app-ready",e=>setProjects(e.detail?.projects));
document.addEventListener("central:workspace-ready",e=>setProjects(e.detail?.projects));
document.addEventListener("central:contract-state",e=>{
  const d=e.detail;if(!d?.id)return;
  const integrity=d.contract?.source?.centralIntegrity;
  if(integrity)state.integrity.set(d.id,integrity);
  renderIntegrity();
});
document.addEventListener("central:study-log-updated",render);
document.addEventListener("central:study-log-auto-added",render);
window.addEventListener("storage",e=>{if(e.key===LOG_KEY)render()});
document.addEventListener("visibilitychange",()=>{if(!document.hidden)render()});
document.addEventListener("DOMContentLoaded",render,{once:true});
setTimeout(render,0);
setInterval(renderIntegrity,60000);
})();
