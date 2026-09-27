import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), "utf8");
const exists = (relativePath) => fs.existsSync(path.join(ROOT, relativePath));
const pass = (message) => console.log(`✓ ${message}`);

function checkSyntax(relativePath) {
  const result = spawnSync(process.execPath, ["--check", path.join(ROOT, relativePath)], {
    encoding: "utf8"
  });

  assert.equal(
    result.status,
    0,
    `Syntax error in ${relativePath}: ${result.stderr || result.stdout}`
  );
  pass(`syntax: ${relativePath}`);
}

function extractLocalRefs(html) {
  const refs = new Set();
  for (const match of html.matchAll(/(?:src|href)="(\.\/[^"#?]+)"/g)) {
    refs.add(match[1].replace(/^\.\//, ""));
  }
  return [...refs];
}

function extractStaticIds(html) {
  return [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
}

function createLocalStorage() {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
    _store: store
  };
}

function loadAppForTests() {
  const localStorage = createLocalStorage();
  const context = vm.createContext({
    console: { warn() {}, info() {}, log() {}, error() {} },
    window: { localStorage },
    document: {
      addEventListener() {},
      getElementById() { return null; },
      querySelector() { return null; }
    },
    localStorage,
    URL,
    Intl,
    Date,
    Map,
    Set,
    JSON,
    RegExp,
    Number,
    String,
    Array,
    Object,
    Math,
    Promise,
    AbortController,
    setTimeout,
    clearTimeout
  });

  vm.runInContext(read("js/app.js"), context, { filename: "js/app.js" });
  return { context, localStorage };
}

function testRegistry(registry, html) {
  assert.equal(registry.schemaVersion, 3, "registry schemaVersion must be 3");
  assert.match(registry.central.version, /^\d+\.\d+\.\d+$/, "central version must be semver");
  assert.ok(Array.isArray(registry.projects) && registry.projects.length > 0, "registry must contain projects");

  const ids = registry.projects.map(project => project.id);
  assert.equal(new Set(ids).size, ids.length, "project ids must be unique");
  const defaultProject = registry.projects.find(project => project.id === registry.central.defaultProject);
  assert.equal(defaultProject?.status, "active", "defaultProject must exist and be active");

  const lifecycle = new Set(["active", "archived", "future"]);
  const required = ["id", "name", "description", "phase", "status", "priority", "icon"];
  for (const project of registry.projects) {
    for (const field of required) {
      assert.equal(typeof project[field], "string", `${project.id || "project"}.${field} must be a string`);
      assert.ok(project[field].trim(), `${project.id || "project"}.${field} must not be empty`);
    }
    assert.ok(lifecycle.has(project.status), `invalid lifecycle: ${project.id}`);

    if (project.status !== "future") {
      assert.equal(new URL(project.url).protocol, "https:", `${project.id}.url must use HTTPS`);
      assert.equal(new URL(project.repository).protocol, "https:", `${project.id}.repository must use HTTPS`);
      assert.ok(html.includes(project.url), `static HTML fallback must include ${project.id} URL`);
    } else {
      if (project.url) assert.equal(new URL(project.url).protocol, "https:", `${project.id}.future URL must use HTTPS`);
      if (project.repository) assert.equal(new URL(project.repository).protocol, "https:", `${project.id}.future repository must use HTTPS`);
    }

    if (project.statusUrl) {
      assert.equal(new URL(project.statusUrl).protocol, "https:", `${project.id}.statusUrl must use HTTPS`);
      assert.ok(project.statusUrl.endsWith("/central-status.json"), `${project.id}.statusUrl must target central-status.json`);
    }
  }

  pass("registry v3 lifecycle, ids, HTTPS and static fallback");
}

function testInternalReferences(html) {
  const refs = extractLocalRefs(html);
  for (const ref of refs) {
    assert.ok(exists(ref), `missing local asset referenced by index.html: ${ref}`);
  }

  const ids = extractStaticIds(html);
  assert.equal(new Set(ids).size, ids.length, "static HTML ids must be unique");

  assert.ok(html.includes("<noscript>"), "index.html must keep a noscript fallback");
  assert.ok(html.includes("JavaScript está desativado"), "noscript fallback must explain direct access");

  pass("internal references, unique static ids and no-JS fallback");
}

function testManifest(manifest) {
  assert.equal(manifest.start_url, "./", "manifest start_url must stay relative");
  assert.equal(manifest.scope, "./", "manifest scope must stay relative");
  assert.equal(manifest.display, "standalone", "manifest display must be standalone");
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0, "manifest must include icons");

  for (const icon of manifest.icons) {
    assert.ok(exists(icon.src.replace(/^\.\//, "")), `manifest icon missing: ${icon.src}`);
  }

  pass("manifest scope, start URL and icons");
}

function testServiceWorker(registry) {
  const sw = read("sw.js");
  const match = sw.match(/const APP_SHELL = \[([\s\S]*?)\];/);
  assert.ok(match, "service worker must declare APP_SHELL");

  const shell = [...match[1].matchAll(/'([^']+)'/g)].map(item => item[1]);
  assert.ok(shell.length > 0, "APP_SHELL must not be empty");

  for (const entry of shell) {
    const relative = entry === "./" ? "index.html" : entry.replace(/^\.\//, "");
    assert.ok(exists(relative), `APP_SHELL entry missing: ${entry}`);
  }

  assert.match(sw, /central-shell-v\d+\.\d+\.\d+/, "service worker cache must be versioned");
  assert.ok(sw.includes("url.origin !== scopeUrl.origin"), "service worker must guard origin");
  assert.ok(sw.includes("!url.pathname.startsWith(scopeUrl.pathname)"), "service worker must guard scope pathname");
  assert.ok(!sw.includes("api.github.com"), "service worker must not cache GitHub API");

  for (const project of registry.projects) {
    if (project.url) assert.ok(!sw.includes(project.url), `service worker must not cache project URL: ${project.id}`);
  }

  pass("service worker shell, versioning and external isolation");
}

function testCriticalAppLogic(registry) {
  const { context, localStorage } = loadAppForTests();

  assert.equal(typeof context.validateConfig, "function", "validateConfig must be testable");
  assert.equal(typeof context.chooseFocus, "function", "chooseFocus must be testable");
  assert.equal(typeof context.readLastVisit, "function", "readLastVisit must be testable");

  const clone = value => JSON.parse(JSON.stringify(value));

  const valid = context.validateConfig(clone(registry));
  assert.equal(valid.projects.length, registry.projects.length, "valid config must pass validation");

  const duplicate = clone(registry);
  duplicate.projects.push({ ...duplicate.projects[0] });
  assert.throws(() => context.validateConfig(duplicate), /duplicado/i, "duplicate project ids must fail");

  const insecure = clone(registry);
  insecure.projects[0].url = insecure.projects[0].url.replace("https://", "http://");
  assert.throws(() => context.validateConfig(insecure), /não segura/i, "HTTP project URL must fail");

  const invalidId = clone(registry);
  invalidId.projects[0].id = 'bad id"><script>';
  assert.throws(() => context.validateConfig(invalidId), /ID de projeto inválido/i, "unsafe project ids must fail");

  const missingDefault = clone(registry);
  missingDefault.central.defaultProject = "missing-project";
  assert.throws(() => context.validateConfig(missingDefault), /Projeto padrão.*ativo|Projeto padrão.*registry/i, "missing or inactive defaultProject must fail");

  localStorage.clear();
  const defaultFocus = context.chooseFocus(valid.projects, valid.central.defaultProject);
  assert.equal(defaultFocus.id, valid.central.defaultProject, "default focus must use registry defaultProject");

  const alternate = valid.projects.find(project => project.id !== valid.central.defaultProject);
  if (alternate) {
    localStorage.setItem("central-estudos:focus-project", alternate.id);
    const chosen = context.chooseFocus(valid.projects, valid.central.defaultProject);
    assert.equal(chosen.id, alternate.id, "valid local focus preference must be honored");
  }

  localStorage.setItem("central-estudos:last-project", "{corrompido");
  const lastVisit = context.readLastVisit();
  assert.equal(lastVisit, null, "corrupted last-visit data must degrade to null");
  assert.equal(localStorage.getItem("central-estudos:last-project"), null, "corrupted last-visit data must be cleaned");

  pass("critical app logic: config validation, focus and corrupted local state");
}

function testTimelineContract(registry) {
  const timeline = read("js/timeline-v8.js");
  const html = read("index.html");

  assert.ok(html.includes('id="activity-panel"'), "v8 activity panel must exist");
  assert.ok(html.includes("./js/timeline-v8.js"), "v8 timeline script must be referenced");
  assert.ok(html.includes("./css/timeline-v8.css"), "v8 timeline stylesheet must be referenced");
  assert.ok(timeline.includes("central-estudos:access-history-v8"), "v8 access history must use its own local key");
  const boundedHistory = timeline.includes(".slice(0,12)") || (
    /\.\s*slice\(\s*0\s*,\s*MAX_ACCESS_HISTORY\s*\)/.test(timeline) &&
    /MAX_ACCESS_HISTORY\s*=\s*12/.test(timeline)
  );
  assert.ok(boundedHistory, "v8 local history must be bounded");
  assert.ok(timeline.includes("central:project-opened"), "v8 must distinguish local access events");
  assert.ok(timeline.includes("central:technical-state"), "v8 must consume technical state separately");
  assert.ok(timeline.includes("não determina a causa"), "v8 diagnosis must avoid unsupported causes");
  assert.ok(timeline.includes("Não mede estudo, duração, progresso ou desempenho"), "v8 local access must not be framed as study");
  assert.ok(!timeline.includes("fetch("), "v8 timeline must reuse existing observability instead of creating extra network calls");

  for (const project of registry.projects.filter(project => project.status === "active")) {
    assert.ok(html.includes(`data-project-id="${project.id}"`), `v8 timeline needs active registry-backed card id: ${project.id}`);
  }

  pass("v8 timeline, source separation and diagnostic contracts");
}


function colorLuminance(hex) {
  const rgb = hex
    .replace("#", "")
    .match(/.{2}/g)
    .map(value => Number.parseInt(value, 16) / 255)
    .map(value => value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4);

  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function contrastRatio(foreground, background) {
  const a = colorLuminance(foreground);
  const b = colorLuminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function cssHexVariable(css, name) {
  const match = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  assert.ok(match, `CSS variable --${name} must be a six-digit hex color`);
  return match[1];
}

function testV9Hardening(registry) {
  const html = read("index.html");
  const app = read("js/app.js");
  const catalog = read("js/catalog-v4.js");
  const personalization = read("js/personalization-v5.js");
  const timeline = read("js/timeline-v8.js");
  const css = read("css/app.css");

  const csp = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1] || "";
  for (const directive of [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "connect-src 'self' https://api.github.com",
    "worker-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'"
  ]) {
    assert.ok(csp.includes(directive), `CSP directive missing: ${directive}`);
  }

  assert.equal((html.match(/<script(?![^>]*src=)/g) || []).length, 0, "inline scripts are not allowed");
  assert.equal(
    [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].filter(match => !match[1].startsWith("./")).length,
    0,
    "external script dependencies are not allowed"
  );
  assert.equal(
    [...html.matchAll(/<link[^>]+href="([^"]+)"/g)].filter(match => /^https?:/.test(match[1])).length,
    0,
    "external stylesheet dependencies are not allowed"
  );

  assert.ok(html.includes('name="viewport"'), "mobile viewport meta must exist");
  assert.ok(html.includes('class="skip-link"'), "keyboard skip link must exist");
  assert.ok(html.includes('id="clear-history"') && html.includes('id="clear-history" class="button button-quiet" type="button" disabled'), "JS-only clear-history control must start disabled");
  assert.ok(html.includes('aria-controls="projects-grid"'), "catalog controls must identify the grid they control");
  assert.ok(css.includes(":focus-visible"), "visible keyboard focus style must exist");
  assert.ok(css.includes("@media (max-width: 360px)"), "small mobile hardening breakpoint must exist");
  assert.ok(css.includes("@media (pointer: coarse)"), "coarse-pointer touch target hardening must exist");
  assert.ok(css.includes("@media (forced-colors: active)"), "forced-colors fallback must exist");
  assert.ok(catalog.includes("HTMLInputElement") && catalog.includes("HTMLTextAreaElement") && catalog.includes("HTMLSelectElement"), "keyboard shortcuts must ignore editable controls");
  assert.ok(catalog.includes('aria-pressed'), "favorite control must expose pressed state");

  const bg = cssHexVariable(css, "bg");
  const surface = cssHexVariable(css, "surface");
  for (const name of ["text", "muted", "success", "warning", "danger"]) {
    const color = cssHexVariable(css, name);
    assert.ok(contrastRatio(color, bg) >= 4.5, `--${name} contrast on --bg must be >= 4.5:1`);
    assert.ok(contrastRatio(color, surface) >= 4.5, `--${name} contrast on --surface must be >= 4.5:1`);
  }

  assert.ok(app.includes("HEALTH_CACHE_TTL_MS=12e4"), "health checks must use a short cache");
  assert.ok(app.includes("/actions/workflows/deploy-pages.yml/runs?branch=main&per_page=1"), "deploy lookup must prefer the targeted one-run endpoint");
  assert.ok(!app.includes("per_page=100"), "deploy lookup must not download 100 workflow runs");
  assert.ok(app.includes("escapeHtml(t.name)") && app.includes("escapeHtml(t.url)"), "registry content must be escaped before card innerHTML");
  assert.ok(personalization.includes("&#039;")&&personalization.includes(".innerHTML="), "personalization must HTML-escape registry text before insertion");
  assert.ok(timeline.includes('e.healthMetaState==="cached"') && timeline.includes("não confirma o estado neste instante"), "cached health must not be described as current");

  const payloadFiles = [
    "index.html",
    "sw.js",
    "manifest.webmanifest",
    "js/app.js",
    "js/catalog-v4.js",
    "js/personalization-v5.js",
    "js/pwa-v6.js",
    "js/timeline-v8.js",
    "js/pro-v11.js",
    "js/contracts-v12.js",
    "js/operational-v13.js",
    "js/workspace-v24.js",
    "css/app.css",
    "css/catalog-v4.css",
    "css/personalization-v5.css",
    "css/timeline-v8.css",
    "css/pro-v11.css",
    "css/operational-v13.css",
    "css/workspace-v24.css",
  ];
  const payloadBytes = payloadFiles.reduce((total, file) => total + fs.statSync(path.join(ROOT, file)).size, 0);
  assert.ok(payloadBytes <= 128 * 1024, `first-party shell source budget exceeded: ${payloadBytes} bytes`);

  for (const project of registry.projects) {
    assert.match(project.id, /^[a-z0-9_-]+$/i, `unsafe registry id: ${project.id}`);
  }

  pass("v9 security, accessibility, contrast, network and payload hardening");
}


function testV11Pro(registry) {
  const html = read("index.html");
  const pro = read("js/pro-v11.js");
  const css = read("css/pro-v11.css");
  const app = read("js/app.js");
  const sw = read("sw.js");

  assert.ok(html.includes('class="pro-nav"'), "v11 primary navigation must exist");
  for (const anchor of ["#agora", "#projetos", "#activity-panel", "#diagnostico"]) {
    assert.ok(html.includes(`href="${anchor}"`), `v11 navigation anchor missing: ${anchor}`);
  }

  assert.ok(html.includes('id="agora"'), "v11 now section must exist");
  assert.ok(html.includes('id="pro-now-focus-name"'), "v11 now view must expose focus");
  assert.ok(html.includes('id="pro-now-resume-name"'), "v11 now view must expose resume");
  assert.ok(html.includes('id="pro-now-project-count"'), "v11 now view must expose project count");

  assert.ok(pro.includes("central:app-ready"), "v11 must refresh when app state becomes ready");
  assert.ok(pro.includes("central:focus-changed"), "v11 must refresh when focus changes");
  assert.ok(pro.includes("central:project-opened"), "v11 must refresh after local access");
  assert.ok(pro.includes("central:history-cleared"), "v11 must refresh after history reset");
  assert.ok(!pro.includes("fetch("), "v11 UX layer must not create external network calls");

  assert.ok(app.includes("central:app-ready"), "core app must expose ready event for v11");
  assert.ok(app.includes("central:focus-changed"), "core app must expose focus change event for v11");

  assert.ok(css.includes("@media(max-width:719px)"), "v11 must define mobile navigation");
  assert.ok(css.includes("position:fixed"), "v11 mobile navigation must remain reachable");
  assert.ok(css.includes("min-height:52px"), "v11 mobile nav touch targets must be adequate");

  const v11CacheMajor = Number(sw.match(/central-shell-v(\d+)\./)?.[1] || 0);
  assert.ok(v11CacheMajor >= 11, "service worker cache must preserve v11 or newer");
  assert.ok(sw.includes("./js/pro-v11.js"), "v11 JS must be in the app shell");
  assert.ok(sw.includes("./css/pro-v11.css"), "v11 CSS must be in the app shell");

  for (const project of registry.projects) {
    assert.ok(html.includes(project.url), `v11 must preserve direct fallback for ${project.id}`);
  }

  assert.ok(!/próxima ação|progresso de estudo|horas estudadas/i.test(pro), "v11 must not invent pedagogical state");

  pass("v11 PRO navigation, now view and no-fake-state contracts");
}

function testV12Contracts(registry) {
  const contracts = read("js/contracts-v12.js");
  const timeline = read("js/timeline-v8.js");
  const pro = read("js/pro-v11.js");
  const sw = read("sw.js");
  const schema = JSON.parse(read("config/status-contract.schema.json"));

  assert.equal(schema.properties.schemaVersion.const, 1, "status contract schema must remain v1");
  assert.ok(schema.required.includes("projectId"), "status contract schema must require projectId");
  assert.ok(schema.required.includes("state"), "status contract schema must require state");

  for (const project of registry.projects.filter(project => project.status === "active")) {
    assert.equal(typeof project.statusUrl, "string", `${project.id} active project must publish statusUrl`);
    assert.equal(new URL(project.statusUrl).protocol, "https:", `${project.id}.statusUrl must use HTTPS`);
  }

  assert.ok(contracts.includes("3e5"), "v12 contracts must use short cache");
  assert.ok(contracts.includes("3500"), "v12 contracts must use timeout");
  assert.ok(contracts.includes('method:"GET"'), "v12 contract transport must be read-only GET");
  assert.ok(!contracts.includes('method:"POST"') && !contracts.includes('method:"PUT"') && !contracts.includes('method:"PATCH"') && !contracts.includes('method:"DELETE"'), "v12 consumer must never write");
  assert.ok(contracts.includes("contract-not-object"), "v12 must validate contract before use");
  assert.ok(contracts.includes("project-id-mismatch"), "v12 must bind contract to registry project");
  assert.ok(contracts.includes("stale-cache"), "v12 must degrade to stale cache");
  assert.ok(contracts.includes("central:contract-state"), "v12 must publish contract state events");
  assert.ok(timeline.includes("central:contract-state"), "diagnostics must consume v12 contract state");
  assert.ok(timeline.includes("contrato operacional inválido"), "diagnostics must explain invalid contract");
  assert.ok(timeline.includes("isso não afeta o projeto nem seus links"), "contract failure must not affect navigation");

  assert.ok(!pro.includes("nextAction"), "v12 must not expose nextAction in the Home before v13");
  assert.ok(!pro.includes("currentUnit"), "v12 must not expose currentUnit in the Home before v13");

  const v12CacheMajor = Number(sw.match(/central-shell-v(\d+)\./)?.[1] || 0);
  assert.ok(v12CacheMajor >= 12, "service worker cache must preserve v12 or newer");
  assert.ok(sw.includes("./js/contracts-v12.js"), "v12 contract consumer must be in app shell");
  for (const project of registry.projects) {
    if (project.statusUrl) assert.ok(!sw.includes(project.statusUrl), `service worker must not cache child contract: ${project.id}`);
  }

  pass("v12 optional read-only contract, cache and graceful-degradation contracts");
}

function testV13OperationalState(registry) {
  const html = read("index.html");
  const operational = read("js/operational-v13.js");
  const css = read("css/operational-v13.css");
  const sw = read("sw.js");

  assert.ok(html.includes('id="operational-panel"'), "v13 operational panel must exist");
  assert.ok(html.includes('id="operational-list"'), "v13 operational list must exist");
  assert.ok(html.includes('id="pro-now-focus-operational"'), "v13 focus operational line must exist");
  assert.ok(html.includes("./js/operational-v13.js"), "v13 operational script must be referenced");
  assert.ok(html.includes("./css/operational-v13.css"), "v13 operational stylesheet must be referenced");

  assert.ok(operational.includes("central:contract-state"), "v13 must consume validated contract events");
  assert.ok(operational.includes("central:focus-changed"), "v13 must follow human-selected focus");
  assert.ok(!operational.includes("fetch("), "v13 presentation layer must not create network calls");
  assert.ok(operational.includes('==="planned"'), "v13 must distinguish planned state");
  assert.ok(operational.includes("stale-cache"), "v13 must distinguish stale state");
  assert.ok(operational.includes("Último estado conhecido"), "stale data must not be presented as current");
  assert.ok(operational.includes("Próxima ação"), "operational action must be labeled explicitly");
  assert.ok(operational.includes("Planejado"), "planned action must be labeled explicitly");

  assert.ok(!/score calculado|ranking calculado|melhor projeto|prioridade calculada/i.test(operational), "v13 must not rank or score projects");
  assert.ok(!/mentor global|mentor central/i.test(operational), "v13 must not implement a global mentor");

  assert.ok(css.includes(".operational-grid"), "v13 operational cards must be styled");
  assert.ok(css.includes("@media(min-width:720px)"), "v13 must support responsive grid");

  const cacheMajor = Number(sw.match(/central-shell-v(\d+)\./)?.[1] || 0);
  assert.ok(cacheMajor >= 13, "service worker cache must preserve v13 or newer");
  assert.ok(sw.includes("./js/operational-v13.js"), "v13 JS must be in app shell");
  assert.ok(sw.includes("./css/operational-v13.css"), "v13 CSS must be in app shell");

  for (const project of registry.projects) {
    if (project.url) assert.ok(html.includes(project.url), `v13 must preserve direct link for ${project.id}`);
  }

  pass("v13 published operational state, provenance and no-ranking contracts");
}

function testV14ExplainableRouting(registry) {
  const html = read("index.html");
  const routing = read("js/operational-v13.js");
  const css = read("css/operational-v13.css");
  const sw = read("sw.js");

  assert.ok(html.includes('id="routing-panel"'), "v14 routing panel must exist");
  for (const lens of ["focus", "resume", "published", "alerts"]) {
    assert.ok(html.includes(`data-route-lens="${lens}"`), `v14 routing lens missing: ${lens}`);
  }

  assert.ok(routing.includes("central-estudos:route-lens-v14"), "v14 selected lens must be local");
  assert.ok(routing.includes('B.has(e)?e:"focus"'), "v14 default lens must be focus");
  assert.ok(routing.includes("Por que aparece aqui?"), "v14 must explain why an item appears");
  assert.ok(routing.includes("A ordem é a do catálogo, sem ranking.")||routing.includes("A Central preserva a ordem do catálogo."), "v14+ published lens must explain catalog order");
  assert.ok(routing.includes("A ordem é a do catálogo, sem pontuação.")||routing.includes("sem pontuação ou ordem automática"), "v14+ alerts lens must explain non-ranked order");
  assert.ok(routing.includes(".sort((t,o)=>t.order-o.order)"), "v14 multi-item routing must preserve catalog order");

  assert.ok(routing.includes("central:focus-changed"), "v14 focus lens must follow human-selected focus");
  assert.ok(routing.includes("central:project-opened"), "v14 resume lens must follow local access");
  assert.ok(routing.includes("central:contract-state"), "v14 published/alerts lenses must use validated contracts");
  assert.ok(!routing.includes("fetch("), "v14 routing layer must not create network calls");

  assert.ok(!/score|ranking calculado|recomenda[cç][aã]o autom[aá]tica|melhor projeto|prioridade calculada/i.test(routing), "v14 must not rank, score or auto-recommend projects");
  assert.ok(routing.includes("stale-cache"), "v14 must distinguish stale operational data");
  assert.ok(routing.includes("Último estado conhecido"), "v14 stale route must be labeled as last known state");

  assert.ok(css.includes(".routing-lenses"), "v14 lenses must be styled");
  assert.ok(css.includes("@media(pointer:coarse)"), "v14 touch targets must be hardened");

  const cacheMajor = Number(sw.match(/central-shell-v(\d+)\./)?.[1] || 0);
  assert.ok(cacheMajor >= 14, "service worker cache must preserve v14 or newer");
  assert.ok(sw.includes("./js/operational-v13.js"), "v14 routing must remain in operational app-shell JS");
  assert.ok(sw.includes("./css/operational-v13.css"), "v14 routing styles must remain in operational app-shell CSS");

  for (const project of registry.projects) {
    if (project.url) assert.ok(html.includes(project.url), `v14 must preserve direct link for ${project.id}`);
  }

  pass("v14 user-selected, explainable and non-ranking routing contracts");
}

function testV15Workspace(registry) {
  const html = read("index.html");
  const app = read("js/app.js");
  const pro = read("js/pro-v11.js");
  const css = read("css/pro-v11.css");
  const sw = read("sw.js");

  const active = registry.projects.filter(project => project.status === "active");
  const archived = registry.projects.filter(project => project.status === "archived");
  assert.equal(active.length, 3, "v15 must keep the three current active projects");
  assert.ok(archived.some(project => project.id === "sedes-tdas"), "v15 must include SEDES as archived history");
  assert.ok(registry.projects.every(project => ["active", "archived", "future"].includes(project.status)), "v15 lifecycle must be explicit");

  assert.ok(html.includes('id="workspace"'), "v15 workspace section must exist");
  for (const tab of ["active", "archived", "future"]) {
    assert.ok(html.includes(`data-workspace-tab="${tab}"`), `v15 workspace tab missing: ${tab}`);
  }
  assert.ok(html.includes("https://rodrigorosadantas.github.io/sedes-tdas-dashboard/"), "SEDES archived fallback link must exist");
  assert.ok(html.includes('id="workspace-export"') && html.includes('id="workspace-import-button"'), "v15 portability controls must exist");

  assert.ok(app.includes('status==="active"'), "v15 core must distinguish active projects");
  assert.ok(app.includes("function activeProjects()"), "v15 core must centralize active project selection");
  assert.ok(app.includes("central:workspace-ready"), "v15 core must expose registry lifecycle to workspace");
  assert.ok(app.includes("chooseFocus(activeProjects()"), "archived/future projects must not become focus");
  assert.ok(app.includes("activeProjects().find(s=>s.id===e?.id)"), "archived/future projects must not become resume targets");
  assert.ok(app.includes("activeProjects().map(async e=>"), "health/metadata must be restricted to active projects");

  assert.ok(pro.includes("central-estudos:workspace-tab-v15"), "workspace tab must be local preference");
  assert.ok(pro.includes('new Set(["active","archived","future"])'), "workspace lifecycle filters must be explicit");
  assert.ok(pro.includes("central:workspace-ready"), "workspace must consume lifecycle event");
  assert.ok(!pro.includes("fetch("), "workspace must not add network calls");
  assert.ok(pro.includes('type:"central-estudos-preferences"'), "preference backup must be typed");
  assert.ok(pro.includes(".size>65536"), "preference import must be size bounded");

  const allowlist = pro.match(/\["central-estudos:focus-project".*?"central-estudos:views-v19"\]/)?.[0] || "";
  for (const forbidden of ["last-project", "access-history", "health-v9", "repo-meta-v3", "contracts-v12"]) {
    assert.ok(!allowlist.includes(forbidden), `backup allowlist must exclude ${forbidden}`);
  }

  assert.ok(css.includes(".workspace-panel") && css.includes(".workspace-list"), "v15 workspace must be styled");
  assert.ok(css.includes("repeat(5"), "v15 primary navigation must accommodate Workspace");

  const cacheMajor = Number(sw.match(/central-shell-v(\d+)\./)?.[1] || 0);
  assert.ok(cacheMajor >= 15, "service worker cache must preserve v15 or newer");

  pass("v15 lifecycle workspace, archived history and safe preference portability");
}

function testV16CommandPalette(registry) {
  const pro = read("js/pro-v11.js");
  const css = read("css/pro-v11.css");
  const sw = read("sw.js");

  assert.ok(pro.includes("command-open")&&pro.includes("command-results"), "v16 command palette must initialize explicitly");
  assert.ok(pro.includes("a.ctrlKey||a.metaKey"), "v16 must support Ctrl/Cmd+K");
  assert.ok(pro.includes('key.toLowerCase()==="k"'), "v16 shortcut must use K");
  assert.ok(pro.includes("instanceof HTMLInputElement"), "v16 shortcut must guard editable fields");
  assert.ok(pro.includes('key==="ArrowDown"||a.key==="ArrowUp"'), "v16 must support arrow navigation");
  assert.ok(pro.includes('key==="Enter"'), "v16 must support Enter");
  assert.ok(pro.includes('key==="Escape"'), "v16 must support Escape");
  assert.ok(pro.includes('setAttribute("role","option")'), "v16 results must expose option semantics");
  assert.ok(pro.includes('"Projeto ativo"') && pro.includes('"Histórico arquivado"') && pro.includes('"Projeto futuro"'), "v16 must distinguish workspace lifecycle");
  assert.ok((pro.includes('Ir para Agora')||pro.includes('Ir para Hoje')) && pro.includes('Ir para Workspace') && pro.includes('Ir para Diagnóstico'), "v16+ must search core navigation");
  assert.ok(pro.includes("Continuar foco") && pro.includes("Abrir último ambiente"), "v16 must expose focus and last-project quick actions");
  assert.ok(!pro.includes("fetch("), "v16 command palette must not create network calls");

  assert.ok(css.includes(".command-open"), "v16 must provide a visible touch control");
  assert.ok(css.includes(".command-dialog"), "v16 dialog must be styled");
  assert.ok(css.includes("bottom:82px"), "v16 mobile trigger must clear the bottom navigation");
  assert.ok(css.includes("@media(pointer:coarse)"), "v16 touch targets must be hardened");

  const cacheMajor = Number(sw.match(/central-shell-v(\d+)\./)?.[1] || 0);
  assert.ok(cacheMajor >= 16, "service worker cache must preserve v16 or newer");

  for (const project of registry.projects) {
    if (project.url) assert.ok(read("index.html").includes(project.url), `v16 must preserve direct link for ${project.id}`);
  }

  pass("v16 keyboard/touch command palette and workspace search contracts");
}

function testV17OperationalInbox(registry) {
  const html = read("index.html");
  const operational = read("js/operational-v13.js");

  assert.ok(html.includes('id="operational-panel"'), "v17 inbox must reuse the operational panel");
  assert.ok(operational.includes("Filtrar itens da Inbox"), "v17 inbox must initialize explicitly");
  assert.ok(operational.includes('"all","Tudo"') && operational.includes('"action","Ações"') && operational.includes('"alert","Alertas"'), "v17 must expose all/action/alert filters");
  assert.ok(operational.includes('aria-label","Filtrar inbox por projeto"'), "v17 must expose a project filter");
  assert.ok(operational.includes("Fonte: contrato publicado pelo projeto"), "v17 must expose provenance text");
  assert.ok(operational.includes("Fonte: contrato publicado pelo projeto"), "v17 live provenance must be explicit");
  assert.ok(operational.includes("Fonte: contrato em cache antigo"), "v17 stale provenance must be explicit");
  assert.ok(operational.includes("Último estado"), "v17 stale state must remain distinct from current state");
  assert.ok(operational.includes(".sort((t,o)=>t.order-o.order)"), "v17 inbox order must follow the catalog");
  assert.ok(!operational.includes("fetch("), "v17 inbox must reuse validated contract events without extra fetch");
  assert.ok(!/score calculado|ranking calculado|melhor projeto|prioridade calculada/i.test(operational), "v17 inbox must not rank or score projects");

  for (const project of registry.projects) {
    if (project.url) assert.ok(html.includes(project.url), `v17 must preserve direct link for ${project.id}`);
  }

  pass("v17 local operational inbox, provenance, stale separation and no-ranking contracts");
}

function testV18ProvenanceFreshness(registry) {
  const contracts = read("js/contracts-v12.js");
  const operational = read("js/operational-v13.js");

  assert.ok(operational.includes("Origem e frescor"), "v18 must expose provenance/freshness details");
  assert.ok(operational.includes("Date.parse(e)"), "v18 must calculate descriptive contract/source age");
  assert.ok(operational.includes(".kind||") && operational.includes(".ref||") && operational.includes(".status||"), "v18 must expose source kind/ref/status");
  assert.ok(operational.includes("Schema v") && operational.includes("Compatível"), "v18 must expose validated schema compatibility");
  assert.ok(operational.includes("Atualizar contrato"), "v18 must expose manual refresh");
  assert.ok(operational.includes("central:contract-refresh"), "v18 presentation must request refresh by event");
  assert.ok(contracts.includes("central:contract-refresh"), "v18 contract layer must consume manual refresh events");
  assert.ok(contracts.includes("w(e,!0)"), "v18 manual refresh must explicitly bypass fresh cache");
  assert.ok(contracts.includes("u=new Set"), "v18 manual refresh must deduplicate concurrent requests");
  assert.ok(contracts.includes('method:"GET"'), "v18 refresh must remain read-only GET");
  assert.ok(contracts.includes('cache:"no-store"'), "v18 refresh must request fresh contract data");
  assert.ok(!operational.includes("fetch("), "v18 presentation layer must not create network calls");
  assert.ok(!/poll|setInterval\(/i.test(operational + contracts), "v18 must not add polling");

  for (const project of registry.projects) {
    if (project.url) assert.ok(read("index.html").includes(project.url), `v18 must preserve direct link for ${project.id}`);
  }

  pass("v18 contract provenance, freshness, compatibility and safe manual refresh");
}

function testV19LocalViews(registry) {
  const pro=read("js/pro-v11.js"),operational=read("js/operational-v13.js");
  assert.ok(pro.includes("central-estudos:views-v19")&&pro.includes("r.length<8"),"v19 views must remain named and bounded");
  assert.ok(["Salvar view local","Aplicar view local","Restaurar view padrão"].every(x=>pro.includes(x)),"local views must remain reachable from the command palette");
  assert.ok(pro.includes('screen||"today"')&&pro.includes("screen:ue()")&&pro.includes("D(o,t)"),"old views default to Hoje and new views validate their screen");
  const allowlist=pro.match(/F=\[(.*?)\]/)?.[1]||"";
  assert.ok(allowlist.includes("central-estudos:focus-project")&&allowlist.includes("E,b,S,C,A")&&pro.includes("central-estudos:views-v19")&&pro.includes("central-estudos:inbox-type-v19")&&pro.includes("central-estudos:inbox-project-v19"),"views and filters must be explicitly allowlisted");
  for(const forbidden of ["central-estudos:last-project","central-estudos:access-history-v8","central-estudos:health-v9","central-estudos:repo-meta-v3","central-estudos:contracts-v12"])assert.ok(!allowlist.includes(forbidden),`backup must exclude ${forbidden}`);
  assert.ok(operational.includes("central-estudos:inbox-type-v19")&&operational.includes("central-estudos:inbox-project-v19"),"Inbox filters must persist locally");
  assert.ok(operational.includes("O(w,a)")&&operational.includes("O(k,l)"),"type and project filter changes must write only local preferences");
  assert.ok(!pro.includes("fetch(")&&!operational.includes("fetch("),"local views must not add network calls");
  for(const project of registry.projects)if(project.url)assert.ok(read("index.html").includes(project.url),`direct link missing for ${project.id}`);
  pass("v19 named bounded local views and allowlisted backup");
}

function testV20TerminalAudit(registry) {
  const roadmap = read("docs/ROADMAP-V20.md");
  const checkpoint10 = read("docs/V10-CHECKPOINT.md");
  const checkpoint15 = read("docs/V15-CHECKPOINT.md");
  const audit = read("docs/FINAL-AUDIT-V20.md");
  const checkpoint20 = read("docs/V20-CHECKPOINT.md");
  const workflow = read(".github/workflows/pages.yml");
  const pro = read("js/pro-v11.js");
  const operational = read("js/operational-v13.js");

  assert.ok(checkpoint20.includes("Stage:** COMPLETE")&&checkpoint20.includes("20.0.0"),"v20 must remain recorded as a completed historical terminal");
  assert.ok(roadmap.includes("## v20 — Workspace PRO estável"), "v20 terminal roadmap target must remain explicit");
  assert.ok(checkpoint10.includes("Stage:** COMPLETE") && checkpoint10.includes("10.0.0"), "v10 terminal baseline must remain complete");
  assert.ok(checkpoint15.includes("Stage:** COMPLETE") && checkpoint15.includes("15.0.0"), "v15 terminal baseline must remain complete");
  for (const domain of ["Arquitetura","Mobile","Acessibilidade","Performance","Segurança","PWA","Contratos","Documentação","Projetos-filhos"]) {
    assert.ok(audit.includes(domain), `v20 final audit must cover ${domain}`);
  }
  assert.ok(/needs:\s*(?:quality|\n\s*-\s*quality)/.test(workflow), "v20 deploy must still depend on quality");
  assert.ok(!pro.includes("fetch(") && !operational.includes("fetch("), "v20 local PRO/presentation layers must remain network-free");
  pass("v20 terminal regression, architecture, audit and deployment contracts");
}

function testV20MobileScrollHotfix() {
  const css = read("css/workspace-v24.css")+read("css/pro-v11.css");
  const pro = read("js/pro-v11.js");
  assert.ok(css.includes(".screen-mode main>[data-screen]:not(.is-screen-active){display:none!important}"), "v24 mobile navigation must switch primary screens without relying on target-only CSS");
  assert.ok(css.includes(".command-results{max-height:none;overflow:visible}"), "mobile command results must not create nested scrolling");
  assert.ok(pro.includes(".slice(0,7)"), "command palette must keep the visible result list bounded");
  pass("v20 mobile single-view navigation and nested-scroll hotfix");
}

function testV20UxEnhancement() {
  const html=read("index.html"),app=read("js/app.js"),operational=read("js/operational-v13.js");
  assert.ok(html.includes("Opções da Central")&&(html.includes("Evolução dos projetos")||html.includes("Situação dos concursos")),"v20+ UX must clarify options and project evolution");
  assert.ok(app.includes('="America/Sao_Paulo"')&&html.includes("HORÁRIO DE BRASÍLIA"),"Central time must remain anchored to Brasília");
  assert.ok(operational.includes("currentUnit")&&operational.includes("nextAction"),"project evolution must use published contract state");
  assert.ok(!operational.includes("percentage"),"project evolution must not invent percentages");
  pass("v20 UX Brasília clock, clearer interface and trustworthy project evolution");
}

function testV20UxPolish() {
  const html=read("index.html"),app=read("js/app.js"),operational=read("js/operational-v13.js"),css=read("css/pro-v11.css");
  assert.ok(html.includes('id="quick-options"')&&html.includes(">Opções<"),"v20 polish must expose quick options");
  assert.ok(app.includes("setInterval(e,6e4)")&&app.includes('weekday:"long"'),"Brasília clock must include a full date and refresh");
  assert.ok(operational.includes("acompanhados"),"evolution summary must expose followed project count");
  assert.ok(read("css/workspace-v24.css").includes("repeat(6,minmax(0,1fr))"),"v24 main navigation must use six screen columns");
  pass("v20 quick options, live Brasília date/time and evolution polish");
}

function testV20MobileHomeSimplification() {
  const html=read("index.html"),css=read("css/pro-v11.css");
  assert.ok(html.includes(">Acessos<")&&html.includes(">Histórico<"),"v20 mobile UX must use clearer navigation labels");
  assert.ok((html.includes("COMO ENTRAR")||html.includes(">MENTOR<"))&&html.includes("Acessos rápidos"),"v20+ UX must preserve clear routing and project language");
  assert.ok(html.includes('id="pro-now-focus-name"')&&html.includes('id="pro-now-resume-name"')&&html.includes('id="resume-button"'),"the Agora view must hold the single focus and last-project actions");
  const pro=read("js/pro-v11.js");
  assert.ok(pro.includes("Prioridade escolhida por você na Central")&&pro.includes("não representa estudo ou progresso")&&pro.includes("resume-button"),"Retomada must bind the chosen focus and local last access separately");
  assert.ok(!html.includes('class="hero"')&&!html.includes('class="section resume-card"'),"duplicate full focus/resume sections must be removed at every viewport");
  const activityStart=html.indexOf('id="activity-panel"'),clearHistory=html.indexOf('id="clear-history"'),activityEnd=html.indexOf("</section>",activityStart);
  assert.ok(clearHistory>activityStart&&clearHistory<activityEnd,"clear-history must remain inside the history view");
  assert.ok(!html.includes('id="last-project-text"'),"retomada must not use a separate duplicate panel");
  assert.ok(!css.includes("main>.hero,main>.resume-card{display:none}"),"mobile CSS must not hide duplicate focus/resume sections that no longer exist");
  pass("v20 consolidated focus/resume home and clearer navigation");
}

function testV20EvolutionRefreshAll() {
  const html=read("index.html"),operational=read("js/operational-v13.js");
  assert.ok(html.indexOf('id="operational-panel"')<html.indexOf('id="routing-panel"'),"evolution must appear before routing");
  assert.ok(html.includes('id="operational-title">Evolução dos projetos')||html.includes('id="operational-title">Situação dos concursos'),"operational heading must remain clear");
  assert.ok(!operational.includes('panel.querySelector("h2").textContent')&&!operational.includes("Ações e alertas publicados pelos projetos"),"inbox setup must not replace the evolution heading or its contract-based description");
  assert.ok(html.includes('id="refresh-all-contracts"'),"evolution must expose refresh all");
  assert.ok(operational.includes("central:contract-refresh")&&operational.includes("forEach"),"refresh all must reuse read-only contract refresh events");
  pass("v20 evolution heading and read-only refresh all");
}

function testV21PresenceRuntime() {
  const {context}=loadAppForTests(),nodes={greeting:{},"brasilia-time":{},"brasilia-date":{},"daily-motivation":{}};
  context.document.getElementById=id=>nodes[id]||null;
  let instant=Date.parse("2026-09-27T03:15:00Z");
  class FixedDate extends Date { constructor(...args){super(...(args.length?args:[instant]))} }
  context.Date=FixedDate;
  vm.runInContext("renderPresence()",context);
  assert.equal(nodes["brasilia-time"].textContent,"00:15","clock must use Brasília time rather than device timezone");
  assert.equal(nodes.greeting.textContent,"Bom dia, Rodrigo.","greeting must follow Brasília hour");
  const expectedDate=new Intl.DateTimeFormat("pt-BR",{timeZone:"America/Sao_Paulo",weekday:"long",day:"numeric",month:"long"}).format(new Date(instant));
  assert.equal(nodes["brasilia-date"].textContent,expectedDate[0].toUpperCase()+expectedDate.slice(1),"calendar date must use Brasília and Portuguese");
  const first=nodes["daily-motivation"].textContent;
  vm.runInContext("renderPresence()",context);
  assert.equal(nodes["daily-motivation"].textContent,first,"motivation must remain stable during the Brasília day");
  instant+=86400000;vm.runInContext("renderPresence()",context);
  assert.notEqual(nodes["daily-motivation"].textContent,first,"motivation must advance with the Brasília calendar day");
  pass("v21 Brasília clock and date-based motivation runtime behavior");
}

function testV21PresenceExperience() {
  const html=read("index.html"),app=read("js/app.js"),css=read("css/pro-v11.css"),roadmap=read("docs/ROADMAP-V21.md"),acceptance=read("docs/ACCEPTANCE-V21.md");
  assert.ok(html.indexOf('id="daily-motivation"')<html.indexOf('<nav class="pro-nav"'),"motivation must appear at the start of the page");
  assert.ok(html.includes('<time id="brasilia-time"')&&html.includes('id="brasilia-date"')&&html.includes("HORÁRIO DE BRASÍLIA"),"v21 must expose an accessible Brasília clock and date");
  assert.ok(app.includes('="America/Sao_Paulo"')&&app.includes('day:"numeric"')&&app.includes("l%c.length")&&app.includes("America/Sao_Paulo"),"daily motivation and clock must use the Brasília calendar date");
  assert.ok(app.includes("setInterval(e,6e4)")&&app.includes("visibilitychange"),"clock must refresh by minute and when the tab resumes");
  const presence=app.slice(app.indexOf("function renderPresence"),app.indexOf("function readHealthCache"));
  assert.ok(presence&&!presence.includes("fetch("),"v21 presence UI must not add a remote dependency");
  assert.ok(css.includes(".presence-v21")&&css.includes(".presence-clock")&&css.includes("font-variant-numeric:tabular-nums")&&css.includes("@media(max-width:719px)"),"v21 welcome and clock must have responsive styling");
  assert.ok(roadmap.includes("21.0.0")&&acceptance.includes("Experiência inicial"),"v21 governance and acceptance must be explicit");
  pass("v21 welcome, daily motivation and Brasília clock");
}

function testV22CommandCenter() {
  const html=read("index.html"),css=read("css/pro-v11.css"),app=read("js/app.js"),operational=read("js/operational-v13.js");
  for(const id of ["pro-now-focus-name","pro-now-focus-description","pro-now-focus-meta","pro-now-focus-note","pro-now-focus-health","pro-now-focus-operational","pro-now-focus-link","focus-new-tab","pro-now-resume-name","pro-now-resume-meta","resume-button","pro-now-project-count","pro-now-project-meta","brasilia-time","brasilia-date"])assert.ok(html.includes(`id="${id}"`),`v22 must preserve ${id}`);
  assert.ok((html.includes("CENTRO DE COMANDO")||html.includes("PLANO DE HOJE"))&&html.includes("Abrir foco agora")&&html.includes("Trocar foco"),"v22+ command actions missing");
  assert.ok(css.includes(".command-center")&&css.includes(".command-metrics")&&css.includes(".command-resume")&&css.includes("#5eead4")&&css.includes("#a78bfa"),"v22 visual system missing");
  assert.ok(app.includes('="America/Sao_Paulo"')&&operational.includes("HOJE ·")&&operational.includes("currentUnit"),"v22 must reuse trusted state");
  pass("v22 command center and trusted-state reuse");
}

function testV23TodayMentor() {
  const html=read("index.html"),pro=read("js/pro-v11.js"),operational=read("js/operational-v13.js"),sw=read("sw.js");
  assert.ok(html.includes(">Hoje<")&&html.includes("PLANO DE HOJE")&&html.includes("HOJE · V24"),"v24 must preserve Hoje in the command center");
  assert.ok(html.includes("RADAR OPERACIONAL")&&html.includes("Situação dos concursos"),"v23 radar must be visible");
  assert.ok(html.includes(">MENTOR<")&&html.includes("Mentor de execução"),"v23 mentor must be visible");
  assert.ok(html.includes('href="#routing-panel">Mentor</a>')&&html.includes('href="#activity-panel">Histórico</a>'),"v23 home shortcuts must expose mentor and history");
  assert.ok(pro.includes("Ir para Hoje")&&pro.includes("Ir para Mentor"),"v23 command palette must expose Hoje and Mentor");
  assert.ok(operational.includes("HOJE · Sem próxima ação publicada pelo foco")&&operational.includes("HOJE · ${o}"),"v23 must distinguish missing vs published action");
  assert.ok(operational.includes("A Central não troca sua prioridade sozinha"),"v23 mentor must preserve human-selected focus");
  assert.ok(read("CHANGELOG.md").includes("## [23.0.0]"),"v23 behavior must remain documented as history");
  pass("v23 Hoje, Radar and Mentor contracts");
}


function testV24ScreensAndViews(registry) {
  const html=read("index.html"),router=read("js/workspace-v24.js"),pro=read("js/pro-v11.js"),operational=read("js/operational-v13.js"),css=read("css/workspace-v24.css"),sw=read("sw.js");
  const screens=[["agora","today"],["retomada","resume"],["projetos","projects"],["inbox","inbox"],["activity-panel","history"],["evolucao","evolution"]];
  for(const [id,key] of screens){assert.ok(html.includes(`href="#${id}"`)&&html.includes(`id="${id}"`)&&router.includes(`${key}:"${id}"`),`v24 direct screen route missing: ${id}`)}
  const mainStart=html.indexOf('<main id="conteudo">'),mainEnd=html.indexOf("</main>",mainStart);
  assert.ok(mainStart>=0&&mainEnd>mainStart,"v24 main landmark must remain present");
  const mainMarkup=html.slice(mainStart,mainEnd),sectionParents=new Map(),sectionStack=[];
  for(const match of mainMarkup.matchAll(/<\/?section\b[^>]*>/g)){
    const tag=match[0];
    if(tag.startsWith("</")){assert.ok(sectionStack.length,"section markup must be balanced");sectionStack.pop();continue}
    const id=tag.match(/\bid="([^"]+)"/)?.[1];
    if(id)sectionParents.set(id,sectionStack.at(-1)||"main");
    sectionStack.push(id||"(anonymous)");
  }
  assert.equal(sectionStack.length,0,"section markup must be balanced");
  for(const id of ["agora","retomada","projetos","workspace","inbox","activity-panel","evolucao"])assert.equal(sectionParents.get(id),"main",`v24 screen ${id} must be a direct main section`);
  assert.equal(sectionParents.get("diagnostico"),"evolucao","v24 diagnostic must remain inside Evolution");
  assert.ok(html.includes('id="inbox-list"')&&html.includes('id="inbox-toolbar"')&&html.includes('id="operational-list"'),"v24 Inbox and Radar need separate containers");
  assert.ok(operational.includes('s("inbox-list")')&&operational.includes('s("operational-list")')&&operational.includes("inbox-list")&&operational.includes("operational-panel"),"Radar and Inbox must render independently from validated state");
  assert.ok(html.includes('id="resume-focus-name"')&&html.includes('id="pro-now-resume-name"')&&pro.includes("não representa estudo ou progresso"),"Retomada must separate human focus and local access");
  assert.ok(pro.includes('"today","resume","projects","inbox","history","evolution"')&&pro.includes("screen:ue()")&&pro.includes('screen||"today"')&&pro.includes("saved-view-list")&&pro.includes("saved-view-row")&&pro.includes("Excluir"),"saved views must retain screen state and have visible open/delete controls");
  assert.ok(router.includes("central-estudos:screen-v24")&&router.includes("hashchange")&&router.includes("screen-mode"),"screen routing must persist locally and follow direct hashes");
  assert.ok(css.includes("repeat(6,minmax(0,1fr))")&&css.includes("@media(max-width:719px)"),"six-screen nav must remain mobile-aware");
  assert.ok(!router.includes("fetch(")&&!operational.includes("fetch("),"v24 presentation must not add requests");
  assert.ok(sw.includes("central-shell-v24.0.0")&&sw.includes("./js/workspace-v24.js")&&sw.includes("./css/workspace-v24.css"),"v24 app shell must cache the new screen layer");
  assert.ok(registry.central.version==="24.0.0","registry must identify v24");
  pass("v24 six screens, separate Inbox/Radar and backward-compatible views");
}

function testReleaseDocumentationCoherence(registry) {
  const readme = read("README.md");
  const architecture = read("docs/ARCHITECTURE.md");
  const checkpoint15 = read("docs/V15-CHECKPOINT.md");
  const checkpoint20 = read("docs/V20-CHECKPOINT.md");
  const roadmap20 = read("docs/ROADMAP-V20.md");
  const changelog = read("CHANGELOG.md");
  const sw = read("sw.js");
  const roadmap21 = read("docs/ROADMAP-V21.md");
  const checkpoint21 = read("docs/V21-CHECKPOINT.md");
  const audit21 = read("docs/FINAL-AUDIT-V21.md");
  const roadmap22 = read("docs/ROADMAP-V22.md");
  const checkpoint22 = read("docs/V22-CHECKPOINT.md");
  const acceptance22 = read("docs/ACCEPTANCE-V22.md");
  const audit22 = read("docs/FINAL-AUDIT-V22.md");
  const roadmap23 = read("docs/ROADMAP-V23.md");
  const checkpoint23 = read("docs/V23-CHECKPOINT.md");
  const acceptance23 = read("docs/ACCEPTANCE-V23.md");
  const audit23 = read("docs/FINAL-AUDIT-V23.md");

  const version = registry.central.version;
  const major = Number(version.split(".")[0]);
  assert.ok(readme.includes(`## Estado atual — v${version.split(".").slice(0,2).join(".")}`), "README current-state version must match registry");
  assert.ok(architecture.includes("## Workspace de concursos — v15"), "architecture must preserve the v15 workspace baseline");
  assert.ok(architecture.includes("schemaVersion: 3"), "architecture must document registry schema v3");
  assert.ok(checkpoint15.includes("Status:** COMPLETE — v15.0.0"), "v15 checkpoint must remain terminal");
  assert.ok(changelog.includes("## [15.0.0]"), "changelog must preserve v15 release");

  if (major >= 16) {
    assert.ok(roadmap20.includes("## v16 — Command Palette"), "v20 roadmap must document v16");
    assert.ok(roadmap20.includes("<= 128 KiB"), "v20 roadmap must document the v16+ shell budget");
    assert.ok(architecture.includes("## Command Palette — v16"), "architecture must document v16 command palette");
    assert.ok(checkpoint20.includes("16.0.0"), "v20 checkpoint must track v16");
    assert.ok(changelog.includes("## [16.0.0]"), "changelog must include v16 release");
    assert.ok(sw.includes(`central-shell-v${version}`), "service worker cache must match registry release");
  }

  if (major >= 17) {
    assert.ok(roadmap20.includes("## v17 — Inbox operacional"), "v20 roadmap must document v17");
    assert.ok(architecture.includes("## Inbox operacional — v17"), "architecture must document v17 inbox");
    assert.ok(checkpoint20.includes("17.0.0"), "v20 checkpoint must track v17");
    assert.ok(changelog.includes("## [17.0.0]"), "changelog must include v17 release");
  }

  if (major >= 18) {
    assert.ok(roadmap20.includes("## v18 — Proveniência e frescor"), "v20 roadmap must document v18");
    assert.ok(architecture.includes("## Proveniência e frescor — v18"), "architecture must document v18");
    assert.ok(checkpoint20.includes("18.0.0"), "v20 checkpoint must track v18");
    assert.ok(changelog.includes("## [18.0.0]"), "changelog must include v18 release");
  }

  if (major >= 19) {
    assert.ok(roadmap20.includes("## v19 — Views locais"), "v20 roadmap must document v19");
    assert.ok(architecture.includes("## Views locais — v19"), "architecture must document v19");
    assert.ok(checkpoint20.includes("19.0.0"), "v20 checkpoint must track v19");
    assert.ok(changelog.includes("## [19.0.0]"), "changelog must include v19 release");
  }

  if (major >= 20) {
    assert.ok(roadmap20.includes("## v20 — Workspace PRO estável"), "v20 roadmap must document terminal v20");
    assert.ok(architecture.includes("## Workspace PRO estável — v20"), "architecture must document terminal v20");
    assert.ok(checkpoint20.includes("20.0.0"), "v20 checkpoint must track terminal v20");
    assert.ok(changelog.includes("## [20.0.0]"), "changelog must include terminal v20 release");
    assert.ok(exists("docs/FINAL-AUDIT-V20.md"), "v20 final audit document must exist");
  }
  if (major >= 21) {
    assert.ok(roadmap21.includes("21.0.0")&&checkpoint21.includes("Stage:** COMPLETE"),"v21 historical release must remain closed");
    assert.ok(roadmap21.includes("Stage:** COMPLETE")&&checkpoint21.includes("Stage:** COMPLETE"),"v21 roadmap and checkpoint must be closed");
    assert.ok(audit21.includes("418231a98699a52b07bdce6d94d6d00a3c1e01bd")&&audit21.includes("36346724227"),"v21 audit must bind the release commit and workflow");
    assert.ok(audit21.includes("não executado")&&audit21.includes("mobile"),"v21 audit must disclose mobile visual inspection status");
    assert.ok(architecture.includes("## Presença e Ritmo — v21"),"architecture must describe the v21 experience");
    assert.ok(changelog.includes("## [21.0.0]"),"changelog must include v21 release");
    assert.ok(exists("docs/FINAL-AUDIT-V21.md"),"v21 final audit must exist");
    if(major===21)assert.ok(sw.includes("central-shell-v21.0.0"),"service worker cache must match v21 release");
  }

  if (major >= 22) {
    assert.ok(roadmap22.includes("22.0.0"),"v22 historical release must remain documented");
    assert.ok(roadmap22.includes("Stage:** COMPLETE")&&checkpoint22.includes("Stage:** COMPLETE")&&acceptance22.includes("Centro de Comando"),"v22 governance must be closed");
    assert.ok(audit22.includes("d767b82e395f704db9958521a8e8872229120dfb")&&audit22.includes("36349217897")&&audit22.includes("10940509659"),"v22 audit must bind release, workflow and artifact");
    assert.ok(exists("docs/FINAL-AUDIT-V22.md"),"v22 final audit must exist");
    assert.ok(architecture.includes("## Centro de Comando — v22")&&changelog.includes("## [22.0.0]"),"v22 docs missing");
    if(major===22)assert.ok(sw.includes("central-shell-v22.0.0"),"service worker must match v22");
  }

  if (major >= 23) {
    assert.ok(roadmap23.includes("Stage:** COMPLETE")&&checkpoint23.includes("Stage:** COMPLETE")&&acceptance23.includes("Hoje + Radar + Mentor"),"v23 governance must be closed");
    assert.ok(audit23.includes("4dcc9d5320ea590418069aefe409790e1c0e5a88")&&audit23.includes("36350011045")&&audit23.includes("10941832458"),"v23 audit must bind release, workflow and artifact");
    assert.ok(exists("docs/FINAL-AUDIT-V23.md"),"v23 final audit must exist");
    assert.ok(architecture.includes("## Hoje + Radar + Mentor — v23")&&changelog.includes("## [23.0.0]"),"v23 docs must be coherent");
    if(major===23)assert.ok(sw.includes("central-shell-v23.0.0"),"service worker must match v23");
  }

  if (major >= 24) {
    const roadmap24=read("docs/ROADMAP-V24.md"),checkpoint24=read("docs/V24-CHECKPOINT.md"),acceptance24=read("docs/ACCEPTANCE-V24.md"),risks24=read("docs/RISK-REGISTER-V24.md");
    assert.ok(roadmap24.includes("seis telas")&&checkpoint24.includes("24.0.0")&&acceptance24.includes("Inbox")&&risks24.includes("128 KiB"),"v24 governance must define scope, checkpoint, acceptance and payload risk");
    assert.ok(architecture.includes("## Seis telas de trabalho — v24")&&changelog.includes("## [24.0.0]"),"v24 architecture and changelog must match release");
  }

  pass("release documentation coherence");
}

function testSecurityAndContracts(registry) {
  const frontendFiles = [
    "index.html",
    "sw.js",
    "manifest.webmanifest",
    "config/projects.json",
    "js/app.js",
    "js/catalog-v4.js",
    "js/personalization-v5.js",
    "js/pwa-v6.js",
    "js/timeline-v8.js",
    "js/pro-v11.js",
    "js/contracts-v12.js",
    "css/app.css",
    "css/catalog-v4.css",
    "css/personalization-v5.css",
    "css/timeline-v8.css",
    "css/pro-v11.css",
    "js/operational-v13.js",
    "js/workspace-v24.js",
    "css/operational-v13.css",
    "css/workspace-v24.css"
  ];

  const combined = frontendFiles.map(read).join("\n");
  const secretPattern = /(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9]{20,}|api[_-]?key\s*[:=]\s*["'][^"']{12,})/i;
  assert.ok(!secretPattern.test(combined), "frontend must not contain obvious secrets/tokens");

  const pwa = read("js/pwa-v6.js");
  assert.ok(!pwa.includes("beforeinstallprompt"), "PWA installation must remain optional/browser-led");
  assert.ok(pwa.includes("pwa-update-notice"), "PWA update notice must be isolated");
  assert.ok(pwa.includes("controllerchange")&&pwa.includes('type:"SKIP_WAITING"')&&pwa.includes("!r||t"), "PWA update reload must be explicitly gated");

  const index = read("index.html");
  for (const project of registry.projects) {
    if (project.url) assert.ok(index.includes(project.url), `direct project link missing: ${project.id}`);
  }

  pass("security scan and critical frontend contracts");
}

const syntaxFiles = [
  "js/app.js",
  "js/catalog-v4.js",
  "js/personalization-v5.js",
  "js/pwa-v6.js",
  "js/timeline-v8.js",
  "js/pro-v11.js",
  "js/contracts-v12.js",
  "js/operational-v13.js",
  "js/workspace-v24.js",
  "sw.js"
];

for (const file of syntaxFiles) checkSyntax(file);

const registry = JSON.parse(read("config/projects.json"));
const manifest = JSON.parse(read("manifest.webmanifest"));
const html = read("index.html");

testRegistry(registry, html);
testInternalReferences(html);
testManifest(manifest);
testServiceWorker(registry);
testCriticalAppLogic(registry);
testTimelineContract(registry);
testV9Hardening(registry);
testV11Pro(registry);
testV12Contracts(registry);
testV13OperationalState(registry);
testV14ExplainableRouting(registry);
testV15Workspace(registry);
testV16CommandPalette(registry);
testV17OperationalInbox(registry);
testV18ProvenanceFreshness(registry);
testV19LocalViews(registry);
testV20TerminalAudit(registry);
testV20MobileScrollHotfix();
testV20UxEnhancement();
testV20UxPolish();
testV20MobileHomeSimplification();
testV20EvolutionRefreshAll();
testV21PresenceRuntime();
testV21PresenceExperience();
testV22CommandCenter();
testV23TodayMentor();
testV24ScreensAndViews(registry);
testReleaseDocumentationCoherence(registry);
testSecurityAndContracts(registry);

console.log("\nQuality gate PASS");
