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
  assert.equal(registry.schemaVersion, 1, "registry schemaVersion must be 1");
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
    "css/app.css",
    "css/catalog-v4.css",
    "css/personalization-v5.css",
    "css/timeline-v8.css"
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
testSecurityAndContracts(registry);

console.log("\nQuality gate PASS");
