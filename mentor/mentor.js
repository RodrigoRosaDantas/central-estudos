(()=>{"use strict";
const REGISTRY_URL="../config/projects.json?v=28.7.1";
const SCHEDULE_URL="../config/study-schedule-v1.json?v=28.2.0";
const FEDERATED_URL="https://api.github.com/repos/RodrigoRosaDantas/central-estudos/contents/data/federated-status.json?ref=main";
const LOG_KEY="central-estudos:study-log-v1";
const FOCUS_KEY="central-estudos:focus-project";
let ORDER=["seedf","tjdft","prf-adm"];
let LABEL={seedf:"SEEDF",tjdft:"TJDFT","prf-adm":"PRF ADM"};
let PRIORITY={seedf:"P1",tjdft:"P2","prf-adm":"P3"};
const VIEWS=["agora","projetos","revisoes","metodo"];
const WEEKDAYS=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
const WEEKDAY_PT={sunday:"Domingo",monday:"Segunda-feira",tuesday:"Terça-feira",wednesday:"Quarta-feira",thursday:"Quinta-feira",friday:"Sexta-feira",saturday:"Sábado"};
const $=id=>document.getElementById(id);
const state={registry:null,schedule:null,federated:null,logs:[],contracts:new Map,lastRefresh:null,loading:false};

function node(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el}
function isoToday(){const parts=new Intl.DateTimeFormat("en-GB",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date()),m=Object.fromEntries(parts.map(x=>[x.type,x.value]));return m.year+"-"+m.month+"-"+m.day}
function shift(date,days){const d=new Date(date+"T00:00:00Z");d.setUTCDate(d.getUTCDate()+days);return d.toISOString().slice(0,10)}
function dayDiff(a,b){if(!a||!b)return null;const x=Date.parse(String(a).slice(0,10)+"T00:00:00Z"),y=Date.parse(String(b).slice(0,10)+"T00:00:00Z");return Number.isFinite(x)&&Number.isFinite(y)?Math.max(0,Math.round((y-x)/864e5)):null}
function duration(n){n=Number(n)||0;const h=Math.floor(n/60),m=n%60;return h?h+"h"+(m?" "+m+"min":""):m+" min"}
function pct(v){return Number.isFinite(v)?Math.round(v*100)+"%":"—"}
function fmtDate(v){const date=studyDate(v);return date?date.split("-").reverse().join("/"):"—"}
function studyDate(value){return window.CentralStudyDatesV1?.publishedDate(value)||null}
function focusId(){try{const v=localStorage.getItem(FOCUS_KEY);return ORDER.includes(v)?v:v==="tcego"&&ORDER.includes("seedf")?"seedf":null}catch{return null}}
function project(id){return state.registry?.projects?.find(p=>p.id===id)||null}
function projectName(id){return project(id)?.name||LABEL[id]||id}
function studyUrl(id){return project(id)?.url||"../#projetos"}

function readLogs(){
 try{
  const raw=JSON.parse(localStorage.getItem(LOG_KEY)||"[]");
  if(!Array.isArray(raw))return[];
  const today=isoToday();
  return raw.filter(e=>e&&typeof e==="object"&&ORDER.includes(e.projectId)&&window.CentralStudyDatesV1?.dateOnly(e.date)&&e.date<=today&&Number.isInteger(e.minutes)&&e.minutes>0&&e.minutes<=1440&&e.confirmed===true&&typeof e.trail==="string"&&e.trail.trim());
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
 const [registry,schedule,federated]=await Promise.all([fetchJson(REGISTRY_URL),fetchJson(SCHEDULE_URL),fetchJson(FEDERATED_URL).catch(()=>null)]);
 if(registry?.schemaVersion!==3||!Array.isArray(registry.projects))throw new Error("registry inválido");
 if(!schedule?.weekdays)throw new Error("cronograma inválido");
 const active=registry.projects.filter(p=>p.status==="active").sort((a,b)=>(a.order??999)-(b.order??999));
 if(!active.length)throw new Error("sem projetos ativos");
 ORDER=active.map(p=>p.id);LABEL=Object.fromEntries(active.map(p=>[p.id,p.shortName||p.name]));PRIORITY=Object.fromEntries(active.map(p=>[p.id,p.code||""]));
 state.registry=registry;state.schedule=schedule;state.federated=federated;
}
async function loadContract(p){
 if(!p?.statusUrl)return{status:"unsupported",contract:null,reason:"sem contrato público"};
 try{
  const data=await fetchJson(p.statusUrl);
  if(!data||data.schemaVersion!==1||data.projectId!==p.id||!data.state)throw new Error("contrato incompatível");
  return{status:data.source?.status==="partial"?"partial":"live",contract:data,reason:null};
 }catch(err){return{status:"unavailable",contract:null,reason:err?.message||"falha ao ler contrato"}}
}
function combinedStudy(id){const study=normalizeStudy(state.contracts.get(id)?.contract?.study),integrity=state.federated?.sources?.[id]?.integrity?.status;return study&&study.evidence==="confirmed"&&["source-newer","partial-check","public-unavailable","unverifiable"].includes(integrity)?{...study,evidence:"partial"}:study}

function scheduleToday(){
 const key=WEEKDAYS[new Date(isoToday()+"T00:00:00Z").getUTCDay()];
 return{key,ids:Array.isArray(state.schedule?.weekdays?.[key])?state.schedule.weekdays[key]:[]};
}
function latestEvidenceDate(id,study,logs){
 const today=isoToday(),candidates=[studyDate(study?.lastStudiedAt),logs.lastDate].filter(date=>date&&date<=today).sort();
 return candidates.at(-1)||null;
}
function projectSignal(id){
 const logs=logStats(id),study=combinedStudy(id),today=isoToday(),schedule=scheduleToday(),scheduled=schedule.ids.includes(id),remoteToday=study?.evidence==="confirmed"&&studyDate(study.lastStudiedAt)===today,executedToday=logs.todayMinutes>0||remoteToday,lastDate=latestEvidenceDate(id,study,logs),daysSince=lastDate?dayDiff(lastDate,today):null,focus=focusId()===id;
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
 const withStudy=signals.filter(s=>s.study&&["confirmed","partial"].includes(s.study.evidence)),confirmed=withStudy.filter(s=>s.study.evidence==="confirmed").length,partial=withStudy.length-confirmed,recentLogs=state.logs.filter(e=>e.date>=shift(isoToday(),-13)),fresh=signals.filter(s=>{const d=s.contractState?.contract?.source?.updatedAt||s.study?.updatedAt;const date=studyDate(d),age=date&&date<=isoToday()?dayDiff(date,isoToday()):null;return age!=null&&age<=2}).length;
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
function portfolioStatus(signal){
 if(signal.executedToday)return signal.logs.todayMinutes?"Registrado na Central hoje":"Execução confirmada pelo projeto";
 if(!signal.scheduled)return"Sem sessão prevista hoje";
 if(signal.contractState?.status==="unavailable")return"Na grade · fonte indisponível";
 return"Na grade · sem confirmação publicada";
}
function renderPriorityBoard(signals){
 const box=$("mentor-priority-board");box.replaceChildren();
 const chosen=focusId(),defaultId=state.registry?.central?.defaultProject;
 signals.forEach(s=>{
  const card=node("a","mentor-priority-card"),priority=PRIORITY[s.id]||"—";
  card.dataset.priority=priority.replace("P","");card.href=studyUrl(s.id);
  const head=node("span","mentor-priority-head"),mark=node("span","mentor-priority-mark",priority),[source,sourceState]=sourceLabel(s),sourceBadge=node("span","mentor-priority-source",source);
  sourceBadge.dataset.state=sourceState;head.append(mark,sourceBadge);
  const title=node("span","mentor-priority-title-row");title.append(node("strong","mentor-priority-name",s.name));
  if(chosen===s.id)title.append(node("span","mentor-focus-label","Seu foco"));
  else if(!chosen&&defaultId===s.id)title.append(node("span","mentor-focus-label","Foco padrão"));
  const status=node("span","mentor-priority-status",portfolioStatus(s));status.dataset.state=s.executedToday?"done":s.scheduled?"scheduled":"off";
  const next=s.study?.nextUnit?"Próxima etapa · "+s.study.nextUnit:s.study?.lastCompletedUnit?"Última etapa publicada · "+s.study.lastCompletedUnit:"Etapa não publicada";
  const nextLine=node("span","mentor-priority-next",next);
  const metrics=node("span","mentor-priority-metrics"),questions=s.study?.questionsDone,accuracy=s.study?.accuracy;
  const questionMetric=node("span","mentor-priority-metric"),timeMetric=node("span","mentor-priority-metric");
  questionMetric.append(node("small","","QUESTÕES"),node("strong","",Number.isInteger(questions)?String(questions):"—"));
  timeMetric.append(node("small","","TEMPO · CENTRAL · 7D"),node("strong","",duration(s.logs.weekMinutes)));
  metrics.append(questionMetric,timeMetric);
  const accuracyWrap=node("span","mentor-priority-accuracy");
  if(Number.isFinite(accuracy)&&Number.isInteger(questions)){
   const accuracyLabel=node("span","mentor-priority-accuracy-label");accuracyLabel.append(node("small","","PRECISÃO PUBLICADA"),node("strong","",pct(accuracy)+" · "+questions+" questões"));
   const progress=node("progress","mentor-accuracy-meter");progress.max=100;progress.value=Math.round(accuracy*100);progress.setAttribute("aria-label","Precisão publicada: "+pct(accuracy)+" em "+questions+" questões");
   accuracyWrap.append(accuracyLabel,progress);
  }else accuracyWrap.append(node("small","mentor-priority-unknown","Sem amostra de questões publicada"));
  card.setAttribute("aria-label",priority+" · "+s.name+" · "+portfolioStatus(s)+" · "+next);
  card.append(head,title,status,nextLine,metrics,accuracyWrap,node("span","mentor-priority-open","Abrir projeto ↗"));
  box.append(card);
 });
}
function sourceLabel(signal){
 const s=signal.contractState?.status||"unavailable";
 if(s==="live")return["Contrato atualizado","live"];
 if(s==="partial")return["Contrato parcial","partial"];
 return["Indisponível","unavailable"];
}
function renderDataHealth(signals){
 const box=$("mentor-data-health-list");box.replaceChildren();
 signals.forEach(s=>{
  const [label,status]=sourceLabel(s),card=node("div","mentor-source-card"),updated=s.contractState?.contract?.source?.updatedAt||s.study?.updatedAt||null;
  card.append(node("strong","",s.name),node("span","",updated?"Atualizado: "+fmtDate(updated):"Sem data confiável"),node("small","",s.study?.sourceRef||s.contractState?.contract?.source?.ref||"Sem sinal pedagógico"));
  const st=node("span","mentor-source-status",label);st.dataset.state=status;card.append(st);
  box.append(card);
});
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
function reviewSummary(signals){
 const reported=signals.filter(s=>Number.isInteger(s.study?.reviewsDue)&&s.study.reviewsDue>=0);
 const total=reported.reduce((n,s)=>n+s.study.reviewsDue,0),sources=reported.length;
 const coverage=!sources?"sem dados publicados":sources===signals.length?"publicadas · "+sources+"/"+signals.length+" fontes":"parcial · "+sources+"/"+signals.length+" fontes";
 return{count:sources?String(total):"—",coverage};
}
function renderAll(){
 const signals=allSignals(),rec=recommendation(signals),conf=confidence(signals),studyCount=signals.filter(s=>s.study&&["confirmed","partial"].includes(s.study.evidence)).length,reviews=reviewSummary(signals);
 $("mentor-now-title").textContent=rec.title;$("mentor-recommendation-copy").textContent=rec.message;$("mentor-confidence").textContent=conf.label;$("mentor-confidence-note").textContent=conf.note;$("mentor-today-time").textContent=duration(totalToday());$("mentor-week-time").textContent=duration(totalWeek());$("mentor-signal-count").textContent=studyCount+"/"+signals.length;$("mentor-review-count").textContent=reviews.count;$("mentor-review-coverage").textContent=reviews.coverage;$("mentor-score-label").textContent=rec.top?"prioridade explicada":"sem ação extra";$("mentor-last-refresh").textContent=state.lastRefresh?"Atualizado "+new Intl.DateTimeFormat("pt-BR",{timeZone:"America/Sao_Paulo",hour:"2-digit",minute:"2-digit"}).format(state.lastRefresh):"não atualizado";
 const actions=$("mentor-primary-actions");actions.replaceChildren();if(rec.top){const a=node("a","mentor-button mentor-button-primary","Abrir "+rec.top.name);a.href=studyUrl(rec.top.id);actions.append(a)}const refresh=node("button","mentor-button mentor-button-secondary","Recalcular");refresh.type="button";refresh.addEventListener("click",loadAll);actions.append(refresh);
 renderReasons(rec);renderSchedule(signals);renderPriorityBoard(signals);renderDataHealth(signals);renderProjectCards(signals);renderReviews(signals);renderSources(signals);
}
async function loadAll(){
 if(state.loading)return;state.loading=true;document.body.classList.add("mentor-loading");$("mentor-refresh").disabled=true;
 try{
  if(!state.registry||!state.schedule)await loadRegistry();
  state.logs=readLogs();
  const active=state.registry.projects.filter(p=>p.status==="active"&&ORDER.includes(p.id));
  const results=await Promise.all(active.map(async p=>[p.id,await loadContract(p)]));
  state.contracts=new Map(results);
  state.lastRefresh=new Date();renderAll();
 }catch(err){
  $("mentor-now-title").textContent="Não foi possível montar o Mentor";$("mentor-recommendation-copy").textContent=err?.message||"Falha ao carregar as fontes.";const reasons=$("mentor-reasons");reasons.replaceChildren(node("p","mentor-alert","A Central continua disponível. Volte e tente atualizar os dados novamente."));const board=$("mentor-priority-board");board.replaceChildren(node("p","mentor-alert","Não foi possível atualizar a leitura dos projetos. Tente novamente."));
 }finally{state.loading=false;document.body.classList.remove("mentor-loading");$("mentor-refresh").disabled=false}
}
function switchView(view){
 if(!VIEWS.includes(view))return;
 document.querySelectorAll("[data-mentor-panel]").forEach(p=>{const active=p.dataset.mentorPanel===view;p.hidden=!active;p.classList.toggle("is-active",active)});
 document.querySelectorAll("[data-mentor-view]").forEach(b=>{const active=b.dataset.mentorView===view;b.classList.toggle("is-active",active);b.setAttribute("aria-selected",String(active));b.tabIndex=active?0:-1});
}
function initTabs(){
 let current=location.hash.replace("#","");if(!VIEWS.includes(current))current="agora";switchView(current);
 const tabs=[...document.querySelectorAll("[data-mentor-view]")];
 tabs.forEach((b,index)=>{
  b.addEventListener("click",()=>{const v=b.dataset.mentorView;switchView(v);history.replaceState(null,"","#"+v)});
  b.addEventListener("keydown",event=>{
   let next=null;
   if(event.key==="ArrowRight")next=(index+1)%tabs.length;
   else if(event.key==="ArrowLeft")next=(index-1+tabs.length)%tabs.length;
   else if(event.key==="Home")next=0;
   else if(event.key==="End")next=tabs.length-1;
   if(next===null)return;
   event.preventDefault();tabs[next].focus();tabs[next].click();
  });
 });
 document.querySelectorAll("[data-mentor-open]").forEach(b=>b.addEventListener("click",()=>{const v=b.dataset.mentorOpen;switchView(v);history.replaceState(null,"","#"+v);document.querySelector(`[data-mentor-view="${v}"]`)?.focus()}));
 window.addEventListener("hashchange",()=>{const view=location.hash.replace("#","");if(VIEWS.includes(view))switchView(view)});
}
let clockDay=isoToday();
function renderClock(){
 const day=isoToday();if(day!==clockDay){clockDay=day;loadAll()}
 const now=new Date(),time=new Intl.DateTimeFormat("pt-BR",{timeZone:"America/Sao_Paulo",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(now);$("mentor-clock").textContent="Brasília · "+time;
}
document.addEventListener("DOMContentLoaded",()=>{initTabs();renderClock();setInterval(renderClock,1000);$("mentor-refresh").addEventListener("click",loadAll);window.addEventListener("storage",e=>{if([LOG_KEY,FOCUS_KEY].includes(e.key))loadAll()});loadAll()});
})();
