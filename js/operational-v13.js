(() => {
  "use strict";

  const panel = document.getElementById("operational-panel");
  const list = document.getElementById("operational-list");
  const focusOperational = document.getElementById("pro-now-focus-operational");
  const routeList = document.getElementById("routing-list");
  const routeExplanation = document.getElementById("routing-explanation");
  const routeButtons = [...document.querySelectorAll("[data-route-lens]")];

  if (!panel || !list || !focusOperational) return;

  const contracts = new Map();
  const LENS_KEY = "central-estudos:route-lens-v14";
  const LAST_KEY = "central-estudos:last-project";
  const LENSES = new Set(["focus", "resume", "published", "alerts"]);
  let focusId = null;
  let lens = (() => {
    try {
      const value = localStorage.getItem(LENS_KEY);
      return LENSES.has(value) ? value : "focus";
    } catch {
      return "focus";
    }
  })();

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

  function routeProjects() {
    return [...document.querySelectorAll(".project-card")].map(card => ({
      id: card.dataset.projectId || "",
      order: Number(card.dataset.projectOrder ?? Number.MAX_SAFE_INTEGER),
      name: card.querySelector("h3")?.textContent?.trim() || "Ambiente",
      phase: card.querySelector(".project-phase")?.textContent?.trim() || "",
      href: card.querySelector(".project-link")?.href || "#projetos"
    })).filter(item => item.id);
  }

  function lastProjectId() {
    try {
      const value = JSON.parse(localStorage.getItem(LAST_KEY) || "null");
      return typeof value?.id === "string" ? value.id : null;
    } catch {
      return null;
    }
  }

  function routeContract(id) {
    const item = contracts.get(id);
    return validVisibleItem(item) ? item : null;
  }

  function routeExplanationText() {
    if (lens === "resume") return "Mostra o último ambiente aberto pela Central neste navegador.";
    if (lens === "published") return "Mostra projetos que publicaram uma próxima ação. A ordem é a do catálogo, sem ranking.";
    if (lens === "alerts") return "Mostra projetos cujo contrato publicou alertas. A ordem é a do catálogo, sem pontuação.";
    return "Mostra somente o foco que você definiu na Central.";
  }

  function routedProjects() {
    const last = lastProjectId();
    return routeProjects().filter(item => {
      const contract = routeContract(item.id);
      if (lens === "focus") return item.id === focusId;
      if (lens === "resume") return item.id === last;
      if (lens === "published") return Boolean(contract?.contract?.state?.nextAction);
      return Boolean(contract?.contract?.state?.alerts?.length);
    }).sort((a, b) => a.order - b.order);
  }

  function routeReason(contract) {
    if (lens === "resume") return "Aparece porque foi o último ambiente aberto pela Central neste navegador.";
    if (lens === "published") return contract?.status === "stale-cache"
      ? "Aparece porque há uma próxima ação no último contrato conhecido, atualmente em cache antigo."
      : "Aparece porque o próprio projeto publicou uma próxima ação no contrato.";
    if (lens === "alerts") {
      const count = contract?.contract?.state?.alerts?.length || 0;
      return `Aparece porque o contrato do projeto publicou ${count} ${count === 1 ? "alerta" : "alertas"}.`;
    }
    return "Aparece porque você definiu este projeto como foco na Central.";
  }

  function createRouteCard(item) {
    const contract = routeContract(item.id);
    const state = contract?.contract?.state;
    const card = document.createElement("article");
    card.className = "routing-card";

    const head = document.createElement("div");
    head.className = "routing-card-head";
    const name = document.createElement("h3");
    name.textContent = item.name;
    const tag = document.createElement("span");
    tag.className = "routing-tag";
    tag.textContent = lens === "focus" ? "Foco escolhido" : lens === "resume" ? "Último acesso" : lens === "alerts" ? "Com alerta" : "Ação publicada";
    head.append(name, tag);
    card.append(head);

    const meta = document.createElement("p");
    meta.className = "routing-meta";
    meta.textContent = item.phase || "Ambiente ativo";
    card.append(meta);

    if (state?.nextAction) {
      const action = document.createElement("p");
      action.className = "routing-operational";
      action.textContent = contract.status === "stale-cache"
        ? `Último estado conhecido: ${state.nextAction}`
        : state.nextActionKind === "planned"
          ? `Planejado: ${state.nextAction}`
          : `Próxima ação publicada: ${state.nextAction}`;
      card.append(action);
    }

    if (lens === "alerts" && state?.alerts?.length) {
      const alert = document.createElement("p");
      alert.className = "routing-alert";
      alert.textContent = state.alerts[0];
      card.append(alert);
    }

    const why = document.createElement("details");
    why.className = "routing-why";
    const summary = document.createElement("summary");
    summary.textContent = "Por que aparece aqui?";
    const reason = document.createElement("p");
    reason.textContent = routeReason(contract);
    why.append(summary, reason);
    card.append(why);

    const link = document.createElement("a");
    link.className = "routing-open";
    link.href = item.href;
    link.textContent = "Abrir projeto →";
    card.append(link);
    return card;
  }

  function renderRouting() {
    if (!routeList || !routeExplanation || !routeButtons.length) return;

    routeButtons.forEach(button => {
      const active = button.dataset.routeLens === lens;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    routeExplanation.textContent = routeExplanationText();

    const items = routedProjects();
    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "routing-empty";
      empty.textContent = lens === "resume"
        ? "Ainda não há um último acesso registrado neste navegador."
        : lens === "alerts"
          ? "Nenhum alerta publicado nesta lente."
          : lens === "published"
            ? "Nenhuma próxima ação publicada está disponível nesta lente."
            : "O foco ainda não pôde ser identificado.";
      routeList.replaceChildren(empty);
      return;
    }

    routeList.replaceChildren(...items.map(createRouteCard));
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
    renderRouting();
  }

  routeButtons.forEach(button => {
    button.addEventListener("click", () => {
      const next = button.dataset.routeLens;
      if (!LENSES.has(next)) return;
      lens = next;
      try { localStorage.setItem(LENS_KEY, next); } catch {}
      renderRouting();
    });
  });

  document.addEventListener("central:app-ready", event => {
    focusId = event.detail?.focusId || focusId;
    render();
  });

  document.addEventListener("central:focus-changed", event => {
    focusId = event.detail?.id || focusId;
    render();
  });

  document.addEventListener("central:project-opened", renderRouting);
  document.addEventListener("central:history-cleared", renderRouting);

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
