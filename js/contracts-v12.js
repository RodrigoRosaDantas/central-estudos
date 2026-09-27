(() => {
"use strict";
const CACHE_KEY="central-estudos:contracts-v12";
const CACHE_TTL_MS = 5 * 60 * 1000;
const TIMEOUT_MS = 3500;
const ALLOWED_ACTION_KINDS=new Set(["operational","planned","manual","none"]),projects=new Map(),refreshing=new Set();
function readCache(){try{const raw=localStorage.getItem(CACHE_KEY);if(!raw)return{};const parsed=JSON.parse(raw);return parsed&&typeof parsed==="object"?parsed:{}}catch{try{localStorage.removeItem(CACHE_KEY)}catch{}return{}}}
function writeCache(cache){try{localStorage.setItem(CACHE_KEY,JSON.stringify(cache))}catch{}}
const nullableString=value=>value===null||typeof value==="string";
function validateContract(contract,expectedProjectId){
if(!contract||typeof contract!=="object")throw new Error("contract-not-object");
if(contract.schemaVersion!==1)throw new Error("unsupported-schema");
if(contract.projectId!==expectedProjectId)throw new Error("project-id-mismatch");
if(typeof contract.publishedAt!=="string"||Number.isNaN(new Date(contract.publishedAt).getTime()))throw new Error("invalid-published-at");
if(!contract.source||typeof contract.source!=="object")throw new Error("missing-source");
if(contract.source.kind!=="public-project-state")throw new Error("invalid-source-kind");
if(typeof contract.source.ref!=="string"||!contract.source.ref.trim())throw new Error("invalid-source-ref");
if(typeof contract.source.status!=="string"||!contract.source.status.trim())throw new Error("invalid-source-status");
if(!nullableString(contract.source.updatedAt))throw new Error("invalid-source-updated-at");
const state=contract.state;if(!state||typeof state!=="object")throw new Error("missing-state");
for(const field of["phase","cycle","currentUnit","nextAction"])if(!nullableString(state[field]))throw new Error(`invalid-state-${field}`);
if(!ALLOWED_ACTION_KINDS.has(state.nextActionKind))throw new Error("invalid-next-action-kind");
if(!Array.isArray(state.alerts)||state.alerts.length>10||state.alerts.some(alert=>typeof alert!=="string"))throw new Error("invalid-alerts");
return contract;
}
function emit(project,status,contract=null,checkedAt=null,reason=null){if(typeof CustomEvent!=="function")return;document.dispatchEvent(new CustomEvent("central:contract-state",{detail:{id:project.id,name:project.name,status,contract,checkedAt,reason,statusUrl:project.statusUrl}}))}
async function loadContract(project,force=false){
if(!project.statusUrl){emit(project,"unsupported",null,null,"status-url-missing");return}
const cache=readCache(),cached=cache[project.id],now=Date.now();
if(!force&&cached?.contract&&Number.isFinite(cached.checkedAt)){try{const valid=validateContract(cached.contract,project.id);if(now-cached.checkedAt<CACHE_TTL_MS){emit(project,"cached",valid,cached.checkedAt);return}}catch{delete cache[project.id];writeCache(cache)}}
if(typeof navigator!=="undefined"&&navigator.onLine===false){if(cached?.contract){try{emit(project,"stale-cache",validateContract(cached.contract,project.id),cached.checkedAt||null,"offline");return}catch{}}emit(project,"unavailable",null,null,"offline");return}
const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),TIMEOUT_MS);
try{
const response=await fetch(project.statusUrl,{method: "GET",cache:"no-store",signal:controller.signal,headers:{Accept:"application/json"}});
if(!response.ok)throw new Error(`http-${response.status}`);
const contract=validateContract(await response.json(),project.id),checkedAt=Date.now();cache[project.id]={contract,checkedAt};writeCache(cache);emit(project,"live",contract,checkedAt);
}catch(error){
if(cached?.contract){try{emit(project,"stale-cache",validateContract(cached.contract,project.id),cached.checkedAt||null,error?.message||"fetch-failed");return}catch{}}
const reason=error?.message||(error?.name==="AbortError"?"timeout":"fetch-failed");emit(project,reason.startsWith("invalid")||reason.includes("schema")||reason.includes("mismatch")?"invalid":"unavailable",null,null,reason);
}finally{clearTimeout(timeout)}
}
document.addEventListener("central:app-ready",event=>{const list=Array.isArray(event.detail?.projects)?event.detail.projects:[];projects.clear();list.forEach(project=>{projects.set(project.id,project);loadContract(project)})});
document.addEventListener("central:contract-refresh",event=>{const id=event.detail?.id,project=projects.get(id);if(!project||refreshing.has(id))return;refreshing.add(id);loadContract(project, true).finally(()=>refreshing.delete(id))});
})();