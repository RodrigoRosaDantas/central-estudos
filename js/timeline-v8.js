(() => {
  "use strict";

  const ACCESS_HISTORY_KEY = "central-estudos:access-history-v8";
  const MAX_ACCESS_HISTORY = 12;
  const DISPLAY_ACCESS_HISTORY = 5;

  const panel = document.getElementById("activity-panel");
  const accessList = document.getElementById("access-history-list");
  const technicalList = document.getElementById("technical-activity-list");

  if (!panel || !accessList || !technicalList) return;

  const technical = new Map();

  function readHistory() {
    try {
      const raw = localStorage.getItem(ACCESS_HISTORY_KEY);
      if (!raw) return [];

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw new Error("invalid-history");

      const valid = parsed
        .filter(item =>
          item &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          typeof item.visitedAt === "string" &&
          !Number.isNaN(new Date(item.visitedAt).getTime())
        )
        .slice(0, MAX_ACCESS_HISTORY);

      if (valid.length !== parsed.length) {
        localStorage.setItem(ACCESS_HISTORY_KEY, JSON.stringify(valid));
      }

      return valid;
    } catch {
      try { localStorage.removeItem(ACCESS_HISTORY_KEY); } catch {}
      return [];
    }
  }

  function writeHistory(history) {
    try {
      localStorage.setItem(
        ACCESS_HISTORY_KEY,
        JSON.stringify(history.slice(0, MAX_ACCESS_HISTORY))
      );
    } catch {
      // Histórico é opcional. Falha local não afeta navegação.
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

  function formatDate(isoDate) {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return "horário não disponível";

    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "short",
      timeStyle: "short"
    }).format(date);
  }

  function relativeTime(isoDate) {
    if (!isoDate) return null;
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return null;

    const diff = date.getTime() - Date.now();
    const absolute = Math.abs(diff);
    const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (absolute < hour) return rtf.format(Math.round(diff / minute), "minute");
    if (absolute < day) return rtf.format(Math.round(diff / hour), "hour");
    return rtf.format(Math.round(diff / day), "day");
  }

  function renderAccessHistory() {
    const history = readHistory().slice(0, DISPLAY_ACCESS_HISTORY);

    if (!history.length) {
      accessList.innerHTML = '<p class="activity-empty">Nenhum acesso registrado neste aparelho.</p>';
      return;
    }

    accessList.innerHTML = history.map(item => `
      <div class="activity-item">
        <span class="activity-marker" aria-hidden="true">↗</span>
        <span class="activity-copy">
          <span class="activity-title">${escapeHtml(item.name)} aberto pela Central</span>
          <span class="activity-meta">${formatDate(item.visitedAt)} · fonte: histórico local deste navegador</span>
          <span class="activity-diagnostic">Este registro indica somente um acesso. Não mede estudo, duração, progresso ou desempenho.</span>
        </span>
      </div>
    `).join("");
  }

  function recordAccess(detail) {
    if (!detail || typeof detail.id !== "string" || typeof detail.name !== "string") return;

    const visitedAt = typeof detail.visitedAt === "string"
      ? detail.visitedAt
      : new Date().toISOString();

    const history = readHistory();
    const latest = history[0];
    const recentDuplicate = latest &&
      latest.id === detail.id &&
      Math.abs(new Date(visitedAt).getTime() - new Date(latest.visitedAt).getTime()) < 15000;

    const next = recentDuplicate
      ? [{ id: detail.id, name: detail.name, visitedAt }, ...history.slice(1)]
      : [{ id: detail.id, name: detail.name, visitedAt }, ...history];

    writeHistory(next);
    renderAccessHistory();
  }

  function projectOrder(id) {
    const card = [...document.querySelectorAll("[data-project-id]")]
      .find(item => item.dataset.projectId === id);
    const value = Number(card?.dataset.projectOrder);
    return Number.isFinite(value) ? value : Number.MAX_SAFE_INTEGER;
  }

  function deployLabel(status) {
    if (status === "success") return "último deploy público concluído";
    if (status === "failure") return "último deploy público com falha";
    if (status === "cancelled") return "último deploy público cancelado";
    if (status === "in_progress") return "deploy público em andamento";
    if (status === "queued") return "deploy público na fila";
    return "deploy público não verificado";
  }

  function diagnosis(item) {
    const notes = [];
    const healthCached = item.healthMetaState === "cached" || item.healthMetaState === "stale-cache";

    if (healthCached && item.health === "online") {
      notes.push("A última checagem conhecida indicou resposta acessível, mas está em cache e não confirma o estado neste instante.");
    } else if (healthCached && item.health === "offline") {
      notes.push("A última checagem conhecida registrou resposta com erro, mas está em cache; a Central não determina a causa nem o estado atual.");
    } else if (item.health === "online") {
      notes.push("O site respondeu à verificação atual.");
    } else if (item.health === "offline") {
      notes.push("O site respondeu com erro. A Central não determina a causa; o acesso direto continua disponível para nova tentativa.");
    } else if (item.health === "unknown") {
      notes.push("A disponibilidade não pôde ser confirmada. Rede, timeout ou política do navegador podem tornar a checagem inconclusiva.");
    } else {
      notes.push("A verificação de disponibilidade ainda está em andamento.");
    }

    if (item.repoMetaState === "stale-cache" || item.deployMetaState === "stale-cache") {
      notes.push("Há metadados em cache que podem estar desatualizados.");
    }

    if (item.deployStatus === "failure" && item.health === "online") {
      notes.push("A falha do último deploy conhecido não implica que o site atual esteja indisponível.");
    }

    return notes.join(" ");
  }

  function renderTechnical() {
    const items = [...technical.values()]
      .sort((a, b) => {
        const aTime = new Date(a.repoUpdatedAt || 0).getTime();
        const bTime = new Date(b.repoUpdatedAt || 0).getTime();
        return bTime - aTime || projectOrder(a.id) - projectOrder(b.id);
      });

    if (!items.length) {
      technicalList.innerHTML = '<p class="activity-empty">Aguardando sinais técnicos públicos.</p>';
      return;
    }

    technicalList.innerHTML = items.map(item => {
      const publication = item.repoUpdatedAt
        ? `publicação técnica ${relativeTime(item.repoUpdatedAt) || "em data conhecida"}`
        : "publicação técnica não verificada";
      const stale = item.repoMetaState === "stale-cache" || item.deployMetaState === "stale-cache";
      const healthCached = item.healthMetaState === "cached" || item.healthMetaState === "stale-cache";
      const source = stale || healthCached
        ? "fontes públicas · há dado em cache"
        : "site público + GitHub público";

      return `
        <div class="activity-item">
          <span class="activity-marker" aria-hidden="true">●</span>
          <span class="activity-copy">
            <span class="activity-title">${escapeHtml(item.name)}</span>
            <span class="activity-meta">${publication} · ${deployLabel(item.deployStatus)} · fonte: ${source}</span>
            <span class="activity-diagnostic">${diagnosis(item)}</span>
          </span>
        </div>
      `;
    }).join("");
  }

  document.addEventListener("central:project-opened", event => {
    recordAccess(event.detail);
  });

  document.addEventListener("central:history-cleared", () => {
    try { localStorage.removeItem(ACCESS_HISTORY_KEY); } catch {}
    renderAccessHistory();
  });

  document.addEventListener("central:technical-state", event => {
    const detail = event.detail;
    if (!detail || typeof detail.id !== "string") return;

    technical.set(detail.id, {
      ...technical.get(detail.id),
      ...detail
    });
    renderTechnical();
  });

  renderAccessHistory();
  panel.hidden = false;
})();
