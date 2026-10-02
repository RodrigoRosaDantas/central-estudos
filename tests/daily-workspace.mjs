import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = file => fs.readFileSync(path.join(ROOT, file), "utf8");

export function testDailyWorkspace() {
  let writes = 0;
  const context = vm.createContext({ window:{}, document:{getElementById(){return null;}}, Intl, Date, Set, localStorage:{setItem(){writes++;}} });
  vm.runInContext(read("js/study-dates-v1.js"),context);
  vm.runInContext(read("js/daily-workspace-v1.js"),context);
  const api = context.window.CentralDailyWorkspaceV1;
  const projects = [{id:"prf-adm",status:"active",order:3},{id:"tcego",status:"archived",order:0},{id:"tjdft",status:"active",order:2},{id:"seedf",status:"active",order:1}];
  const seedf = { status:"live", contract:{schemaVersion:1,projectId:"seedf",source:{kind:"public-project-state",status:"synced"},state:{currentUnit:"L06",nextAction:"L06 · material e D0 pendentes",alerts:["Questões registradas; D0 pendente."]},study:{evidence:"confirmed",nextUnit:"L06",lastCompletedUnit:"L03",lastStudiedAt:"2026-09-30",activeErrors:23,reviewsDue:0}} };
  const prf = { status:"live", contract:{schemaVersion:1,projectId:"prf-adm",source:{kind:"public-project-state",status:"synced"},state:{currentUnit:null,nextAction:"PRFADM01"},study:{evidence:"confirmed",nextUnit:"PRFADM01",lastCompletedUnit:null,lastStudiedAt:null,activeErrors:null,reviewsDue:0,completedSessions:0,notes:["Materiais: 33/33"]}} };
  const entries = [
    {projectId:"seedf",confirmed:true,date:"2026-10-02",minutes:45},
    {projectId:"seedf",confirmed:true,date:"2026-10-02",minutes:15},
    {projectId:"seedf",confirmed:false,date:"2026-10-02",minutes:60},
    {projectId:"seedf",confirmed:true,date:"2026-02-30",minutes:60},
    {projectId:"seedf",confirmed:true,date:"2026-10-03",minutes:60},
    {projectId:"seedf",confirmed:true,date:"2026-10-02",minutes:1441},
    {projectId:"tcego",confirmed:true,date:"2026-10-02",minutes:60}
  ];
  const before = JSON.stringify({projects,seedf,prf,entries});
  const rows = api.model(projects,{seedf,"prf-adm":prf},entries,"2026-10-02",["seedf","tjdft","prf-adm"]);
  assert.deepEqual(Array.from(rows,p=>p.id),["seedf","tjdft","prf-adm"]);
  assert.equal(rows[0].minutes,60);
  assert.equal(rows[0].records,2);
  assert.equal(rows[0].unit,"L06");
  assert.equal(rows[0].lastUnit,"L03","partial questions on L06 must not close D0");
  assert.equal(rows[0].lastDate,"2026-09-30");
  assert.equal(rows[0].reviews,0,"published zero must remain distinct from missing");
  assert.equal(rows[1].reviews,null);
  assert.equal(rows[1].errors,null);
  assert.equal(rows[1].sourceStatus,"loading");
  assert.equal(rows[2].minutes,0,"published materials must not manufacture time");
  assert.equal(rows[2].lastUnit,null,"editorial readiness must not become a completed study block");
  assert.equal(rows[2].errors,null);
  assert.equal(rows[0].destinations.material,"https://rodrigorosadantas.github.io/seedf-ppge-dashboard/leis/l06/");
  assert.equal(rows[0].destinations.questions,"https://rodrigorosadantas.github.io/seedf-ppge-dashboard/leis/l06/#18-questoes-da-lei");
  assert.equal(api.links("tjdft","P03").material,"https://rodrigorosadantas.github.io/tjdft-dashboard/portugues-rlm/p03/");
  assert.equal(api.links("tjdft","P99").material,"https://rodrigorosadantas.github.io/tjdft-dashboard/portugues-rlm/");
  assert.equal(api.links("seedf","../../outside").material,"https://rodrigorosadantas.github.io/seedf-ppge-dashboard/leis/");
  assert.equal(api.links("tcego","L01"),null);
  assert.equal(api.published({...seedf,contract:{...seedf.contract,projectId:"tjdft"}},"seedf"),null);
  assert.equal(api.published({...seedf,status:"invalid"},"seedf"),null);
  assert.equal(api.published({...seedf,contract:{...seedf.contract,source:{kind:"public-project-state",status:"unavailable"}}},"seedf"),null);
  const old = api.model(projects,{seedf:{...seedf,status:"stale-cache"}},[],"2026-10-02",["seedf","tjdft"]);
  assert.equal(old[0].sourceStatus,"stale-cache");
  assert.equal(old[2].planned,false);
  assert.equal(api.model(projects,{},[],"2026-10-04",[]).some(p=>p.planned),false,"Sunday must preserve protected rest");
  assert.equal(JSON.stringify({projects,seedf,prf,entries}),before,"overview must never mutate source data");
  assert.equal(writes,0);
  assert.ok(!read("js/daily-workspace-v1.js").includes("fetch("));
  assert.ok(!read("js/daily-workspace-v1.js").includes("localStorage.setItem"));

  // Exercise the generated shortcut with a collapsed form and an older selected day.
  class Node {
    constructor(tag = "div") { this.tagName=tag; this.children=[]; this.dataset={}; this.attributes={}; this.handlers={}; this.textContent=""; this.value=""; this.className=""; this.classes=new Set(); this.classList={remove:name=>this.classes.delete(name)}; }
    append(...children) { this.children.push(...children); }
    replaceChildren(...children) { this.children=children; }
    setAttribute(name,value) { this.attributes[name]=value; }
    addEventListener(name,handler) { this.handlers[name]=handler; }
    dispatchEvent(event) { this.events ||= []; this.events.push(event.type); this.handlers[event.type]?.(event); }
    scrollIntoView() { this.scrolled=true; }
    focus() { this.focused=true; }
  }
  const ids=["daily-plan-cards","daily-plan-date","daily-plan-caption","daily-records-note","review-project-cards","review-overview","daily-refresh","daily-refresh-status","study-log-form","study-log-entry-panel","study-log-date","study-log-form-context","study-log-entry-summary","study-log-hours","study-log-minutes","study-log-confirmed"];
  const nodes=Object.fromEntries(ids.map(id=>[id,new Node()])), dailyProjects=["seedf","tjdft","prf-adm"].map(id=>{const n=new Node();n.dataset.dailyProject=id;n.textContent=id;return n;});
  nodes["study-log-entry-panel"].open=false;
  nodes["study-log-date"].value="2026-09-29";
  nodes["study-log-form"].classes.add("is-guided-entry");
  nodes["study-log-form-context"].hidden=false;
  nodes["study-log-confirmed"].checked=false;
  const uiListeners={}, events=[], screensOpened=[];
  const uiContext=vm.createContext({
    window:{CentralStudyLogV1:{today:()=>"2026-10-02"},CentralWorkspaceV24:{setScreen:screen=>screensOpened.push(screen)},addEventListener(){}},
    document:{getElementById:id=>nodes[id]||null,querySelectorAll:query=>query==="[data-daily-project]"?dailyProjects:["P1","P2","P3"].map(text=>({textContent:text})),createElement:tag=>new Node(tag),addEventListener:(name,fn)=>{uiListeners[name]=fn;},dispatchEvent:event=>events.push(event)},
    localStorage:{getItem:()=>null,setItem(){writes++;}},Intl,Date,Set,clearTimeout(){},setTimeout(){return 1;},
    Event:class {constructor(type){this.type=type;}},CustomEvent:class {constructor(type,options){this.type=type;this.detail=options?.detail;}}
  });
  vm.runInContext(read("js/daily-workspace-v1.js"),uiContext);
  uiListeners.DOMContentLoaded();
  const card=nodes["daily-plan-cards"].children.find(el=>el.dataset.projectId==="tjdft");
  card.children.find(el=>el.className==="daily-register").handlers.click({preventDefault(){}});
  assert.deepEqual(screensOpened,["projects"]);
  assert.equal(nodes["study-log-entry-panel"].open,true,"daily registration must expose the fields without a second click");
  assert.equal(nodes["study-log-date"].value,"2026-10-02","daily shortcut must not retain an older planner day");
  assert.ok(nodes["study-log-date"].events.includes("change"),"planner must receive the selected day");
  assert.equal(events.find(e=>e.type==="central:study-log-select-project")?.detail.id,"tjdft");
  assert.equal(nodes["study-log-form-context"].hidden,true,"old guided project context must be hidden");
  assert.equal(nodes["study-log-form"].classes.has("is-guided-entry"),false);
  assert.equal(nodes["study-log-date"].focused,true);
  assert.equal(nodes["study-log-form"].scrolled,true);
  assert.equal(nodes["study-log-hours"].value,"");
  assert.equal(nodes["study-log-minutes"].value,"");
  assert.equal(nodes["study-log-confirmed"].checked,false);
  assert.equal(writes,0,"opening the form must never save a study block");

  function element(hash,screen){ return {hash,dataset:{screen},attributes:{},classes:new Set(),classList:{add(){},toggle(name,on){on?this._owner.classes.add(name):this._owner.classes.delete(name);}},setAttribute(name,value){this.attributes[name]=value;},removeAttribute(name){delete this.attributes[name];}}; }
  const nav = ["#agora","#projetos","#revisoes","#mais"].map(hash=>element(hash));
  const screens = ["today","projects","reviews","more","resume","inbox","history","evolution"].map(screen=>element(null,screen));
  for(const el of [...nav,...screens]) el.classList._owner = el;
  const listeners = {}, location = {hash:"#retomada"};
  const routeContext = vm.createContext({window:{addEventListener(){}},document:{body:{classList:{add(){}}},querySelectorAll(query){return query===".pro-nav-link"?nav:screens;},addEventListener(name,handler){listeners[name]=handler;},dispatchEvent(){}},location,localStorage:{setItem(){},getItem(){return null;}},CustomEvent:class {constructor(name,options){this.type=name;this.detail=options.detail;}}});
  vm.runInContext(read("js/workspace-v24.js"),routeContext); listeners.DOMContentLoaded();
  assert.equal(routeContext.window.CentralWorkspaceV24.current(),"resume");
  assert.equal(nav[3].attributes["aria-current"],"page","old secondary screen must keep More selected");
  routeContext.window.CentralWorkspaceV24.setScreen("reviews");
  assert.equal(location.hash,"revisoes");
  assert.equal(nav[2].attributes["aria-current"],"page");
  assert.equal(nav[3].attributes["aria-current"],undefined);
  assert.equal(screens.filter(el=>el.classes.has("is-screen-active")).length,1);
  for(const route of ["inbox","history","evolution","more"]){ routeContext.window.CentralWorkspaceV24.setScreen(route); assert.equal(nav[3].attributes["aria-current"],"page"); }
  assert.ok(read("js/pro-v11.js").includes('function oe(){if(window.CentralWorkspaceV24)return;'),"old scroll observer must not replace router selection");
  const html=read("index.html"),sw=read("sw.js");
  assert.equal((html.match(/class="pro-nav-link"/g)||[]).length,4);
  for(const file of ["js/daily-workspace-v1.js","css/daily-workspace-v1.css"]){ assert.ok(html.includes(file+"?v=28.7.1")); assert.ok(sw.includes(file+"?v=28.7.1")); }
  console.log("✓ v28.7 daily plan, verified routes, read-only evidence and four-screen navigation");
}
