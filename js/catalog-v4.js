(() => {
  "use strict";

  const FAVORITES_KEY = "central-estudos:favorites-v4";
  const ORDER_KEY = "central-estudos:catalog-order-v4";
  const SORT_KEY = "central-estudos:catalog-sort-v4";

  const grid = document.getElementById("projects-grid");
  const search = document.getElementById("catalog-search");
  const sort = document.getElementById("catalog-sort");
  const count = document.getElementById("catalog-count");
  const empty = document.getElementById("catalog-empty");

  if (!grid || !search || !sort) return;

  document.documentElement.classList.add("catalog-enabled");

  let applying = false;

  const readJson = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  };

  const writeJson = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  };

  const readText = key => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const writeText = (key, value) => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  };

  const slug = value => (value || "project")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "project";

  const projectId = card =>
    card.dataset.projectId ||
    slug(card.querySelector("h3")?.textContent);

  const favorites = () => {
    const value = readJson(FAVORITES_KEY, []);
    return Array.isArray(value)
      ? new Set(value.filter(item => typeof item === "string" && item))
      : new Set();
  };

  const savedOrder = () => {
    const value = readJson(ORDER_KEY, []);
    return Array.isArray(value)
      ? value.filter(item => typeof item === "string" && item)
      : [];
  };

  function ensureFavoriteButton(card, favs) {
    const id = projectId(card);
    let button = card.querySelector(".favorite-toggle");

    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "favorite-toggle";
      button.addEventListener("click", () => {
        const next = favorites();
        next.has(id) ? next.delete(id) : next.add(id);
        writeJson(FAVORITES_KEY, [...next]);
        applyCatalog();
      });

      const target = card.querySelector(".project-top-right") || card.querySelector(".project-top");
      target ? target.append(button) : card.prepend(button);
    }

    const active = favs.has(id);
    button.textContent = active ? "★" : "☆";
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute(
      "aria-label",
      active ? `Remover ${card.querySelector("h3")?.textContent || "ambiente"} dos favoritos`
             : `Adicionar ${card.querySelector("h3")?.textContent || "ambiente"} aos favoritos`
    );
    button.title = active ? "Remover dos favoritos" : "Adicionar aos favoritos";
  }

  const searchableText = card => [
    card.querySelector("h3")?.textContent,
    card.querySelector(".muted")?.textContent,
    card.querySelector(".project-phase")?.textContent
  ]
    .filter(Boolean)
    .join(" ")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  function applyCatalog() {
    if (applying) return;
    applying = true;

    try {
      const cards = [...grid.querySelectorAll(".project-card")];
      const favs = favorites();

      cards.forEach(card => ensureFavoriteButton(card, favs));

      const query = search.value
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      const mode = sort.value;
      const order = savedOrder();
      const orderIndex = id => {
        const index = order.indexOf(id);
        return index === -1 ? Number.MAX_SAFE_INTEGER : index;
      };

      cards.sort((a, b) => {
        const aId = projectId(a);
        const bId = projectId(b);

        if (mode === "favorites") {
          const delta = Number(favs.has(bId)) - Number(favs.has(aId));
          if (delta) return delta;
        }

        if (mode === "name") {
          return (a.querySelector("h3")?.textContent || "")
            .localeCompare(b.querySelector("h3")?.textContent || "", "pt-BR");
        }

        return orderIndex(aId) - orderIndex(bId);
      });

      let visible = 0;

      cards.forEach(card => {
        const matches = !query || searchableText(card).includes(query);
        card.hidden = !matches;
        if (matches) visible += 1;
        grid.append(card);
      });

      if (count) count.textContent = `${visible} de ${cards.length} ambientes`;
      if (empty) empty.hidden = visible !== 0;
    } finally {
      applying = false;
    }
  }

  const initial = [...grid.querySelectorAll(".project-card")].map(projectId);
  if (initial.length && !savedOrder().length) writeJson(ORDER_KEY, initial);

  const savedSort = readText(SORT_KEY);
  if (["default", "favorites", "name"].includes(savedSort)) {
    sort.value = savedSort;
  }

  search.addEventListener("input", applyCatalog);
  sort.addEventListener("change", () => {
    writeText(SORT_KEY, sort.value);
    applyCatalog();
  });

  applyCatalog();

  const observer = new MutationObserver(() => {
    if (applying) return;
    const cards = [...grid.querySelectorAll(".project-card")];
    const missing = cards.some(card => !card.querySelector(".favorite-toggle"));
    if (missing) queueMicrotask(applyCatalog);
  });

  observer.observe(grid, { childList: true, subtree: false });

  document.addEventListener("keydown", event => {
    if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

    const target = event.target;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      target?.isContentEditable
    ) return;

    const number = Number(event.key);
    if (!Number.isInteger(number) || number < 1 || number > 9) return;

    const cards = [...grid.querySelectorAll(".project-card")].filter(card => !card.hidden);
    const link = cards[number - 1]?.querySelector("a.project-link");

    if (link) {
      event.preventDefault();
      link.click();
    }
  });
})();
