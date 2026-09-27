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
  assert.equal(registry.schemaVersion, 2, "registry schemaVersion must be 2");
  assert.match(registry.central.version, /^\d+\.\d+\.\d+$/, "central version must be semver");
  assert.ok(Array.isArray(registry.projects) && registry.projects.length > 0, "registry must contain projects");

  const ids = registry.projects.map(project => project.id);
  assert.equal(new Set(ids).size, ids.length, "project ids must be unique");
  assert.ok(ids.includes(registry.central.defaultProject), "defaultProject must exist in registry");

  const required = ["id", "name", "description", "phase", "status", "priority", "icon", "url", "repository"];
  for (const project of registry.projects) {
    for (const field of required) {
      assert.equal(typeof project[field], "string", `${project.id || "project"}.${field} must be a string`);
      assert.ok(project[field].trim(), `${project.id || "project"}.${field} must not be empty`);
    }

    assert.equal(new URL(project.url).protocol, "https:", `${project.id}.url must use HTTPS`);
    assert.equal(new URL(project.repository).protocol, "https:", `${project.id}.repository must use HTTPS`);
    if (project.statusUrl) {
      assert.equal(new URL(project.statusUrl).protocol, "https:", `${project.id}.statusUrl must use HTTPS`);
      assert.ok(project.statusUrl.endsWith("/central-status.json"), `${project.id}.statusUrl must target central-status.json`);
    }
    assert.ok(html.includes(project.url), `static HTML fallback must include ${project.id} URL`);
  }

  pass("registry schema, ids, HTTPS and static fallback");
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
    assert.ok(!sw.includes(project.url), `service worker must not cache project URL: ${project.id}`);
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
  assert.throws(() => context.validateConfig(missingDefault), /Projeto padrão não existe/i, "missing defaultProject must fail");

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
  assert.ok(timeline.includes("MAX_ACCESS_HISTORY = 12"), "v8 local history must be bounded");
  assert.ok(timeline.includes("central:project-opened"), "v8 must distinguish local access events");
  assert.ok(timeline.includes("central:technical-state"), "v8 must consume technical state separately");
  assert.ok(timeline.includes("não determina a causa"), "v8 diagnosis must avoid unsupported causes");
  assert.ok(timeline.includes("Não mede estudo, duração, progresso ou desempenho"), "v8 local access must not be framed as study");
  assert.ok(!timeline.includes("fetch("), "v8 timeline must reuse existing observability instead of creating extra network calls");

  for (const project of registry.projects) {
    assert.ok(html.includes(`data-project-id="${project.id}"`), `v8 timeline needs registry-backed card id: ${project.id}`);
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

  assert.ok(app.includes("HEALTH_CACHE_TTL_MS = 2 * 60 * 1000"), "health checks must use a short cache");
  assert.ok(app.includes("/actions/workflows/deploy-pages.yml/runs?branch=main&per_page=1"), "deploy lookup must prefer the targeted one-run endpoint");
  assert.ok(!app.includes("per_page=100"), "deploy lookup must not download 100 workflow runs");
  assert.ok(app.includes("escapeHtml(project.name)") && app.includes("escapeHtml(project.url)"), "registry content must be escaped before card innerHTML");
  assert.ok(personalization.includes("escapeHtml(item.name)"), "personalization content must be escaped before innerHTML");
  assert.ok(timeline.includes('healthMetaState === "cached"') && timeline.includes("não confirma o estado neste instante"), "cached health must not be described as current");

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
    "css/app.css",
    "css/catalog-v4.css",
    "css/personalization-v5.css",
    "css/timeline-v8.css",
    "css/pro-v11.css"
  ];
  const payloadBytes = payloadFiles.reduce((total, file) => total + fs.statSync(path.join(ROOT, file)).size, 0);
  assert.ok(payloadBytes <= 120 * 1024, `first-party shell source budget exceeded: ${payloadBytes} bytes`);

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

  for (const project of registry.projects) {
    assert.equal(typeof project.statusUrl, "string", `${project.id} must publish statusUrl in v12`);
    assert.equal(new URL(project.statusUrl).protocol, "https:", `${project.id}.statusUrl must use HTTPS`);
  }

  assert.ok(contracts.includes('CACHE_TTL_MS = 5 * 60 * 1000'), "v12 contracts must use short cache");
  assert.ok(contracts.includes("TIMEOUT_MS = 3500"), "v12 contracts must use timeout");
  assert.ok(contracts.includes('method: "GET"'), "v12 contract transport must be read-only GET");
  assert.ok(!contracts.includes('method: "POST"') && !contracts.includes('method: "PUT"') && !contracts.includes('method: "PATCH"') && !contracts.includes('method: "DELETE"'), "v12 consumer must never write");
  assert.ok(contracts.includes("validateContract"), "v12 must validate contract before use");
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
    assert.ok(!sw.includes(project.statusUrl), `service worker must not cache child contract: ${project.id}`);
  }

  pass("v12 optional read-only contract, cache and graceful-degradation contracts");
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
    "css/pro-v11.css"
  ];

  const combined = frontendFiles.map(read).join("\n");
  const secretPattern = /(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk-[A-Za-z0-9]{20,}|api[_-]?key\s*[:=]\s*["'][^"']{12,})/i;
  assert.ok(!secretPattern.test(combined), "frontend must not contain obvious secrets/tokens");

  const pwa = read("js/pwa-v6.js");
  assert.ok(!pwa.includes("beforeinstallprompt"), "PWA installation must remain optional/browser-led");
  assert.ok(pwa.includes("pwa-update-notice"), "PWA update notice must be isolated");
  assert.ok(pwa.includes("reloadOnControllerChange"), "PWA update reload must be explicitly gated");

  const index = read("index.html");
  for (const project of registry.projects) {
    assert.ok(index.includes(project.url), `direct project link missing: ${project.id}`);
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
testSecurityAndContracts(registry);

console.log("\nQuality gate PASS");
