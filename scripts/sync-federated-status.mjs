import { mkdir, readFile, writeFile } from "node:fs/promises";

const ROOT = new URL("../", import.meta.url);
const OUTPUT = new URL("data/federated-status.json", ROOT);
const NOTION_VERSION = "2026-03-11";

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

async function readWithFallback(primary, fallback) {
  try {
    return { value: await readJson(primary), via: "pages" };
  } catch (firstError) {
    try {
      return { value: await readJson(fallback), via: "raw-github" };
    } catch {
      throw firstError;
    }
  }
}

async function notionStatus(envName) {
  const token = process.env[envName];
  if (!token) return "missing";
  try {
    const response = await fetch("https://api.notion.com/v1/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": NOTION_VERSION,
        Accept: "application/json"
      },
      signal: AbortSignal.timeout(6000)
    });
    return response.ok ? "verified" : "error";
  } catch {
    return "error";
  }
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

function timestampOf(source) {
  const values = [
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

  const notion = await notionStatus(TOKEN_ENV[project.id]);
  sources[project.id] = {
    kind: "project",
    publicStatus,
    notionStatus: notion,
    sourceUrl: project.statusUrl,
    transport,
    contract
  };
  console.log(`${project.id}: public=${publicStatus}; notion=${notion}`);
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

  const notion = await notionStatus(TOKEN_ENV[tool.id]);
  sources[tool.id] = {
    kind: tool.kind,
    publicStatus,
    notionStatus: notion,
    sourceUrl: tool.url,
    transport,
    state
  };
  console.log(`${tool.id}: public=${publicStatus}; notion=${notion}`);
}

const newest = Object.values(sources).map(timestampOf).filter(Boolean).sort((a, b) => b - a)[0];
const payload = {
  schemaVersion: 1,
  generatedAt: newest ? new Date(newest).toISOString() : new Date().toISOString(),
  sources,
  privacy: {
    secretsPublished: false,
    tokenValuesStored: false,
    notionIdentityStored: false
  }
};

await mkdir(new URL("data/", ROOT), { recursive: true });
await writeFile(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log("data/federated-status.json atualizado sem publicar credenciais.");
