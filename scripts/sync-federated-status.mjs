import { mkdir, readFile, writeFile } from "node:fs/promises";

const ROOT = new URL("../", import.meta.url);
const OUTPUT = new URL("data/federated-status.json", ROOT);
const INTEGRATION_CONFIG = new URL("config/integration-sources-v1.json", ROOT);
const DEFAULT_NOTION_VERSION = "2026-03-11";

const TOKEN_ENV = {
  seedf: "SEEDF",
  tjdft: "TJDFT_NOTION_TOKEN",
  "prf-adm": "PRF_ADM_GITHUB",
  "plataforma-questoes": "PLATAFORMA_DE_QUESTOES",
  "plano-de-transicao": "PLANO_DE_TRANSICAO_GITHUB"
};

const RAW_FALLBACKS = {
  seedf: "https://raw.githubusercontent.com/RodrigoRosaDantas/seedf-ppge-dashboard/main/public/central-status.json",
  tjdft: "https://raw.githubusercontent.com/RodrigoRosaDantas/tjdft-dashboard/main/public/central-status.json",
  "prf-adm": "https://raw.githubusercontent.com/RodrigoRosaDantas/prf-administrativo-dashboard/main/central-status.json",
  "plataforma-questoes": "https://raw.githubusercontent.com/RodrigoRosaDantas/plataforma-questoes/main/data/metadata.json",
  "plano-de-transicao": "https://raw.githubusercontent.com/RodrigoRosaDantas/plano-de-transicao/main/data/snapshot.json"
};

async function readJson(url) {
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) throw new Error(`http-${response.status}`);
  return response.json();
}

function sourceTimestamp(value) {
  const candidates = [
    value?.source?.updatedAt,
    value?.study?.updatedAt,
    value?.generatedAt,
    value?.meta?.generatedAt,
    value?.updatedAt
  ];
  const parsed = candidates
    .map(item => Date.parse(item || ""))
    .filter(Number.isFinite)
    .sort((a, b) => b - a);
  return parsed[0] || null;
}

async function readWithFallback(primary, fallback) {
  const [pagesResult, rawResult] = await Promise.allSettled([
    readJson(primary),
    readJson(fallback)
  ]);

  if (pagesResult.status === "fulfilled" && rawResult.status === "fulfilled") {
    const pagesTime = sourceTimestamp(pagesResult.value);
    const rawTime = sourceTimestamp(rawResult.value);
    if (rawTime && (!pagesTime || rawTime > pagesTime)) {
      return { value: rawResult.value, via: "raw-github" };
    }
    return { value: pagesResult.value, via: "pages" };
  }

  if (pagesResult.status === "fulfilled") return { value: pagesResult.value, via: "pages" };
  if (rawResult.status === "fulfilled") return { value: rawResult.value, via: "raw-github" };
  throw pagesResult.reason || rawResult.reason || new Error("source-unavailable");
}

async function notionRequest(token, version, endpoint, init = {}) {
  const response = await fetch(`https://api.notion.com/v1${endpoint}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": version || DEFAULT_NOTION_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers || {})
    },
    signal: AbortSignal.timeout(7000)
  });
  if (!response.ok) throw new Error(`http-${response.status}`);
  return response.json();
}

async function notionIdentityStatus(token, version) {
  if (!token) return "missing";
  try {
    await notionRequest(token, version, "/users/me");
    return "verified";
  } catch {
    return "error";
  }
}

async function probeLatestEdit(token, version, probe) {
  if (probe.kind === "page") {
    const page = await notionRequest(token, version, `/pages/${probe.id}`);
    return typeof page?.last_edited_time === "string" ? page.last_edited_time : null;
  }

  const prefix = probe.kind === "dataSource" ? "data_sources" : probe.kind === "database" ? "databases" : null;
  if (!prefix) throw new Error("unsupported-probe");

  const result = await notionRequest(token, version, `/${prefix}/${probe.id}/query`, {
    method: "POST",
    body: JSON.stringify({
      page_size: 1,
      sorts: [{ timestamp: "last_edited_time", direction: "descending" }]
    })
  });
  const first = Array.isArray(result?.results) ? result.results[0] : null;
  if (typeof first?.last_edited_time === "string") return first.last_edited_time;

  const container = await notionRequest(token, version, `/${prefix}/${probe.id}`);
  return typeof container?.last_edited_time === "string" ? container.last_edited_time : null;
}

function probeFailureReason(error) {
  const message = String(error?.message || "");
  const http = message.match(/^http-(\d{3})$/);
  if (http) return `http-${http[1]}`;
  if (error?.name === "TimeoutError" || error?.name === "AbortError") return "timeout";
  return "request-error";
}

async function inspectNotionSource(sourceId, sourceConfig) {
  const token = process.env[TOKEN_ENV[sourceId]];
  const notionVersion = sourceConfig?.notionVersion || DEFAULT_NOTION_VERSION;
  const notionStatus = await notionIdentityStatus(token, notionVersion);
  const configured = Array.isArray(sourceConfig?.probes) ? sourceConfig.probes : [];
  const probes = [];

  if (notionStatus === "verified") {
    for (const probe of configured) {
      try {
        const latestEditedAt = await probeLatestEdit(token, notionVersion, probe);
        probes.push({
          label: probe.label,
          status: latestEditedAt ? "ok" : "empty",
          latestEditedAt: latestEditedAt || null
        });
      } catch (error) {
        probes.push({
          label: probe.label,
          status: "error",
          latestEditedAt: null,
          reason: probeFailureReason(error)
        });
      }
    }
  } else {
    configured.forEach(probe => probes.push({ label: probe.label, status: "not-checked", latestEditedAt: null }));
  }

  const edited = probes
    .map(item => Date.parse(item.latestEditedAt || ""))
    .filter(Number.isFinite)
    .sort((a, b) => b - a);
  const ok = probes.filter(item => item.status === "ok").length;

  return {
    notionStatus,
    notionLatestEditedAt: edited.length ? new Date(edited[0]).toISOString() : null,
    checks: { ok, total: configured.length },
    probes
  };
}

function validContract(contract, projectId) {
  return Boolean(
    contract &&
    contract.schemaVersion === 1 &&
    contract.projectId === projectId &&
    contract.source &&
    contract.source.kind === "public-project-state" &&
    contract.state &&
    typeof contract.state === "object"
  );
}

function parseTime(value) {
  const parsed = Date.parse(value || "");
  return Number.isFinite(parsed) ? parsed : null;
}

function buildIntegrity({ publicStatus, publishedUpdatedAt, notion, toleranceSeconds }) {
  const publishedTime = parseTime(publishedUpdatedAt);
  const notionTime = parseTime(notion.notionLatestEditedAt);
  const total = notion.checks?.total || 0;
  const ok = notion.checks?.ok || 0;
  let status = "unverifiable";
  let sourceAheadSeconds = null;

  if (publicStatus !== "live") {
    status = "public-unavailable";
  } else if (notion.notionStatus !== "verified" || !publishedTime || !notionTime) {
    status = "unverifiable";
  } else {
    sourceAheadSeconds = Math.max(0, Math.floor((notionTime - publishedTime) / 1000));
    if (sourceAheadSeconds > toleranceSeconds) status = "source-newer";
    else if (ok < total) status = "partial-check";
    else status = "aligned";
  }

  return {
    status,
    coverage: `${ok}/${total}`,
    notionLatestEditedAt: notion.notionLatestEditedAt,
    publishedUpdatedAt: publishedUpdatedAt || null,
    sourceAheadSeconds,
    probes: notion.probes
  };
}

function timestampOf(source) {
  const values = [
    source?.integrity?.notionLatestEditedAt,
    source?.contract?.source?.updatedAt,
    source?.contract?.study?.updatedAt,
    source?.state?.generatedAt
  ];
  return values
    .map(value => Date.parse(value || ""))
    .filter(Number.isFinite)
    .sort((a, b) => b - a)[0] || null;
}

let previous = { sources: {} };
try {
  previous = JSON.parse(await readFile(OUTPUT, "utf8"));
} catch {}

const registry = JSON.parse(await readFile(new URL("config/projects.json", ROOT), "utf8"));
const integrationConfig = JSON.parse(await readFile(INTEGRATION_CONFIG, "utf8"));
if (integrationConfig?.schemaVersion !== 1 || !integrationConfig?.sources) {
  throw new Error("config/integration-sources-v1.json inválido.");
}
const toleranceSeconds = Number.isInteger(integrationConfig.toleranceSeconds)
  ? integrationConfig.toleranceSeconds
  : 120;
const sources = {};

for (const project of registry.projects.filter(item => item.status === "active" && item.statusUrl)) {
  const old = previous?.sources?.[project.id] || {};
  let contract = old.contract || null;
  let publicStatus = contract ? "stale" : "unavailable";
  let transport = old.transport || null;

  try {
    const fresh = await readWithFallback(project.statusUrl, RAW_FALLBACKS[project.id]);
    if (!validContract(fresh.value, project.id)) throw new Error("invalid-contract");
    contract = fresh.value;
    publicStatus = "live";
    transport = fresh.via;
  } catch {}

  const notion = await inspectNotionSource(project.id, integrationConfig.sources[project.id]);
  const publishedUpdatedAt = contract?.source?.updatedAt || contract?.study?.updatedAt || null;
  const integrity = buildIntegrity({ publicStatus, publishedUpdatedAt, notion, toleranceSeconds });

  sources[project.id] = {
    kind: "project",
    publicStatus,
    notionStatus: notion.notionStatus,
    sourceUrl: project.statusUrl,
    transport,
    integrity,
    contract
  };
  console.log(
    `${project.id}: public=${publicStatus}; notion=${notion.notionStatus}; integrity=${integrity.status}; checks=${integrity.coverage}`
  );
}

const tools = [
  {
    id: "plataforma-questoes",
    kind: "tool",
    url: "https://rodrigorosadantas.github.io/plataforma-questoes/data/metadata.json",
    sanitize(value) {
      return {
        generatedAt: value?.generatedAt || null,
        questionCount: Number.isInteger(value?.questionCount) ? value.questionCount : null,
        records: Number.isInteger(value?.sourceAudit?.records) ? value.sourceAudit.records : null,
        published: Number.isInteger(value?.sourceAudit?.published) ? value.sourceAudit.published : null,
        excluded: Number.isInteger(value?.sourceAudit?.excluded) ? value.sourceAudit.excluded : null,
        sampleMode: value?.sampleMode === true
      };
    }
  },
  {
    id: "plano-de-transicao",
    kind: "journey",
    url: "https://rodrigorosadantas.github.io/plano-de-transicao/data/snapshot.json",
    sanitize(value) {
      return {
        generatedAt: value?.meta?.generatedAt || null,
        live: value?.meta?.live === true,
        phase: typeof value?.meta?.phase === "string" ? value.meta.phase : null,
        syncWarnings: Array.isArray(value?.meta?.syncWarnings) ? value.meta.syncWarnings.length : null,
        dataWarnings: Array.isArray(value?.meta?.dataWarnings) ? value.meta.dataWarnings.length : null
      };
    }
  }
];

for (const tool of tools) {
  const old = previous?.sources?.[tool.id] || {};
  let state = old.state || null;
  let publicStatus = state ? "stale" : "unavailable";
  let transport = old.transport || null;

  try {
    const fresh = await readWithFallback(tool.url, RAW_FALLBACKS[tool.id]);
    state = tool.sanitize(fresh.value);
    publicStatus = "live";
    transport = fresh.via;
  } catch {}

  const notion = await inspectNotionSource(tool.id, integrationConfig.sources[tool.id]);
  const publishedUpdatedAt = state?.generatedAt || null;
  const integrity = buildIntegrity({ publicStatus, publishedUpdatedAt, notion, toleranceSeconds });

  sources[tool.id] = {
    kind: tool.kind,
    publicStatus,
    notionStatus: notion.notionStatus,
    sourceUrl: tool.url,
    transport,
    integrity,
    state
  };
  console.log(
    `${tool.id}: public=${publicStatus}; notion=${notion.notionStatus}; integrity=${integrity.status}; checks=${integrity.coverage}`
  );
}

const newest = Object.values(sources).map(timestampOf).filter(Boolean).sort((a, b) => b - a)[0];
const checkedAt = new Date().toISOString();
const payload = {
  schemaVersion: 2,
  generatedAt: checkedAt,
  checkedAt,
  latestSourceAt: newest ? new Date(newest).toISOString() : null,
  toleranceSeconds,
  sources,
  privacy: {
    secretsPublished: false,
    tokenValuesStored: false,
    notionIdentityStored: false,
    notionContentStored: false
  }
};

await mkdir(new URL("data/", ROOT), { recursive: true });
await writeFile(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log("data/federated-status.json atualizado com conferência de integridade sem publicar credenciais ou conteúdo privado.");
