(()=>{"use strict";
const REGISTRY_URL="../config/projects.json?v=28.0.2";
const SCHEDULE_URL="../config/study-schedule-v1.json?v=28.0.2";
const LOG_KEY="central-estudos:study-log-v1";
const SYNC_KEY="central-estudos:study-sync-v1";
const FOCUS_KEY="central-estudos:focus-project";
const SUPABASE_URL="https://fqqkkyusnzhuuizahkww.supabase.co";
const SUPABASE_KEY="sb_publishable_GfoaAPKtYuSu_UY6wE8jMg_XsVjdWU7";
const ORDER=["seedf","tjdft","tcego","prf-adm"];
const LABEL={seedf:"SEEDF",tjdft:"TJDFT",tcego:"TCE-GO","prf-adm":"PRF ADM"};
const PRIORITY={seedf:"P1",tjdft:"P2",tcego:"P3","prf-adm":"P4"};
const WEEKDAYS=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
const WEEKDAY_PT={sunday:"Domingo",monday:"Segunda-feira",tuesday:"Terça-feira",wednesday:"Quarta-feira",thursday:"Quinta-feira",friday:"Sexta-feira",saturday:"Sábado"};
const $=id=>document.getElementById(id);
const state={registry:null,schedule:null,logs:[],contracts:new Map,privateStudy:new Map,projectStates:new Map,lastRefresh:null,loading:false};

function node(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el}
function isoToday(){const parts=new Intl.DateTimeFormat("en-GB",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date()),m=Object.fromEntries(parts.map(x=>[x.type,x.value]));return m.year+"-"+m.month+"-"+m.day}
function shift(date,days){const d=new Date(date+"T00:00:00Z");d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10)}
function dayDiff(a,b){if(!a||!b)return null;const x=Date.parse(String(a).slice(0,10)+"T00:00:00Z"),y=Date.parse(String(b).slice(0,10)+"T00:00:00Z");return Number.isFinite(x)&&Number.isFinite(y)?Math.max(0,Math.round((y-x)/864e5)):null}
function duration(n){n=Number(n)||0;const h=Math.floor(n/60),m=n%60;return h?h+"h"+(m?" "+m+"min":""):m+" min"}
function pct(v){return Number.isFinite(v)?Math.round(v*100)+"%":"—"}
function fmtDate(v){if(!v)return"—";const s=String(v).slice(0,10),p=s.split("-");return p.length===3?p.reverse().join("/"):String(v)}
function focusId(){try{const v=localStorage.getItem(FOCUS_KEY);return ORDER.includes(v)?v:null}catch{return null}}
function project(id){return state.registry?.projects?.find(p=>p.id===id)||null}
function projectName(id){return project(id)?.name||LABEL[id]||id}
function studyUrl(id){return project(id)?.url||"../#projetos"}

function readLogs(){
 try{
  const raw=JSON.parse(localStorage.getItem(LOG_KEY)||"[]");
  if(!Array.isArray(raw))return[];
  const today=isoToday();
  return raw.filter(e=>e&&typeof e==="object"&&ORDER.includes(e.projectId)&&typeof e.date==="string"&&e.date<=today&&Number.isInteger(e.minutes)&&e.minutes>0&&typeof e.trail==="string");
 }catch{return[]}
}
function logStats(id){
 const today=isoToday(),from=shift(today,-6),mine=state.logs.filter(e=>e.projectId===id),week=mine.filter(e=>e.date>=from&&e.date<=today),todayRows=mine.filter(e=>e.date===today),dates=mine.map(e=>e.date).sort();
 return{todayMinutes:todayRows.reduce((n,e)=>n+e.minutes,0),weekMinutes:week.reduce((n,e)=>n+e.minutes,0),totalMinutes:mine.reduce((n,e)=>n+e.minutes,0),lastDate:dates.at(-1)||null,blocks:mine.length};
}
function normalizeStudy(s){
 if(!s||typeof s!=="object")return null;
 if(!["confirmed","partial","planned","unavailable"].includes(s.evidence))return null;
 if(typeof s.sourceRef!=="string"||!s.sourceRef.trim())return null;
 const out={...s};
 const ints=["questionsDone","correct","errors","doubts","reviewsDue","activeErrors","completedSessions","totalSessions"];
 for(const k of ints)if(out[k]!=null&&(!Number.isInteger(out[k])||out[k]<0))out[k]=null;
 if(out.accuracy!=null&&(!Number.isFinite(out.accuracy)||out.accuracy<0||out.accuracy>1))out.accuracy=null;
 if(!Array.isArray(out.notes))out.notes=[];
 return out;
}
async function fetchJson(url,timeout=6000){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
 try{
  const res=await fetch(url,{cache:"no-store",signal:controller.signal,headers:{Accept:"application/json"}});
  if(!res.ok)throw new Error("HTTP "+res.status);
  return await res.json();
 }finally{clearTimeout(timer)}
}
async function loadRegistry(){
 const [registry,schedule]=await Promise.all([fetchJson(REGISTRY_URL),fetchJson(SCHEDULE_URL)]);
 if(registry?.schemaVersion!==3||!Array.isArray(registry.projects))throw new Error("registry inválido");
 if(!schedule?.weekdays)throw new Error("cronograma inválido");
 state.registry=registry;state.schedule=schedule;
}
async function loadContract(p){
 if(!p?.statusUrl)return{status:"unsupported",contract:null,reason:"sem contrato público"};
 try{
  const data=await fetchJson(p.statusUrl);
  if(!data||data.schemaVersion!==1||data.projectId!==p.id||!data.state)throw new Error("contrato incompatível");
  return{status:data.source?.status==="partial"?"partial":"live",contract:data,reason:null};
 }catch(err){return{status:"unavailable",contract:null,reason:err?.message||"falha ao ler contrato"}}
}
function readSyncState(){
 try{const v=JSON.parse(localStorage.getItem(SYNC_KEY)||"null");return v&&v.version===1?v:null}catch{return null}
}
function decodeJwt(token){try{const part=token.split(".")[1].replace(/-/g,"+").replace(/_/g,"/");return JSON.parse(atob(part+"=".repeat((4-part.length%4)%4)))}catch{return{}}}
async function refreshSupabaseSession(sync){
 if(!sync?.session?.refresh_token)return null;
 try{
  const res=await fetch(SUPABASE_URL+"/auth/v1/token?grant_type=refresh_token",{method:"POST",headers:{apikey:SUPABASE_KEY,"Content-Type":"application/json"},body:JSON.stringify({refresh_token:sync.session.refresh_token})});
  const data=await res.json();
  if(!res.ok||!data.access_token)return null;
  const exp=Number(data.expires_at)?Number(data.expires_at)*1000:Date.now()+(Number(data.expires_in)||3600)*1000;
  sync.session={access_token:data.access_token,refresh_token:data.refresh_token||sync.session.refresh_token,expires_at:exp,user_id:data.user?.id||sync.session.user_id||""};
  sync.accountId=sync.accountId||data.user?.id||sync.session.user_id||"";
  localStorage.setItem(SYNC_KEY,JSON.stringify(sync));
  return sync;
 }catch{return null}
}
async function tcePrivateStudy(){
 let sync=readSyncState();
 if(!sync?.session?.access_token)return{status:"signed-out",study:null,reason:"Conecte o Supabase na Central principal para incluir o progresso privado do TCE-GO."};
 const jwt=decodeJwt(sync.session.access_token),expires=(Number(sync.session.expires_at)||Number(jwt.exp)*1000||0);
 if(expires&&expires<Date.now()+60000)sync=await refreshSupabaseSession(sync);
 if(!sync?.session?.access_token)return{status:"signed-out",study:null,reason:"Sessão Supabase expirada. Reconecte pela Central principal."};
 const userId=sync.accountId||sync.session.user_id||decodeJwt(sync.session.access_token).sub;
 if(!userId)return{status:"signed-out",study:null,reason:"Sessão sem usuário identificável."};
 const url=new URL(SUPABASE_URL+"/rest/v1/tce_progress_state");
 url.searchParams.set("select","dxx,resolved_sxx,studied,completed,time_minutes,questions_done,correct,errors,doubts,canonical_status,confirmed_at,updated_at,event_occurred_at,canonical_revision");
 url.searchParams.set("owner_id","eq."+userId);
 url.searchParams.set("order","event_occurred_at.desc");
 url.searchParams.set("limit","150");
 try{
  const res=await fetch(url.toString(),{method:"GET",headers:{apikey:SUPABASE_KEY,Authorization:"Bearer "+sync.session.access_token,Accept:"application/json"}});
  if(res.status===401)return{status:"signed-out",study:null,reason:"Sessão Supabase precisa ser renovada na Central principal."};
  if(!res.ok)throw new Error("HTTP "+res.status);
  const rows=await res.json();
  if(!Array.isArray(rows)||!rows.length)return{status:"empty",study:null,reason:"Nenhuma execução privada confirmada no TCE-GO."};
  const questions=rows.reduce((n,r)=>n+(Number(r.questions_done)||0),0),correct=rows.reduce((n,r)=>n+(Number(r.correct)||0),0),errors=rows.reduce((n,r)=>n+(Number(r.errors)||0),0),doubts=rows.reduce((n,r)=>n+(Number(r.doubts)||0),0);
  const last=rows[0],lastCompleted=rows.find(r=>r.completed),reviewDates=rows.map(r=>r.canonical_revision).filter(Boolean).sort(),today=isoToday();
  const due=reviewDates.filter(v=>String(v).slice(0,10)<=today).length;
  return{status:"private",study:normalizeStudy({evidence:"confirmed",sourceRef:"supabase:tce_progress_state",updatedAt:last.event_occurred_at||last.updated_at||null,trail:"TCE-GO",lastCompletedUnit:lastCompleted?.dxx||null,nextUnit:null,lastStudiedAt:last.event_occurred_at||last.confirmed_at||null,questionsDone:questions,correct,errors,doubts,accuracy:questions?correct/questions:null,reviewsDue:due,nextReviewAt:reviewDates.find(v=>String(v).slice(0,10)>today)||null,activeErrors:errors,completedSessions:rows.filter(r=>r.completed).length,totalSessions:null,notes:["Progresso privado lido somente com sua sessão Supabase."]}),reason:null};
 }catch(err){return{status:"unavailable",study:null,reason:err?.message||"Não foi possível ler o TCE privado."}}
}
function combinedStudy(id){
 const publicStudy=normalizeStudy(state.contracts.get(id)?.contract?.study),privateStudy=state.privateStudy.get(id)||null;
 return privateStudy?{...(publicStudy||{}),...privateStudy}:publicStudy;
}
function scheduleToday(){
 const key=WEEKDAYS[new Date(isoToday()+"T00:00:00Z").getUTCDay()];
 return{key,ids:Array.isArray(state.schedule?.weekdays?.[key])?state.schedule.weekdays[key]:[]};
}
function latestEvidenceDate(id,study,logs){
 const candidates=[study?.lastStudiedAt,logs.lastDate].filter(Boolean).map(v=>String(v).slice(0,10)).sort();
 return candidates.at(-1)||null;
}
function projectSignal(id){
 const logs=logStats(id),study=combinedStudy(id),today=isoToday(),schedule=scheduleToday(),scheduled=schedule.ids.includes(id),remoteToday=study?.evidence==="confirmed"&&String(study.lastStudiedAt||"").slice(0,10)===today,executedToday=logs.todayMinutes>0||remoteToday,lastDate=latestEvidenceDate(id,study,logs),daysSince=lastDate?dayDiff(lastDate,today):null,focus=focusId()===id;
 let score=0;const reasons=[];
 if(scheduled&&!executedToday){score+=70;reasons.push({tone:"warn",title:"Previsto hoje",text:"Está na grade de hoje e ainda não há execução confirmada nem tempo registrado."})}
 if(scheduled&&executedToday){score-=50;reasons.push({tone:"good",title:"Executado hoje",text:logs.todayMinutes?"Há "+duration(logs.todayMinutes)+" registrados hoje.":"O próprio projeto publicou execução confirmada hoje."})}
 if(Number(study?.reviewsDue)>0){score+=45;reasons.push({tone:"danger",title:"Revisão vencida",text:study.reviewsDue+" revisão(ões) publicada(s) estão vencidas."})}
 if(Number.isFinite(study?.accuracy)&&Number(study?.questionsDone)>=10&&study.accuracy<.9){
  const add=study.accuracy<.7?25:study.accuracy<.8?15:5;score+=add;
  reasons.push({tone:study.accuracy<.7?"danger":"warn",title:"Desempenho publicado",text:pct(study.accuracy)+" em "+study.questionsDone+" questão(ões)."});
 }
 if(Number(study?.activeErrors)>0){const add=Math.min(Number(study.activeErrors),10)*2;score+=add;reasons.push({tone:"warn",title:"Erros ativos",text:study.activeErrors+" erro(s) ativo(s) publicados pelo projeto."})}
 if(daysSince!=null&&daysSince>=3){score+=Math.min(daysSince,10);reasons.push({tone:"warn",title:"Recência",text:"Última evidência de estudo há "+daysSince+" dia(s)."})}
 if(study?.nextUnit)reasons.push({tone:"good",title:"Próxima unidade",text:study.nextUnit+" foi publicada como próxima etapa."});
 if(focus){score+=4;reasons.push({tone:"good",title:"Seu foco",text:"Este é o foco que você escolheu na Central."})}
 if(!scheduled)score-=20;
 return{id,name:projectName(id),project:project(id),logs,study,scheduled,executedToday,remoteToday,lastDate,daysSince,score,reasons,contractState:state.contracts.get(id)||null};
}
function allSignals(){return ORDER.map(projectSignal)}
function recommendation(signals){
 const scheduledPending=signals.filter(s=>s.scheduled&&!s.executedToday).sort((a,b)=>b.score-a.score||ORDER.indexOf(a.id)-ORDER.indexOf(b.id));
 if(scheduledPending.length)return{kind:"study",top:scheduledPending[0],title:scheduledPending[0].name,message:scheduledPending[0].study?.nextUnit?"Próxima unidade publicada: "+scheduledPending[0].study.nextUnit+".":"É o próximo projeto previsto na grade sem execução confirmada hoje."};
 const reviews=signals.filter(s=>Number(s.study?.reviewsDue)>0).sort((a,b)=>Number(b.study?.reviewsDue)-Number(a.study?.reviewsDue)||b.score-a.score);
 if(reviews.length)return{kind:"review",top:reviews[0],title:"Revisar "+reviews[0].name,message:reviews[0].study.reviewsDue+" revisão(ões) vencida(s) publicada(s) merecem atenção antes de abrir conteúdo novo."};
 const schedule=scheduleToday();
 if(!schedule.ids.length)return{kind:"rest",top:null,title:"Descanso protegido",message:state.schedule?.notes?.sunday||"Hoje não há bloco regular previsto."};
 return{kind:"close",top:null,title:"Fechamento do dia",message:"Os projetos previstos hoje já têm execução confirmada ou tempo registrado. Verifique pendências explícitas e encerre sem criar compensação artificial."};
}
function confidence(signals){
 const withStudy=signals.filter(s=>s.study&&["confirmed","partial"].includes(s.study.evidence)),confirmed=withStudy.filter(s=>s.study.evidence==="confirmed").length,partial=withStudy.length-confirmed,recentLogs=state.logs.filter(e=>e.date>=shift(isoToday(),-13)),fresh=signals.filter(s=>{const d=s.contractState?.contract?.source?.updatedAt||s.study?.updatedAt;const age=d?dayDiff(String(d).slice(0,10),isoToday()):null;return age!=null&&age<=2}).length;
 if(confirmed>=3&&fresh>=3)return{label:"Alta",note:confirmed+" fontes confirmadas e "+fresh+" sinais atualizados recentemente."};
 if(withStudy.length>=2||recentLogs.length>=3)return{label:"Média",note:confirmed+" confirmada(s), "+partial+" parcial(is) e "+recentLogs.length+" bloco(s) locais recentes."};
 return{label:"Baixa",note:"A base ainda está curta; o Mentor evita preencher lacunas por suposição."};
}
function totalToday(){return state.logs.filter(e=>e.date===isoToday()).reduce((n,e)=>n+e.minutes,0)}
function totalWeek(){const from=shift(isoToday(),-6);return state.logs.filter(e=>e.date>=from&&e.date<=isoToday()).reduce((n,e)=>n+e.minutes,0)}

function renderReasons(rec){
 const box=$("mentor-reasons");box.replaceChildren();
 const reasons=rec.top?.reasons||[];
 if(!reasons.length){box.append(node("p","mentor-empty",rec.message));return}
 reasons.forEach(r=>{const item=node("div","mentor-reason");item.dataset.tone=r.tone||"info";item.append(node("strong","",r.title),node("span","",r.text));box.append(item)});
}
function renderSchedule(signals){
 const box=$("mentor-schedule"),schedule=scheduleToday();box.replaceChildren();$("mentor-weekday").textContent=WEEKDAY_PT[schedule.key]||schedule.key;
 if(!schedule.ids.length){box.append(node("p","mentor-empty",state.schedule?.notes?.[schedule.key]||"Nenhum bloco regular previsto."));return}
 schedule.ids.forEach(id=>{const s=signals.find(x=>x.id===id),item=node("div","mentor-schedule-item");item.dataset.state=s?.executedToday?"done":"pending";item.append(node("strong","",(PRIORITY[id]||"")+" · "+projectName(id)),node("span","",s?.executedToday?"Execução confirmada hoje.":s?.study?.nextUnit?"Próximo: "+s.study.nextUnit:"Previsto na grade; próxima unidade não publicada."));box.append(item)});
}
function sourceLabel(signal){
 if(signal.id==="tcego"&&state.projectStates.get("tcego")?.privateStatus==="private")return["Privado autenticado","live"];
 const s=signal.contractState?.status||"unavailable";
 if(s==="live")return["Contrato atualizado","live"];
 if(s==="partial")return["Contrato parcial","partial"];
 if(signal.id==="tcego"&&state.projectStates.get("tcego")?.privateStatus==="signed-out")return["TCE privado desconectado","signed-out"];
 return["Indisponível","unavailable"];
}
function renderDataHealth(signals){
 const box=$("mentor-data-health-list");box.replaceChildren();
 signals.forEach(s=>{const [label,status]=sourceLabel(s),card=node("div","mentor-source-card"),updated=s.contractState?.contract?.source?.updatedAt||s.study?.updatedAt||null;card.append(node("strong","",s.name),node("span","",updated?"Atualizado: "+fmtDate(updated):"Sem data confiável"),node("small","",s.study?.sourceRef||s.contractState?.contract?.source?.ref||"Sem sinal pedagógico"));const st=node("span","mentor-source-status",label);st.dataset.state=status;card.append(st);box.append(card)});
}
function renderProjectCards(signals){
 const box=$("mentor-project-grid");box.replaceChildren();
 signals.forEach(s=>{const card=node("article","mentor-project-card"),head=node("div","mentor-project-head"),title=node("div",""),badge=node("span","mentor-mini-chip",PRIORITY[s.id]+" · "+(s.study?.evidence||"sem sinal"));title.append(node("h3","",s.name),node("p","mentor-project-note",s.project?.description||"Projeto ativo"));head.append(title,badge);card.append(head);
  const meta=node("div","mentor-project-meta");["Último: "+(s.study?.lastCompletedUnit||"desconhecido"),"Próximo: "+(s.study?.nextUnit||"desconhecido"),"Última evidência: "+fmtDate(s.lastDate)].forEach(t=>meta.append(node("span","mentor-mini-chip",t)));card.append(meta);
  const stats=node("div","mentor-project-stats"),pairs=[["7 dias",duration(s.logs.weekMinutes)],["Questões",s.study?.questionsDone??"—"],["Precisão",pct(s.study?.accuracy)],["Erros ativos",s.study?.activeErrors??"—"],["Revisões",s.study?.reviewsDue??"—"],["Sessões",s.study?.completedSessions!=null?(s.study.completedSessions+(s.study.totalSessions?"/"+s.study.totalSessions:"")):"—"]];
  pairs.forEach(([a,b])=>{const x=node("div","mentor-project-stat");x.append(node("span","",a),node("strong","",String(b)));stats.append(x)});card.append(stats);
  if(s.study?.notes?.length)card.append(node("p","mentor-project-note",s.study.notes.slice(0,2).join(" · ")));
  const actions=node("div","mentor-project-actions"),open=node("a","mentor-button mentor-button-primary","Abrir projeto"),why=node("button","mentor-button mentor-button-secondary","Ver motivos");open.href=studyUrl(s.id);why.type="button";why.addEventListener("click",()=>{switchView("agora");const custom={top:s,title:s.name,message:"Motivos atuais deste projeto."};$("mentor-now-title").textContent=s.name;$("mentor-recommendation-copy").textContent=custom.message;renderReasons(custom);location.hash="agora"});actions.append(open,why);card.append(actions);box.append(card)});
}
function renderReviews(signals){
 const review=$("mentor-review-list"),risk=$("mentor-risk-list");review.replaceChildren();risk.replaceChildren();
 const reviews=signals.filter(s=>Number(s.study?.reviewsDue)>0||s.study?.nextReviewAt).sort((a,b)=>(Number(b.study?.reviewsDue)||0)-(Number(a.study?.reviewsDue)||0));
 if(!reviews.length)review.append(node("p","mentor-empty","Nenhuma revisão explícita foi publicada pelos projetos."));
 else reviews.forEach(s=>{const x=node("div","mentor-review-item");x.dataset.tone=Number(s.study?.reviewsDue)>0?"warn":"info";x.append(node("strong","",s.name),node("span","",Number(s.study?.reviewsDue)>0?s.study.reviewsDue+" vencida(s) · próxima "+fmtDate(s.study?.nextReviewAt):"Próxima revisão: "+fmtDate(s.study?.nextReviewAt)));review.append(x)});
 const risks=[];
 signals.forEach(s=>{if(Number.isFinite(s.study?.accuracy)&&Number(s.study?.questionsDone)>=10&&s.study.accuracy<.85)risks.push({severity:s.study.accuracy<.7?3:2,title:s.name+" · desempenho",text:pct(s.study.accuracy)+" em "+s.study.questionsDone+" questões"});if(Number(s.study?.activeErrors)>0)risks.push({severity:Number(s.study.activeErrors)>=10?3:2,title:s.name+" · erros ativos",text:s.study.activeErrors+" erro(s) publicados"});if(!s.study)risks.push({severity:1,title:s.name+" · lacuna de dados",text:"O projeto ainda não fornece sinal pedagógico suficiente ao Mentor."})});
 risks.sort((a,b)=>b.severity-a.severity);
 if(!risks.length)risk.append(node("p","mentor-empty","Nenhum risco explícito foi encontrado nos sinais disponíveis."));
 else risks.forEach(r=>{const x=node("div","mentor-risk-item");x.dataset.tone=r.severity>=3?"danger":"warn";x.append(node("strong","",r.title),node("span","",r.text));risk.append(x)});
}
function renderSources(signals){
 const box=$("mentor-source-details");box.replaceChildren();
 signals.forEach(s=>{const row=node("div","mentor-source-row"),source=s.study?.sourceRef||s.contractState?.contract?.source?.ref||"sem sinal";row.append(node("strong","",s.name+" · "+source),node("span","",s.contractState?.contract?.source?.updatedAt?"Atualização da fonte: "+s.contractState.contract.source.updatedAt:"Sem timestamp público disponível"));box.append(row)});
}
function renderAll(){
 const signals=allSignals(),rec=recommendation(signals),conf=confidence(signals),studyCount=signals.filter(s=>s.study&&["confirmed","partial"].includes(s.study.evidence)).length,reviews=signals.reduce((n,s)=>n+(Number(s.study?.reviewsDue)||0),0);
 $("mentor-now-title").textContent=rec.title;$("mentor-recommendation-copy").textContent=rec.message;$("mentor-confidence").textContent=conf.label;$("mentor-confidence-note").textContent=conf.note;$("mentor-today-time").textContent=duration(totalToday());$("mentor-week-time").textContent=duration(totalWeek());$("mentor-signal-count").textContent=studyCount+"/4";$("mentor-review-count").textContent=String(reviews);$("mentor-score-label").textContent=rec.top?"prioridade explicada":"sem ação extra";$("mentor-last-refresh").textContent=state.lastRefresh?"Atualizado "+new Intl.DateTimeFormat("pt-BR",{timeZone:"America/Sao_Paulo",hour:"2-digit",minute:"2-digit"}).format(state.lastRefresh):"não atualizado";
 const actions=$("mentor-primary-actions");actions.replaceChildren();if(rec.top){const a=node("a","mentor-button mentor-button-primary","Abrir "+rec.top.name);a.href=studyUrl(rec.top.id);actions.append(a)}const refresh=node("button","mentor-button mentor-button-secondary","Recalcular");refresh.type="button";refresh.addEventListener("click",loadAll);actions.append(refresh);
 renderReasons(rec);renderSchedule(signals);renderDataHealth(signals);renderProjectCards(signals);renderReviews(signals);renderSources(signals);
}
async function loadAll(){
 if(state.loading)return;state.loading=true;document.body.classList.add("mentor-loading");$("mentor-refresh").disabled=true;
 try{
  if(!state.registry||!state.schedule)await loadRegistry();
  state.logs=readLogs();
  const active=state.registry.projects.filter(p=>p.status==="active"&&ORDER.includes(p.id));
  const results=await Promise.all(active.map(async p=>[p.id,await loadContract(p)]));
  state.contracts=new Map(results);
  const tce=await tcePrivateStudy();state.projectStates.set("tcego",{privateStatus:tce.status,reason:tce.reason});state.privateStudy.clear();if(tce.study)state.privateStudy.set("tcego",tce.study);
  state.lastRefresh=new Date();renderAll();
 }catch(err){
  $("mentor-now-title").textContent="Não foi possível montar o Mentor";$("mentor-recommendation-copy").textContent=err?.message||"Falha ao carregar as fontes.";const reasons=$("mentor-reasons");reasons.replaceChildren(node("p","mentor-alert","A Central continua disponível. Volte e tente atualizar os dados novamente."));
 }finally{state.loading=false;document.body.classList.remove("mentor-loading");$("mentor-refresh").disabled=false}
}
function switchView(view){
 document.querySelectorAll("[data-mentor-panel]").forEach(p=>{const active=p.dataset.mentorPanel===view;p.hidden=!active;p.classList.toggle("is-active",active)});
 document.querySelectorAll("[data-mentor-view]").forEach(b=>{const active=b.dataset.mentorView===view;b.classList.toggle("is-active",active);b.setAttribute("aria-pressed",String(active))});
}
function initTabs(){
 const allowed=new Set(["agora","projetos","revisoes","metodo"]);let current=location.hash.replace("#","");if(!allowed.has(current))current="agora";switchView(current);
 document.querySelectorAll("[data-mentor-view]").forEach(b=>b.addEventListener("click",()=>{const v=b.dataset.mentorView;switchView(v);history.replaceState(null,"","#"+v)}));
}
function renderClock(){
 const now=new Date(),time=new Intl.DateTimeFormat("pt-BR",{timeZone:"America/Sao_Paulo",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(now);$("mentor-clock").textContent="Brasília · "+time;
}
document.addEventListener("DOMContentLoaded",()=>{initTabs();renderClock();setInterval(renderClock,1000);$("mentor-refresh").addEventListener("click",loadAll);window.addEventListener("storage",e=>{if([LOG_KEY,SYNC_KEY,FOCUS_KEY].includes(e.key))loadAll()});loadAll()});
})();