(() => {
"use strict";
const LAST="central-estudos:last-project",TAB="central-estudos:workspace-tab-v15";
const PREF=["central-estudos:focus-project","central-estudos:favorites-v4","central-estudos:catalog-order-v4","central-estudos:catalog-sort-v4","central-estudos:density-v5","central-estudos:technical-cards-v5","central-estudos:route-lens-v14",TAB];
const $=id=>document.getElementById(id),nav=[...document.querySelectorAll(".pro-nav-link")],grid=$("projects-grid");
const F=$("pro-now-focus-name"),FM=$("pro-now-focus-meta"),FL=$("pro-now-focus-link"),R=$("pro-now-resume-name"),RM=$("pro-now-resume-meta"),RL=$("pro-now-resume-link"),PC=$("pro-now-project-count"),PM=$("pro-now-project-meta");
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
F.textContent=$("focus-title")?.textContent?.trim()||"Foco atual";FM.textContent=$("focus-phase")?.textContent?.trim()||"Prioridade atual";FL.href=$("continue-button")?.href||"#projetos";
const ps=cards();PC.textContent=`${ps.length} ${ps.length===1?"ativo":"ativos"}`;PM.textContent=ps.map(x=>x.name).join(" · ")||"Nenhum ambiente disponível";
const v=last(),p=v&&ps.find(x=>x.id===v.id);if(p){R.textContent=p.name;RM.textContent=`${p.phase||"Ambiente"} · ${when(v.visitedAt)}`;RL.href=p.href;RL.classList.remove("is-hidden")}else{R.textContent="Nenhum acesso ainda";RM.textContent="Abra um ambiente pela Central para criar um ponto de retomada.";RL.removeAttribute("href");RL.classList.add("is-hidden")}
}
function activeNav(){const ss=nav.map(a=>document.querySelector(a.getAttribute("href"))).filter(Boolean);if(!("IntersectionObserver"in window)||!ss.length)return;const o=new IntersectionObserver(es=>{const v=es.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!v)return;nav.forEach(a=>{const on=a.getAttribute("href")===`#${v.target.id}`;a.classList.toggle("is-active",on);on?a.setAttribute("aria-current","location"):a.removeAttribute("aria-current")})},{rootMargin:"-18% 0px -62% 0px",threshold:[0,.2,.5,.8]});ss.forEach(s=>o.observe(s))}
function n(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e}
function renderWorkspace(){
if(!WL)return;["active","archived","future"].forEach(k=>{const c=$(`workspace-count-${k}`);if(c)c.textContent=String(projects.filter(p=>p.status===k).length);document.querySelector(`[data-workspace-tab="${k}"]`)?.classList.toggle("is-active",tab===k);document.querySelector(`[data-workspace-tab="${k}"]`)?.setAttribute("aria-pressed",String(tab===k))});
const items=projects.filter(p=>p.status===tab);WL.replaceChildren();if(!items.length){WL.append(n("p","workspace-empty",tab==="future"?"Nenhum projeto futuro cadastrado.":"Nenhum projeto nesta categoria."));return}
items.forEach(p=>{const c=n("article","workspace-card"),h=n("div","workspace-card-head"),title=n("strong","",p.name),badge=n("span","workspace-badge",p.status==="active"?"Ativo":p.status==="archived"?"Arquivado":"Futuro");h.append(title,badge);c.append(h,n("p","workspace-phase",p.phase),n("p","workspace-description",p.archiveNote||p.description));if(p.url){const a=n("a","workspace-link",p.status==="archived"?"Abrir histórico →":"Abrir projeto →");a.href=p.url;if(p.status==="active")a.addEventListener("click",()=>{const at=new Date().toISOString();write(LAST,JSON.stringify({id:p.id,visitedAt:at}));document.dispatchEvent(new CustomEvent("central:project-opened",{detail:{id:p.id,name:p.name,visitedAt:at}}))});c.append(a)}WL.append(c)})
}
function activeIds(){return new Set(projects.filter(p=>p.status==="active").map(p=>p.id))}
function validPref(k,v){const ids=activeIds();if(k==="central-estudos:focus-project")return ids.has(v);if(k==="central-estudos:catalog-sort-v4")return["default","favorites","name"].includes(v);if(k==="central-estudos:density-v5")return["comfortable","compact"].includes(v);if(k==="central-estudos:technical-cards-v5")return["show","hide"].includes(v);if(k==="central-estudos:route-lens-v14")return["focus","resume","published","alerts"].includes(v);if(k===TAB)return lifecycle.has(v);if(k==="central-estudos:favorites-v4"||k==="central-estudos:catalog-order-v4"){try{const a=JSON.parse(v);return Array.isArray(a)&&a.every(x=>typeof x==="string"&&ids.has(x))}catch{return false}}return false}
function exportPrefs(){const preferences={};PREF.forEach(k=>{const v=read(k);if(v!==null&&validPref(k,v))preferences[k]=v});const blob=new Blob([JSON.stringify({schemaVersion:1,type:"central-estudos-preferences",exportedAt:new Date().toISOString(),preferences},null,2)],{type:"application/json"}),a=document.createElement("a"),u=URL.createObjectURL(blob);a.href=u;a.download=`central-estudos-preferencias-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(u),0);if(WS)WS.textContent="Preferências exportadas. Histórico e caches não foram incluídos."}
async function importPrefs(file){try{if(!file||file.size>65536)throw new Error("Arquivo inválido ou maior que 64 KB.");const data=JSON.parse(await file.text());if(data?.schemaVersion!==1||data?.type!=="central-estudos-preferences"||!data.preferences||typeof data.preferences!=="object")throw new Error("Backup incompatível.");let count=0;for(const k of PREF){const v=data.preferences[k];if(typeof v==="string"&&validPref(k,v)&&write(k,v))count++}if(!count)throw new Error("Nenhuma preferência válida encontrada.");if(WS)WS.textContent=`${count} preferências importadas. Recarregando…`;setTimeout(()=>location.reload(),350)}catch(e){if(WS)WS.textContent=e.message||"Não foi possível importar as preferências."}}
document.querySelectorAll("[data-workspace-tab]").forEach(b=>b.addEventListener("click",()=>{tab=b.dataset.workspaceTab;write(TAB,tab);renderWorkspace()}));
$("workspace-export")?.addEventListener("click",exportPrefs);$("workspace-import-button")?.addEventListener("click",()=>WI?.click());WI?.addEventListener("change",()=>{importPrefs(WI.files?.[0]);WI.value=""});
document.addEventListener("central:workspace-ready",e=>{projects=Array.isArray(e.detail?.projects)?e.detail.projects:[];renderWorkspace()});
["central:app-ready","central:focus-changed","central:project-opened","central:history-cleared","central:catalog-refresh"].forEach(e=>document.addEventListener(e,refresh));
if(grid&&"MutationObserver"in window)new MutationObserver(()=>queueMicrotask(refresh)).observe(grid,{childList:true,subtree:false});
document.addEventListener("DOMContentLoaded",()=>{refresh();activeNav();renderWorkspace()});
})();
