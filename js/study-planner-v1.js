(() => {
  "use strict";

  const api = window.CentralStudyLogV1;
  const catalogUrl = "./config/study-catalog-v1.json?v=28.1.0";
  const weekdayNames = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
  const weekdayKeys = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const projectIds = { P1: "seedf", P2: "tjdft", P3: "tcego", P4: "prf-adm" };
  const fallback = {
    seedf: { name: "SEEDF", groups: [{ label: "Matéria", items: ["Leis — Leis Primeiro", "Ciclo vigente — unidade Dxx", "Questões / revisão", "Outro assunto — detalhe abaixo"] }] },
    tjdft: { name: "TJDFT", groups: [{ label: "Matéria", items: ["Português Primeiro", "RLM Preventivo", "Revisão integrada", "Outro assunto — detalhe abaixo"] }] },
    tcego: { name: "TCE-GO", groups: [{ label: "Matéria", items: ["Sessão TCE-GO — conferir unidade", "Outro assunto — detalhe abaixo"] }] },
    "prf-adm": { name: "PRF Administrativo", groups: [{ label: "Matéria", items: ["PRFADMxx — conferir próximo código e material no Notion", "Outro assunto — detalhe abaixo"] }] }
  };

  const $ = id => document.getElementById(id);
  const trailField = $("study-log-trail");
  if (!api || !trailField) return;

  // Enhance the existing text field before the offline log binds its form handlers.
  const matterSelect = document.createElement("select");
  matterSelect.id = trailField.id;
  matterSelect.className = trailField.className;
  matterSelect.required = true;
  matterSelect.setAttribute("aria-label", "Matéria ou unidade estudada");
  matterSelect.dataset.catalog = "study-catalog-v1";
  trailField.replaceWith(matterSelect);

  const planner = $("study-log-planner");
  const weekPicker = $("study-log-week-picker");
  const weekLabel = $("study-log-week-label");
  const dayLabel = $("study-log-selected-day");
  const dayTotal = $("study-log-selected-total");
  const blocksNode = $("study-log-planned-blocks");
  const note = $("study-log-planner-note");
  const form = $("study-log-form");
  const panel = $("study-log-entry-panel");
  const dateInput = $("study-log-date");
  const projectInput = $("study-log-project");
  const topicInput = $("study-log-topic");
  const context = $("study-log-form-context");
  if (![planner, weekPicker, weekLabel, dayLabel, dayTotal, blocksNode, form, panel, dateInput, projectInput].every(Boolean)) return;

  const dayButton = $("study-log-week-prev");
  const currentButton = $("study-log-week-current");
  const manualButton = $("study-log-manual-button");
  const catalog = { projects: fallback };
  let selectedDate = api.today();
  let completeCatalog = false;
  const ids = new Set([...projectInput.options].map(option => option.value).filter(Boolean));
  let logEntries = api.read(ids);

  function add(parent, tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    parent.append(node);
    return node;
  }

  function isoDay(value, offset) {
    const day = new Date(`${value}T00:00:00Z`);
    day.setUTCDate(day.getUTCDate() + offset);
    return day.toISOString().slice(0, 10);
  }

  function formatDate(value, options = { day: "2-digit", month: "2-digit" }) {
    return new Intl.DateTimeFormat("pt-BR", { ...options, timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
  }

  function minutesOn(value) {
    return api.total(logEntries.filter(entry => entry.date === value));
  }

  function updateSelectedDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value > api.today()) return;
    selectedDate = value;
    dateInput.value = value;
    dateInput.max = api.today();
    document.dispatchEvent(new CustomEvent("central:study-date-selected", { detail: { date: value } }));
    render();
  }

  function scheduledItems(key) {
    const day = document.querySelector(`.schedule-day-card[data-weekday="${key}"]`);
    if (!day) return [];
    return [...day.querySelectorAll(".schedule-items > li")].map(row => {
      const priority = row.querySelector(".schedule-mark")?.textContent.trim();
      const projectId = projectIds[priority];
      const link = row.querySelector("a");
      const name = link?.textContent.trim() || row.querySelector("strong")?.textContent.trim();
      return projectId && name ? {
        projectId,
        name,
        activity: row.querySelector("small")?.textContent.trim() || "Estudo previsto",
        href: link?.href || document.querySelector(`.schedule-priority-chip[data-priority="${priority === "PRF" ? "4" : priority?.slice(1)}"]`)?.href || ""
      } : null;
    }).filter(Boolean);
  }

  function setMatters(projectId) {
    matterSelect.replaceChildren();
    const prompt = add(matterSelect, "option", "", completeCatalog ? "Selecione a matéria deste bloco" : "Selecione a matéria (catálogo básico)");
    prompt.value = "";
    prompt.disabled = true;
    const project = catalog.projects[projectId];
    for (const group of project?.groups || []) {
      const optgroup = document.createElement("optgroup");
      optgroup.label = group.label;
      for (const label of group.items || []) {
        const option = document.createElement("option");
        option.value = label;
        option.textContent = label;
        optgroup.append(option);
      }
      matterSelect.append(optgroup);
    }
    matterSelect.value = "";
    if (topicInput) topicInput.required = false;
  }

  function createPlanCard(item) {
    const card = add(blocksNode, "article", "study-plan-card");
    const head = add(card, "div", "study-plan-card-heading");
    add(head, "span", "study-plan-project", item.name);
    add(head, "span", "study-plan-activity", item.activity);
    const descriptions = {
      seedf: item.activity === "Revisão" ? "Leis Primeiro, ciclo e revisões conforme o dia no projeto." : "Leis Primeiro ou unidade do ciclo; selecione o assunto feito.",
      tjdft: item.activity === "Revisão" ? "Escolha a revisão integrada ou o conteúdo que retomou." : "Escolha Português, RLM ou a unidade efetivamente estudada.",
      tcego: "Sessão prevista. Confira no projeto se a unidade e o material estão liberados.",
      "prf-adm": "Roda leve. Confira no Notion o próximo código e se o material está pronto."
    };
    add(card, "p", "study-plan-description", descriptions[item.projectId]);
    if (item.href) {
      const link = add(card, "a", "study-plan-source", "Abrir projeto ↗");
      link.href = item.href;
      link.target = "_blank";
      link.rel = "noopener";
    }
    const button = add(card, "button", "study-plan-choose", "Registrar esta matéria");
    button.type = "button";
    button.disabled = selectedDate > api.today();
    button.addEventListener("click", () => openGuidedEntry(item));
  }

  function openGuidedEntry(item) {
    dateInput.value = selectedDate;
    projectInput.value = item.projectId;
    if (topicInput) topicInput.value = "";
    $("study-log-hours").value = "";
    $("study-log-minutes").value = "";
    $("study-log-confirmed").checked = false;
    form.classList.add("is-guided-entry");
    if (context) {
      context.hidden = false;
      context.textContent = `${weekdayNames[new Date(`${selectedDate}T00:00:00Z`).getUTCDay()]} · ${formatDate(selectedDate, { day: "2-digit", month: "2-digit", year: "numeric" })} · ${item.name}`;
    }
    if (panel) panel.open = true;
    setMatters(item.projectId);
    $("study-log-entry-summary").textContent = `Registro guiado · ${item.name}`;
    $("study-log-hours").focus({ preventScroll: true });
    panel.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function renderStudyTotals(range) {
    const daily = logEntries.filter(entry => entry.date === selectedDate);
    const weekly = logEntries.filter(entry => entry.date >= range.from && entry.date <= range.to);
    const todayTotal = $("study-log-today-total"), weekTotal = $("study-log-week-total");
    const dailyList = $("study-log-today-list"), days = $("study-log-days"), cards = $("study-log-projects");
    const scoreLabels = document.querySelectorAll("#study-log .study-log-score > span");
    if (scoreLabels[0]) scoreLabels[0].textContent = "TEMPO NO DIA SELECIONADO";
    if (scoreLabels[1]) scoreLabels[1].textContent = "TEMPO NA SEMANA SELECIONADA";
    const subtitles = document.querySelectorAll("#study-log .study-log-subtitle");
    if (subtitles[0]) subtitles[0].textContent = "Semana selecionada, dia a dia";
    if (subtitles[1]) subtitles[1].textContent = "Resumo por projeto e tópico na semana selecionada";
    if (todayTotal) todayTotal.textContent = api.duration(api.total(daily));
    if (weekTotal) weekTotal.textContent = api.duration(api.total(weekly));
    if (dailyList) {
      dailyList.replaceChildren();
      if (!daily.length) add(dailyList, "p", "study-log-empty", "Nenhum bloco registrado neste dia.");
      for (const entry of daily) {
        const name = [...projectInput.options].find(option => option.value === entry.projectId)?.textContent || entry.projectId;
        add(dailyList, "p", "study-log-line", `${name} · ${entry.trail}${entry.topic ? ` · ${entry.topic}` : ""} — ${api.duration(entry.minutes)}`);
      }
    }
    if (days) {
      days.replaceChildren();
      for (let i = 0; i < 7; i++) {
        const date = isoDay(range.from, i), item = add(days, "article", "study-log-day");
        add(item, "span", "", weekdayNames[new Date(`${date}T00:00:00Z`).getUTCDay()].slice(0, 3));
        add(item, "strong", "", api.duration(minutesOn(date)));
      }
    }
    if (cards) {
      cards.replaceChildren();
      for (const option of [...projectInput.options].filter(item => item.value)) {
        const all = logEntries.filter(entry => entry.projectId === option.value);
        const mine = weekly.filter(entry => entry.projectId === option.value);
        const card = add(cards, "article", "project-card study-log-project");
        add(card, "h4", "", option.textContent);
        add(card, "strong", "study-log-project-total", api.duration(api.total(all)));
        add(card, "small", "", `total acumulado · ${api.duration(api.total(mine))} nesta semana`);
        const list = add(card, "ul", "study-log-groups");
        if (!mine.length) add(list, "li", "study-log-empty", "Sem registro nesta semana.");
        else for (const [label, minutes] of api.group(mine)) add(list, "li", "", `${label} — ${api.duration(minutes)}`);
      }
    }
  }

  function render() {
    logEntries = api.read(ids);
    const range = api.weekRange(selectedDate);
    const today = api.today();
    weekLabel.textContent = `${formatDate(range.from, { day: "2-digit", month: "short" })} – ${formatDate(range.to, { day: "2-digit", month: "short", year: "numeric" })} · ${api.duration(api.total(logEntries.filter(entry => entry.date >= range.from && entry.date <= range.to)))}`;
    currentButton.disabled = selectedDate === today;
    weekPicker.replaceChildren();
    for (let i = 0; i < 7; i++) {
      const date = isoDay(range.from, i);
      const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
      const button = add(weekPicker, "button", "study-log-day-choice");
      button.type = "button";
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(date === selectedDate));
      button.setAttribute("aria-pressed", String(date === selectedDate));
      button.disabled = date > today;
      add(button, "span", "study-log-day-name", weekdayNames[weekday].slice(0, 3));
      add(button, "strong", "study-log-day-number", formatDate(date, { day: "2-digit" }));
      add(button, "small", "study-log-day-time", minutesOn(date) ? api.duration(minutesOn(date)) : "—");
      button.addEventListener("click", () => updateSelectedDate(date));
    }
    const weekday = new Date(`${selectedDate}T00:00:00Z`).getUTCDay();
    dayLabel.textContent = `${weekdayNames[weekday]} · ${formatDate(selectedDate, { day: "2-digit", month: "long", year: "numeric" })}`;
    dayTotal.textContent = `${api.duration(minutesOn(selectedDate))} registrados`;
    blocksNode.replaceChildren();
    const items = scheduledItems(weekdayKeys[weekday]);
    if (!items.length) {
      add(blocksNode, "article", "study-plan-rest", "Domingo protegido. Só registre revisão D7/D20 se estiver prevista no projeto.");
      renderStudyTotals(range);
      return;
    }
    for (const item of items) createPlanCard(item);
    renderStudyTotals(range);
  }

  async function loadCatalog() {
    try {
      const response = await fetch(catalogUrl, { cache: "no-cache" });
      if (!response.ok) throw new Error("Catálogo indisponível");
      const data = await response.json();
      if (data.version !== "28.1.0" || !data.projects || !["seedf", "tjdft", "tcego", "prf-adm"].every(id => data.projects[id]?.groups?.length)) throw new Error("Catálogo inválido");
      for (const project of Object.values(data.projects)) {
        for (const group of project.groups) {
          if (!Array.isArray(group.items) || group.items.some(item => typeof item !== "string" || item.length > 100)) throw new Error("Matéria inválida");
        }
      }
      const prior = matterSelect.value;
      catalog.projects = data.projects;
      completeCatalog = true;
      setMatters(projectInput.value);
      if ([...matterSelect.options].some(option => option.value === prior)) matterSelect.value = prior;
      note.textContent = `Catálogo de matérias conferido em ${formatDate(data.asOf, { day: "2-digit", month: "2-digit", year: "numeric" })}. A ordem e o progresso continuam no projeto de origem.`;
    } catch {
      note.textContent = "Catálogo detalhado indisponível agora; o registro manual continua acessível. Confira a matéria e a unidade no projeto de origem.";
    }
  }

  dayButton.addEventListener("click", () => updateSelectedDate(isoDay(selectedDate, -7)));
  currentButton.addEventListener("click", () => updateSelectedDate(api.today()));
  manualButton.addEventListener("click", () => {
    dateInput.value = selectedDate;
    form.classList.remove("is-guided-entry");
    if (context) context.hidden = true;
    if (panel) panel.open = true;
    $("study-log-entry-summary").textContent = "Registro manual · escolha projeto e matéria";
    setMatters(projectInput.value);
    projectInput.focus({ preventScroll: true });
    panel.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  projectInput.addEventListener("change", () => setMatters(projectInput.value));
  dateInput.addEventListener("change", () => {
    if (dateInput.value && dateInput.value <= api.today()) updateSelectedDate(dateInput.value);
  });
  matterSelect.addEventListener("change", () => {
    if (topicInput) topicInput.required = matterSelect.value.startsWith("Outro assunto");
  });
  const recentList = $("study-log-recent");
  if (recentList && "MutationObserver" in window) new MutationObserver(render).observe(recentList, { childList: true });
  document.addEventListener("central:study-date-selected", event => {
    if (event.detail?.date && event.detail.date !== selectedDate) {
      selectedDate = event.detail.date;
      render();
    }
  });

  render();
  loadCatalog();
})();
