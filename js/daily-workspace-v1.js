/* v28.7 — read-only daily plan and published review overview. */
(() => {
  "use strict";
  const HOST = "https://rodrigorosadantas.github.io/";
  const ROUTES = {
    seedf: { root: "seedf-ppge-dashboard/", track: "leis/", errors: "erros/", reviews: "revisoes/" },
    tjdft: { root: "tjdft-dashboard/", track: "portugues-rlm/", errors: "erros/", reviews: "revisoes/" },
    "prf-adm": { root: "prf-administrativo-dashboard/", track: "#leitura", errors: "#execucao", reviews: "#execucao" }
  };
  const QUESTION_ANCHORS = { seedf: { L06: "18-questoes-da-lei" } };
  const PRF_QUESTIONS = "https://app.notion.com/p/3e8cf5a267318197b509f976a15315d5";
  const TJ_UNITS = new Set(["P01","P02","P03","RL01","P04","REV01","P05","P06","RL02","P07","P08","REV02","P09","RL03","P10","P11","P12","REV03","RL04","P13","P14","P15","RL05","REV04","P16","P17","P18","RL06","RL07","REV05","RL08","RL09","RL10","RL11","RL12","REV06","RL13"]);
  const count = v => Number.isInteger(v) && v >= 0 ? v : null;
  function links(id, unit) {
    const r = ROUTES[id];
    if (!r) return null;
    const root = HOST + r.root;
    const code = typeof unit === "string" ? unit.toUpperCase() : "";
    const knownUnit = id === "seedf" ? /^L(?:0[1-9]|[12]\d|3[0-4])$/.test(code) : id === "tjdft" && TJ_UNITS.has(code);
    const material = root + r.track + (knownUnit ? code.toLowerCase() + "/" : "");
    return { root, material, questions: id === "prf-adm" ? PRF_QUESTIONS : material + (knownUnit && QUESTION_ANCHORS[id]?.[code] ? "#" + QUESTION_ANCHORS[id][code] : ""), errors: root + r.errors, reviews: root + r.reviews };
  }
  function published(detail, id) {
    const c = detail?.contract;
    return ["live", "cached", "stale-cache"].includes(detail?.status) && c?.schemaVersion === 1 && c.projectId === id && c.source?.kind === "public-project-state" && c.source.status === "synced" && c.study && c.state ? c : null;
  }
  function model(projects, details, entries, day, plannedIds) {
    return projects.filter(p => p.status === "active" && ROUTES[p.id]).sort((a,b) => a.order - b.order).map(p => {
      const detail = details[p.id], c = published(detail, p.id), study = c?.study;
      const logs = entries.filter(e => e.projectId === p.id && e.confirmed === true && window.CentralStudyDatesV1?.dateOnly(e.date) === day && Number.isInteger(e.minutes) && e.minutes >= 1 && e.minutes <= 1440);
      return { ...p, planned: plannedIds.includes(p.id), minutes: logs.reduce((sum,e) => sum + e.minutes, 0), records: logs.length,
        unit: study?.nextUnit || c?.state?.currentUnit || null, alerts: Array.isArray(c?.state?.alerts) ? c.state.alerts.filter(x => typeof x === "string").slice(0,1) : [],
        action: typeof c?.state?.nextAction === "string" && c.state.nextAction.trim() ? c.state.nextAction.trim() : null,
        lastUnit: study?.evidence === "confirmed" && typeof study.lastCompletedUnit === "string" ? study.lastCompletedUnit : null,
        lastDate: study?.evidence === "confirmed" ? window.CentralStudyDatesV1?.publishedDate(study.lastStudiedAt) : null,
        errors: count(study?.activeErrors), reviews: count(study?.reviewsDue), nextReview: window.CentralStudyDatesV1?.publishedDate(study?.nextReviewAt) || null,
        sourceStatus: c ? detail.status : detail?.status || "loading", sourceUpdatedAt: c?.source?.updatedAt || null,
        destinations: links(p.id, study?.nextUnit || c?.state?.currentUnit) };
    });
  }
  window.CentralDailyWorkspaceV1 = { model, links, published };
  const $ = id => document.getElementById(id);
  if (!$("daily-plan-cards")) return;
  let projects = [...document.querySelectorAll("[data-daily-project]")].map((el,index) => ({ id: el.dataset.dailyProject, name: el.textContent.trim(), code: `P${index + 1}`, order: index + 1, status: "active" }));
  const details = {};
  let storageOK = true, configFailed = false, dayTimer;
  const date = () => window.CentralStudyLogV1?.today() || new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo", year:"numeric", month:"2-digit", day:"2-digit" }).format(new Date());
  const duration = minutes => window.CentralStudyLogV1?.duration(minutes) || `${minutes} min`;
  const displayDate = value => value ? value.slice(8,10) + "/" + value.slice(5,7) : "sem data publicada";
  function node(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; }
  function anchor(text, href, cls) { const a = node("a", cls, text); a.href = href; if (href.startsWith("https://app.notion.com/")) { a.target = "_blank"; a.rel = "noopener noreferrer"; a.setAttribute("aria-label", text + " — abre o Notion em nova guia"); } return a; }
  function readEntries() {
    try { const raw = localStorage.getItem("central-estudos:study-log-v1"), value = raw ? JSON.parse(raw) : []; storageOK = true; return Array.isArray(value) ? (window.CentralStudyLogV1?.read(new Set(projects.map(p => p.id))) || value.filter(e => e && typeof e === "object")) : []; }
    catch { storageOK = false; return []; }
  }
  function schedule(day) {
    const key = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"][new Date(day + "T12:00:00Z").getUTCDay()];
    const codes = [...document.querySelectorAll(`.schedule-day-card[data-weekday="${key}"] .schedule-mark`)].map(el => el.textContent.trim());
    return { key, ids: projects.filter(p => codes.includes(p.code)).map(p => p.id) };
  }
  function sourceText(p) {
    const label = { live:"Estado publicado consultado", cached:"Última consulta salva", "stale-cache":"Consulta anterior · pode estar desatualizada", loading:"Consultando estado publicado…", unavailable:"Estado indisponível · acessos disponíveis", invalid:"Estado inválido · confira no projeto", unsupported:"Estado não publicado" }[p.sourceStatus] || "Estado indisponível";
    if (!p.sourceUpdatedAt) return label;
    try { return label + " · fonte " + new Intl.DateTimeFormat("pt-BR", { timeZone:"America/Sao_Paulo", day:"2-digit", month:"2-digit", hour:"2-digit", minute:"2-digit" }).format(new Date(p.sourceUpdatedAt)); }
    catch { return label; }
  }
  function registration(p) {
    const a = anchor("Registrar tempo", "#projetos", "daily-register");
    a.setAttribute("aria-label", "Registrar tempo de estudo — " + p.name);
    a.addEventListener("click", event => {
      event.preventDefault(); window.CentralWorkspaceV24?.setScreen("projects");
      const form = $("study-log-form"), panel = $("study-log-entry-panel"), input = $("study-log-date"), context = $("study-log-form-context");
      if (panel) panel.open = true;
      form?.classList.remove("is-guided-entry");
      if (context) context.hidden = true;
      if (input) { input.value = date(); input.dispatchEvent(new Event("change", { bubbles:true })); }
      if ($("study-log-entry-summary")) $("study-log-entry-summary").textContent = "Registrar bloco";
      document.dispatchEvent(new CustomEvent("central:study-log-select-project", { detail: { id:p.id } }));
      form?.scrollIntoView({ block:"start", behavior:"smooth" });
      input?.focus({ preventScroll:true });
    });
    return a;
  }
  function renderPlan(rows, day, grade) {
    const container = $("daily-plan-cards"); container.replaceChildren();
    $("daily-plan-date").textContent = new Intl.DateTimeFormat("pt-BR", { timeZone:"America/Sao_Paulo", weekday:"long", day:"numeric", month:"long" }).format(new Date(day + "T12:00:00Z"));
    $("daily-plan-caption").textContent = grade.key === "sunday" ? "Descanso previsto. D7/D20 somente quando indicados pelo projeto." : grade.key === "saturday" ? "Hoje é dia de revisão de SEEDF e TJDFT." : "Siga a grade do dia e retome a próxima ação de cada projeto.";
    for (const p of rows) {
      const card = node("article", "daily-project-card" + (p.planned ? " is-planned" : "")); card.dataset.projectId = p.id;
      const head = node("div", "daily-card-head"); head.append(node("span", "daily-priority", p.code), node("h3", "", p.name), node("span", "daily-plan-label", p.planned ? (grade.key === "saturday" ? "Revisão hoje" : "Na grade de hoje") : "Fora da grade de hoje"));
      const next = node("a", "daily-next"); next.href = p.destinations.material;
      next.append(node("span", "daily-label", p.unit ? "PRÓXIMO PASSO · " + p.unit : "PRÓXIMO PASSO"), node("strong", "", p.action || (p.sourceStatus === "loading" ? "Consultando o próximo passo…" : "Abrir a trilha do projeto")), node("span", "daily-next-arrow", "Abrir material →"));
      const facts = node("div", "daily-facts");
      const local = node("div", ""); local.append(node("span", "daily-label", "REGISTRADO HOJE"), node("strong", "", storageOK ? (p.records ? duration(p.minutes) : "Sem registro") : "Indisponível"));
      const confirmed = node("div", ""); confirmed.append(node("span", "daily-label", "ÚLTIMO BLOCO CONFIRMADO"), node("strong", "", p.lastUnit ? p.lastUnit + (p.lastDate ? " · " + displayDate(p.lastDate) : "") : "Sem bloco informado"));
      facts.append(local, confirmed);
      const shortcuts = node("nav", "daily-links"); shortcuts.setAttribute("aria-label", "Atalhos — " + p.name);
      shortcuts.append(anchor("Material",p.destinations.material),anchor(p.id === "prf-adm" ? "Questões ↗" : "Questões da unidade",p.destinations.questions),anchor(p.id === "prf-adm" ? "Execução / erros" : "Erros",p.destinations.errors));
      card.append(head, next); for (const alert of p.alerts) card.append(node("p","daily-card-note",alert)); card.append(facts, shortcuts, registration(p), node("p", "daily-source" + (p.sourceStatus === "stale-cache" ? " is-stale" : ""), sourceText(p))); container.append(card);
    }
    $("daily-records-note").textContent = storageOK ? "Os minutos vêm dos registros confirmados neste navegador. Sem registro significa que o tempo ainda não foi informado." : "O armazenamento local está indisponível. Os projetos e seus estados publicados continuam acessíveis.";
  }
  function renderReviews(rows) {
    const container = $("review-project-cards"); container.replaceChildren();
    const known = rows.filter(p => p.errors !== null), sum = known.reduce((s,p) => s + p.errors, 0);
    $("review-overview").textContent = known.length ? `${sum} erros ativos informados · ${known.length} de ${rows.length} projetos com dado publicado` : "Aguardando os dados publicados pelos projetos.";
    for (const p of rows) {
      const card = node("article", "review-project-card"); card.dataset.projectId = p.id;
      const title = node("h3", "", p.code + " · " + p.name);
      const stats = node("dl", "review-stats");
      for (const [label,value] of [["Revisões pendentes",p.reviews === null ? "Não informado" : String(p.reviews)],["Erros ativos",p.errors === null ? "Não informado" : String(p.errors)],["Próxima revisão",p.nextReview ? displayDate(p.nextReview) : "Sem data publicada"]]) {
        const group = node("div", ""); group.append(node("dt", "", label),node("dd", "", value)); stats.append(group);
      }
      const actions = node("div", "review-actions"); actions.append(anchor(p.id === "prf-adm" ? "Ver rotina de revisão" : "Abrir revisões",p.destinations.reviews,"daily-action"),anchor(p.id === "prf-adm" ? "Ver execução e erros" : "Abrir caderno de erros",p.destinations.errors,"daily-action"));
      card.append(title,stats,actions,node("p","daily-source" + (p.sourceStatus === "stale-cache" ? " is-stale" : ""),sourceText(p))); container.append(card);
    }
  }
  function render() {
    const day = date(), grade = schedule(day), rows = model(projects,details,readEntries(),day,grade.ids);
    renderPlan(rows,day,grade); renderReviews(rows);
    const pending = rows.some(p => p.sourceStatus === "loading");
    const button = $("daily-refresh"); button.disabled = pending; button.textContent = configFailed ? "Recarregar Central" : pending ? "Consultando…" : "Atualizar painel";
    $("daily-refresh-status").textContent = pending ? "Consultando os estados publicados dos projetos." : rows.some(p => ["unavailable","invalid","unsupported","stale-cache"].includes(p.sourceStatus)) ? "Consulta concluída. Alguns projetos precisam de conferência na origem." : "Consulta concluída. Os horários de cada fonte aparecem nos cartões.";
    clearTimeout(dayTimer); function checkDay() { if (date() !== day) render(); else dayTimer = setTimeout(checkDay,60000); } dayTimer = setTimeout(checkDay,60000);
  }
  document.addEventListener("central:app-unavailable", () => { configFailed = true; for (const p of projects) details[p.id] = { id:p.id,status:"unavailable" }; render(); });
  document.addEventListener("central:workspace-ready", e => { if (Array.isArray(e.detail?.projects)) projects = e.detail.projects; render(); });
  document.addEventListener("central:contract-state", e => { if (e.detail?.id) details[e.detail.id] = e.detail; render(); });
  for (const event of ["central:study-log-updated","central:study-log-auto-added","central:screen-change"]) document.addEventListener(event, render);
  window.addEventListener("storage", e => { if (e.key === "central-estudos:study-log-v1") render(); });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) render(); });
  $("daily-refresh").addEventListener("click", () => {
    if (configFailed) { location.reload(); return; }
    for (const p of projects.filter(p => p.status === "active" && ROUTES[p.id])) { details[p.id] = { id:p.id,status:"loading" }; document.dispatchEvent(new CustomEvent("central:contract-refresh",{detail:{id:p.id}})); }
    render();
  });
  document.addEventListener("DOMContentLoaded", render);
})();
