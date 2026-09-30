(()=>{"use strict";
const api=window.CentralStudyLogV1;
if(!api)return;
const SUPABASE_URL="https://fqqkkyusnzhuuizahkww.supabase.co";
const SUPABASE_KEY="sb_publishable_GfoaAPKtYuSu_UY6wE8jMg_XsVjdWU7";
const SESSION_KEY="central-estudos:study-sync-v1";
const MAX=5000;
const $=id=>document.getElementById(id);
const projectSelect=$("study-log-project");
const planner=$("study-log-planner");
if(!projectSelect||!planner)return;
const knownIds=new Set([...projectSelect.options].map(option=>option.value).filter(Boolean));knownIds.add("tcego");
let state=readState(),busy=false,timer=null,authMessage="",authType="info";
function add(parent,tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;parent.append(node);return node}
function readState(){try{const v=JSON.parse(localStorage.getItem(SESSION_KEY)||"null");if(v&&v.version===1)return{version:1,session:v.session&&typeof v.session.access_token==="string"?v.session:null,accountId:typeof v.accountId==="string"?v.accountId:"",pendingDeletes:Array.isArray(v.pendingDeletes)?v.pendingDeletes.filter(x=>typeof x==="string").slice(-MAX):[],lastSyncedAt:typeof v.lastSyncedAt==="string"?v.lastSyncedAt:""} }catch{}return{version:1,session:null,accountId:"",pendingDeletes:[],lastSyncedAt:""}}
function saveState(){try{localStorage.setItem(SESSION_KEY,JSON.stringify(state))}catch{}}
function decodeJwt(token){try{const part=token.split(".")[1].replace(/-/g,"+").replace(/_/g,"/");return JSON.parse(atob(part+"=".repeat((4-part.length%4)%4)))}catch{return{}}}
function expiresAt(data){return Number(data.expires_at)?Number(data.expires_at)*1000:Date.now()+(Number(data.expires_in)||3600)*1000}
function authHeaders(token){return{apikey:SUPABASE_KEY,Authorization:"Bearer "+token}}
function renderStatus(message,type){
 const status=$("study-sync-status");
 if(!status)return;
 if(message!==undefined){authMessage=message;authType=type||"info"}
 if(authMessage){status.textContent=authMessage;status.dataset.type=authType;return}
 if(state.session)status.textContent=state.lastSyncedAt?"Conectado e sincronizado com a Central.":"Conectado; sincronização inicial pendente.";
 else status.textContent="Salvo neste aparelho. Conecte para acessar seus registros em outros dispositivos.";
 status.dataset.type="info";
}
function mount(){
 const panel=document.createElement("section");panel.className="study-log-backup";panel.setAttribute("aria-label","Sincronização segura dos registros");
 const status=add(panel,"p","study-log-privacy","");status.id="study-sync-status";status.setAttribute("role","status");status.setAttribute("aria-live","polite");
 const details=document.createElement("details");details.className="study-log-manual";
 add(details,"summary","button button-ghost","Sincronizar entre aparelhos");
 const form=document.createElement("form");form.id="study-sync-form";form.className="study-log-form";
 const label=add(form,"label","catalog-field study-log-field study-log-project-field","E-mail já cadastrado no Supabase");
 const input=document.createElement("input");input.id="study-sync-email";input.type="email";input.name="email";input.autocomplete="email";input.required=true;input.placeholder="voce@exemplo.com";label.append(input);
 const button=add(form,"button","study-log-save command-primary","Enviar link de acesso");button.type="submit";
 const foot=document.createElement("p");foot.className="study-log-privacy";foot.textContent="Este formulário não cria usuários. O link vai para uma conta já cadastrada no Supabase.";
 form.append(button);
 details.append(form,foot);
 const signout=add(details,"button","button button-ghost","Desconectar deste aparelho");signout.type="button";signout.id="study-sync-signout";signout.hidden=true;
 panel.append(details);
 planner.insertAdjacentElement("beforebegin",panel);
 form.addEventListener("submit",sendMagicLink);
 signout.addEventListener("click",signOut);
 renderStatus();
}
function handleAuthCallback(){
 const params=new URLSearchParams(location.hash.startsWith("#")?location.hash.slice(1):"");
 const token=params.get("access_token"),refresh=params.get("refresh_token");
 if(token&&refresh){
  const jwt=decodeJwt(token);
  state.session={access_token:token,refresh_token:refresh,expires_at:(Number(params.get("expires_at"))||Number(jwt.exp)||Math.floor(Date.now()/1000)+Number(params.get("expires_in")||3600))*1000,user_id:jwt.sub||""};
  saveState();
  history.replaceState(null,document.title,location.pathname+location.search);
  renderStatus("Link confirmado. Sincronizando seus blocos…");
  return true;
 }
 if(params.get("error")){
  history.replaceState(null,document.title,location.pathname+location.search);
  renderStatus("O link não confirmou o acesso. Solicite um novo link de sincronização.","error");
 }
 return false;
}
async function readResponse(response){let data={};try{data=await response.json()}catch{}return data}
async function getUser(token){
 const response=await fetch(SUPABASE_URL+"/auth/v1/user",{headers:authHeaders(token)});
 if(response.status===401)return null;
 if(!response.ok)throw new Error("get-user");
 return readResponse(response);
}
async function refreshSession(){
 if(!state.session?.refresh_token)return null;
 const response=await fetch(SUPABASE_URL+"/auth/v1/token?grant_type=refresh_token",{method:"POST",headers:{"apikey":SUPABASE_KEY,"Content-Type":"application/json"},body:JSON.stringify({refresh_token:state.session.refresh_token})});
 const data=await readResponse(response);
 if(!response.ok||!data.access_token)return null;
 state.session={access_token:data.access_token,refresh_token:data.refresh_token||state.session.refresh_token,expires_at:expiresAt(data),user_id:data.user?.id||state.session.user_id||""};
 saveState();
 return data.user||null;
}
async function ensureSession(){
 if(!state.session)return null;
 let user=null;
 if(Number(state.session.expires_at||0)<Date.now()+60000)user=await refreshSession();
 if(!user)user=await getUser(state.session.access_token);
 if(!user?.id){user=await refreshSession();if(!user?.id){state.session=null;saveState();$("study-sync-signout").hidden=true;renderStatus("Sua sessão expirou. Solicite um novo link para voltar a sincronizar.","error");return null}}
 if(state.accountId&&state.accountId!==user.id){renderStatus("Este aparelho foi vinculado a outra conta Supabase. Entre com a conta original para evitar misturar registros.","error");return null}
 state.accountId=state.accountId||user.id;
 state.session.user_id=user.id;
 saveState();
 $("study-sync-signout").hidden=false;
 return user;
}
async function sendMagicLink(event){
 event.preventDefault();
 const form=$("study-sync-form"),email=$("study-sync-email"),button=form.querySelector("button[type=submit]");
 if(!form.reportValidity())return;
 button.disabled=true;button.textContent="Enviando…";renderStatus("Solicitando o link de acesso…");
 try{
  const redirectTo=location.origin+location.pathname;
  const url=SUPABASE_URL+"/auth/v1/otp?redirect_to="+encodeURIComponent(redirectTo);
  const response=await fetch(url,{method:"POST",headers:{"apikey":SUPABASE_KEY,"Content-Type":"application/json"},body:JSON.stringify({email:email.value.trim(),create_user:false})});
  if(!response.ok)throw new Error("otp");
  renderStatus("Se este e-mail estiver cadastrado no Supabase, o link chegará na caixa de entrada.");
 }catch{renderStatus("Não foi possível solicitar o link agora. Confira a conexão e o e-mail da conta cadastrada no Supabase.","error")}
 finally{button.disabled=false;button.textContent="Enviar link de acesso"}
}
async function signOut(){
 const session=state.session;
 if(session?.access_token){try{await fetch(SUPABASE_URL+"/auth/v1/logout?scope=local",{method:"POST",headers:authHeaders(session.access_token)})}catch{}}
 state.session=null;saveState();$("study-sync-signout").hidden=true;renderStatus("Desconectado. Os registros continuam guardados neste aparelho.");
}
function syncUrl(){
 const url=new URL(SUPABASE_URL+"/rest/v1/central_study_logs");
 url.searchParams.set("select","client_id,study_date,project_id,trail,topic,duration_minutes,created_at");
 url.searchParams.set("user_id","eq."+state.accountId);
 url.searchParams.set("order","created_at.desc");
 url.searchParams.set("limit","1000");
 return url;
}
async function authedFetch(url,init,user){
 const headers=new Headers(init?.headers||{});
 headers.set("apikey",SUPABASE_KEY);
 headers.set("Authorization","Bearer "+state.session.access_token);
 return fetch(url,{...init,headers});
}
async function fetchRemote(user){
 const base=syncUrl(),rows=[];
 for(let offset=0;offset<MAX;offset+=1000){
  const url=new URL(base);url.searchParams.set("offset",String(offset));
  const response=await authedFetch(url.toString(),{headers:{Range:offset+"-"+(offset+999)}},user);
  if(!response.ok)throw new Error("select");
  const page=await readResponse(response);
  if(!Array.isArray(page))throw new Error("shape");
  rows.push(...page);
  if(page.length<1000)break;
 }
 return rows.reverse().map(row=>api.normalize({id:row.client_id,date:row.study_date,projectId:row.project_id,trail:row.trail,topic:row.topic,minutes:row.duration_minutes,confirmed:true},knownIds)).filter(Boolean);
}
async function deletePending(user){
 const pending=[...new Set(state.pendingDeletes)];
 for(const id of pending){
  const url=new URL(SUPABASE_URL+"/rest/v1/central_study_logs");
  url.searchParams.set("user_id","eq."+user.id);
  url.searchParams.set("client_id","eq."+id);
  const response=await authedFetch(url.toString(),{method:"DELETE",headers:{Prefer:"return=minimal"}},user);
  if(!response.ok)throw new Error("delete");
  state.pendingDeletes=state.pendingDeletes.filter(item=>item!==id);saveState();
 }
}
function validClientId(id){return typeof id==="string"&&/^[A-Za-z0-9_-]{1,120}$/.test(id)}
async function pushLocal(user,entries){
 const clean=entries.filter(entry=>validClientId(entry.id));
 if(clean.length!==entries.length)throw new Error("client-id");
 for(let offset=0;offset<clean.length;offset+=250){
  const payload=clean.slice(offset,offset+250).map(entry=>({user_id:user.id,client_id:entry.id,study_date:entry.date,project_id:entry.projectId,trail:entry.trail,topic:entry.topic,duration_minutes:entry.minutes}));
  const url=SUPABASE_URL+"/rest/v1/central_study_logs?on_conflict=user_id%2Cclient_id";
  const response=await authedFetch(url,{method:"POST",headers:{"Content-Type":"application/json",Prefer:"resolution=ignore-duplicates,return=minimal"},body:JSON.stringify(payload)},user);
  if(!response.ok)throw new Error("upsert");
 }
}
async function syncNow(){
 if(busy||!state.session||!navigator.onLine)return;
 busy=true;
 try{
  const user=await ensureSession();if(!user)return;
  await deletePending(user);
  const local=api.read(knownIds),remote=await fetchRemote(user),localIds=new Set(local.map(entry=>entry.id)),hasNewRemote=remote.some(entry=>!localIds.has(entry.id)),merged=api.merge(local,remote).slice(-MAX);
  api.save(merged);
  if(hasNewRemote){window.location.reload();return}
  await pushLocal(user,merged);
  state.lastSyncedAt=new Date().toISOString();saveState();
  renderStatus("Sincronizado agora. Seus registros estão disponíveis neste aparelho e nos próximos em que entrar.");
 }catch{
  renderStatus("Sincronização pendente. Seus blocos continuam salvos neste aparelho; tente novamente quando a conexão voltar.","error");
 }finally{busy=false}
}
function scheduleSync(){if(!state.session)return;clearTimeout(timer);timer=setTimeout(syncNow,700)}
function trackDeletes(event){
 const button=event.target.closest(".study-log-delete");if(!button)return;
 const before=api.read(knownIds).map(entry=>entry.id);
 setTimeout(()=>{
  const after=new Set(api.read(knownIds).map(entry=>entry.id));
  const removed=before.filter(id=>!after.has(id));
  if(removed.length){state.pendingDeletes=[...new Set([...state.pendingDeletes,...removed])].slice(-MAX);saveState();scheduleSync()}
 },0);
}
function init(){
 mount();
 document.addEventListener("central:workspace-ready",event=>{for(const project of event.detail?.projects||[])if(typeof project.id==="string")knownIds.add(project.id)});
 const arrived=handleAuthCallback();
 const entryForm=$("study-log-form");if(entryForm)entryForm.addEventListener("submit",scheduleSync);
 const importInput=$("study-log-import");if(importInput)importInput.addEventListener("change",scheduleSync);
 const recent=$("study-log-recent");if(recent)recent.addEventListener("click",trackDeletes,true);
 window.addEventListener("online",scheduleSync);
 window.addEventListener("storage",event=>{if(event.key===api.key)scheduleSync()});
 if(state.session||arrived){$("study-sync-signout").hidden=false;renderStatus(arrived?"Link confirmado. Sincronizando seus blocos…":undefined);syncNow()}
}
document.addEventListener("DOMContentLoaded",init);
})();