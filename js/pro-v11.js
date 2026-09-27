(() => {
"use strict";
const LAST="central-estudos:last-project",TAB="central-estudos:workspace-tab-v15",LENS="central-estudos:route-lens-v14",IT="central-estudos:inbox-type-v19",IP="central-estudos:inbox-project-v19",VIEWS="central-estudos:views-v19",MAX_VIEWS=8;
const PREF=["central-estudos:focus-project","central-estudos:favorites-v4","central-estudos:catalog-order-v4","central-estudos:catalog-sort-v4","central-estudos:density-v5","central-estudos:technical-cards-v5",LENS,TAB,IT,IP,VIEWS];
const $=id=>document.getElementById(id),nav=[...document.querySelectorAll(".pro-nav-link")],grid=$("projects-grid");
const F=$("pro-now-focus-name"),FM=$("pro-now-focus-meta"),FL=$("pro-now-focus-link"),R=$("pro-now-resume-name"),RM=$("pro-now-resume-meta"),RL=$("resume-button"),PC=$("pro-now-project-count"),PM=$("pro-now-project-meta");
const WL=$("workspace-list"),WS=$("workspace-portability-status"),WI=$("workspace-import");
if(!F||!FM||!FL||!R||!RM||!RL||!PC||!PM)return;
let projects=[],tab=read(TAB)||"active";
const lifecycle=new Set(["active","archived","future"]);
if(!lifecycle.has(tab))tab="active";
function read(k){try{return localStorage.getItem(k)}catch{return null}}
function write(k,v){try{localStorage.setItem(k,v);return true}catch{return false}}
function last(){try{const v=JSON.parse(read(LAST));return v&&typeof v.id==="string"?v:null}catch{return null}}
function cards(){return[...document.querySelectorAll(".project-card")].map(c=>({id:c.dataset.projectId||"",name:c.querySelector("h3")?.textContent?.trim()||"Ambiente",phase:c.querySelector(".project-phase")?.textContent?.trim()||"",href:c.querySelector(".project-link")?.href||""})).filter(x=>x.id&&x.href)}
function when(v){const d=new Date(v);return v&&!Number.isNaN(d.getTime())?new Intl.DateTimeFormat("pt-BR",{dateStyle:"short",timeStyle:"short"}).format(d):"Último acesso salvo neste navegador."}
function refresh(){
F.textContent=$("pro-now-focus-name")?.textContent?.trim()||"Foco atual";FM.textContent=$("pro-now-focus-meta")?.textContent?.trim()||"Prioridade atual";FL.href=$("pro-now-focus-link")?.href||"#projetos";
const ps=cards();PC.textContent=`${ps.length} ${ps.length===1?"ativo":"ativos"}`;PM.textContent=ps.map(x=>x.name).join(" · ")||"Nenhum ambiente disponível";
const v=last(),p=v&&ps.find(x=>x.id===v.id);if(p){R.textContent=p.name;RM.textContent=`Último acesso ${when(v.visitedAt)}`;RL.href=p.href;RL.classList.remove("is-hidden")}else{R.textContent="Nenhum projeto aberto";RM.textContent="O último ambiente aberto pela Central aparecerá aqui.";RL.removeAttribute("href");RL.classList.add("is-hidden")}
}
function activeNav(){const ss=nav.map(a=>document.querySelector(a.getAttribute("href"))).filter(Boolean);if(!("IntersectionObserver"in window)||!ss.length)return;const o=new IntersectionObserver(es=>{const v=es.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!v)return;nav.forEach(a=>{const on=a.getAttribute("href")===`#${v.target.id}`;a.classList.toggle("is-active",on);on?a.setAttribute("aria-current","location"):a.removeAttribute("aria-current")})},{rootMargin:"-18% 0px -62% 0px",threshold:[0,.2,.5,.8]});ss.forEach(s=>o.observe(s))}
function n(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
function renderWorkspace(){
if(!WL)return;["active","archived","future"].forEach(k=>{const c=$(`workspace-count-${k}`);if(c)c.textContent=String(projects.filter(p=>p.status===k).length);document.querySelector(`[data-workspace-tab="${k}"]`)?.classList.toggle("is-active",tab===k);document.querySelector(`[data-workspace-tab="${k}"]`)?.setAttribute("aria-pressed",String(tab===k))});
const items=projects.filter(p=>p.status===tab);WL.replaceChildren();if(!items.length){WL.append(n("p","workspace-empty",tab==="future"?"Nenhum projeto futuro cadastrado.":"Nenhum projeto nesta categoria."));return}
items.forEach(p=>{const c=n("article","workspace-card"),h=n("div","workspace-card-head"),title=n("strong","",p.name),badge=n("span","workspace-badge",p.status==="active"?"Ativo":p.status==="archived"?"Arquivado":"Futuro");h.append(title,badge);c.append(h,n("p","workspace-phase",p.phase),n("p","workspace-description",p.archiveNote||p.description));if(p.url){const a=n("a","workspace-link",p.status==="archived"?"Abrir histórico →":"Abrir projeto →");a.href=p.url;if(p.status==="active")a.addEventListener("click",()=>{const at=new Date().toISOString();write(LAST,JSON.stringify({id:p.id,visitedAt:at}));document.dispatchEvent(new CustomEvent("central:project-opened",{detail:{id:p.id,name:p.name,visitedAt:at}}))});c.append(a)}WL.append(c)})
}
function activeIds(){return new Set(projects.filter(p=>p.status==="active").map(p=>p.id))}
const LENSES=["focus","resume","published","alerts"],TYPES=["all","action","alert"],viewOk=(x,ids)=>x&&typeof x.name==="string"&&x.name.trim()&&x.name.length<=40&&lifecycle.has(x.tab)&&LENSES.includes(x.lens)&&TYPES.includes(x.type)&&(x.project==="all"||ids.has(x.project));function validPref(k,v){const ids=activeIds();if(k==="central-estudos:focus-project")return ids.has(v);if(k==="central-estudos:catalog-sort-v4")return["default","favorites","name"].includes(v);if(k==="central-estudos:density-v5")return["comfortable","compact"].includes(v);if(k==="central-estudos:technical-cards-v5")return["show","hide"].includes(v);if(k===LENS)return LENSES.includes(v);if(k===TAB)return lifecycle.has(v);if(k===IT)return TYPES.includes(v);if(k===IP)return v==="all"||ids.has(v);if(k===VIEWS){try{const a=JSON.parse(v);return Array.isArray(a)&&a.length<=MAX_VIEWS&&a.every(x=>viewOk(x,ids))}catch{return false}}if(k==="central-estudos:favorites-v4"||k==="central-estudos:catalog-order-v4"){try{const a=JSON.parse(v);return Array.isArray(a)&&a.every(x=>typeof x==="string"&&ids.has(x))}catch{return false}}return false}
function exportPrefs(){const preferences={};PREF.forEach(k=>{const v=read(k);if(v!==null&&validPref(k,v))preferences[k]=v});const blob=new Blob([JSON.stringify({schemaVersion:1,type:"central-estudos-preferences",exportedAt:new Date().toISOString(),preferences},null,2)],{type:"application/json"}),a=document.createElement("a"),u=URL.createObjectURL(blob);a.href=u;a.download=`central-estudos-preferencias-${new Date().toISOString().slice(0,7)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(u),0);if(WS)WS.textContent="Preferências exportadas. Histórico e caches não foram incluídos."}
async function importPrefs(file){try{if(!file||file.size>65536)throw new Error("Arquivo inválido ou maior que 64 KB.");const data=JSON.parse(await file.text());if(data?.schemaVersion!==1||data?.type!=="central-estudos-preferences"||!data.preferences||typeof data.preferences!=="object")throw new Error("Backup incompatível.");let count=0;for(const k of PREF){const v=data.preferences[k];if(typeof v==="string"&&validPref(k,v)&&write(k,v))count++}if(!count)throw new Error("Nenhuma preferência válida encontrada.");if(WS)WS.textContent=`${count} preferências importadas. Recarregando…`;setTimeout(()=>location.reload(),350)}catch(e){if(WS)WS.textContent=e.message||"Não foi possível importar as preferências."}}
document.querySelectorAll("[data-workspace-tab]").forEach(b=>b.addEventListener("click",()=>{tab=b.dataset.workspaceTab;write(TAB,tab);renderWorkspace()}));
$("workspace-export")?.addEventListener("click",exportPrefs);$("workspace-import-button")?.addEventListener("click",()=>WI?.click());WI?.addEventListener("change",()=>{importPrefs(WI.files?.[0]);WI.value=""});
document.addEventListener("central:workspace-ready",e=>{projects=Array.isArray(e.detail?.projects)?e.detail.projects:[];renderWorkspace()});
let cmdIndex=0,cmdVisible=[],cmdInput,cmdList,cmdDialog;
const norm=v=>String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
function editable(t){return t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||t instanceof HTMLSelectElement||t?.isContentEditable}
function openProject(p){if(!p?.url)return;if(p.status==="active"){const at=new Date().toISOString();write(LAST,JSON.stringify({id:p.id,visitedAt:at}));document.dispatchEvent(new CustomEvent("central:project-opened",{detail:{id:p.id,name:p.name,visitedAt:at}}))}location.href=p.url}
function views(){try{const a=JSON.parse(read(VIEWS)||"[]"),ids=activeIds();return Array.isArray(a)&&a.length<=MAX_VIEWS&&a.every(x=>viewOk(x,ids))?a:[]}catch{return[]}}function saveView(){const name=(window.prompt("Nome da view local:")||"").trim(),ids=activeIds(),a=views(),x={name,tab,lens:read(LENS)||"focus",type:read(IT)||"all",project:read(IP)||"all"};if(!viewOk(x,ids))return;const i=a.findIndex(v=>v.name===name);if(i>=0)a[i]=x;else if(a.length<MAX_VIEWS)a.push(x);else return;write(VIEWS,JSON.stringify(a));if(WS)WS.textContent=`View “${name}” salva neste navegador.`}function applyView(){const a=views(),name=(window.prompt(`Aplicar view: ${a.map(v=>v.name).join(", ")}`)||"").trim(),x=a.find(v=>v.name===name);if(!x)return;[[TAB,x.tab],[LENS,x.lens],[IT,x.type],[IP,x.project]].forEach(([k,v])=>write(k,v));location.reload()}function defaultsView(){[[TAB,"active"],[LENS,"focus"],[IT,"all"],[IP,"all"]].forEach(([k,v])=>write(k,v));location.reload()}
function commands(){
const a=[
["Ir para Hoje","Navegação","hoje agora início home",()=>location.hash="agora"],
["Ir para Projetos","Navegação","projetos ambientes catálogo",()=>location.hash="projetos"],
["Ir para Workspace","Navegação","workspace concursos",()=>location.hash="workspace"],
["Ir para Atividade","Navegação","atividade histórico",()=>location.hash="activity-panel"],
["Ir para Diagnóstico","Navegação","diagnóstico técnico",()=>location.hash="diagnostico"],
["Ir para Mentor","Navegação","mentor foco retomada ações alertas",()=>location.hash="routing-panel"],
["Salvar view local","Views","salvar filtros abas lentes",saveView],["Aplicar view local","Views","aplicar filtros abas lentes",applyView],["Restaurar view padrão","Views","restaurar defaults filtros abas lentes",defaultsView]
].map(([label,meta,keys,run])=>({label,meta,keys,run}));
const focus=$("pro-now-focus-link"),focusName=$("pro-now-focus-name")?.textContent?.trim();if(focus?.href&&focusName)a.unshift({label:`Continuar foco — ${focusName}`,meta:"Foco atual",keys:"foco continuar",run:()=>focus.click()});
const resume=$("resume-button");if(resume?.href&&!resume.classList.contains("is-hidden"))a.unshift({label:`Abrir último ambiente — ${$("pro-now-resume-name")?.textContent?.trim()||"último acesso"}`,meta:"Último acesso",keys:"abrir último ambiente último acesso",run:()=>resume.click()});
projects.forEach(p=>a.push({label:p.name,meta:p.status==="active"?"Projeto ativo":p.status==="archived"?"Histórico arquivado":"Projeto futuro",keys:`${p.description||""} ${p.phase||""} ${p.status}`,run:()=>p.url?openProject(p):(tab="future",write(TAB,tab),renderWorkspace(),location.hash="workspace")}));
return a}
function renderCommands(){
const q=norm(cmdInput?.value),all=commands();cmdVisible=all.filter(x=>!q||norm(`${x.label} ${x.meta} ${x.keys}`).includes(q)).slice(0,10);cmdIndex=Math.min(cmdIndex,Math.max(0,cmdVisible.length-1));cmdList.replaceChildren();
if(!cmdVisible.length){cmdList.append(n("p","command-empty","Nenhum resultado."));return}
cmdVisible.forEach((x,i)=>{const b=n("button","command-result");b.type="button";b.dataset.index=i;b.setAttribute("role","option");b.setAttribute("aria-selected",String(i===cmdIndex));b.append(n("strong","",x.label),n("span","",x.meta));b.addEventListener("click",()=>{closeCommand();x.run()});cmdList.append(b)})}
function moveCommand(d){if(!cmdVisible.length)return;cmdIndex=(cmdIndex+d+cmdVisible.length)%cmdVisible.length;[...cmdList.querySelectorAll(".command-result")].forEach((b,i)=>b.setAttribute("aria-selected",String(i===cmdIndex)));cmdList.querySelector(`[data-index="${cmdIndex}"]`)?.scrollIntoView({block:"nearest"})}
function openCommand(){if(!cmdDialog)return;if(cmdDialog.open){cmdInput.focus();return}cmdIndex=0;cmdInput.value="";renderCommands();typeof cmdDialog.showModal==="function"?cmdDialog.showModal():cmdDialog.setAttribute("open","");setTimeout(()=>cmdInput.focus(),0)}
function closeCommand(){if(!cmdDialog)return;typeof cmdDialog.close==="function"&&cmdDialog.open?cmdDialog.close():cmdDialog.removeAttribute("open")}
function initCommand(){
const open=n("button","command-open","⌕");open.type="button";open.setAttribute("aria-label","Abrir acesso rápido — Ctrl ou Command + K");open.title="Acesso rápido · Ctrl/⌘ + K";
cmdDialog=document.createElement("dialog");cmdDialog.id="command-palette";cmdDialog.className="command-dialog";cmdDialog.setAttribute("aria-labelledby","command-title");
const box=n("div","command-box"),head=n("div","command-head"),title=n("strong","");title.id="command-title";title.textContent="Acesso rápido";const close=n("button","command-close","×");close.type="button";close.setAttribute("aria-label","Fechar");
cmdInput=document.createElement("input");cmdInput.className="command-search";cmdInput.type="search";cmdInput.placeholder="Buscar projeto, área ou seção…";cmdInput.autocomplete="off";cmdInput.setAttribute("aria-label","Buscar na Central");
cmdList=n("div","command-results");cmdList.setAttribute("role","listbox");box.append(head,cmdInput,cmdList,n("p","command-help","↑ ↓ navegar · Enter abrir · Esc fechar"));head.append(title,close);cmdDialog.append(box);document.body.append(open,cmdDialog);
open.addEventListener("click",openCommand);close.addEventListener("click",closeCommand);cmdDialog.addEventListener("click",e=>{if(e.target===cmdDialog)closeCommand()});cmdInput.addEventListener("input",()=>{cmdIndex=0;renderCommands()});cmdInput.addEventListener("keydown",e=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();moveCommand(e.key==="ArrowDown"?1:-1)}else if(e.key==="Enter"){e.preventDefault();cmdVisible[cmdIndex]?.run();closeCommand()}});
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"&&!editable(e.target)){e.preventDefault();openCommand()}else if(e.key==="Escape"&&cmdDialog?.open)closeCommand()})
}
["central:app-ready","central:focus-changed","central:project-opened","central:history-cleared","central:catalog-refresh"].forEach(e=>document.addEventListener(e,refresh));
if(grid&&"MutationObserver"in window)new MutationObserver(()=>queueMicrotask(refresh)).observe(grid,{childList:true,subtree:false});
document.addEventListener("DOMContentLoaded",()=>{refresh();activeNav();renderWorkspace();initCommand()});
})();
