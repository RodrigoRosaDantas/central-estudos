const STORAGE_KEY = "central-estudos:last-project";
const FOCUS_STORAGE_KEY = "central-estudos:focus-project";
const HEALTH_TIMEOUT_MS = 4500;
const META_TIMEOUT_MS = 4500;
const HEALTH_CACHE_KEY = "central-estudos:health-v9";
const HEALTH_CACHE_TTL_MS = 2 * 60 * 1000;
const META_CACHE_KEY = "central-estudos:repo-meta-v3";
const META_CACHE_TTL_MS = 15 * 60 * 1000;

const state = {
  config: null,
  projects: [],
  focus: null,
  storageAvailable: true,
  githubApiState: "checking"
};

function byId(id) {
  return document.getElementById(id);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function safeStorageGet(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    state.storageAvailable = false;
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    state.storageAvailable = false;
    return false;
  }
}

function safeStorageRemove(key) {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch {
    state.storageAvailable = false;
    return false;
  }
}

function showSystemNotice(message, kind = "info") {
  const notice = byId("system-notice");
  if (!notice) return;
  notice.textContent = message;
  notice.className = `system-notice is-${kind}`;
}

function hideSystemNotice() {
  const notice = byId("system-notice");
  if (!notice) return;
  notice.textContent = "";
  notice.className = "system-notice is-hidden";
}

function validateConfig(config) {
  if (!config || typeof config !== "object") {
    throw new Error("Configuração da Central inválida.");
  }
  if (!config.central || typeof config.central.defaultProject !== "string") {
    throw new Error("Configuração central incompleta.");
  }
  if (!Array.isArray(config.projects) || config.projects.length === 0) {
    throw new Error("Nenhum ambiente configurado.");
  }

  const required = ["id", "name", "description", "phase", "status", "priority", "icon", "url", "repository"];
  const ids = new Set();

  config.projects.forEach(project => {
    required.forEach(field => {
      if (typeof project[field] !== "string" || !project[field].trim()) {
        throw new Error(`Projeto com campo obrigatório inválido: ${field}.`);
      }
    });

    if (!/^[a-z0-9_-]+$/i.test(project.id)) {
      throw new Error(`ID de projeto inválido: ${project.id}.`);
    }
    if (ids.has(project.id)) throw new Error(`ID de projeto duplicado: ${project.id}.`);
    ids.add(project.id);

    for (const field of ["url", "repository"]) {
      let parsed;
      try {
        parsed = new URL(project[field]);
      } catch {
        throw new Error(`URL inválida em ${project.id}.`);
      }
      if (parsed.protocol !== "https:") throw new Error(`URL não segura em ${project.id}.`);
    }
  });

  if (!ids.has(config.central.defaultProject)) {
    throw new Error("Projeto padrão não existe no registry.");
  }
  if (typeof config.central.version !== "string" || !/^\d+\.\d+\.\d+$/.test(config.central.version)) {
    throw new Error("Versão central inválida.");
  }

  return config;
}

function normalizeProject(project) {
  return {
    ...project,
    id: project.id.trim(),
    name: project.name.trim(),
    description: project.description.trim(),
    phase: project.phase.trim(),
    status: project.status.trim(),
    priority: project.priority.trim(),
    icon: project.icon.trim(),
    url: new URL(project.url).href,
    repository: new URL(project.repository).href,
    health: "checking",
    healthMetaState: "checking",
    healthCheckedAt: null,
    repoUpdatedAt: null,
    repoMetaState: "checking",
    repoCheckedAt: null,
    deployStatus: "checking",
    deployUpdatedAt: null,
    deployMetaState: "checking"
  };
}

function readLastVisit() {
  const raw = safeStorageGet(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.id === "string") {
      return {
        id: parsed.id,
        visitedAt: typeof parsed.visitedAt === "string" ? parsed.visitedAt : null
      };
    }
  } catch {}

  if (/^[a-z0-9_-]+$/i.test(raw)) return { id: raw, visitedAt: null };
  safeStorageRemove(STORAGE_KEY);
  return null;
}

function readFocusPreference() {
  const value = safeStorageGet(FOCUS_STORAGE_KEY);
  return value && /^[a-z0-9_-]+$/i.test(value) ? value : null;
}

function chooseFocus(projects, defaultProject) {
  const preferredId = readFocusPreference();
  const preferred = projects.find(project => project.id === preferredId);
  if (preferredId && !preferred) safeStorageRemove(FOCUS_STORAGE_KEY);

  return (
    preferred ||
    projects.find(project => project.id === defaultProject) ||
    projects.find(project => project.priority === "focus") ||
    projects[0]
  );
}

function setFocusProject(project) {
  safeStorageSet(FOCUS_STORAGE_KEY, project.id);
  state.focus = project;
  renderFocus(project);
  renderProjects();

  if (!state.storageAvailable) {
    showSystemNotice("A preferência de foco vale apenas nesta sessão porque o armazenamento local não está disponível.", "warning");
  }
}

function rememberProject(project) {
  const visitedAt = new Date().toISOString();
  safeStorageSet(STORAGE_KEY, JSON.stringify({
    id: project.id,
    visitedAt
  }));

  if (typeof CustomEvent === "function") {
    document.dispatchEvent(new CustomEvent("central:project-opened", {
      detail: {
        id: project.id,
        name: project.name,
        visitedAt
      }
    }));
  }
}

function openProject(project) {
  rememberProject(project);
  window.location.assign(project.url);
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia, Rodrigo.";
  if (hour < 18) return "Boa tarde, Rodrigo.";
  return "Boa noite, Rodrigo.";
}

function readHealthCache() {
  const raw = safeStorageGet(HEALTH_CACHE_KEY);
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    safeStorageRemove(HEALTH_CACHE_KEY);
    return {};
  }
}

function writeHealthCache(cache) {
  safeStorageSet(HEALTH_CACHE_KEY, JSON.stringify(cache));
}

function readRepoMetaCache() {
  const raw = safeStorageGet(META_CACHE_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    safeStorageRemove(META_CACHE_KEY);
    return {};
  }
}

function writeRepoMetaCache(cache) {
  safeStorageSet(META_CACHE_KEY, JSON.stringify(cache));
}

function githubRepoParts(project) {
  try {
    const url = new URL(project.repository);
    const parts = url.pathname.split("/").filter(Boolean);
    if (url.hostname !== "github.com" || parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1] };
  } catch {
    return null;
  }
}

function githubApiBase(project) {
  const parts = githubRepoParts(project);
  return parts ? `https://api.github.com/repos/${parts.owner}/${parts.repo}` : null;
}

function relativeTimeFromNow(isoDate) {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return null;

  const diffMs = date.getTime() - Date.now();
  const absMs = Math.abs(diffMs);
  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (absMs < hour) return rtf.format(Math.round(diffMs / minute), "minute");
  if (absMs < day) return rtf.format(Math.round(diffMs / hour), "hour");
  return rtf.format(Math.round(diffMs / day), "day");
}

function exactDateTime(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date);
}

function isRateLimited(response) {
  return response.status === 429 ||
    (response.status === 403 && response.headers.get("x-ratelimit-remaining") === "0");
}

async function fetchGithubJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), META_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
      cache: "no-store",
      signal: controller.signal
    });

    if (isRateLimited(response)) {
      state.githubApiState = "rate-limited";
      return { ok: false, reason: "rate-limited", data: null };
    }

    if (!response.ok) {
      return { ok: false, reason: `http-${response.status}`, data: null };
    }

    if (state.githubApiState !== "rate-limited") state.githubApiState = "online";
    return { ok: true, reason: null, data: await response.json() };
  } catch {
    if (state.githubApiState !== "rate-limited") state.githubApiState = "unknown";
    return { ok: false, reason: "network", data: null };
  } finally {
    clearTimeout(timeout);
  }
}

function repoFreshnessMarkup(project) {
  if (project.repoMetaState === "checking") {
    return '<div class="observability-row"><span class="observability-icon">↻</span><span class="observability-copy"><span class="observability-label is-muted">Publicação técnica: verificando…</span><span class="observability-meta">Fonte: GitHub público</span></span></div>';
  }

  if (!project.repoUpdatedAt) {
    return '<div class="observability-row"><span class="observability-icon">·</span><span class="observability-copy"><span class="observability-label is-muted">Publicação técnica: não verificada</span><span class="observability-meta">Fonte: GitHub público</span></span></div>';
  }

  const relative = relativeTimeFromNow(project.repoUpdatedAt) || "em data conhecida";
  const exact = exactDateTime(project.repoUpdatedAt);
  const stale = project.repoMetaState === "stale-cache";
  const label = stale
    ? `Publicação técnica: cache · ${relative}`
    : `Publicação técnica: ${relative}`;
  const meta = stale
    ? `Dado preservado em cache · última checagem ${relativeTimeFromNow(project.repoCheckedAt) || "anterior"}`
    : `GitHub público · ${exact}`;

  return `<div class="observability-row"><span class="observability-icon">${stale ? "◷" : "↑"}</span><span class="observability-copy"><span class="observability-label ${stale ? "is-warning" : ""}">${label}</span><span class="observability-meta">${meta}</span></span></div>`;
}

function deployMarkup(project) {
  if (project.deployMetaState === "checking") {
    return '<div class="observability-row"><span class="observability-icon">↻</span><span class="observability-copy"><span class="observability-label is-muted">Deploy: verificando…</span><span class="observability-meta">Workflow público do GitHub</span></span></div>';
  }

  if (project.deployStatus === "unknown") {
    return '<div class="observability-row"><span class="observability-icon">·</span><span class="observability-copy"><span class="observability-label is-muted">Deploy: não verificado</span><span class="observability-meta">Nenhum workflow público de deploy identificado</span></span></div>';
  }

  const stale = project.deployMetaState === "stale-cache";
  const statusMap = {
    success: ["Publicado", "is-success", "✓"],
    failure: ["Falha no último deploy", "is-danger", "!"],
    cancelled: ["Último deploy cancelado", "is-warning", "–"],
    in_progress: ["Deploy em andamento", "is-warning", "↻"],
    queued: ["Deploy na fila", "is-warning", "…"]
  };
  const [label, className, icon] = statusMap[project.deployStatus] || ["Deploy: estado público conhecido", "is-muted", "·"];
  const relative = relativeTimeFromNow(project.deployUpdatedAt);
  const meta = stale
    ? `Dado em cache · ${relative || "checagem anterior"}`
    : `Workflow público${relative ? ` · ${relative}` : ""}`;

  return `<div class="observability-row"><span class="observability-icon">${icon}</span><span class="observability-copy"><span class="observability-label ${stale ? "is-warning" : className}">${stale ? "Deploy em cache: " : "Deploy: "}${label}</span><span class="observability-meta">${meta}</span></span></div>`;
}

function healthLabel(status) {
  if (status === "online") return "Site acessível";
  if (status === "offline") return "Site respondeu com erro";
  if (status === "unknown") return "Disponibilidade não verificada";
  return "Verificando disponibilidade";
}

function healthMarkup(project) {
  const status = project.health;
  const cached = project.healthMetaState === "cached" || project.healthMetaState === "stale-cache";
  const className = cached
    ? "is-warning"
    : status === "online"
      ? "is-success"
      : status === "offline"
        ? "is-danger"
        : "is-muted";
  const icon = cached ? "◷" : status === "online" ? "✓" : status === "offline" ? "!" : status === "checking" ? "↻" : "·";
  const label = cached ? `Disponibilidade em cache: ${healthLabel(status)}` : healthLabel(status);
  const checked = project.healthCheckedAt ? exactDateTime(project.healthCheckedAt) : null;
  const meta = cached
    ? `${project.healthMetaState === "stale-cache" ? "Cache antigo" : "Cache recente"}${checked ? ` · checagem ${checked}` : ""}; não confirma o estado neste instante`
    : status === "unknown"
      ? "Falha de rede ou verificação inconclusiva; o link continua disponível"
      : "Tentativa técnica direta ao site";

  return `<div class="observability-row"><span class="observability-icon">${icon}</span><span class="observability-copy"><span class="observability-label ${className}">${label}</span><span class="observability-meta">${meta}</span></span></div>`;
}

function updatePulse() {
  const projectCount = state.projects.length;
  const onlineCount = state.projects.filter(project => project.health === "online" && project.healthMetaState === "live").length;
  const cachedCount = state.projects.filter(project => project.healthMetaState === "cached" || project.healthMetaState === "stale-cache").length;
  const healthPending = state.projects.some(project => project.health === "checking");
  const knownDates = state.projects
    .map(project => project.repoUpdatedAt ? new Date(project.repoUpdatedAt) : null)
    .filter(date => date && !Number.isNaN(date.getTime()))
    .sort((a, b) => b - a);

  const projectEl = byId("pulse-projects");
  const onlineEl = byId("pulse-online");
  const freshnessEl = byId("pulse-freshness");
  if (!projectEl || !onlineEl || !freshnessEl) return;

  projectEl.textContent = String(projectCount);
  onlineEl.textContent = healthPending
    ? "Verificando"
    : cachedCount
      ? `${onlineCount}/${projectCount} agora · ${cachedCount} cache`
      : `${onlineCount}/${projectCount} acessíveis`;

  if (knownDates.length) {
    const latest = relativeTimeFromNow(knownDates[0].toISOString());
    const anyStale = state.projects.some(project => project.repoMetaState === "stale-cache");
    freshnessEl.textContent = anyStale
      ? `Cache · ${latest || "conhecido"}`
      : `Atualizado ${latest || ""}`;
  } else {
    const metaPending = state.projects.some(project => project.repoMetaState === "checking");
    freshnessEl.textContent = metaPending ? "Verificando" : "Não verificado";
  }

  const source = byId("observability-source");
  if (source) {
    source.textContent = state.githubApiState === "rate-limited"
      ? "Fonte: sites públicos + GitHub público. API do GitHub temporariamente limitada; dados conhecidos podem aparecer em cache."
      : "Fonte: sites públicos + GitHub público. Cache local de 15 minutos. Dados técnicos não representam estudo.";
  }
}

async function fetchProjectObservability(project) {
  const cache = readRepoMetaCache();
  const cached = cache[project.id] || {};
  const now = Date.now();

  const repoCacheFresh = cached.repoCheckedAt &&
    now - cached.repoCheckedAt < META_CACHE_TTL_MS;
  const deployCacheFresh = cached.deployCheckedAt &&
    now - cached.deployCheckedAt < META_CACHE_TTL_MS;

  if (repoCacheFresh) {
    project.repoUpdatedAt = cached.pushedAt || null;
    project.repoCheckedAt = cached.repoCheckedAt;
    project.repoMetaState = project.repoUpdatedAt ? "cached" : "unknown";
  }

  if (deployCacheFresh) {
    project.deployStatus = cached.deployStatus || "unknown";
    project.deployUpdatedAt = cached.deployUpdatedAt || null;
    project.deployMetaState = project.deployStatus !== "unknown" ? "cached" : "unknown";
  }

  if (repoCacheFresh && deployCacheFresh) return;

  const apiBase = githubApiBase(project);
  if (!apiBase) {
    if (!repoCacheFresh) project.repoMetaState = cached.pushedAt ? "stale-cache" : "unknown";
    if (!deployCacheFresh) {
      project.deployStatus = cached.deployStatus || "unknown";
      project.deployUpdatedAt = cached.deployUpdatedAt || null;
      project.deployMetaState = cached.deployStatus && cached.deployStatus !== "unknown"
        ? "stale-cache"
        : "unknown";
    }
    return;
  }

  let repoRateLimited = false;

  if (!repoCacheFresh) {
    const repoResult = await fetchGithubJson(apiBase);

    if (repoResult.ok) {
      project.repoUpdatedAt = repoResult.data.pushed_at || repoResult.data.updated_at || null;
      project.repoCheckedAt = now;
      project.repoMetaState = project.repoUpdatedAt ? "online" : "unknown";
    } else {
      repoRateLimited = repoResult.reason === "rate-limited";
      if (cached.pushedAt) {
        project.repoUpdatedAt = cached.pushedAt;
        project.repoCheckedAt = cached.repoCheckedAt || null;
        project.repoMetaState = "stale-cache";
      } else {
        project.repoMetaState = "unknown";
      }
    }
  }

  if (!deployCacheFresh) {
    if (repoRateLimited) {
      project.deployStatus = cached.deployStatus || "unknown";
      project.deployUpdatedAt = cached.deployUpdatedAt || null;
      project.deployMetaState = cached.deployStatus && cached.deployStatus !== "unknown"
        ? "stale-cache"
        : "unknown";
    } else {
      const targetedResult = await fetchGithubJson(
        `${apiBase}/actions/workflows/deploy-pages.yml/runs?branch=main&per_page=1`
      );
      const runsResult = targetedResult.ok || targetedResult.reason === "rate-limited"
        ? targetedResult
        : await fetchGithubJson(`${apiBase}/actions/runs?branch=main&per_page=30`);

      if (runsResult.ok && Array.isArray(runsResult.data.workflow_runs)) {
        const runs = runsResult.data.workflow_runs;
        const run = targetedResult.ok
          ? runs[0]
          : runs.find(item => /deploy-pages\.ya?ml$/i.test(item.path || "")) ||
            runs.find(item => /deploy.*pages|pages.*deploy|publish/i.test(item.name || "")) ||
            runs.find(item => /pages|deploy|publish/i.test(item.path || ""));

        if (run) {
          project.deployStatus = run.status === "completed"
            ? (run.conclusion || "unknown")
            : (run.status || "unknown");
          project.deployUpdatedAt = run.updated_at || run.created_at || null;
          project.deployMetaState = "online";
        } else {
          project.deployStatus = "unknown";
          project.deployUpdatedAt = null;
          project.deployMetaState = "unknown";
        }
      } else if (cached.deployStatus && cached.deployStatus !== "unknown") {
        project.deployStatus = cached.deployStatus;
        project.deployUpdatedAt = cached.deployUpdatedAt || null;
        project.deployMetaState = "stale-cache";
      } else {
        project.deployStatus = "unknown";
        project.deployMetaState = "unknown";
      }
    }
  }

  cache[project.id] = {
    pushedAt: project.repoUpdatedAt || cached.pushedAt || null,
    repoCheckedAt: project.repoMetaState === "online"
      ? now
      : (cached.repoCheckedAt || null),
    deployStatus: project.deployStatus || cached.deployStatus || "unknown",
    deployUpdatedAt: project.deployUpdatedAt || cached.deployUpdatedAt || null,
    deployCheckedAt: project.deployMetaState === "online"
      ? now
      : (cached.deployCheckedAt || null)
  };

  writeRepoMetaCache(cache);
}

function renderFocus(project) {
  if (!project) return;

  byId("focus-title").textContent = project.name;
  byId("focus-description").textContent = project.description;
  byId("focus-phase").textContent = project.phase;

  const focusNote = byId("focus-note");
  if (focusNote) {
    focusNote.textContent = readFocusPreference()
      ? "Foco escolhido por você neste aparelho."
      : "Prioridade padrão configurada na Central.";
  }

  const health = byId("focus-health");
  const healthCached = project.healthMetaState === "cached" || project.healthMetaState === "stale-cache";
  const shortHealth = healthCached
    ? project.health === "online" ? "Online (cache)" : project.health === "offline" ? "Erro (cache)" : "Cache"
    : project.health === "online"
      ? "Online"
      : project.health === "offline"
        ? "Erro técnico"
        : project.health === "checking"
          ? "Verificando"
          : "Não verificado";
  health.className = `health health-${healthCached ? "unknown" : project.health}`;
  health.innerHTML = `<span class="dot"></span>${shortHealth}`;

  const button = byId("continue-button");
  button.href = project.url;
  button.onclick = event => {
    event.preventDefault();
    openProject(project);
  };

  const newTab = byId("focus-new-tab");
  newTab.href = project.url;
  newTab.onclick = () => rememberProject(project);
}

function renderProjects() {
  const grid = byId("projects-grid");
  const lastVisit = readLastVisit();
  grid.innerHTML = "";

  state.projects.forEach((project, projectIndex) => {
    const isLast = project.id === lastVisit?.id;
    const isFocus = project.id === state.focus?.id;
    const article = document.createElement("article");
    article.className = `project-card project-${project.id}${isLast ? " is-last" : ""}${isFocus ? " is-focus" : ""}`;
    article.dataset.projectId = project.id;
    article.dataset.projectOrder = String(projectIndex);
    article.innerHTML = `
      <div class="project-top">
        <span class="project-icon" aria-hidden="true">${escapeHtml(project.icon || "•")}</span>
        <div class="project-top-right">
          ${isLast ? '<span class="last-chip">Último acesso</span>' : ""}
          <span class="project-status">${isFocus ? "Foco" : "Ativo"}</span>
        </div>
      </div>
      <h3>${escapeHtml(project.name)}</h3>
      <p class="muted">${escapeHtml(project.description)}</p>
      <p class="project-phase">${escapeHtml(project.phase)}</p>
      <div class="project-observability">
        <span data-health="${project.id}">${healthMarkup(project)}</span>
        <span data-repo="${project.id}">${repoFreshnessMarkup(project)}</span>
        <span data-deploy="${project.id}">${deployMarkup(project)}</span>
      </div>
      <div class="project-actions">
        <a class="project-link" href="${escapeHtml(project.url)}">Abrir ambiente →</a>
        <button class="focus-toggle" type="button" ${isFocus ? "disabled" : ""} aria-label="${escapeHtml(isFocus ? `${project.name} é o foco atual` : `Definir ${project.name} como foco`)}">
          ${isFocus ? "★ Foco atual" : "☆ Definir foco"}
        </button>
      </div>
    `;

    article.querySelector(".project-link").addEventListener("click", event => {
      event.preventDefault();
      openProject(project);
    });

    const focusButton = article.querySelector(".focus-toggle");
    if (focusButton && !isFocus) {
      focusButton.addEventListener("click", () => setFocusProject(project));
    }

    grid.appendChild(article);
  });
}

function formatVisitDate(isoDate) {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date);
}

function renderResume() {
  const lastVisit = readLastVisit();
  const project = state.projects.find(item => item.id === lastVisit?.id);
  const visitedAt = formatVisitDate(lastVisit?.visitedAt);
  const resumeButton = byId("resume-button");
  const clearButton = byId("clear-history");

  if (!project) {
    if (lastVisit?.id) safeStorageRemove(STORAGE_KEY);
    byId("last-project-text").textContent =
      "Abra um ambiente pela Central para criar um ponto de retomada neste aparelho.";
    resumeButton.classList.add("is-hidden");
    clearButton.disabled = true;
    return;
  }

  byId("last-project-text").textContent =
    `Último ambiente aberto: ${project.name}${visitedAt ? ` em ${visitedAt}` : ""}.`;

  resumeButton.textContent = `Retomar ${project.name} →`;
  resumeButton.href = project.url;
  resumeButton.classList.remove("is-hidden");
  resumeButton.onclick = event => {
    event.preventDefault();
    openProject(project);
  };
  clearButton.disabled = false;
}

async function checkHealth(project) {
  const cache = readHealthCache();
  const cached = cache[project.id];
  const now = Date.now();
  const validCached = cached &&
    ["online", "offline"].includes(cached.status) &&
    Number.isFinite(cached.checkedAt);

  if (validCached && now - cached.checkedAt < HEALTH_CACHE_TTL_MS) {
    return {
      status: cached.status,
      checkedAt: cached.checkedAt,
      metaState: "cached"
    };
  }

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    return validCached
      ? { status: cached.status, checkedAt: cached.checkedAt, metaState: "stale-cache" }
      : { status: "unknown", checkedAt: null, metaState: "unknown" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);

  try {
    const response = await fetch(project.url, {
      method: "HEAD",
      cache: "no-store",
      signal: controller.signal
    });
    const status = response.ok ? "online" : "offline";
    cache[project.id] = { status, checkedAt: now };
    writeHealthCache(cache);
    return { status, checkedAt: now, metaState: "live" };
  } catch {
    return validCached
      ? { status: cached.status, checkedAt: cached.checkedAt, metaState: "stale-cache" }
      : { status: "unknown", checkedAt: null, metaState: "unknown" };
  } finally {
    clearTimeout(timeout);
  }
}

function emitTechnicalState(project) {
  if (typeof CustomEvent !== "function") return;

  document.dispatchEvent(new CustomEvent("central:technical-state", {
    detail: {
      id: project.id,
      name: project.name,
      health: project.health,
      healthMetaState: project.healthMetaState,
      healthCheckedAt: project.healthCheckedAt,
      repoUpdatedAt: project.repoUpdatedAt,
      repoMetaState: project.repoMetaState,
      repoCheckedAt: project.repoCheckedAt,
      deployStatus: project.deployStatus,
      deployUpdatedAt: project.deployUpdatedAt,
      deployMetaState: project.deployMetaState
    }
  }));
}

async function updateHealth() {
  await Promise.all(
    state.projects.map(async project => {
      const healthResult = await checkHealth(project);
      project.health = healthResult.status;
      project.healthMetaState = healthResult.metaState;
      project.healthCheckedAt = healthResult.checkedAt;
      const slot = document.querySelector(`[data-health="${project.id}"]`);
      if (slot) slot.innerHTML = healthMarkup(project);
      if (state.focus?.id === project.id) renderFocus(project);
      emitTechnicalState(project);
      updatePulse();
    })
  );
}

async function updateRepositoryMetadata() {
  await Promise.all(
    state.projects.map(async project => {
      await fetchProjectObservability(project);

      const repoSlot = document.querySelector(`[data-repo="${project.id}"]`);
      if (repoSlot) repoSlot.innerHTML = repoFreshnessMarkup(project);

      const deploySlot = document.querySelector(`[data-deploy="${project.id}"]`);
      if (deploySlot) deploySlot.innerHTML = deployMarkup(project);

      emitTechnicalState(project);
      updatePulse();
    })
  );
}

function bindClearHistory() {
  const clearButton = byId("clear-history");
  if (!clearButton) return;

  clearButton.addEventListener("click", () => {
    safeStorageRemove(STORAGE_KEY);
    if (typeof CustomEvent === "function") {
      document.dispatchEvent(new CustomEvent("central:history-cleared"));
    }
    renderResume();
    renderProjects();

    if (!state.storageAvailable) {
      showSystemNotice("O histórico não pôde ser alterado porque o armazenamento local está indisponível.", "warning");
    }
  });
}

function enterFallbackMode(error) {
  console.warn("Central em modo de fallback:", error);
  showSystemNotice(
    "A camada dinâmica não carregou. Os três acessos diretos abaixo continuam funcionando normalmente.",
    "warning"
  );

  const health = byId("focus-health");
  if (health) {
    health.className = "health health-unknown";
    health.innerHTML = '<span class="dot"></span>Modo direto';
  }

  const lastProjectText = byId("last-project-text");
  if (lastProjectText) {
    lastProjectText.textContent =
      "Retomada dinâmica indisponível. Use os acessos diretos dos ambientes.";
  }

  const clearButton = byId("clear-history");
  if (clearButton) clearButton.disabled = true;
}

async function init() {
  const greeting = byId("greeting");
  if (greeting) greeting.textContent = getGreeting();

  try {
    const response = await fetch("./config/projects.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Registro de projetos indisponível.");

    state.config = validateConfig(await response.json());
    state.projects = state.config.projects.map(normalizeProject);
    state.focus = chooseFocus(state.projects, state.config.central.defaultProject);

    renderFocus(state.focus);
    renderResume();
    renderProjects();
    bindClearHistory();

    const version = byId("app-version");
    if (version && state.config.central.version) {
      version.textContent = `v${state.config.central.version}`;
    }

    if (!state.storageAvailable) {
      showSystemNotice(
        "Preferências e retomada local estão indisponíveis neste navegador; a navegação continua normal.",
        "warning"
      );
    } else {
      hideSystemNotice();
    }

    updatePulse();
    updateHealth();
    updateRepositoryMetadata();
  } catch (error) {
    enterFallbackMode(error);
  }
}

document.addEventListener("DOMContentLoaded", init);
