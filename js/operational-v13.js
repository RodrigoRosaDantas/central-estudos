(() => {
  "use strict";

  const panel = document.getElementById("operational-panel");
  const list = document.getElementById("operational-list");
  const focusOperational = document.getElementById("pro-now-focus-operational");

  if (!panel || !list || !focusOperational) return;

  const contracts = new Map();
  let focusId = null;

  function projectInfo(id) {
    const card = [...document.querySelectorAll(".project-card")]
      .find(item => item.dataset.projectId === id);

    return {
      name: card?.querySelector("h3")?.textContent?.trim() || id,
      href: card?.querySelector(".project-link")?.href || "#projetos",
      order: Number(card?.dataset.projectOrder ?? Number.MAX_SAFE_INTEGER)
    };
  }

  function kindMeta(kind, status) {
    if (status === "stale-cache") {
      return {
        label: "Último estado",
        className: "is-stale",
        actionPrefix: "Último estado conhecido"
      };
    }

    if (kind === "planned") {
      return {
        label: "Planejado",
        className: "is-planned",
        actionPrefix: "Planejado"
      };
    }

    if (kind === "manual") {
      return {
        label: "Publicado",
        className: "is-operational",
        actionPrefix: "Ação publicada"
      };
    }

    return {
      label: "Operacional",
      className: "is-operational",
      actionPrefix: "Próxima ação"
    };
  }

  function contextText(state) {
    const parts = [];
    if (state.phase) parts.push(state.phase);
    if (state.cycle) parts.push(state.cycle);
    if (state.currentUnit) parts.push(state.currentUnit);
    return parts.join(" · ");
  }

  function sourceText(item) {
    if (item.status === "stale-cache") return "Fonte: contrato em cache antigo";
    if (item.status === "cached") return "Fonte: contrato em cache recente";
    return "Fonte: contrato publicado pelo projeto";
  }

  function validVisibleItem(detail) {
    if (!detail?.contract?.state) return false;
    return ["live", "cached", "stale-cache"].includes(detail.status);
  }

  function createCard(item) {
    const info = projectInfo(item.id);
    const state = item.contract.state;
    const meta = kindMeta(state.nextActionKind, item.status);

    const article = document.createElement("article");
    article.className = "operational-card";
    article.dataset.projectId = item.id;
    article.dataset.focus = String(item.id === focusId);

    const head = document.createElement("div");
    head.className = "operational-head";

    const name = document.createElement("h3");
    name.className = "operational-name";
    name.textContent = info.name;

    const badge = document.createElement("span");
    badge.className = `operational-badge ${meta.className}`;
    badge.textContent = meta.label;

    head.append(name, badge);
    article.append(head);

    const context = document.createElement("p");
    context.className = "operational-context";
    context.textContent = contextText(state) || "Estado operacional publicado";
    article.append(context);

    if (state.nextAction) {
      const action = document.createElement("p");
      action.className = "operational-action";
      action.textContent = `${meta.actionPrefix}: ${state.nextAction}`;
      article.append(action);
    }

    if (Array.isArray(state.alerts) && state.alerts.length) {
      const alerts = document.createElement("div");
      alerts.className = "operational-alerts";

      state.alerts.slice(0, 3).forEach(message => {
        const alert = document.createElement("p");
        alert.className = "operational-alert";
        alert.textContent = message;
        alerts.append(alert);
      });

      article.append(alerts);
    }

    const footer = document.createElement("div");
    footer.className = "operational-footer";

    const source = document.createElement("span");
    source.className = "operational-source";
    source.textContent = sourceText(item);

    const link = document.createElement("a");
    link.className = "operational-link";
    link.href = info.href;
    link.textContent = "Abrir projeto →";

    footer.append(source, link);
    article.append(footer);

    return { article, order: info.order };
  }

  function renderFocusOperational() {
    const item = focusId ? contracts.get(focusId) : null;

    if (!item || !validVisibleItem(item)) {
      focusOperational.textContent = "";
      focusOperational.classList.add("is-hidden");
      focusOperational.removeAttribute("data-kind");
      focusOperational.removeAttribute("data-stale");
      return;
    }

    const state = item.contract.state;
    if (!state.nextAction) {
      focusOperational.textContent = "";
      focusOperational.classList.add("is-hidden");
      return;
    }

    const meta = kindMeta(state.nextActionKind, item.status);
    focusOperational.textContent = `${meta.actionPrefix}: ${state.nextAction}`;
    focusOperational.dataset.kind = state.nextActionKind;
    focusOperational.dataset.stale = String(item.status === "stale-cache");
    focusOperational.classList.remove("is-hidden");
  }

  function render() {
    const visible = [...contracts.values()]
      .filter(validVisibleItem)
      .map(item => ({ item, ...createCard(item) }))
      .sort((a, b) => a.order - b.order);

    list.replaceChildren(...visible.map(entry => entry.article));
    panel.hidden = visible.length === 0;
    renderFocusOperational();
  }

  document.addEventListener("central:app-ready", event => {
    focusId = event.detail?.focusId || focusId;
    render();
  });

  document.addEventListener("central:focus-changed", event => {
    focusId = event.detail?.id || focusId;
    render();
  });

  document.addEventListener("central:contract-state", event => {
    const detail = event.detail;
    if (!detail || typeof detail.id !== "string") return;

    contracts.set(detail.id, {
      id: detail.id,
      status: detail.status,
      contract: detail.contract || null,
      checkedAt: detail.checkedAt || null
    });

    render();
  });
})();
