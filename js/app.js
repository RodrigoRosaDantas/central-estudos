const STORAGE_KEY = "central-estudos:last-project";

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

function chooseFocus(projects, defaultProject) {
  const lastId = localStorage.getItem(STORAGE_KEY);
  return (
    projects.find(p => p.id === lastId) ||
    projects.find(p => p.id === defaultProject) ||
    projects.find(p => p.priority === "focus") ||
    projects[0]
  );
}

function rememberProject(project) {
  localStorage.setItem(STORAGE_KEY, project.id);
}

function openProject(project) {
  rememberProject(project);
  window.location.href = project.url;
}

function healthMarkup(status) {
  const label = status === "online" ? "Online" : status === "offline" ? "Indisponível" : "Verificando";
  return `<span class="mini-health ${status}"><span class="dot"></span>${label}</span>`;
}

function renderFocus(project) {
  if (!project) return;
  byId("focus-title").textContent = project.name;
  byId("focus-description").textContent = project.description;
  byId("focus-phase").textContent = project.phase;

  const health = byId("focus-health");
  health.className = `health health-${project.health}`;
  health.innerHTML = `<span class="dot"></span>${project.health === "online" ? "Online" : project.health === "offline" ? "Indisponível" : "Verificando"}`;

  const button = byId("continue-button");
  button.href = project.url;
  button.onclick = (event) => {
    event.preventDefault();
    openProject(project);
  };
}

function renderProjects() {
  const grid = byId("projects-grid");
  grid.innerHTML = "";

  state.projects.forEach(project => {
    const article = document.createElement("article");
    article.className = "project-card";
    article.innerHTML = `
      <div class="project-top">
        <span class="project-icon" aria-hidden="true">${project.icon}</span>
        <span class="project-status">${project.priority === "focus" ? "Foco" : "Ativo"}</span>
      </div>
      <h3>${project.name}</h3>
      <p class="muted">${project.description}</p>
      <p class="project-phase">${project.phase}</p>
      <div class="project-actions">
        <a class="project-link" href="${project.url}" rel="noopener">Abrir ambiente →</a>
        <span data-health="${project.id}">${healthMarkup(project.health)}</span>
      </div>
    `;

    const link = article.querySelector(".project-link");
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openProject(project);
    });

    grid.appendChild(article);
  });
}

function renderLastProject() {
  const lastId = localStorage.getItem(STORAGE_KEY);
  const project = state.projects.find(p => p.id === lastId);
  byId("last-project-text").textContent = project
    ? `Último ambiente aberto: ${project.name}.`
    : "Ainda não há histórico local nesta Central.";
}

async function checkHealth(project) {
  try {
    const response = await fetch(project.url, {
      method: "HEAD",
      cache: "no-store"
    });
    return response.ok ? "online" : "offline";
  } catch {
    return "offline";
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

async function init() {
  try {
    const response = await fetch("./config/projects.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Não foi possível carregar o registro de projetos.");

    state.config = await response.json();
    state.projects = state.config.projects.map(normalizeProject);
    state.focus = chooseFocus(state.projects, state.config.central.defaultProject);

    renderFocus(state.focus);
    renderProjects();
    renderLastProject();

    byId("clear-history").addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      state.focus = chooseFocus(state.projects, state.config.central.defaultProject);
      renderFocus(state.focus);
      renderLastProject();
    });

    updateHealth();
  } catch (error) {
    byId("focus-title").textContent = "Central indisponível";
    byId("focus-description").textContent = error.message;
    byId("projects-grid").innerHTML = `
      <article class="project-card">
        <h3>Falha de configuração</h3>
        <p class="muted">O arquivo config/projects.json não pôde ser carregado.</p>
      </article>
    `;
  }
}

document.addEventListener("DOMContentLoaded", init);
