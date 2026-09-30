import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
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
  assert.equal(registry.central.journeyUrl, "https://rodrigorosadantas.github.io/plano-de-transicao/", "registry must publish the direct Jornada link");
  assert.ok(Array.isArray(registry.projects) && registry.projects.length > 0, "registry must contain projects");

  const ids = registry.projects.map(project => project.id);
  assert.equal(new Set(ids).size, ids.length, "project ids must be unique");
  const defaultProject = registry.projects.find(project => project.id === registry.central.defaultProject);
  assert.equal(defaultProject?.status, "active", "defaultProject must exist and be active");
  const activeCodes = Object.fromEntries(registry.projects.filter(project => project.status === "active").map(project => [project.id, project.code]));
  assert.deepEqual(activeCodes, { seedf: "P1", tjdft: "P2", "prf-adm": "P3" }, "active registry order and P1–P3 mapping must remain explicit");
  assert.deepEqual(Object.keys(activeCodes), ["seedf", "tjdft", "prf-adm"], "registry cards must follow active P1–P3 order");
  assert.deepEqual(registry.projects.filter(project => project.status === "active").map(project => project.studyPriority), [1, 2, 3], "studyPriority must preserve the explicit P1–P3 ranking");
  assert.ok(html.includes('id="journey-link"') && html.includes("Painel Estratégico"), "Central must expose a direct Jornada link");
  for (const code of ["P1", "P2", "P3"]) assert.ok(html.includes(`<span class="project-code">${code}</span>`), `static project fallback must include ${code}`);

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
      if (project.destinationType === "notion") {
        assert.equal(project.repository, undefined, `${project.id} Notion project must not claim a GitHub repository`);
      } else {
        assert.equal(new URL(project.repository).protocol, "https:", `${project.id}.repository must use HTTPS`);
      }
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
  assert.ok(manifest.description.includes("PRF Administrativo") && manifest.description.includes("Plataforma de Questões"), "installed Central description must include the PRF project and question tool");
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
  assert.ok(read("index.html").includes('src="./js/catalog-v4.js?v=28.2.0"'), "the catalog migration script must be cache-busted for existing browsers");

  for (const entry of shell) {
    const relative = entry === "./" ? "index.html" : entry.replace(/^\.\//, "").split("?")[0];
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

  const duplicateCode = clone(registry);
  duplicateCode.projects.find(project => project.id === "prf-adm").code = "P1";
  assert.throws(() => context.validateConfig(duplicateCode), /Código de projeto duplicado/i, "duplicate active P codes must fail");
  const invalidCode = clone(registry);
  invalidCode.projects.find(project => project.id === "prf-adm").code = "P0";
  assert.throws(() => context.validateConfig(invalidCode), /Código de prioridade inválido/i, "invalid active priorities must fail");

  const duplicate = clone(registry);
  duplicate.projects.push({ ...duplicate.projects[0] });
  assert.throws(() => context.validateConfig(duplicate), /duplicado/i, "duplicate project ids must fail");

  const insecure = clone(registry);
  insecure.projects[0].url = insecure.projects[0].url.replace("https://", "http://");
  assert.throws(() => context.validateConfig(insecure), /não segura/i, "HTTP project URL must fail");

  const invalidId = clone(registry);
  invalidId.projects[0].id = 'bad id"><script>';
  assert.throws(() => context.validateConfig(invalidId), /ID de projeto inválido/i, "unsafe project ids must fail");

  const prf = valid.projects.find(project => project.id === "prf-adm");
  assert.ok(prf, "PRF Administrative must be registered as a project");
  assert.equal(prf.destinationType, "site", "PRF must be typed as a GitHub Pages site");
  assert.equal(prf.repository, "https://github.com/RodrigoRosaDantas/prf-administrativo-dashboard", "PRF must use its own repository");
  assert.equal(prf.notionUrl, "https://app.notion.com/p/3e8cf5a2673181679cd2f5532e0abf60", "PRF must preserve its Notion source link");
  const normalizedPrf = context.normalizeProject(prf);
  assert.equal(normalizedPrf.destinationType, "site", "normalization must retain the site destination type");
  assert.equal(normalizedPrf.repository, prf.repository, "normalization must retain the matching repository");

  const invalidDestination = clone(registry);
  invalidDestination.projects.find(project => project.id === "prf-adm").destinationType = "iframe";
  assert.throws(() => context.validateConfig(invalidDestination), /Tipo de destino inválido/i, "unknown destination type must fail");

  const invalidNotionHost = clone(registry);
  invalidNotionHost.projects.find(project => project.id === "prf-adm").notionUrl = "https://notion.so/3e8cf5a2673181679cd2f5532e0abf60";
  assert.throws(() => context.validateConfig(invalidNotionHost), /URL de Notion inválida/i, "Notion project must use the official app.notion.com host");

  const notionWithRepo = clone(registry);
  const notionProject = notionWithRepo.projects.find(project => project.id === "prf-adm");
  notionProject.destinationType = "notion";
  notionProject.url = notionProject.notionUrl;
  assert.throws(() => context.validateConfig(notionWithRepo), /não deve declarar repositório/i, "Notion project must not claim another project's repository");

  const siteWithoutRepo = clone(registry);
  delete siteWithoutRepo.projects.find(project => project.id === "prf-adm").repository;
  assert.throws(() => context.validateConfig(siteWithoutRepo), /precisa de URL e repositório/i, "GitHub site project still requires its own repository");

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

  localStorage.setItem("central-estudos:focus-project", "prf-adm");
  assert.equal(context.chooseFocus(valid.projects, valid.central.defaultProject).id, "prf-adm", "external project must remain selectable as local focus");

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
  const sw = read("sw.js");
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

  const shellMatch = sw.match(/const APP_SHELL = \[([\s\S]*?)\];/);
  assert.ok(shellMatch, "service worker must declare APP_SHELL for payload measurement");
  const payloadFiles = [...shellMatch[1].matchAll(/'([^']+)'/g)]
    .map(match => match[1])
    .map(entry => entry === "./" ? "index.html" : entry.replace(/^\.\//, "").split("?")[0]);
  const uniquePayloadFiles = [...new Set(payloadFiles)];
  for (const file of uniquePayloadFiles) assert.ok(exists(file), `payload budget asset missing: ${file}`);
  const payloadBytes = uniquePayloadFiles.reduce((total, file) => total + fs.statSync(path.join(ROOT, file)).size, 0);
  const gzipBytes = uniquePayloadFiles.reduce((total, file) => total + zlib.gzipSync(fs.readFileSync(path.join(ROOT, file)), { level: 9 }).length, 0);
  // v28 adds a dedicated offline Mentor workspace; the larger ceiling was explicitly authorized on 2026-09-29.
  assert.ok(payloadBytes <= 256 * 1024, `complete app shell raw budget exceeded: ${payloadBytes} bytes`);
  assert.ok(gzipBytes <= 80 * 1024, `complete app shell gzip budget exceeded: ${gzipBytes} bytes`);

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
    if (project.destinationType === "notion") {
      assert.equal(project.statusUrl, undefined, `${project.id} Notion project must remain outside status contracts`);
      continue;
    }
    if (project.statusUrl) assert.equal(new URL(project.statusUrl).protocol, "https:", `${project.id}.statusUrl must use HTTPS`);
  }

  const prf = registry.projects.find(project => project.id === "prf-adm");
  assert.equal(prf.statusUrl, "https://rodrigorosadantas.github.io/prf-administrativo-dashboard/central-status.json", "PRF Pages must expose the read-only project status contract after v27.9");

  assert.ok(contracts.includes("3e5"), "v12 contracts must use short cache");
  assert.ok(contracts.includes("3500"), "v12 contracts must use timeout");
  assert.ok(contracts.includes('method:"GET"'), "v12 contract transport must be read-only GET");
  assert.ok(!contracts.includes('method:"POST"') && !contracts.includes('method:"PUT"') && !contracts.includes('method:"PATCH"') && !contracts.includes('method:"DELETE"'), "v12 consumer must never write");
  assert.ok(contracts.includes("contract-not-object"), "v12 must validate contract before use");
  assert.ok(contracts.includes("project-id-mismatch"), "v12 must bind contract to registry project");
  assert.ok(contracts.includes("stale-cache"), "v12 must degrade to stale cache");
  assert.ok(contracts.includes("central:contract-state"), "v12 must publish contract state events");
  assert.ok(contracts.includes("invalid-study")&&contracts.includes("questionsDone")&&contracts.includes("accuracy"), "optional study signals must be validated before presentation");
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

  const summaryStart = operational.indexOf("function D(){");
  const summaryEnd = operational.indexOf("const H=", summaryStart);
  assert.ok(summaryStart >= 0 && summaryEnd > summaryStart, "focus summary renderer must be isolated for a direct regression check");
  const summarySource = operational.slice(summaryStart, summaryEnd);
  const renderPrfSummary = (contract, status = "live") => {
    const node = { dataset: {}, textContent: "", classList: { remove() {} } };
    const context = vm.createContext({
      u: "prf-adm",
      T: () => contract ? { status, contract } : null,
      K: (kind, state) => state === "stale-cache"
        ? ["Último estado", "is-stale", "Último estado conhecido"]
        : kind === "planned"
          ? ["Planejado", "is-planned", "Planejado"]
          : kind === "manual"
            ? ["Publicado", "is-operational", "Ação publicada"]
            : ["Operacional", "is-operational", "Próxima ação"],
      d: node,
      String
    });
    vm.runInContext(summarySource + "D();", context, { filename: "focus-summary-prf" });
    return node;
  };
  const currentPrf = renderPrfSummary({ state: { nextAction: "PRFADM09 — próxima ação publicada", nextActionKind: "operational" } });
  assert.ok(currentPrf.textContent.includes("PRFADM09") && !currentPrf.textContent.includes("PRFADM01"), "PRF focus summary must use the current published nextAction rather than a fixed unit");
  assert.equal(currentPrf.dataset.kind, "operational", "PRF focus summary must preserve the contract action kind");
  assert.equal(currentPrf.dataset.stale, "false", "live PRF contract must not be marked stale");
  const stalePrf = renderPrfSummary({ state: { nextAction: "PRFADM08 — último estado conhecido", nextActionKind: "operational" } }, "stale-cache");
  assert.ok(stalePrf.textContent.includes("Último estado conhecido") && stalePrf.textContent.includes("PRFADM08"), "cached PRF actions must be labeled as the last known state");
  assert.equal(stalePrf.dataset.stale, "true", "stale PRF contract must be marked stale");
  const missingPrf = renderPrfSummary(null, "unavailable");
  assert.ok(missingPrf.textContent.includes("Sem próxima ação publicada pelo foco") && !missingPrf.textContent.includes("PRFADM01"), "missing PRF contract must use a generic fallback and invent no unit");
  assert.equal(missingPrf.dataset.kind, "manual", "missing PRF action must remain a manual project link");


  assert.ok(!/score calculado|ranking calculado|melhor projeto|prioridade calculada/i.test(operational), "v13 must not rank or score projects");
  assert.ok(!/mentor global|mentor central/i.test(operational), "v13 must not implement a global mentor");

  assert.ok(css.includes(".operational-grid"), "v13 operational cards must be styled");
  assert.ok(css.includes("@media(min-width:720px)"), "v13 must support responsive grid");

  const cacheMajor = Number(sw.match(/central-shell-v(\d+)\./)?.[1] || 0);
  assert.ok(cacheMajor >= 13, "service worker cache must preserve v13 or newer");
  assert.ok(!sw.includes("./js/operational-v13.js"), "live operational hydration must remain online-only to keep the authorized offline shell budget");
  assert.ok(!sw.includes("./css/operational-v13.css"), "the hidden live status panel must not consume offline shell budget");

  for (const project of registry.projects) {
    if (project.url) assert.ok(html.includes(project.url), `v13 must preserve direct link for ${project.id}`);
  }

  pass("v13 published operational state, dynamic PRF action summary and no-ranking contracts");
}

function testV14ExplainableRouting(registry) {
  const html = read("index.html");
  const mentor = read("mentor/index.html");
  const routing = read("js/operational-v13.js");
  const routingV14 = routing.split('const LOG_KEY="central-estudos:study-log-v1"')[0];
  const css = read("css/operational-v13.css");
  const sw = read("sw.js");

  assert.ok(!html.includes('id="routing-panel"'), "v28 must remove the legacy Mentor panel from the main Home");
  assert.ok(mentor.includes("Mentor Central")&&mentor.includes('data-mentor-view="agora"')&&mentor.includes('data-mentor-view="projetos"'), "v28 dedicated Mentor page must replace the old inline routing UI");

  assert.ok(routingV14.includes("central-estudos:route-lens-v14"), "v14 selected lens must be local");
  assert.ok(routingV14.includes('B.has(e)?e:"focus"'), "v14 default lens must be focus");
  assert.ok(routingV14.includes("Por que aparece aqui?"), "v14 must explain why an item appears");
  assert.ok(routingV14.includes("A ordem é a do catálogo, sem ranking.")||routingV14.includes("A Central preserva a ordem do catálogo."), "v14+ published lens must explain catalog order");
  assert.ok(routingV14.includes("A ordem é a do catálogo, sem pontuação.")||routingV14.includes("sem pontuação ou ordem automática"), "v14+ alerts lens must explain non-ranked order");
  assert.ok(routingV14.includes(".sort((t,o)=>t.order-o.order)"), "v14 multi-item routing must preserve catalog order");

  assert.ok(routingV14.includes("central:focus-changed"), "v14 focus lens must follow human-selected focus");
  assert.ok(routingV14.includes("central:project-opened"), "v14 resume lens must follow local access");
  assert.ok(routingV14.includes("central:contract-state"), "v14 published/alerts lenses must use validated contracts");
  assert.ok(!routingV14.includes("fetch("), "v14 routing layer must not create network calls");

  assert.ok(!/score|ranking calculado|recomenda[cç][aã]o autom[aá]tica|melhor projeto|prioridade calculada/i.test(routingV14), "v14 must not rank, score or auto-recommend projects");
  assert.ok(routingV14.includes("stale-cache"), "v14 must distinguish stale operational data");
  assert.ok(routingV14.includes("Último estado conhecido"), "v14 stale route must be labeled as last known state");

  assert.ok(css.includes(".routing-lenses"), "v14 lenses must be styled");
  assert.ok(css.includes("@media(pointer:coarse)"), "v14 touch targets must be hardened");

  const cacheMajor = Number(sw.match(/central-shell-v(\d+)\./)?.[1] || 0);
  assert.ok(cacheMajor >= 14, "service worker cache must preserve v14 or newer");
  assert.ok(!sw.includes("./js/operational-v13.js") && !sw.includes("./css/operational-v13.css"), "published-data routing is loaded only when online, while core local study flows stay in the offline shell");

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
  assert.equal(active.length, 3, "current workspace must list three active study projects");
  assert.ok(archived.some(project => project.id === "tcego"), "TCE-GO must remain in the archived workspace");
  assert.ok(!active.some(project => project.id === "plataforma-questoes"), "study tool must not be counted as a contest project");
  assert.ok(archived.some(project => project.id === "sedes-tdas"), "v15 must include SEDES as archived history");
  assert.ok(archived.some(project => project.id === "tcego") && html.includes("TCE-GO · Histórico") && html.includes("tce-go-dashboard/"), "archived TCE-GO must retain a no-JavaScript history link");
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
  assert.ok(app.includes("function monitoredProjects()") && app.includes("monitoredProjects().map(async e=>"), "health/metadata must be restricted to dashboard projects with telemetry");

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
  assert.ok((app.includes("setInterval(e,1e3)")||app.includes("setInterval(e,6e4)"))&&app.includes('weekday:"long"'),"Brasília clock must include a full date and refresh");
  assert.ok(operational.includes("acompanhados"),"evolution summary must expose followed project count");
  assert.ok(read("css/workspace-v24.css").includes("repeat(6,minmax(0,1fr))"),"v24 main navigation must use six screen columns");
  pass("v20 quick options, live Brasília date/time and evolution polish");
}

function testV20MobileHomeSimplification() {
  const html=read("index.html"),css=read("css/pro-v11.css");
  assert.ok(html.includes(">Acessos<")&&html.includes(">Histórico<"),"v20 mobile UX must use clearer navigation labels");
  assert.ok((html.includes("COMO ENTRAR")||html.includes(">MENTOR<"))&&(html.includes("Acessos rápidos")||html.includes("Seus projetos")),"v20+ UX must preserve clear routing and project language");
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
  assert.ok(html.includes('id="operational-panel"')&&html.includes('href="./mentor/">Abrir Mentor →</a>'),"evolution must keep the operational radar and link to the dedicated Mentor page");
  assert.ok(html.includes('id="operational-title">Evolução dos projetos')||html.includes('id="operational-title">Situação dos concursos'),"operational heading must remain clear");
  assert.ok(!operational.includes('panel.querySelector("h2").textContent')&&!operational.includes("Ações e alertas publicados pelos projetos"),"inbox setup must not replace the evolution heading or its contract-based description");
  assert.ok(html.includes('id="refresh-all-contracts"'),"evolution must expose refresh all");
  assert.ok(operational.includes("central:contract-refresh")&&operational.includes("forEach"),"refresh all must reuse read-only contract refresh events");
  pass("v20 evolution heading and read-only refresh all");
}

function testV21PresenceRuntime() {
  const {context}=loadAppForTests(),nodes={greeting:{},"brasilia-time":{},"brasilia-date":{},"daily-motivation":{},"daily-motivation-author":{},"daily-motivation-source":{}};
  context.document.getElementById=id=>nodes[id]||null;
  let instant=Date.parse("2026-09-27T03:15:40Z");
  class FixedDate extends Date { constructor(...args){super(...(args.length?args:[instant]))} }
  context.Date=FixedDate;
  vm.runInContext("renderPresence()",context);
  assert.equal(nodes["brasilia-time"].textContent,"00:15:40","clock must show seconds in Brasília time rather than device timezone");
  assert.equal(nodes.greeting.textContent,"Bom dia, Rodrigo.","greeting must follow Brasília hour");
  const expectedDate=new Intl.DateTimeFormat("pt-BR",{timeZone:"America/Sao_Paulo",weekday:"long",day:"numeric",month:"long"}).format(new Date(instant));
  assert.equal(nodes["brasilia-date"].textContent,expectedDate[0].toUpperCase()+expectedDate.slice(1),"calendar date must use Brasília and Portuguese");
  assert.ok(nodes["daily-motivation-author"].textContent&&nodes["daily-motivation-source"].href.startsWith("https://"),"daily quote must include author and source");
  const first=nodes["daily-motivation"].textContent;
  vm.runInContext("renderPresence()",context);
  assert.equal(nodes["daily-motivation"].textContent,first,"motivation must remain stable within one five-minute window");
  instant=Math.ceil(instant/300000)*300000;vm.runInContext("renderPresence()",context);
  assert.notEqual(nodes["daily-motivation"].textContent,first,"motivation must rotate automatically at the next five-minute boundary");
  pass("Brasília clock and five-minute attributed motivation rotation");
}

function testV272MajorCadarQuotes() {
  const {context}=loadAppForTests(),nodes={greeting:{},"brasilia-time":{},"brasilia-date":{},"daily-motivation":{},"daily-motivation-author":{},"daily-motivation-source":{}};
  context.document.getElementById=id=>nodes[id]||null;
  const start=Date.parse("2026-09-27T03:15:00Z"),rotationMs=300000,texts=new Set();
  const sourceByQuote=new Map([
    ["Seja forte ou seja vencido.","https://www.instagram.com/caveiracadar09/"],
    ["Tudo que eu ensino, eu vivi.","https://projetocaopastor.com.br/curso/programa-de-protecao"],
    ["Planeja como General e executa como soldado.","https://www.youtube.com/watch?v=YIUoDC1PHbE"],
    ["Tudo que eu cobro, eu pratiquei.","https://projetocaopastor.com.br/curso/programa-de-protecao"],
    ["Não negocia com a tua mente.","https://www.youtube.com/watch?v=YIUoDC1PHbE"],
    ["Comemore suas pequenas vitórias.","https://www.youtube.com/watch?v=YIUoDC1PHbE"]
  ]);
  let instant=start;
  class FixedDate extends Date { constructor(...args){super(...(args.length?args:[instant]))} }
  context.Date=FixedDate;
  for(let window=0;window<6;window++){
    instant=start+window*rotationMs;
    vm.runInContext("renderPresence()",context);
    const text=nodes["daily-motivation"].textContent;
    assert.ok(text,"each five-minute window must render a quote");
    assert.equal(nodes["daily-motivation-author"].textContent,"Major Cadar","every displayed phrase must keep Major Cadar attribution");
    assert.equal(nodes["daily-motivation-source"].href,sourceByQuote.get(text),"each phrase must keep its own verified source link");
    texts.add(text);
  }
  assert.equal(texts.size,6,"the six consecutive five-minute windows must cycle through all six Cadar phrases");
  assert.ok(read("js/app.js").includes("const quoteIntervalMs=300000"),"quote rotation must use five-minute windows");
  pass("v27.2.2 Major Cadar five-minute rotation, attribution and exact source links");
}

function testV21PresenceExperience() {
  const html=read("index.html"),app=read("js/app.js"),css=read("css/pro-v11.css"),roadmap=read("docs/ROADMAP-V21.md"),acceptance=read("docs/ACCEPTANCE-V21.md");
  assert.ok(html.indexOf('id="daily-motivation"')<html.indexOf('<nav class="pro-nav"'),"motivation must appear at the start of the page");
  assert.ok(html.includes('<time id="brasilia-time"')&&html.includes('id="brasilia-date"')&&html.includes("HORÁRIO DE BRASÍLIA"),"v21 must expose an accessible Brasília clock and date");
  assert.ok(app.includes('="America/Sao_Paulo"')&&app.includes('day:"numeric"')&&app.includes("quotes.length")&&app.includes("America/Sao_Paulo"),"daily motivation and clock must use the Brasília calendar date");
  assert.ok(app.includes("setInterval(e,1e3)")&&app.includes('second:"2-digit"')&&app.includes("visibilitychange"),"clock must refresh every second and when the tab resumes");
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
  const html=read("index.html"),mentor=read("mentor/index.html"),pro=read("js/pro-v11.js"),operational=read("js/operational-v13.js");
  assert.ok(html.includes(">Hoje<")&&html.includes("PLANO DE HOJE")&&html.includes(`HOJE · V${registry.central.version}`),"later releases must preserve Hoje in the command center");
  assert.ok(html.includes("RADAR OPERACIONAL")&&html.includes("Situação dos concursos"),"operational radar must remain available in the Central");
  assert.ok(html.includes('href="./mentor/"')&&mentor.includes("Mentor Central"),"Mentor must be a dedicated child page linked from the Central");
  assert.ok(html.includes('href="./mentor/">Abrir Mentor</a>')&&html.includes('href="#activity-panel">Histórico</a>'),"home shortcuts must expose the dedicated Mentor and history");
  assert.ok(pro.includes("Ir para Hoje")&&pro.includes('location.href="./mentor/"'),"command palette must open the dedicated Mentor page");
  assert.ok(operational.includes("HOJE · Sem próxima ação publicada pelo foco")&&operational.includes("t.nextAction"),"Today must distinguish missing vs published action");
  assert.ok(read("CHANGELOG.md").includes("## [23.0.0]"),"v23 behavior must remain documented as history");
  pass("v28 preserves Hoje/Radar while moving Mentor to its own page");
}


function testV24ScreensAndViews(registry) {
  const html=read("index.html"),router=read("js/workspace-v24.js"),pro=read("js/pro-v11.js"),operational=read("js/operational-v13.js"),css=read("css/workspace-v24.css"),sw=read("sw.js");
  const screens=[["agora","today"],["retomada","resume"],["projetos","projects"],["inbox","inbox"],["activity-panel","history"],["evolucao","evolution"]];
  for(const [id,key] of screens){assert.ok(html.includes(`id="${id}"`)&&router.includes(`${key}:"${id}"`),`v24 screen route missing: ${id}`);if(id!=="evolucao")assert.ok(html.includes(`href="#${id}"`),`v24 visible screen link missing: ${id}`)}
  assert.ok(html.includes('class="pro-nav-link" href="./mentor/"'),"v28 sixth primary tab must open the dedicated Mentor page");
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
  for(const id of ["agora","agenda-semanal","retomada","projetos","workspace","inbox","activity-panel","evolucao"])assert.equal(sectionParents.get(id),"main",`v24 screen ${id} must be a direct main section`);
  assert.equal(sectionParents.get("diagnostico"),"evolucao","v24 diagnostic must remain inside Evolution");
  assert.ok(html.includes('id="inbox-list"')&&html.includes('id="inbox-toolbar"')&&html.includes('id="operational-list"'),"v24 Inbox and Radar need separate containers");
  assert.ok(operational.includes('s("inbox-list")')&&operational.includes('s("operational-list")')&&operational.includes("inbox-list")&&operational.includes("operational-panel"),"Radar and Inbox must render independently from validated state");
  assert.ok(html.includes('id="resume-focus-name"')&&html.includes('id="pro-now-resume-name"')&&pro.includes("não representa estudo ou progresso"),"Retomada must separate human focus and local access");
  assert.ok(pro.includes('"today","resume","projects","inbox","history","evolution"')&&pro.includes("screen:ue()")&&pro.includes('screen||"today"')&&pro.includes("saved-view-list")&&pro.includes("saved-view-row")&&pro.includes("Excluir"),"saved views must retain screen state and have visible open/delete controls");
  assert.ok(router.includes("central-estudos:screen-v24")&&router.includes("hashchange")&&router.includes("screen-mode"),"screen routing must persist locally and follow direct hashes");
  assert.ok(css.includes("repeat(6,minmax(0,1fr))")&&css.includes("@media(max-width:719px)"),"six-screen nav must remain mobile-aware");
  assert.ok(!router.includes("fetch(")&&!operational.includes("fetch("),"v24 presentation must not add requests");
  assert.ok(sw.includes("./js/workspace-v24.js")&&sw.includes("./css/workspace-v24.css"),"v24 app shell assets must remain present");
  assert.ok(Number(registry.central.version.split(".")[0])>=24,"registry must preserve the v24 release line");
  pass("v24 six screens, separate Inbox/Radar and backward-compatible views");
}

function testV27DailySchedule(registry) {
  const html=read("index.html"),router=read("js/workspace-v24.js"),css=read("css/workspace-v27.css"),quoteCss=read("css/workspace-v26.css"),sw=read("sw.js"),app=read("js/app.js"),operational=read("js/operational-v13.js");
  const start=html.indexOf('<section id="agenda-semanal"'),end=html.indexOf("</section>",start);
  assert.ok(start>=0&&end>start,"weekly schedule must remain a section on the page");
  const schedule=html.slice(start,end);
  assert.equal(registry.central.version,"28.2.0","registry must identify v28.2.0");
  assert.ok(html.includes("HOJE · V"+registry.central.version),"Today panel version badge must match the current release");
  assert.ok(html.includes('id="pro-now-focus-name">SEEDF</strong>')&&html.includes('id="pro-now-focus-link" class="command-primary" href="https://rodrigorosadantas.github.io/seedf-ppge-dashboard/"')&&html.includes('src="./js/operational-v13.js?v=28.2.0"')&&operational.includes('MARK={P1:"seedf",P2:"tjdft",P3:"prf-adm"}')&&!operational.includes('if(u==="tcego")')&&!operational.includes("central:private-study-state"),"Today must use active P1–P3 without private TCE reads");
  assert.equal(registry.central.defaultProject,"seedf","P1 SEEDF must be the default active focus");
  assert.ok(html.includes('href="#agenda-semanal">Cronograma</a>')&&router.includes('"agenda-semanal":"today"'),"schedule must have an accessible shortcut and route back to Hoje");
  const stripStart=schedule.indexOf('<div class="weekly-priority-strip"');
  const priorityStrip=schedule.slice(stripStart,schedule.indexOf("</div>",stripStart));
  assert.deepEqual([...priorityStrip.matchAll(/data-priority="([^"]+)"/g)].map(match=>match[1]),["1","2","3"],"active priorities must list SEEDF, TJDFT and PRF in order");
  assert.ok(priorityStrip.includes('data-priority="3" href="https://rodrigorosadantas.github.io/prf-administrativo-dashboard/"')&&priorityStrip.includes("<span>P3</span><strong>PRF ADM</strong>"),"P3 chip must open the published PRF site");
  assert.ok(quoteCss.includes("grid-template-columns:repeat(3,minmax(0,1fr))")&&quoteCss.includes("grid-template-columns:repeat(2,minmax(0,1fr))"),"priority strip must reflow from three columns to two on narrow screens");
  const days=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
  assert.deepEqual([...schedule.matchAll(/data-weekday="([^"]+)"/g)].map(match=>match[1]),days,"schedule must expose one card per weekday");
  const day=key=>{const at=schedule.indexOf('data-weekday="'+key+'"');return schedule.slice(at,schedule.indexOf("</article>",at)+10)};
  const cards=Object.fromEntries(days.map(key=>[key,day(key)]));
  for(const key of days.slice(0,5))assert.ok(cards[key].includes(">SEEDF</a>")&&cards[key].includes(">TJDFT</a>")&&cards[key].includes("Estudo"),key+" must show SEEDF P1 and TJDFT P2 study");
  for(const key of ["monday","wednesday","friday"])assert.ok(cards[key].includes("PRF ADM")&&cards[key].includes("PRFADMxx")&&cards[key].includes('href="/prf-administrativo-dashboard/"')&&cards[key].includes('class="schedule-mark schedule-mark-track">P3</span>'),key+" must show PRF Administrative as P3");
  for(const key of ["tuesday","thursday"])assert.ok(!cards[key].includes("TCE-GO")&&!cards[key].includes("PRF ADM"),key+" must keep only scheduled SEEDF and TJDFT blocks");
  assert.ok(cards.saturday.includes("SEEDF")&&cards.saturday.includes("TJDFT")&&cards.saturday.includes("Revisão")&&!cards.saturday.includes("TCE-GO"),"Saturday must review SEEDF and TJDFT without TCE-GO");
  assert.ok(cards.sunday.includes("Descanso")&&cards.sunday.includes("D7/D20"),"Sunday must remain protected with only scheduled reviews");
  assert.ok(schedule.includes('aria-label="Prioridade 3 — PRF Administrativo na agenda semanal"')&&schedule.includes("P3 na ordem de estudos")&&schedule.includes("segunda, quarta e sexta"),"PRF must be P3 while preserving its study days");
  assert.ok(!schedule.includes("data-days=")&&schedule.includes("Grade é previsão"),"day-by-day schedule must identify planning rather than execution");
  assert.ok(schedule.includes("PRFADM01–PRFADM33")&&schedule.includes("sequência 01–33")&&!schedule.includes("01–30"),"weekly schedule must match the current 33-session PRF cycle");
  const closeout=schedule.slice(schedule.indexOf('<details id="daily-closeout"'),schedule.indexOf("</details>",schedule.indexOf('<details id="daily-closeout"')));
  assert.ok(closeout.includes("open")&&["PREVISTO","REGISTRADO","MENTOR"].every(label=>closeout.includes("<strong>"+label+"</strong>")),"daily closeout must remain factual");
  assert.ok(closeout.includes("carregando seus blocos locais")&&closeout.includes('href="./mentor/">Abrir Mentor Central</a>'),"closeout must avoid stale claims and link the Mentor");
  assert.ok(closeout.includes("Grade é previsão")&&closeout.includes("tempo registrado não confirma progresso")&&!closeout.includes("FEITO · informado em 28/09"),"closeout must distinguish planning and time logging from progress");
  const mobileCss=css.slice(css.indexOf("@media(max-width:719px)"));
  assert.ok(html.includes("./css/workspace-v27.css")&&html.includes("weekly-schedule-v27")&&mobileCss.includes(".schedule-day-grid{grid-template-columns:1fr")&&mobileCss.includes(".schedule-day-card{grid-template-columns:minmax(82px,.34fr) minmax(0,1fr)")&&mobileCss.includes(".schedule-day-heading>span{display:none}")&&mobileCss.includes(".schedule-day-rest-v27 .schedule-day-heading>span{display:inline-flex}")&&mobileCss.includes(".schedule-day-card .schedule-item-copy{display:block")&&mobileCss.includes("min-width:0"),"v27 mobile schedule must keep seven compact day rows without overflow");
  assert.ok(html.includes('src="./js/command-context-v1.js?v=28.1.0"')&&sw.includes("'./js/command-context-v1.js?v=28.1.0'"),"today marker and change summary must remain in the app shell");
  assert.ok(sw.includes("central-shell-v28.2.0-active-portfolio-20260930")&&sw.includes("./css/workspace-v27.css"),"PWA shell cache must include the v27 stylesheet and current version");
  assert.ok(html.includes('src="./js/app.js?v=28.2.0"')&&sw.includes("'./js/app.js?v=28.2.0'")&&sw.includes("'./config/projects.json?v=28.2.0'")&&app.includes("./config/projects.json?v=28.2.0"),"registry URL and app cache must use the current release");
  assert.ok(sw.includes("./config/study-schedule-v1.json?v=28.2.0"),"PWA shell must refresh the active schedule");
  assert.ok(html.includes("Mudanças desde a última conferência")&&html.includes("contratos validados neste aparelho")&&html.includes('id="published-changes-list"'),"published changes must show their local/read-only provenance");
  assert.ok(css.includes(".schedule-day-card.is-today")&&css.includes('content:"HOJE"'),"current weekday must have a visible marker");
  assert.ok(html.includes("PRF Administrativo")&&html.includes(">P3</span>"),"weekly routine must label PRF as P3");
  for(const source of ["instagram.com/caveiracadar09","projetocaopastor.com.br/curso/programa-de-protecao","youtube.com/watch?v=YIUoDC1PHbE"])assert.ok(app.includes(source),"Major Cadar quote source missing: "+source);
  assert.ok(html.includes('id="daily-motivation-author"')&&html.includes('id="daily-motivation-source"')&&html.includes("Frases do Major Cadar · muda a cada 5 min")&&html.includes('id="daily-motivation" class="daily-motivation" aria-live="polite" aria-atomic="true"')&&html.includes("Seja forte ou seja vencido.")&&app.includes('author:"Major Cadar"')&&app.includes('second:"2-digit"')&&app.includes("setInterval(e,1e3)"),"quote, attribution and Brasília clock must remain accessible");
  assert.ok(quoteCss.includes("border-left:4px solid #b69cff")&&quoteCss.includes("font-size:clamp(1rem,2.2vw,1.5rem)")&&quoteCss.includes("font-weight:800")&&quoteCss.includes("#a78bfa30"),"daily quote card must keep readable visual treatment");
  assert.ok(quoteCss.includes("@media(min-width:900px)")&&quoteCss.includes("grid-template-columns:.8fr 1.2fr")&&quoteCss.includes("grid-area:1/2/4/3")&&quoteCss.includes("min-height:154px"),"desktop quote must use the open header space");
  assert.ok(html.includes('href="./css/workspace-v26.css?v=portfolio-20260930"')&&sw.includes("'./css/workspace-v26.css?v=portfolio-20260930'")&&sw.includes("central-shell-v28.2.0-active-portfolio-20260930"),"current release must refresh installed PWA clients");
  pass("v28.2.0 active P1–P3 portfolio, archived history and factual closeout");
}

function testV278AdaptiveMentor(registry) {
  const html=read("index.html"),op=read("js/operational-v13.js"),css=read("css/operational-v13.css"),sw=read("sw.js");
  assert.equal(registry.central.version,"28.2.0","current Central release must preserve the adaptive Mentor");
  assert.ok(op.includes('summary.id="mentor-adaptive-summary"')&&op.includes("Mentor adaptativo")&&op.includes("Motor local · R$ 0 API"),"adaptive mentor must be present and explicitly API-free");
  assert.ok(op.includes('LOG_KEY="central-estudos:study-log-v1"')&&op.includes("scheduledOn")&&op.includes("confidence(logs)")&&op.includes("SEM TEMPO REGISTRADO NA CENTRAL"),"daily state must derive from real study logs and the current schedule");
  assert.ok(op.includes("sem registro na Central")&&op.includes("campo ausente continua desconhecido"),"mentor must explain missing evidence without inventing performance");
  assert.ok(op.includes('FOCUS_KEY="central-estudos:focus-project"')&&!op.includes("localStorage.setItem(FOCUS_KEY"),"mentor may read human focus but must never change it");
  assert.ok(op.includes("MutationObserver")&&op.includes("America/Sao_Paulo")&&!op.includes("openai")&&!op.includes("api.openai.com"),"mentor must react locally with Brasília dates and no OpenAI API dependency");
  assert.ok(css.includes(".adaptive-mentor")&&css.includes(".adaptive-kpis")&&css.includes("@media(max-width:719px)")&&css.includes("@media(pointer:coarse)"),"adaptive mentor must have responsive and touch-aware styling");
  assert.ok(html.includes("REGISTRADO</strong>: carregando seus blocos locais.")&&!html.includes("FEITO · informado em 28/09"),"static closeout must be generic instead of freezing stale study state");
  assert.ok(!sw.includes("./js/operational-v13.js")&&!sw.includes("./css/operational-v13.css"),"adaptive operational layer must stay outside the offline shell budget");
  pass("v27.9 API-free adaptive mentor, confidence and explainable recommendations");
}

function testV279ProjectStudySignals(registry) {
  const schema=JSON.parse(read("config/status-contract.schema.json")),op=read("js/operational-v13.js"),sync=read("js/study-sync-v1.js");
  const prf=registry.projects.find(project=>project.id==="prf-adm"),tce=registry.projects.find(project=>project.id==="tcego");
  assert.equal(prf?.statusUrl,"https://rodrigorosadantas.github.io/prf-administrativo-dashboard/central-status.json","PRF must publish a read-only status contract");
  assert.equal(prf?.studyPriority,3,"PRF must remain P3 in the active schedule");
  assert.equal(registry.projects.find(project=>project.id==="seedf")?.priority,"focus","P1 SEEDF must keep default focus");
  assert.equal(tce?.status,"archived","TCE-GO must remain archived history");
  assert.equal(tce?.availability,"archive-only","archived TCE-GO must be excluded from active reads");
  assert.ok(schema.properties.study&&schema.properties.study.properties.accuracy&&schema.properties.study.properties.reviewsDue&&schema.properties.study.properties.activeErrors,"status contract must support optional pedagogical signals");
  assert.ok(op.includes("publishedStudy=new Map")&&op.includes("central:contract-state")&&!op.includes("privateStudy")&&!op.includes("central:private-study-state"),"operational Mentor must use public signals and omit private TCE state");
  assert.ok(op.includes("revisão(ões) vencida(s)")&&op.includes("desempenho publicado")&&op.includes("erro(s) ativo(s)")&&op.includes("próxima unidade publicada"),"Mentor must consume explicit study signals");
  assert.ok(op.includes("campo ausente continua desconhecido")&&!op.includes("api.openai.com"),"missing data must remain unknown and Mentor API-free");
  assert.ok(sync.includes("/rest/v1/central_study_logs")&&!sync.includes("/rest/v1/tce_progress_state")&&!sync.includes("central:private-study-state"),"generic study sync must remain without private TCE queries");
  pass("v27.9 public project signals without private TCE reads");
}

function testV28DedicatedMentor(registry) {
  const html=read("index.html"),mentor=read("mentor/index.html"),js=read("mentor/mentor.js"),css=read("mentor/mentor.css"),sw=read("sw.js"),schedule=JSON.parse(read("config/study-schedule-v1.json"));
  assert.equal(registry.central.version,"28.2.0","current Central release must preserve the dedicated Mentor");
  assert.ok(!html.includes('id="routing-panel"')&&html.includes('href="./mentor/"'),"main Central must link to the dedicated Mentor");
  for(const tab of ["agora","projetos","revisoes","metodo"])assert.ok(mentor.includes('data-mentor-view="'+tab+'"'),"Mentor tab missing: "+tab);
  assert.ok(mentor.includes("R$ 0 API")&&mentor.includes("Mentor Central")&&mentor.includes("Revisões & riscos"),"Mentor must expose its identity and zero-API status");
  assert.ok(js.includes("central-estudos:study-log-v1")&&!js.includes("/rest/v1/tce_progress_state")&&!js.includes("central:private-study-state"),"Mentor must use local logs without private TCE data");
  assert.ok(js.includes("statusUrl")&&js.includes('fetch(url,{cache:"no-store"')&&js.includes("normalizeStudy"),"Mentor must validate read-only public project contracts");
  assert.ok(js.includes("reviewsDue")&&js.includes("activeErrors")&&js.includes("accuracy")&&js.includes("executedToday"),"Mentor must use explicit study signals");
  assert.ok(!js.includes("api.openai.com")&&!js.includes("service_role")&&!js.includes("sb_secret_")&&!js.includes("privateStatus"),"Mentor must remain API-free and omit private-state integrations");
  assert.ok(!mentor.includes("supabase.co")&&mentor.includes("3 PROJETOS · P1–P3")&&!mentor.includes("TCE-GO privado"),"Mentor copy must match the active portfolio and private-data boundary");
  assert.ok(schedule.weekdays.monday.join(",")==="seedf,tjdft,prf-adm"&&schedule.weekdays.tuesday.join(",")==="seedf,tjdft"&&schedule.weekdays.sunday.length===0,"Mentor schedule config must match the active weekly plan");
  assert.ok(css.includes(".mentor-project-grid")&&css.includes("@media(max-width:860px)")&&css.includes("@media(pointer:coarse)"),"Mentor must remain responsive and touch-aware");
  assert.ok(mentor.includes('role="tablist"')&&mentor.includes('role="tab"')&&mentor.includes('role="tabpanel"')&&!mentor.includes('aria-pressed="true"'),"Mentor navigation must preserve keyboard tab semantics");
  assert.ok(js.includes('let ORDER=["seedf","tjdft","prf-adm"]')&&js.includes('ORDER=active.map(p=>p.id)')&&js.includes("renderPriorityBoard(signals)"),"portfolio must follow active registry order");
  assert.ok(mentor.includes("3 PROJETOS · P1–P3")&&mentor.includes("tempo mostra apenas o que foi registrado nesta Central")&&js.includes("TEMPO · CENTRAL · 7D"),"portfolio must distinguish local time from project-published signals");
  assert.ok(js.includes("PRECISÃO PUBLICADA")&&js.includes("Sem amostra de questões publicada")&&js.includes("mentor-priority-source"),"portfolio metrics must label published accuracy without fabricating zeros");
  assert.ok(css.includes('.mentor-priority-card[data-priority="1"]')&&css.includes('.mentor-priority-card[data-priority="3"]')&&!css.includes('data-priority="4"')&&css.includes(".mentor-accuracy-meter")&&css.includes("@media(max-width:380px)")&&css.includes(":focus-visible"),"P1–P3 cards need distinct responsive styling and visible keyboard focus");
  assert.ok(js.includes('event.key==="ArrowRight"')&&js.includes('event.key==="Home"')&&js.includes('event.key==="End"')&&js.includes("board.replaceChildren"),"tab keyboard controls and project-load fallback must remain");
  for(const asset of ["./mentor/index.html","./mentor/mentor.css?v=28.2.0","./mentor/mentor.js?v=28.2.0","./config/study-schedule-v1.json?v=28.2.0"])assert.ok(sw.includes(asset),"PWA shell missing Mentor asset: "+asset);
  assert.ok(sw.includes("mentorNavigation")&&sw.includes("'./mentor/index.html'"),"offline navigation must preserve the Mentor child page");
  assert.ok(mentor.includes('id="mentor-review-coverage"')&&js.includes("function reviewSummary(signals)")&&js.includes("Number.isInteger(s.study?.reviewsDue)"),"review totals must keep absent values unknown and report coverage");
  assert.ok(mentor.includes("<strong>até +10</strong>")&&mentor.includes("acréscimo progressivo, limitado a +10"),"recency explanation must match capped progressive score");
  const extractMentorFunction=(name,next)=>{const start=js.indexOf("function "+name+"("),end=js.indexOf("\nfunction "+next+"(",start);assert.ok(start>=0&&end>start,"could not isolate Mentor function "+name);return js.slice(start,end).trim()};
  const reviewSummary=vm.runInNewContext(extractMentorFunction("reviewSummary","renderAll")+"\nreviewSummary;");
  const asJson=value=>JSON.parse(JSON.stringify(value));
  assert.deepEqual(asJson(reviewSummary([{study:null},{study:{reviewsDue:null}},{study:{}}])),{count:"—",coverage:"sem dados publicados"},"unknown review totals must remain unknown");
  assert.deepEqual(asJson(reviewSummary([{study:{reviewsDue:0}},{study:{reviewsDue:2}},{study:null}])),{count:"2",coverage:"parcial · 2/3 fontes"},"partial review totals must include only reported sources");
  assert.deepEqual(asJson(reviewSummary([{study:{reviewsDue:0}},{study:{reviewsDue:0}}])),{count:"0",coverage:"publicadas · 2/2 fontes"},"published zero must differ from missing data");
  const healthBox={children:[],replaceChildren(...items){this.children=[...items]},append(...items){this.children.push(...items)}},mockNode=(tag,className,text)=>({tag,className,textContent:text,dataset:{},children:[],append(...items){this.children.push(...items)}});
  vm.runInNewContext(extractMentorFunction("sourceLabel","renderDataHealth")+"\n"+extractMentorFunction("renderDataHealth","renderProjectCards")+"\nrenderDataHealth(signals);",{$:()=>healthBox,node:mockNode,fmtDate:value=>value,signals:[{id:"prf-adm",name:"PRF ADM",contractState:{status:"live",contract:{source:{updatedAt:"2026-09-29",ref:"public:prf"}}},study:null}]});
  const healthText=healthBox.children.flatMap(card=>card.children.map(item=>item.textContent));
  assert.ok(healthText.includes("Contrato atualizado")&&healthText.includes("public:prf"),"public status and provenance must be visible without private data");
  pass("v28.2 dedicated Mentor with active portfolio and no private TCE reads");
}

function testV281DailyCloseoutHydration() {
  const source = read("js/operational-v13.js");
  const marker = ';(()=>{"use strict";\nconst LOG_KEY="central-estudos:study-log-v1"';
  const start = source.indexOf(marker);
  assert.ok(start >= 0, "daily closeout module must be present after the read-only contract layer");
  const moduleSource = source.slice(start);
  let now = Date.parse("2026-09-30T02:59:00.000Z");
  let midnightCheck = null;
  const handlers = new Map();
  const timeouts = [];
  const box = { children: [], dataset: {}, replaceChildren(...items) { this.children = [...items]; }, append(...items) { this.children.push(...items); } };
  const fakeNode = tag => ({ tagName: tag, textContent: "", className: "", children: [], dataset: {}, setAttribute() {}, append(...items) { this.children.push(...items); }, replaceChildren(...items) { this.children = [...items]; } });
  const rows = { tuesday: ["P1", "P2"], wednesday: ["P1", "P2", "P3"] };
  const scheduleCard = selector => {
    const match = selector.match(/data-weekday="([^"]+)"/);
    if (!match) return null;
    return { querySelectorAll() { return (rows[match[1]] || []).map(mark => ({ querySelector() { return { textContent: mark }; } })); } };
  };
  const document = {
    hidden: false,
    addEventListener(type, callback) { const list = handlers.get(type) || []; list.push(callback); handlers.set(type, list); },
    getElementById() { return null; },
    querySelector(selector) { return selector === "#daily-closeout .command-next" ? box : scheduleCard(selector); },
    querySelectorAll() { return []; },
    createElement: fakeNode,
    createTextNode(text) { return { textContent: String(text), children: [] }; }
  };
  const localStorage = createLocalStorage();
  localStorage.setItem("central-estudos:study-log-v1", JSON.stringify([{ id: "log-1", date: "2026-09-29", projectId: "seedf", trail: "Leis Primeiro", topic: "L04", minutes: 25, confirmed: true }]));
  class FixedDate extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
    static now() { return now; }
  }
  const context = vm.createContext({
    document,
    window: { addEventListener() {} },
    localStorage,
    Intl,
    Date: FixedDate,
    Map, Set, JSON, Number, String, Array, Object, Math, RegExp,
    setTimeout(callback, delay = 0) { if (delay > 0) midnightCheck = callback; else timeouts.push(callback); return timeouts.length; }
  });
  vm.runInContext(moduleSource, context, { filename: "js/operational-v13.js#daily-closeout" });
  for (const callback of handlers.get("DOMContentLoaded") || []) callback();
  for (const callback of timeouts) callback();
  const textOf = value => String(value?.textContent || "") + (value?.children || []).map(textOf).join("");
  let output = textOf(box);
  assert.ok(output.includes("DATA · BRASÍLIA: 29/09/2026"), "closeout must render today in the Brasília timezone");
  assert.ok(output.includes("TEMPO REGISTRADO NA CENTRAL: SEEDF 25 min"), "closeout must show explicitly confirmed local study time");
  assert.ok(output.includes("SEM TEMPO REGISTRADO NA CENTRAL: TJDFT"), "closeout must distinguish missing Central time from absence of study");
  assert.ok(output.includes("Ausência de registro não prova ausência de estudo"), "closeout must preserve unknown-as-unknown semantics");

  for (const callback of handlers.get("central:contract-state") || []) callback({ detail: { id: "tjdft", contract: { study: { evidence: "confirmed", lastStudiedAt: "2026-09-29", lastCompletedUnit: "P01" } } } });
  for (const callback of handlers.get("central:contract-state") || []) callback({ detail: { id: "prf-adm", contract: { study: { evidence: "confirmed", lastStudiedAt: null, nextUnit: "PRFADM01" } } } });
  output = textOf(box);
  assert.ok(output.includes("EXECUÇÃO CONFIRMADA PELO PROJETO: TJDFT · P01"), "closeout must show only dated project confirmations from their matching project IDs");
  assert.ok(!output.includes("PRF ADM"), "a generic PRF contract signal without a study date must not become a completed-session claim");

  now = Date.parse("2026-09-30T03:01:00.000Z");
  assert.equal(typeof midnightCheck, "function", "closeout must schedule a Brasília date rollover check");
  midnightCheck();
  output = textOf(box);
  assert.ok(output.includes("DATA · BRASÍLIA: 30/09/2026"), "open pages must refresh the closeout after Brasília midnight");
  assert.ok(output.includes("SEM TEMPO REGISTRADO NA CENTRAL: SEEDF · TJDFT · PRF ADM"), "the next day's schedule must be recalculated without carrying yesterday's state");
  pass("v28.2.0 dynamic daily closeout, active PRF summary and Brasília date rollover");
}

function testHomeResponsiveLayout() {
  const home=read("css/home-v1.css");
  const desktop=home.lastIndexOf(".presence-v21{grid-template-columns:minmax(0,1.4fr) minmax(285px,.6fr)");
  const responsive=home.lastIndexOf("@media(max-width:979px){.presence-v21{grid-template-columns:1fr");
  assert.ok(responsive>desktop&&home.slice(responsive).includes(".presence-clock{align-self:stretch;min-height:86px}"),"tablet and phone must stack the focus and clock after desktop layout rules");
  pass("home focus and clock stack on narrow screens after desktop overrides");
}

function testStudyLog(registry) {
  const html = read("index.html"), sw = read("sw.js"), source = read("js/study-log-v1.js");
  assert.ok(html.includes('id="study-log-form"') && html.includes('id="study-log-confirmed"') && html.includes('id="study-log-hours"') && html.includes('id="study-log-minutes"'), "daily study log must collect an explicit confirmation and hours/minutes");
  assert.ok(html.includes('class="catalog-field study-log-field" for="study-log-hours"') && html.includes('class="catalog-field study-log-field" for="study-log-minutes"'), "duration labels must use the stacked input style on desktop and mobile");
  assert.ok(html.includes('id="study-log-projects"') && html.includes('id="study-log-today-total"') && html.includes('id="study-log-week-total"') && html.includes('id="study-log-days"'), "study log must show daily totals, weekday totals and per-project summaries");
  assert.ok(html.includes("não sincronizam com o Notion") && html.includes("Exportar backup JSON") && html.includes("Restaurar backup"), "local storage scope and backup/restore must be explicit");
  assert.ok(html.includes('./js/study-log-v1.js') && html.includes('./css/study-log-v1.css') && sw.includes("'./js/study-log-v1.js'") && sw.includes("'./css/study-log-v1.css'"), "tracker assets must be referenced and available in the offline shell");
  assert.ok(!source.includes("fetch(") && !source.includes("XMLHttpRequest"), "study tracking must not add network requests");
  assert.ok(source.includes('central-estudos:study-log-v1') && source.includes('central:workspace-ready'), "tracker must use an isolated local key and current project registry");
  assert.ok(html.includes("./js/operational-v13.js") && !sw.includes("./js/operational-v13.js"), "online operational UI must remain available without displacing the local study log from the offline shell");

  const store = createLocalStorage();
  const context = vm.createContext({
    window: { localStorage: store }, document: { addEventListener() {} }, localStorage: store,
    Intl, Date, Map, Set, JSON, RegExp, Number, String, Array, Object, Math, URL
  });
  vm.runInContext(source, context, { filename: "js/study-log-v1.js" });
  const api = context.window.CentralStudyLogV1;
  assert.equal(api.key, "central-estudos:study-log-v1", "study log must keep a namespaced local key");
  const ids = new Set(registry.projects.map(project => project.id));
  const testDate = api.today();
  const valid = api.normalize({ id: "one", date: testDate, projectId: "seedf", trail: "Trilha de leis", topic: "LDB", minutes: 75, confirmed: true }, ids);
  assert.equal(valid.minutes, 75, "valid confirmed study time must normalize to minutes");
  assert.equal(api.normalize({ id: "no-confirmation", date: testDate, projectId: "seedf", trail: "Leis", topic: "", minutes: 30, confirmed: false }, ids), null, "unconfirmed work must not become a study record");
  assert.equal(api.normalize({ id: "bad-date", date: "2026-02-30", projectId: "seedf", trail: "Leis", topic: "", minutes: 30, confirmed: true }, ids), null, "impossible dates must be rejected");
  assert.equal(api.normalize({ id: "bad-time", date: testDate, projectId: "seedf", trail: "Leis", topic: "", minutes: 1441, confirmed: true }, ids), null, "durations beyond 24 hours must be rejected");
  assert.equal(api.normalize({ id: "bad-project", date: testDate, projectId: "missing", trail: "Leis", topic: "", minutes: 30, confirmed: true }, ids), null, "unknown projects must be rejected");
  const range = JSON.parse(JSON.stringify(api.weekRange(testDate)));
  assert.equal(new Date(`${range.from}T00:00:00Z`).getUTCDay(), 1, "week summaries must start on Monday");
  assert.equal(new Date(`${range.to}T00:00:00Z`).getUTCDay(), 0, "week summaries must end on Sunday");
  const futureDate = new Date(`${testDate}T00:00:00Z`); futureDate.setUTCDate(futureDate.getUTCDate()+1);
  assert.equal(api.normalize({ id: "future", date: futureDate.toISOString().slice(0,10), projectId: "seedf", trail: "Leis", topic: "", minutes: 30, confirmed: true }, ids), null, "future study time must not be logged");
  const second = { ...valid, id: "two", trail: "Português", topic: "Interpretação", minutes: 45 };
  assert.equal(api.total([valid, second]), 120, "daily and weekly duration totals must sum in minutes");
  assert.equal(api.duration(75), "1h 15min", "duration display must preserve hours and remaining minutes");
  assert.deepEqual(JSON.parse(JSON.stringify(api.group([valid, second]))), [["Trilha de leis · LDB", 75], ["Português · Interpretação", 45]], "project breakdowns must separate trail and topic");
  api.save([valid]);
  assert.equal(api.read(ids)[0].id, "one", "valid study entries must persist and reload locally");
  store.setItem(api.key, "{corrompido");
  assert.deepEqual(JSON.parse(JSON.stringify(api.read(ids))), [], "corrupt local data must degrade to an empty history");
  const merged = api.merge([valid], [valid, second]);
  assert.equal(merged.length, 2, "backup restoration must ignore duplicate entry ids");
  pass("v27.6 local study log, date/project validation, weekly totals and backups");
}

function testStudySync() {
  const html = read("index.html"), sw = read("sw.js"), source = read("js/study-sync-v1.js");
  assert.ok(source.includes('/auth/v1/logout?scope=local'), "disconnecting this device must not revoke other Supabase sessions");
  assert.ok(html.includes("./js/study-sync-v1.js?v=28.2.0") && sw.includes("./js/study-sync-v1.js?v=28.2.0"), "the fixed sync module must load in online and installed PWA clients");
  assert.ok(source.includes("create_user:false"), "Central sync must authenticate only existing Supabase users");
  assert.ok(source.includes("/rest/v1/central_study_logs") && source.includes("resolution=ignore-duplicates") && source.includes("user_id"), "sync writes must target the Central table idempotently and scope rows by user");
  assert.ok(source.includes("state.accountId&&state.accountId!==user.id"), "a device bound to one account must not merge another account's records");
  assert.ok(!source.includes("service_role") && !source.includes("sb_secret_"), "browser sync must not expose server secrets");
  assert.ok(source.includes('knownIds.add("tcego")') && source.includes("/rest/v1/central_study_logs") && !source.includes("/rest/v1/tce_progress_state") && !source.includes("central:private-study-state"), "generic sync must preserve archived TCE log IDs without private progress reads");
  pass("optional Supabase study sync, existing-account auth and device-local logout");
}
function testStudyPlanner(registry) {
  const html = read("index.html"), sw = read("sw.js"), planner = read("js/study-planner-v1.js"), css = read("css/study-planner-v1.css");
  const catalog = JSON.parse(read("config/study-catalog-v1.json"));
  assert.equal(catalog.version, "28.2.0", "matter catalog must match the guided planner release");
  assert.deepEqual(Object.keys(catalog.projects).sort(), registry.projects.filter(project => project.status === "active").map(project => project.id).sort(), "guided catalogs must cover exactly the three active study projects");
  assert.equal(catalog.projects.seedf.groups[0].items.length, 12, "SEEDF must offer Leis Primeiro and its mapped norms");
  assert.equal(catalog.projects.tjdft.groups[0].items.length, 18, "TJDFT must map all P01–P18 Portuguese units");
  assert.equal(catalog.projects.tjdft.groups[1].items.length, 13, "TJDFT must map all RL01–RL13 units");
  assert.equal(catalog.projects.tjdft.groups[2].items.filter(item => item.startsWith("REV")).length, 6, "TJDFT must map REV01–REV06");
  assert.equal(catalog.projects.tcego, undefined, "archived TCE-GO must be removed from the active study catalog");
  assert.equal(catalog.projects["prf-adm"].groups[0].items.filter(item => /^PRFADM\d{2}/.test(item)).length, 33, "PRF catalog must cover the full rotating PRFADM01–33 sequence");
  assert.ok(html.includes('id="study-log-week-picker"')&&html.includes('id="study-log-planned-blocks"')&&html.includes('id="study-log-manual-button"'), "daily register must select a weekday, show scheduled blocks and keep an off-grid path");
  assert.ok(html.includes('id="study-log-confirmed"')&&html.includes("Marque só depois de estudar."), "the planner must only record real study after explicit confirmation");
  assert.ok(planner.includes(".schedule-day-card[data-weekday=")&&planner.includes("let projectIds = { P1: \"seedf\", P2: \"tjdft\", P3: \"prf-adm\" }")&&planner.includes("central:app-ready"), "planner must reuse the current schedule and map active P1–P3 projects");
  assert.ok(planner.includes("central:study-date-selected")&&planner.includes("MutationObserver")&&planner.includes("TEMPO NA SEMANA SELECIONADA"), "day and week selectors must update the matching totals when local records change");
  assert.ok(html.includes("./js/study-planner-v1.js?v=28.2.0")&&html.includes("./css/study-planner-v1.css?v=28.2.0"), "guided planner assets must be referenced with the release version");
  const appShell = sw.match(/const APP_SHELL = \[([\s\S]*?)\];/)?.[1] || "";
  const runtimeStart = sw.indexOf("const RUNTIME_ASSETS");
  const runtimeEnd = sw.indexOf("self.addEventListener('install'", runtimeStart);
  const runtime = sw.slice(runtimeStart, runtimeEnd);
  for (const asset of ["./js/study-planner-v1.js?v=28.2.0", "./css/study-planner-v1.css?v=28.2.0", "./config/study-catalog-v1.json?v=28.2.0"]) {
    assert.ok(runtime.includes(asset) && !appShell.includes(asset), `${asset} must use the scoped runtime cache and preserve the approved app-shell ceiling`);
  }
  assert.ok(sw.includes("central-study-runtime-v28.2.0")&&sw.includes("return saved || new Response('', { status: 503 });"), "guided catalog resources must be cached same-origin with an offline fallback");
  assert.ok(css.includes('.study-log-day-choice[aria-pressed=true]')&&css.includes("@media(max-width:360px)")&&css.includes("min-height:42px"), "weekday and plan controls must remain touch-friendly on narrow phones");
  pass("v27.7 guided weekday, mapped subject catalogs, real-study confirmation and offline runtime fallback");
}

function testCommandContext() {
  const source=read("js/command-context-v1.js"),keys=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],listeners={},store=new Map();
  let now=Date.UTC(2026,8,28,2,59),tick=null,intervalMs=null;
  const createNode=tag=>{const classes=new Set();return{tag,className:"",textContent:"",children:[],dataset:{},attributes:{},classList:{toggle:(name,on)=>on?classes.add(name):classes.delete(name),contains:name=>classes.has(name)},append(...items){this.children.push(...items)},replaceChildren(...items){this.children=[...items]},setAttribute(name,value){this.attributes[name]=value},removeAttribute(name){delete this.attributes[name]}}};
  const cards=keys.map(key=>{const card=createNode("article");card.dataset.weekday=key;return card}),output=createNode("div"),document={hidden:false,getElementById:id=>id==="published-changes-list"?output:null,querySelectorAll:()=>cards,createElement:createNode,addEventListener:(name,fn)=>{listeners[name]=fn}};
  const localStorage={getItem:key=>store.get(key)||null,setItem:(key,value)=>store.set(key,value)};
  store.set("central-estudos:published-snapshot-v1",JSON.stringify({tcego:{state:{phase:"Edital publicado",cycle:"D2",currentUnit:"D007",nextAction:"Estudar D007",alerts:[]}}}));
  class TestDate extends Date{constructor(...args){super(...(args.length?args:[now]))}}
  vm.runInNewContext(source,{document,localStorage,Intl,Date:TestDate,setInterval:(fn,ms)=>{tick=fn;intervalMs=ms}});
  assert.equal(intervalMs,60000,"weekday marker must refresh at least once per minute");
  assert.deepEqual(cards.filter(card=>card.classList.contains("is-today")).map(card=>card.dataset.weekday),["sunday"],"Brasília Sunday 23:59 must highlight Sunday even when UTC is already Monday");
  assert.equal(cards.find(card=>card.dataset.weekday==="sunday").attributes["aria-current"],"date","current day must be exposed to assistive technology");
  now=Date.UTC(2026,8,28,3,1);tick();
  assert.deepEqual(cards.filter(card=>card.classList.contains("is-today")).map(card=>card.dataset.weekday),["monday"],"the highlighted day must cross midnight in Brasília time");
  const emit=(status,currentUnit)=>listeners["central:contract-state"]({detail:{id:"tcego",name:"TCE-GO",status,contract:{publishedAt:"2026-09-28T03:00:00Z",source:{updatedAt:"2026-09-28T03:00:00Z"},state:{phase:"Edital publicado",cycle:"D2",currentUnit,nextAction:`Estudar ${currentUnit}`,alerts:[]}}}});
  emit("live","D008");
  const textOf=node=>node.textContent+node.children.map(textOf).join("");
  assert.ok(textOf(output).includes("Unidade: D007 → D008"),"the summary must show the exact change from the last saved state");
  assert.equal(JSON.parse(store.get("central-estudos:published-snapshot-v1")).tcego.state.currentUnit,"D008","a live validated snapshot must become the next comparison baseline");
  emit("stale-cache","D009");
  assert.ok(textOf(output).includes("Último estado em cache"),"cached changes must be identified as unconfirmed");
  assert.equal(JSON.parse(store.get("central-estudos:published-snapshot-v1")).tcego.state.currentUnit,"D008","stale cache must not overwrite the last live baseline");
  pass("v27.3.0 Brasília weekday and validated local change comparison");
}

function testCatalogLegacyPriorityOrder() {
  const source = read("js/catalog-v4.js");
  const names = { seedf: "SEEDF", tjdft: "TJDFT", tcego: "TCE-GO", "prf-adm": "PRF Administrativo" };

  function runCatalog(initialCards, savedOrder) {
    const localStorage = createLocalStorage();
    if (savedOrder) localStorage.setItem("central-estudos:catalog-order-v4", JSON.stringify(savedOrder));
    const cards = initialCards.map((id, index) => {
      const favorite = { setAttribute() {}, addEventListener() {} };
      return {
        dataset: { projectId: id, projectOrder: String(index) },
        querySelector(selector) {
          if (selector === "h3") return { textContent: names[id] };
          if (selector === ".favorite-toggle") return favorite;
          return null;
        }
      };
    });
    const grid = {
      querySelectorAll(selector) { return selector === ".project-card" ? cards.slice() : []; },
      append(card) {
        const index = cards.indexOf(card);
        if (index >= 0) cards.splice(index, 1);
        cards.push(card);
      }
    };
    const search = { value: "", addEventListener() {} };
    const sort = { value: "default", addEventListener() {} };
    const count = { textContent: "" };
    const empty = { hidden: true };
    const elements = {
      "projects-grid": grid,
      "catalog-search": search,
      "catalog-sort": sort,
      "catalog-count": count,
      "catalog-empty": empty
    };
    const document = {
      getElementById(id) { return elements[id] || null; },
      documentElement: { classList: { add() {} } },
      addEventListener() {}
    };
    class MutationObserverStub { observe() {} }
    vm.runInNewContext(source, { document, localStorage, MutationObserver: MutationObserverStub });
    return {
      visibleOrder: cards.map(card => card.dataset.projectId),
      savedOrder: JSON.parse(localStorage.getItem("central-estudos:catalog-order-v4") || "[]")
    };
  }

  const currentDefault = ["seedf", "tjdft", "prf-adm"];
  const legacyDefault = ["tcego", "seedf", "tjdft", "prf-adm"];
  const migrated = runCatalog(currentDefault, legacyDefault);
  assert.deepEqual(migrated.visibleOrder, currentDefault, "the former default must migrate while omitting archived TCE-GO");
  assert.deepEqual(migrated.savedOrder, currentDefault, "the migrated active order must be saved for later visits");

  const customOrder = ["tcego", "tjdft", "seedf", "prf-adm"];
  const customized = runCatalog(currentDefault, customOrder);
  assert.deepEqual(customized.visibleOrder, ["tjdft", "seedf", "prf-adm"], "custom order must drop archived TCE-GO and preserve active relative order");
  assert.deepEqual(customized.savedOrder, ["tjdft", "seedf", "prf-adm"], "the cleaned custom active order must be saved");

  const fresh = runCatalog(currentDefault, null);
  assert.deepEqual(fresh.visibleOrder, currentDefault, "a fresh catalog must start in P1–P3 order");
  assert.deepEqual(fresh.savedOrder, currentDefault, "a fresh catalog must save P1–P3 as its default");
  pass("catalog order migrates the legacy P3-first default and preserves custom preferences");
}

function testV274PrfSiteAndToolDirectory(registry) {
  const html = read("index.html");
  const app = read("js/app.js");
  const config = read("config/projects.json");
  const prf = registry.projects.find(project => project.id === "prf-adm");
  const gridStart = html.indexOf('<div id="projects-grid"');
  const gridEnd = html.indexOf("</div><p id=\"catalog-empty\"", gridStart);
  const toolsStart = html.indexOf('<div class="study-tools"');
  const toolsEnd = html.indexOf("</div></section><section id=\"workspace\"", toolsStart);

    assert.equal(registry.central.version, "28.2.0", "catalog must identify current release v28.2.0");
    assert.equal(registry.central.defaultProject, "seedf", "P1 SEEDF must be the default Today focus while P3 PRF stays on its assigned days");
  assert.ok(prf && prf.status === "active" && prf.priority === "normal" && prf.studyPriority === 3, "PRF must be active, ranked P3 in the study schedule, and keep normal focus semantics");
  assert.equal(prf.description, "Roda PRFADM01–33", "Central catalog must show the current 33-session PRF cycle");
  assert.equal(prf.destinationType, "site", "PRF must open as a site");
  assert.equal(prf.url, "https://rodrigorosadantas.github.io/prf-administrativo-dashboard/", "PRF must use its published Pages URL");
  assert.equal(prf.repository, "https://github.com/RodrigoRosaDantas/prf-administrativo-dashboard", "PRF must use its own GitHub repository");
  assert.equal(prf.notionUrl, "https://app.notion.com/p/3e8cf5a2673181679cd2f5532e0abf60", "PRF must keep the Notion source of truth available");
  assert.equal(prf.statusUrl, "https://rodrigorosadantas.github.io/prf-administrativo-dashboard/central-status.json", "PRF site must expose its sanitized operational status contract");
  assert.ok(gridStart >= 0 && gridEnd > gridStart, "project fallback grid must be present");
  const grid = html.slice(gridStart, gridEnd);
  assert.deepEqual([...grid.matchAll(/data-project-id="([^"]+)"/g)].map(match => match[1]), ["seedf", "tjdft", "prf-adm"], "static project cards must follow the P1–P3 priority order");
  assert.equal(grid.split("<article class=\"project-card").length - 1, grid.split("</article>").length - 1, "static project fallback must contain balanced cards");
  assert.ok(grid.includes('data-project-id="prf-adm"') && grid.includes(prf.url), "PRF project must appear in the no-JavaScript project catalogue");
  assert.ok(app.includes('function monitoredProjects(){return activeProjects().filter(e=>e.destinationType!=="notion")}'), "only dashboard projects may be technically monitored");
  assert.ok(grid.includes(prf.notionUrl), "static PRF card must preserve direct Notion access");
  assert.ok(app.includes("e.notionUrl")&&app.includes("<a class=observability-meta"), "dynamic PRF card must preserve its Notion source link");
  assert.ok(app.includes('t.destinationType==="notion"?"Abrir no Notion →":"Abrir projeto →"'), "project cards must identify project destinations");
  assert.ok(html.includes("Abrir painel →")&&html.includes("Notion ↗"), "static PRF card must expose both project destinations");

  assert.ok(toolsStart >= 0 && toolsEnd > toolsStart, "separate study-tools area must exist");
  const tools = html.slice(toolsStart, toolsEnd);
  const questionUrl = "https://rodrigorosadantas.github.io/plataforma-questoes/";
  assert.ok(tools.includes("Plataforma de Questões") && tools.includes(questionUrl), "question platform must have its own direct access card");
  assert.ok(!grid.includes(questionUrl) && !config.includes("plataforma-questoes"), "question platform must remain outside the contest project registry");
  assert.ok(tools.includes("fora da contagem") && tools.includes("Ferramenta"), "tool card must explain its separate role");
  assert.ok(html.includes("3 de 3 projetos") && html.includes("3 projetos ativos · 1 ferramenta de estudo"), "static project and tool counts must match the catalog");

  pass("v28.2 preserves the PRF GitHub Pages site, Notion source, P3 rank and separate question-tool card");
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
    const roadmap24=read("docs/ROADMAP-V24.md"),checkpoint24=read("docs/V24-CHECKPOINT.md"),acceptance24=read("docs/ACCEPTANCE-V24.md"),risks24=read("docs/RISK-REGISTER-V24.md"),audit24=read("docs/FINAL-AUDIT-V24.md");
    assert.ok(roadmap24.includes("seis telas")&&checkpoint24.includes("24.0.0")&&acceptance24.includes("Inbox")&&risks24.includes("128 KiB"),"v24 governance must define scope, checkpoint, acceptance and payload risk");
    assert.ok(roadmap24.includes("Stage:** COMPLETE")&&checkpoint24.includes("Stage:** COMPLETE")&&exists("docs/FINAL-AUDIT-V24.md"),"v24 roadmap, checkpoint and final audit must be closed");
    assert.ok(audit24.includes("01ccefa385f306c13c86e736e6d9a7a49d16adb4")&&audit24.includes("36358103801")&&audit24.includes("10943764161")&&audit24.includes("beae227ecac1214edbd9f6872701e019adfe2b9dabd422b80779705d8ae8f427"),"v24 audit must bind the release commit, successful workflow and Pages artifact");
    assert.ok(audit24.includes("120.555 bytes")&&audit24.includes("131.072 bytes")&&acceptance24.includes("[ ] QA visual manual em viewport móvel"),"v24 audit must record payload and remaining mobile visual QA limit");
    assert.ok(architecture.includes("filha direta de `<main>`")&&risks24.includes("Tela aninhada sumir"),"v24 screen hierarchy regression must remain documented");
    assert.ok(architecture.includes("## Seis telas de trabalho — v24")&&changelog.includes("## [24.0.0]"),"v24 architecture and changelog must match release");
  }

  if (major >= 25) {
    const roadmap25=read("docs/ROADMAP-V25.md"),checkpoint25=read("docs/V25-CHECKPOINT.md"),acceptance25=read("docs/ACCEPTANCE-V25.md"),risks25=read("docs/RISK-REGISTER-V25.md");
    assert.ok(roadmap25.includes("25.0.0")&&checkpoint25.includes("25.0.0")&&acceptance25.includes("cronograma")&&risks25.includes("dias da semana"),"v25 governance must define scope, checkpoint, acceptance and risks");
    assert.ok((readme.includes("v25.0")||readme.includes("v26.0")||readme.includes("v27.0")||readme.includes("v27.1.1"))&&changelog.includes("## [25.0.0]")&&architecture.includes("## Cronograma semanal — v25"),"v25 history and current README, changelog and architecture must agree");
  }

  if (major >= 26) {
    const roadmap26=read("docs/ROADMAP-V26.md"),checkpoint26=read("docs/V26-CHECKPOINT.md"),acceptance26=read("docs/ACCEPTANCE-V26.md"),risks26=read("docs/RISK-REGISTER-V26.md");
    assert.ok(roadmap26.includes("26.0.0")&&checkpoint26.includes("26.0.0")&&acceptance26.includes("PRF-ADM")&&risks26.includes("celular"),"v26 governance must define scope, checkpoint, acceptance and risks");
    assert.ok((readme.includes("v26.0")||readme.includes("v27.0")||readme.includes("v27.1.1"))&&changelog.includes("## [26.0.0]")&&architecture.includes("## Ritmo de estudo e presença — v26"),"v26 README, changelog and architecture must agree");
  }

  if (major >= 27) {
    const roadmap27=read("docs/ROADMAP-V27.md"),checkpoint27=read("docs/V27-CHECKPOINT.md"),acceptance27=read("docs/ACCEPTANCE-V27.md"),risks27=read("docs/RISK-REGISTER-V27.md");
    assert.ok(roadmap27.includes("27.0.0")&&checkpoint27.includes("27.0.0")&&acceptance27.includes("segunda")&&risks27.includes("PRF Administrativo"),"v27 governance must define scope, checkpoint, acceptance and risks");
    assert.ok((readme.includes("v27.0")||readme.includes("v27"))&&changelog.includes("## [27.0.0]")&&architecture.includes("## Cronograma dia a dia — v27"),"v27 README, changelog and architecture must agree");
    const roadmap271=read("docs/ROADMAP-V27.1.md"),acceptance271=read("docs/ACCEPTANCE-V27.1.md"),audit271=read("docs/FINAL-AUDIT-V27.1.1.md");
    assert.ok(roadmap271.includes("Stage:** PUBLISHED")&&acceptance271.includes("v27.1.1")&&acceptance271.includes("[x] GitHub Actions Quality gate")&&acceptance271.includes("[ ] Inspeção visual móvel"),"v27.1 release governance must close publication while preserving the mobile QA limit");
    assert.ok(audit271.includes("864fb0410a845cacef53794a7061d2c6c7dd6182")&&audit271.includes("36368493310")&&audit271.includes("10948247167")&&audit271.includes("a35952ca77442ac02a9d5461a882164f872ad4ea41863cfcf2e7356e7d940eff")&&audit271.includes("144.642 bytes"),"v27.1.1 final audit must bind its commit, successful workflow, Pages artifact and shell measurements");
    const roadmap272=read("docs/ROADMAP-V27.2.md"),acceptance272=read("docs/ACCEPTANCE-V27.2.md"),audit272=read("docs/FINAL-AUDIT-V27.2.1.md");
    const budgetDecision=read("docs/APP-SHELL-BUDGET-CHANGE-2026-09-28.md");
    const roadmap2722=read("docs/ROADMAP-V27.2.2.md"),acceptance2722=read("docs/ACCEPTANCE-V27.2.2.md"),audit2722=read("docs/FINAL-AUDIT-V27.2.2.md");
    assert.ok(roadmap272.includes("27.2.0")&&roadmap272.includes("Major Cadar")&&acceptance272.includes("Major Cadar")&&acceptance272.includes("Brasília"),"v27.2 quote release must document scope and original daily selection");
    assert.ok(roadmap2722.includes("cinco minutos")&&acceptance2722.includes("cinco minutos")&&audit2722.includes("v27.2.2")&&audit2722.includes("Quality gate local"),"v27.2.2 must document five-minute quote rotation and local audit");
    assert.ok(audit272.includes("ce5288686fc8d8d60e504455721653ef5cb6a260")&&audit272.includes("36369866365")&&audit272.includes("10948796852")&&audit272.includes("c7acdea6599e50d905f3d735c3e9da7a9d3222a4f4d2589d6fbc16e2532debf3")&&audit272.includes("144.728 bytes"),"v27.2 final audit must bind the hotfix commit, successful workflow, Pages artifact and measured shell");
    assert.ok(budgetDecision.includes("147.456 bytes (144 KiB)")&&budgetDecision.includes("49.152 bytes (48 KiB)")&&budgetDecision.includes("autorizou")&&audit272.includes("APP-SHELL-BUDGET-CHANGE-2026-09-28.md"),"the post-v20 shell budget must have an explicit user authorization record");
    assert.ok(architecture.includes("Major Cadar")&&changelog.includes("## [27.2.0]"),"v27.2 quote experience must be described in architecture and changelog");
    const roadmap273=read("docs/ROADMAP-V27.3.0.md"),acceptance273=read("docs/ACCEPTANCE-V27.3.0.md"),risk273=read("docs/RISK-REGISTER-V27.3.0.md"),checkpoint273=read("docs/V27.3-CHECKPOINT.md"),audit273=read("docs/FINAL-AUDIT-V27.3.0.md");
    assert.ok(roadmap273.includes("27.3.0")&&roadmap273.includes("America/Sao_Paulo")&&acceptance273.includes("aria-current")&&risk273.includes("viewport móvel")&&checkpoint273.includes("PUBLISHED")&&acceptance273.includes("[x] Quality gate e Deploy to GitHub Pages")&&acceptance273.includes("[ ] QA visual manual móvel")&&audit273.includes("36426260988")&&audit273.includes("10970644399")&&audit273.includes("147.251 bytes"),"v27.3 governance must close the published release while keeping mobile QA pending");
    assert.ok(readme.includes("v27.3.0")&&changelog.includes("## [27.3.0]")&&architecture.includes("v27.3.0")&&audit273.includes("v27.3.0"),"v27.3 current release must be described consistently");
    assert.ok(!readme.includes("agenda semanal continua indicando a execução PRF como complementar")&&architecture.includes("Projeto PRF"),"current docs must classify PRF as a project, not only as a complementary track");
    const roadmap274=read("docs/ROADMAP-V27.4.0.md"),acceptance274=read("docs/ACCEPTANCE-V27.4.0.md"),risk274=read("docs/RISK-REGISTER-V27.4.0.md"),checkpoint274=read("docs/V27.4-CHECKPOINT.md"),audit274=read("docs/FINAL-AUDIT-V27.4.0.md");
    assert.ok(roadmap274.includes("27.4.0")&&roadmap274.includes("GitHub Pages")&&acceptance274.includes("Notion")&&risk274.includes("snapshot")&&checkpoint274.includes("v27.4.0")&&audit274.includes("Quality gate"),"v27.4 governance must document the PRF site, preserved source and release audit");
    assert.ok(readme.includes("v27.6.0")&&changelog.includes("## [27.6.0]")&&architecture.includes("v27.4.2"),"v27.6.0 current release must preserve the v27.4 architecture history");
    const roadmap2741=read("docs/ROADMAP-V27.4.1.md"),acceptance2741=read("docs/ACCEPTANCE-V27.4.1.md"),risk2741=read("docs/RISK-REGISTER-V27.4.1.md"),checkpoint2741=read("docs/V27.4.1-CHECKPOINT.md"),audit2741=read("docs/FINAL-AUDIT-V27.4.1.md");
    assert.ok(roadmap2741.includes("27.4.1")&&roadmap2741.includes("desktop")&&acceptance2741.includes("Autoria")&&risk2741.includes("App shell")&&checkpoint2741.includes("v27.4.1")&&audit2741.includes("Quality gate"),"v27.4.1 governance must document the desktop quote redesign and release audit");
    const roadmap2742=read("docs/ROADMAP-V27.4.2.md"),acceptance2742=read("docs/ACCEPTANCE-V27.4.2.md"),risk2742=read("docs/RISK-REGISTER-V27.4.2.md"),checkpoint2742=read("docs/V27.4.2-CHECKPOINT.md"),audit2742=read("docs/FINAL-AUDIT-V27.4.2.md");
    assert.ok(roadmap2742.includes("P4")&&acceptance2742.includes("P1")&&acceptance2742.includes("P4")&&risk2742.includes("duas colunas")&&checkpoint2742.includes("PUBLISHED")&&audit2742.includes("P1–P4")&&audit2742.includes("36445529505")&&audit2742.includes("10980661883"),"v27.4.2 governance must record the priority change, responsive behavior and published audit");
    const roadmap2743=read("docs/ROADMAP-V27.4.3.md"),acceptance2743=read("docs/ACCEPTANCE-V27.4.3.md"),risk2743=read("docs/RISK-REGISTER-V27.4.3.md"),checkpoint2743=read("docs/V27.4.3-CHECKPOINT.md"),audit2743=read("docs/FINAL-AUDIT-V27.4.3.md");
    assert.ok(roadmap2743.includes("27.4.3")&&roadmap2743.includes("33 sessões")&&acceptance2743.includes("PRFADM33")&&acceptance2743.includes("Plataforma de Questões")&&risk2743.includes("Notion")&&checkpoint2743.includes("PUBLISHED")&&acceptance2743.includes("Pages Deploy aprovados")&&audit2743.includes("PRFADM01–33")&&audit2743.includes("36460170138"),"v27.4.3 must record the 33-session PRF correction and successful publication");
    const roadmap275=read("docs/ROADMAP-V27.5.0.md"),acceptance275=read("docs/ACCEPTANCE-V27.5.0.md"),risk275=read("docs/RISK-REGISTER-V27.5.0.md"),checkpoint275=read("docs/V27.5-CHECKPOINT.md"),audit275=read("docs/FINAL-AUDIT-V27.5.0.md");
    assert.ok(roadmap275.includes("27.5.0")&&roadmap275.includes("PUBLISHED")&&acceptance275.includes("bloqueio editorial")&&acceptance275.includes("36486528901")&&risk275.includes("teto aprovado")&&checkpoint275.includes("PUBLISHED")&&checkpoint275.includes("147.360/147.456")&&audit275.includes("36486528901")&&audit275.includes("10999012799")&&audit275.includes("Quality gate"),"v27.5 governance must record scope, acceptance, risks and the successful deployment audit");
    const roadmap276=read("docs/ROADMAP-V27.6.0.md"),acceptance276=read("docs/ACCEPTANCE-V27.6.0.md"),risk276=read("docs/RISK-REGISTER-V27.6.0.md"),checkpoint276=read("docs/V27.6-CHECKPOINT.md"),audit276=read("docs/FINAL-AUDIT-V27.6.0.md");
    assert.ok(roadmap276.includes("27.6.0")&&roadmap276.includes("horas estudadas")&&acceptance276.includes("não sincroniza com o Notion")&&risk276.includes("backup")&&checkpoint276.includes("PUBLISHED")&&audit276.includes("36494568358"),"v27.6 governance must record the published local study tracker, privacy and successful deployment");
    const roadmap2761=read("docs/ROADMAP-V27.6.1.md"),acceptance2761=read("docs/ACCEPTANCE-V27.6.1.md"),risk2761=read("docs/RISK-REGISTER-V27.6.1.md"),checkpoint2761=read("docs/V27.6.1-CHECKPOINT.md"),audit2761=read("docs/FINAL-AUDIT-V27.6.1.md");
    assert.ok(roadmap2761.includes("27.6.1")&&roadmap2761.includes("campos de duração")&&roadmap2761.includes("PUBLISHED")&&acceptance2761.includes("rótulos acima")&&acceptance2761.includes("workflow #382")&&risk2761.includes("na mesma linha")&&checkpoint2761.includes("PUBLISHED")&&audit2761.includes("36494985818")&&audit2761.includes("11002388897"),"v27.6.1 governance must record the published duration-field correction and deployment audit");
    const roadmap277=read("docs/ROADMAP-V27.7.0.md"),acceptance277=read("docs/ACCEPTANCE-V27.7.0.md"),risk277=read("docs/RISK-REGISTER-V27.7.0.md"),checkpoint277=read("docs/V27.7-CHECKPOINT.md"),audit277=read("docs/FINAL-AUDIT-V27.7.0.md");
    assert.ok(roadmap277.includes("27.7.0")&&roadmap277.includes("PUBLISHED")&&roadmap277.includes("#agenda-semanal")&&acceptance277.includes("P01–P18")&&acceptance277.includes("PRFADM01–PRFADM33")&&risk277.includes("desatualizado")&&checkpoint277.includes("PUBLISHED")&&audit277.includes("bd0ac36beb9f53e899035d0e12e5e9a042f325b7")&&audit277.includes("workflow run #384")&&audit277.includes("11005355766"),"v27.7 governance must document the mapped catalogs, unchanged schedule, published workflow, artifact and runtime cache risks");
  }

  if (version === "28.0.3") {
    const roadmap283=read("docs/ROADMAP-V28.0.3.md"),checkpoint283=read("docs/V28.0.3-CHECKPOINT.md"),acceptance283=read("docs/ACCEPTANCE-V28.0.3.md"),risks283=read("docs/RISK-REGISTER-V28.0.3.md"),audit283=read("docs/FINAL-AUDIT-V28.0.3.md");
    assert.ok(roadmap283.includes("P1–P4")&&roadmap283.includes("PUBLISHED")&&checkpoint283.includes("PUBLISHED")&&acceptance283.includes("[x] A aba “Agora”")&&risks283.includes("Precisão parece uma medida de conclusão"),"v28.0.3 governance must cover the P1–P4 Mentor page, acceptance and data-interpretation risks");
    assert.ok(audit283.includes("#26")&&audit283.includes("9f1bba387d5d2592d8e8650daa3a778759bc7fa0")&&audit283.includes("36612869668")&&audit283.includes("Inspeção visual separada em viewport móvel não foi executada"),"v28.0.3 final audit must bind the publication and disclose the remaining visual mobile review");
    assert.ok(readme.includes("aprimora a página `/mentor/`")&&changelog.includes("## [28.0.3]")&&architecture.includes("Panorama visual P1–P4 — v28.0.3"),"current Mentor redesign must be reflected in README, changelog and architecture");
  }
  if (version === "28.1.0") {
    const roadmap281=read("docs/ROADMAP-V28.1.0.md"),checkpoint281=read("docs/V28.1.0-CHECKPOINT.md"),acceptance281=read("docs/ACCEPTANCE-V28.1.0.md"),risks281=read("docs/RISK-REGISTER-V28.1.0.md"),audit281=read("docs/FINAL-AUDIT-V28.1.0.md");
    assert.ok(roadmap281.includes("P1–P4")&&roadmap281.includes("PUBLISHED")&&checkpoint281.includes("ecosystem-integration-v1")&&checkpoint281.includes("PUBLISHED")&&acceptance281.includes("[x] CI do PR")&&acceptance281.includes("O Painel lê um único catálogo público")&&risks281.includes("dois dias de calendário atrás em Brasília"),"v28.1.0 governance must cover P1–P4, the shared registry, public contracts, freshness and published release gates");
    assert.ok(audit281.includes("P1 — SEEDF")&&audit281.includes("P2 — TJDFT")&&audit281.includes("P3 — TCE-GO")&&audit281.includes("P4 — PRF Administrativo")&&audit281.includes("36620886883")&&audit281.includes("5f3a55a2644d0a381f1fe67c2c63bf26a26aff43"),"v28.1.0 final audit must record all live projects, their deploy and the title-only follow-up state");
    assert.ok(readme.includes("v28.2")&&changelog.includes("## [28.2.0]")&&architecture.includes("Carteira ativa P1–P3 e arquivo TCE-GO — v28.2.0"),"current portfolio and archive rules must be reflected in README, changelog and architecture");
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
    "js/command-context-v1.js",
    "css/app.css",
    "css/catalog-v4.css",
    "css/personalization-v5.css",
    "css/timeline-v8.css",
    "css/pro-v11.css",
    "js/operational-v13.js",
    "js/workspace-v24.js",
    "js/study-log-v1.js",
    "js/study-sync-v1.js",
    "js/study-planner-v1.js",
    "config/study-catalog-v1.json",
    "css/study-log-v1.css",
    "css/study-planner-v1.css",
    "css/operational-v13.css",
    "css/workspace-v24.css",
    "css/workspace-v26.css",
    "css/workspace-v27.css",
    "mentor/index.html",
    "mentor/mentor.css",
    "mentor/mentor.js"
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
  "js/command-context-v1.js",
  "js/operational-v13.js",
  "js/workspace-v24.js",
  "js/study-log-v1.js",
  "js/study-sync-v1.js",
  "js/study-planner-v1.js",
  "mentor/mentor.js",
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
testV272MajorCadarQuotes();
testV21PresenceExperience();
testV22CommandCenter();
testV23TodayMentor();
testV24ScreensAndViews(registry);
testV27DailySchedule(registry);
testV278AdaptiveMentor(registry);
testV279ProjectStudySignals(registry);
testV28DedicatedMentor(registry);
testV281DailyCloseoutHydration();
testHomeResponsiveLayout();
testStudyLog(registry);
testStudySync();
testStudyPlanner(registry);
testCommandContext();
testV274PrfSiteAndToolDirectory(registry);
testCatalogLegacyPriorityOrder();
testReleaseDocumentationCoherence(registry);
testSecurityAndContracts(registry);

console.log("\nQuality gate PASS");
