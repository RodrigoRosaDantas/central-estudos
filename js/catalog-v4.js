(() => {
  "use strict";

  const FAVORITES_KEY = "central-estudos:favorites-v4";
  const ORDER_KEY = "central-estudos:catalog-order-v4";
  const grid = document.getElementById("projects-grid");
  const search = document.getElementById("catalog-search");
  const sort = document.getElementById("catalog-sort");
  const count = document.getElementById("catalog-count");
  if (!grid || !search || !sort) return;

  let applying = false;

  function readJson(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key));
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* progressive enhancement */ }
  }

  function projectId(card) {
    const known = ["tcego", "seedf", "tjdft"];
    return known.find(id => card.classList.contains(`project-${id}`)) ||
      (card.querySelector("h3")?.textContent || "project").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }

  function favorites() {
    const value = readJson(FAVORITES_KEY, []);
    return Array.isArray(value) ? new Set(value.filter(item => typeof item === "string")) : new Set();
  }

  function savedOrder() {
    const value = readJson(ORDER_KEY, []);
    return Array.isArray(value) ? value.filter(item => typeof item === "string") : [];
  }

  function ensureFavoriteButton(card, favs) {
    const id = projectId(card);
    let button = card.querySelector(".favorite-toggle");
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "favorite-toggle";
      button.addEventListener("click", () => {
        const next = favorites();
        if (next.has(id)) next.delete(id); else next.add(id);
        writeJson(FAVORITES_KEY, [...next]);
        applyCatalog();
      });
      const top = card.querySelector(".project-top");
      if (top) top.append(button); else card.prepend(button);
    }
    const active = favs.has(id);
    button.textContent = active ? "★" : "☆";
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-label", active ? "Remover dos favoritos" : "Adicionar aos favoritos");
    button.title = active ? "Remover dos favoritos" : "Adicionar aos favoritos";
  }

  function text(card) {
    return (card.textContent || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  function applyCatalog() {
    if (applying) return;
    applying = true;
    try {
      const cards = [...grid.querySelectorAll(".project-card")];
      const favs = favorites();
      cards.forEach(card => ensureFavoriteButton(card, favs));

      const query = search.value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const mode = sort.value;
      const order = savedOrder();
      const orderIndex = id => {
        const index = order.indexOf(id);
        return index === -1 ? Number.MAX_SAFE_INTEGER : index;
      };

      cards.sort((a, b) => {
        const aId = projectId(a); const bId = projectId(b);
        if (mode === "favorites") {
          const favDelta = Number(favs.has(bId)) - Number(favs.has(aId));
          if (favDelta) return favDelta;
        }
        if (mode === "name") return (a.querySelector("h3")?.textContent || "").localeCompare(b.querySelector("h3")?.textContent || "", "pt-BR");
        return orderIndex(aId) - orderIndex(bId);
      });

      let visible = 0;
      cards.forEach(card => {
        const matches = !query || text(card).includes(query);
        card.hidden = !matches;
        if (matches) visible += 1;
        grid.append(card);
      });
      if (count) count.textContent = `${visible} de ${cards.length} ambientes`;
    } finally {
      applying = false;
    }
  }

  function captureCurrentOrder() {
    const ids = [...grid.querySelectorAll(".project-card")].map(projectId);
    if (ids.length) writeJson(ORDER_KEY, ids);
  }

  search.addEventListener("input", applyCatalog);
  sort.addEventListener("change", applyCatalog);
  captureCurrentOrder();
  applyCatalog();

  const observer = new MutationObserver(() => {
    if (!applying) queueMicrotask(applyCatalog);
  });
  observer.observe(grid, { childList: true });

  document.addEventListener("keydown", event => {
    if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target?.isContentEditable) return;
    const number = Number(event.key);
    if (!Number.isInteger(number) || number < 1 || number > 9) return;
    const visibleCards = [...grid.querySelectorAll(".project-card")].filter(card => !card.hidden);
    const card = visibleCards[number - 1];
    const link = card?.querySelector("a.project-link");
    if (link) {
      event.preventDefault();
      link.click();
    }
  });
})();
