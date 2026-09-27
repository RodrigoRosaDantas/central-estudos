(() => {
  "use strict";

  const LENS_KEY = "central-estudos:route-lens-v14";
  const LAST_PROJECT_KEY = "central-estudos:last-project";
  const LENSES = new Set(["focus", "resume", "published", "alerts"]);
  const contracts = new Map();

  const list = document.getElementById("routing-list");
  const explanation = document.getElementById("routing-explanation");
  const buttons = [...document.querySelectorAll("[data-route-lens]")];

  if (!list || !explanation || !buttons.length) return;

  let focusId = null;
  let lens = readLens();

  function readLens() {
    try {
      const value = localStorage.getItem(LENS_KEY);
      return LENSES.has(value) ? value : "focus";
    } catch {
      return "focus";
    }
  }

  function saveLens(value) {
    try { localStorage.setItem(LENS_KEY, value); } catch {}
  }

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

  function projects() {
    return [...document.querySelectorAll(".project-card")].map(card => ({
      id: card.dataset.projectId || "",
      order: Number(card.dataset.projectOrder ?? Number.MAX_SAFE_INTEGER),
      name: card.querySelector("h3")?.textContent?.trim() || "Ambiente",
      phase: card.querySelector(".project-phase")?.textContent?.trim() || "",
      href: card.querySelector(".project-link")?.href || "#projetos"
    })).filter(item => item.id);
  }

  function visibleContract(id) {
    const item = contracts.get(id);
    return item && ["live", "cached", "stale-cache"].includes(item.status) && item.contract?.state
      ? item
      : null;
  }

  function explanationFor(value) {
    if (value === "resume") return "Mostra o último ambiente aberto pela Central neste navegador.";
    if (value === "published") return "Mostra projetos que publicaram uma próxima ação. A ordem é a do catálogo, sem ranking.";
    if (value === "alerts") return "Mostra projetos cujo contrato publicou alertas. A ordem é a do catálogo, sem pontuação.";
    return "Mostra somente o foco que você definiu na Central.";
  }

  function reasonFor(value, item, contract) {
    if (value === "resume") return "Aparece porque foi o último ambiente aberto pela Central neste navegador.";
    if (value === "published") {
      return contract?.status === "stale-cache"
        ? "Aparece porque há uma próxima ação no último contrato conhecido, atualmente em cache antigo."
        : "Aparece porque o próprio projeto publicou uma próxima ação no contrato.";
    }
    if (value === "alerts") {
      const count = contract?.contract?.state?.alerts?.length || 0;
      return `Aparece porque o contrato do projeto publicou ${count} ${count === 1 ? "alerta" : "alertas"}.`;
    }
    return "Aparece porque você definiu este projeto como foco na Central.";
  }

  function operationalText(contract) {
    if (!contract) return null;
    const state = contract.contract.state;
    if (!state.nextAction) return null;

    if (contract.status === "stale-cache") return `Último estado conhecido: ${state.nextAction}`;
    if (state.nextActionKind === "planned") return `Planejado: ${state.nextAction}`;
    return `Próxima ação publicada: ${state.nextAction}`;
  }

  function routeItems() {
    const all = projects();
    const last = readLastVisit();

    return all.filter(item => {
      const contract = visibleContract(item.id);
      if (lens === "focus") return item.id === focusId;
      if (lens === "resume") return Boolean(last && item.id === last.id);
      if (lens === "published") return Boolean(contract?.contract?.state?.nextAction);
      if (lens === "alerts") return Boolean(contract?.contract?.state?.alerts?.length);
      return false;
    }).sort((a, b) => a.order - b.order);
  }

  function createCard(item) {
    const contract = visibleContract(item.id);
    const card = document.createElement("article");
    card.className = "routing-card";

    const head = document.createElement("div");
    head.className = "routing-card-head";

    const name = document.createElement("h3");
    name.textContent = item.name;

    const tag = document.createElement("span");
    tag.className = "routing-tag";
    tag.textContent = lens === "focus"
      ? "Foco escolhido"
      : lens === "resume"
        ? "Último acesso"
        : lens === "alerts"
          ? "Com alerta"
          : "Ação publicada";

    head.append(name, tag);
    card.append(head);

    const meta = document.createElement("p");
    meta.className = "routing-meta";
    meta.textContent = item.phase || "Ambiente ativo";
    card.append(meta);

    const opText = operationalText(contract);
    if (opText) {
      const operational = document.createElement("p");
      operational.className = "routing-operational";
      operational.textContent = opText;
      card.append(operational);
    }

    if (lens === "alerts" && contract?.contract?.state?.alerts?.length) {
      const alert = document.createElement("p");
      alert.className = "routing-alert";
      alert.textContent = contract.contract.state.alerts[0];
      card.append(alert);
    }

    const why = document.createElement("details");
    why.className = "routing-why";
    const summary = document.createElement("summary");
    summary.textContent = "Por que aparece aqui?";
    const reason = document.createElement("p");
    reason.textContent = reasonFor(lens, item, contract);
    why.append(summary, reason);
    card.append(why);

    const link = document.createElement("a");
    link.className = "routing-open";
    link.href = item.href;
    link.textContent = "Abrir projeto →";
    card.append(link);

    return card;
  }

  function render() {
    buttons.forEach(button => {
      const active = button.dataset.routeLens === lens;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    explanation.textContent = explanationFor(lens);
    const items = routeItems();

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
      list.replaceChildren(empty);
      return;
    }

    list.replaceChildren(...items.map(createCard));
  }

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const next = button.dataset.routeLens;
      if (!LENSES.has(next)) return;
      lens = next;
      saveLens(next);
      render();
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

  document.addEventListener("central:project-opened", render);
  document.addEventListener("central:history-cleared", render);

  document.addEventListener("central:contract-state", event => {
    const detail = event.detail;
    if (!detail || typeof detail.id !== "string") return;
    contracts.set(detail.id, detail);
    render();
  });

  render();
})();
