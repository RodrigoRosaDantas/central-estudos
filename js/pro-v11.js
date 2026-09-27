(() => {
  "use strict";

  const LAST_PROJECT_KEY = "central-estudos:last-project";
  const navLinks = [...document.querySelectorAll(".pro-nav-link")];
  const cardsRoot = document.getElementById("projects-grid");

  const focusName = document.getElementById("pro-now-focus-name");
  const focusMeta = document.getElementById("pro-now-focus-meta");
  const focusLink = document.getElementById("pro-now-focus-link");
  const resumeName = document.getElementById("pro-now-resume-name");
  const resumeMeta = document.getElementById("pro-now-resume-meta");
  const resumeLink = document.getElementById("pro-now-resume-link");
  const projectCount = document.getElementById("pro-now-project-count");
  const projectMeta = document.getElementById("pro-now-project-meta");

  if (!focusName || !focusMeta || !focusLink || !resumeName || !resumeMeta || !resumeLink || !projectCount || !projectMeta) return;

  function readLastVisit() {
    try {
      const raw = localStorage.getItem(LAST_PROJECT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed.id === "string" ? parsed : null;
    } catch {
      return null;
    }
  }

  function cardData() {
    return [...document.querySelectorAll(".project-card")].map(card => ({
      id: card.dataset.projectId || "",
      name: card.querySelector("h3")?.textContent?.trim() || "Ambiente",
      phase: card.querySelector(".project-phase")?.textContent?.trim() || "",
      href: card.querySelector(".project-link")?.href || ""
    })).filter(item => item.id && item.href);
  }

  function formatVisitedAt(isoDate) {
    if (!isoDate) return "Último acesso salvo neste navegador.";
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return "Último acesso salvo neste navegador.";

    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(date);
  }

  function refreshNow() {
    const focusTitle = document.getElementById("focus-title")?.textContent?.trim() || "Foco atual";
    const focusPhase = document.getElementById("focus-phase")?.textContent?.trim() || "Prioridade atual";
    const currentFocusLink = document.getElementById("continue-button")?.href || "#projetos";

    focusName.textContent = focusTitle;
    focusMeta.textContent = focusPhase;
    focusLink.href = currentFocusLink;

    const projects = cardData();
    projectCount.textContent = `${projects.length} ${projects.length === 1 ? "ativo" : "ativos"}`;
    projectMeta.textContent = projects.map(item => item.name).join(" · ") || "Nenhum ambiente disponível";

    const lastVisit = readLastVisit();
    const lastProject = lastVisit ? projects.find(item => item.id === lastVisit.id) : null;

    if (lastProject) {
      resumeName.textContent = lastProject.name;
      resumeMeta.textContent = `${lastProject.phase || "Ambiente"} · ${formatVisitedAt(lastVisit.visitedAt)}`;
      resumeLink.href = lastProject.href;
      resumeLink.classList.remove("is-hidden");
    } else {
      resumeName.textContent = "Nenhum acesso ainda";
      resumeMeta.textContent = "Abra um ambiente pela Central para criar um ponto de retomada.";
      resumeLink.removeAttribute("href");
      resumeLink.classList.add("is-hidden");
    }
  }

  function updateActiveNav() {
    const sections = navLinks
      .map(link => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    if (!("IntersectionObserver" in window) || !sections.length) return;

    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      navLinks.forEach(link => {
        const active = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("is-active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, {
      rootMargin: "-18% 0px -62% 0px",
      threshold: [0, .2, .5, .8]
    });

    sections.forEach(section => observer.observe(section));
  }

  document.addEventListener("central:app-ready", refreshNow);
  document.addEventListener("central:focus-changed", refreshNow);
  document.addEventListener("central:project-opened", refreshNow);
  document.addEventListener("central:history-cleared", refreshNow);
  document.addEventListener("central:catalog-refresh", refreshNow);

  if (cardsRoot && "MutationObserver" in window) {
    const observer = new MutationObserver(() => queueMicrotask(refreshNow));
    observer.observe(cardsRoot, { childList: true, subtree: false });
  }

  document.addEventListener("DOMContentLoaded", () => {
    refreshNow();
    updateActiveNav();
  });
})();
