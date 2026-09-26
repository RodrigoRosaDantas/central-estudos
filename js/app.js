const STORAGE_KEY = "central-estudos:last-project";
const HEALTH_TIMEOUT_MS = 4500;

const state = {
  config: null,
  projects: [],
  focus: null
};

function byId(id) {
  return document.getElementById(id);
}

function normalizeProject(project) {
  return {
    ...project,
    health: "checking"
  };
}

function readLastVisit() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (parsed && parsed.id) return parsed;
  } catch {
    return { id: raw, visitedAt: null };
  }

  return null;
}

function chooseFocus(projects, defaultProject) {
  return (
    projects.find(project => project.id === defaultProject) ||
    projects.find(project => project.priority === "focus") ||
    projects[0]
  );
}

function rememberProject(project) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    id: project.id,
    visitedAt: new Date().toISOString()
  }));
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

function healthLabel(status) {
  if (status === "online") return "Online";
  if (status === "offline") return "Indisponível";
  if (status === "unknown") return "Não verificado";
  return "Verificando";
}

function healthMarkup(status) {
  return `<span class="mini-health ${status}"><span class="dot"></span>${healthLabel(status)}</span>`;
}

function renderFocus(project) {
  if (!project) return;

  byId("focus-title").textContent = project.name;
  byId("focus-description").textContent = project.description;
  byId("focus-phase").textContent = project.phase;

  const health = byId("focus-health");
  health.className = `health health-${project.health}`;
  health.innerHTML = `<span class="dot"></span>${healthLabel(project.health)}`;

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

  state.projects.forEach(project => {
    const isLast = project.id === lastVisit?.id;
    const article = document.createElement("article");
    article.className = `project-card project-${project.id}${isLast ? " is-last" : ""}`;
    article.innerHTML = `
      <div class="project-top">
        <span class="project-icon" aria-hidden="true">${project.icon}</span>
        <div class="project-top-right">
          ${isLast ? '<span class="last-chip">Último acesso</span>' : ""}
          <span class="project-status">${project.priority === "focus" ? "Foco" : "Ativo"}</span>
        </div>
      </div>
      <h3>${project.name}</h3>
      <p class="muted">${project.description}</p>
      <p class="project-phase">${project.phase}</p>
      <div class="project-actions">
        <a class="project-link" href="${project.url}">Abrir ambiente →</a>
        <span data-health="${project.id}">${healthMarkup(project.health)}</span>
      </div>
    `;

    article.querySelector(".project-link").addEventListener("click", event => {
      event.preventDefault();
      openProject(project);
    });

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
    byId("last-project-text").textContent =
      "O histórico local será registrado quando você abrir um ambiente pela Central.";
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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);

  try {
    const response = await fetch(project.url, {
      method: "HEAD",
      cache: "no-store",
      signal: controller.signal
    });
    return response.ok ? "online" : "offline";
  } catch {
    return "unknown";
  } finally {
    clearTimeout(timeout);
  }
}

async function updateHealth() {
  await Promise.all(
    state.projects.map(async project => {
      project.health = await checkHealth(project);

      const slot = document.querySelector(`[data-health="${project.id}"]`);
      if (slot) slot.innerHTML = healthMarkup(project.health);

      if (state.focus?.id === project.id) renderFocus(project);
    })
  );
}

function bindClearHistory() {
  byId("clear-history").addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    renderResume();
    renderProjects();
  });
}

async function init() {
  byId("greeting").textContent = getGreeting();

  try {
    const response = await fetch("./config/projects.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Registro de projetos indisponível.");

    state.config = await response.json();
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

    updateHealth();
  } catch (error) {
    console.warn("Central em modo de fallback:", error);
    byId("focus-health").className = "health health-unknown";
    byId("focus-health").innerHTML = '<span class="dot"></span>Modo direto';
    byId("last-project-text").textContent =
      "O registro dinâmico não carregou. Os acessos diretos continuam disponíveis.";
    byId("clear-history").disabled = true;
  }
}

document.addEventListener("DOMContentLoaded", init);
