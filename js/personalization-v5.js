(() => {
  "use strict";

  const DENSITY_KEY = "central-estudos:density-v5";
  const TECHNICAL_KEY = "central-estudos:technical-cards-v5";
  const ORDER_KEY = "central-estudos:catalog-order-v4";
  const SORT_KEY = "central-estudos:catalog-sort-v4";
  const FAVORITES_KEY = "central-estudos:favorites-v4";
  const FOCUS_KEY = "central-estudos:focus-project";

  const VALID_DENSITIES = new Set(["comfortable", "compact"]);
  const VALID_TECHNICAL = new Set(["show", "hide"]);

  const panel = document.getElementById("preferences-panel");
  const density = document.getElementById("preference-density");
  const technical = document.getElementById("preference-technical");
  const orderList = document.getElementById("preferences-order-list");
  const reset = document.getElementById("preferences-reset");
  const status = document.getElementById("preferences-status");
  const grid = document.getElementById("projects-grid");
  const catalogSort = document.getElementById("catalog-sort");

  if (!panel || !density || !technical || !orderList || !reset || !grid) return;

  document.documentElement.classList.add("preferences-enabled");

  let storageWritable = true;
  let renderingOrder = false;

  function readText(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      storageWritable = false;
      return null;
    }
  }

  function writeText(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      storageWritable = false;
      return false;
    }
  }

  function readJson(key, fallback) {
    const raw = readText(key);
    if (!raw) return fallback;

    try {
      return JSON.parse(raw) ?? fallback;
    } catch {
      removeKey(key);
      return fallback;
    }
  }

  function writeJson(key, value) {
    return writeText(key, JSON.stringify(value));
  }

  function removeKey(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      storageWritable = false;
      return false;
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function announce(message) {
    if (status) {
      status.textContent = storageWritable
        ? message
        : `${message} Esta sessão não conseguiu persistir alterações no navegador.`;
    }
  }

  function projectEntries() {
    return [...grid.querySelectorAll(".project-card")].map(card => ({
      id: card.dataset.projectId ||
        (card.querySelector("h3")?.textContent || "project")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      name: card.querySelector("h3")?.textContent?.trim() || "Ambiente",
      registryOrder: Number.isFinite(Number(card.dataset.projectOrder))
        ? Number(card.dataset.projectOrder)
        : Number.MAX_SAFE_INTEGER
    }));
  }

  function defaultOrder() {
    return projectEntries()
      .slice()
      .sort((a, b) => a.registryOrder - b.registryOrder || a.name.localeCompare(b.name, "pt-BR"))
      .map(item => item.id);
  }

  function normalizedOrder() {
    const entries = projectEntries();
    const ids = entries.map(item => item.id);
    const defaults = defaultOrder();
    const saved = readJson(ORDER_KEY, []);
    const validSaved = Array.isArray(saved)
      ? saved.filter(id => typeof id === "string" && ids.includes(id))
      : [];

    return [
      ...new Set(validSaved),
      ...defaults.filter(id => ids.includes(id) && !validSaved.includes(id))
    ];
  }

  function applyDensity(value, persist = false) {
    const next = VALID_DENSITIES.has(value) ? value : "comfortable";
    density.value = next;
    document.documentElement.classList.toggle("density-compact", next === "compact");

    if (persist) {
      writeText(DENSITY_KEY, next);
      announce(`Densidade ${next === "compact" ? "compacta" : "confortável"} aplicada.`);
    }
  }

  function applyTechnical(value, persist = false) {
    const next = VALID_TECHNICAL.has(value) ? value : "show";
    technical.checked = next === "show";
    document.documentElement.classList.toggle("technical-cards-hidden", next === "hide");

    if (persist) {
      writeText(TECHNICAL_KEY, next);
      announce(next === "show"
        ? "Detalhes técnicos dos cards exibidos."
        : "Detalhes técnicos dos cards ocultados.");
    }
  }

  function refreshCatalog() {
    document.dispatchEvent(new CustomEvent("central:catalog-refresh"));
  }

  function saveOrder(order) {
    writeJson(ORDER_KEY, order);
    writeText(SORT_KEY, "default");
    if (catalogSort) catalogSort.value = "default";
    refreshCatalog();
  }

  function moveProject(id, direction) {
    const order = normalizedOrder();
    const index = order.indexOf(id);
    const target = index + direction;

    if (index < 0 || target < 0 || target >= order.length) return;

    [order[index], order[target]] = [order[target], order[index]];
    saveOrder(order);
    renderOrder();
    announce("Ordem dos ambientes atualizada. O catálogo voltou para Ordem padrão.");
  }

  function renderOrder() {
    if (renderingOrder) return;
    renderingOrder = true;

    try {
      const entries = projectEntries();
      const byId = new Map(entries.map(item => [item.id, item]));
      const order = normalizedOrder().filter(id => byId.has(id));

      orderList.innerHTML = "";

      order.forEach((id, index) => {
        const item = byId.get(id);
        const row = document.createElement("div");
        row.className = "preference-order-item";
        row.innerHTML = `
          <span class="preference-order-name">${escapeHtml(item.name)}</span>
          <span class="preference-order-actions">
            <button class="preference-order-button" type="button" data-move="-1" aria-label="Mover ${escapeHtml(item.name)} para cima" ${index === 0 ? "disabled" : ""}>↑</button>
            <button class="preference-order-button" type="button" data-move="1" aria-label="Mover ${escapeHtml(item.name)} para baixo" ${index === order.length - 1 ? "disabled" : ""}>↓</button>
          </span>
        `;

        row.querySelectorAll("[data-move]").forEach(button => {
          button.addEventListener("click", () => {
            moveProject(id, Number(button.dataset.move));
          });
        });

        orderList.appendChild(row);
      });
    } finally {
      renderingOrder = false;
    }
  }

  function resetPreferences() {
    const confirmed = window.confirm(
      "Restaurar foco, favoritos, ordem, densidade e preferências de apresentação aos padrões? O histórico de último acesso será preservado."
    );
    if (!confirmed) return;

    [
      DENSITY_KEY,
      TECHNICAL_KEY,
      ORDER_KEY,
      SORT_KEY,
      FAVORITES_KEY,
      FOCUS_KEY
    ].forEach(removeKey);

    applyDensity("comfortable");
    applyTechnical("show");
    if (catalogSort) catalogSort.value = "default";

    const order = defaultOrder();
    if (order.length) writeJson(ORDER_KEY, order);

    refreshCatalog();
    renderOrder();
    announce("Preferências restauradas. O histórico de último acesso foi preservado.");

    window.setTimeout(() => window.location.reload(), 250);
  }

  const savedDensity = readText(DENSITY_KEY);
  const savedTechnical = readText(TECHNICAL_KEY);

  if (savedDensity && !VALID_DENSITIES.has(savedDensity)) removeKey(DENSITY_KEY);
  if (savedTechnical && !VALID_TECHNICAL.has(savedTechnical)) removeKey(TECHNICAL_KEY);

  applyDensity(VALID_DENSITIES.has(savedDensity) ? savedDensity : "comfortable");
  applyTechnical(VALID_TECHNICAL.has(savedTechnical) ? savedTechnical : "show");

  density.addEventListener("change", () => applyDensity(density.value, true));
  technical.addEventListener("change", () => applyTechnical(technical.checked ? "show" : "hide", true));
  reset.addEventListener("click", resetPreferences);

  renderOrder();

  const observer = new MutationObserver(() => {
    if (renderingOrder) return;
    queueMicrotask(renderOrder);
  });
  observer.observe(grid, { childList: true, subtree: false });

  announce(storageWritable
    ? "Preferências salvas somente neste navegador."
    : "Preferências aplicadas apenas nesta sessão.");
})();
