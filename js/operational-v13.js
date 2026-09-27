(() => {
"use strict";
const $ = id => document.getElementById(id);
const panel = $("operational-panel"), list = $("operational-list"), focusLine = $("pro-now-focus-operational");
const routeList = $("routing-list"), routeText = $("routing-explanation");
const routeButtons = [...document.querySelectorAll("[data-route-lens]")];
if (!panel || !list || !focusLine) return;
const contracts = new Map();
const LENS_KEY = "central-estudos:route-lens-v14";
const LAST_KEY = "central-estudos:last-project";
const LENSES = new Set(["focus", "resume", "published", "alerts"]);
let focusId = null;
let lens = (() => {
try {
const value = localStorage.getItem(LENS_KEY);
return LENSES.has(value) ? value : "focus";
} catch { return "focus"; }
})();
const node = (tag, className, text) => {
const element = document.createElement(tag);
if (className) element.className = className;
if (text !== undefined) element.textContent = text;
return element;
};
const projectInfo = id => {
const card = [...document.querySelectorAll(".project-card")].find(item => item.dataset.projectId === id);
return {
id,
name: card?.querySelector("h3")?.textContent?.trim() || id,
phase: card?.querySelector(".project-phase")?.textContent?.trim() || "",
href: card?.querySelector(".project-link")?.href || "#projetos",
order: Number(card?.dataset.projectOrder ?? Number.MAX_SAFE_INTEGER)
};
};
const allProjects = () => [...document.querySelectorAll(".project-card")]
.map(card => projectInfo(card.dataset.projectId || ""))
.filter(item => item.id);
const visible = item => Boolean(item?.contract?.state && ["live", "cached", "stale-cache"].includes(item.status));
const contractFor = id => {
const item = contracts.get(id);
return visible(item) ? item : null;
};
const kindMeta = (kind, status) => {
if (status === "stale-cache") return ["Último estado", "is-stale", "Último estado conhecido"];
if (kind === "planned") return ["Planejado", "is-planned", "Planejado"];
if (kind === "manual") return ["Publicado", "is-operational", "Ação publicada"];
return ["Operacional", "is-operational", "Próxima ação"];
};
const contextText = state => [state.phase, state.cycle, state.currentUnit].filter(Boolean).join(" · ");
const sourceText = status => status === "stale-cache"
? "Fonte: contrato em cache antigo"
: status === "cached"
? "Fonte: contrato em cache recente"
: "Fonte: contrato publicado pelo projeto";
function operationalCard(item) {
const info = projectInfo(item.id), state = item.contract.state;
const [label, badgeClass, prefix] = kindMeta(state.nextActionKind, item.status);
const card = node("article", "operational-card");
card.dataset.projectId = item.id;
card.dataset.focus = String(item.id === focusId);
const head = node("div", "operational-head");
head.append(node("h3", "operational-name", info.name), node("span", `operational-badge ${badgeClass}`, label));
card.append(head, node("p", "operational-context", contextText(state) || "Estado operacional publicado"));
if (state.nextAction) card.append(node("p", "operational-action", `${prefix}: ${state.nextAction}`));
if (state.alerts?.length) {
const alerts = node("div", "operational-alerts");
state.alerts.slice(0, 3).forEach(message => alerts.append(node("p", "operational-alert", message)));
card.append(alerts);
}
const footer = node("div", "operational-footer");
const link = node("a", "operational-link", "Abrir projeto →");
link.href = info.href;
footer.append(node("span", "operational-source", sourceText(item.status)), link);
card.append(footer);
return { article: card, order: info.order };
}
function renderFocus() {
const item = focusId ? contractFor(focusId) : null;
const state = item?.contract?.state;
if (!state?.nextAction) {
focusLine.textContent = "";
focusLine.classList.add("is-hidden");
return;
}
const [, , prefix] = kindMeta(state.nextActionKind, item.status);
focusLine.textContent = `${prefix}: ${state.nextAction}`;
focusLine.dataset.kind = state.nextActionKind;
focusLine.dataset.stale = String(item.status === "stale-cache");
focusLine.classList.remove("is-hidden");
}
const readLastId = () => {
try {
const value = JSON.parse(localStorage.getItem(LAST_KEY) || "null");
return typeof value?.id === "string" ? value.id : null;
} catch { return null; }
};
const lensExplanation = () => lens === "resume"
? "Mostra o último ambiente aberto pela Central neste navegador."
: lens === "published"
? "Mostra projetos que publicaram uma próxima ação. A ordem é a do catálogo, sem ranking."
: lens === "alerts"
? "Mostra projetos cujo contrato publicou alertas. A ordem é a do catálogo, sem pontuação."
: "Mostra somente o foco que você definiu na Central.";
function routedProjects() {
const last = readLastId();
return allProjects().filter(item => {
const contract = contractFor(item.id);
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
function routeCard(item) {
const contract = contractFor(item.id), state = contract?.contract?.state;
const card = node("article", "routing-card"), head = node("div", "routing-card-head");
const tag = lens === "focus" ? "Foco escolhido" : lens === "resume" ? "Último acesso" : lens === "alerts" ? "Com alerta" : "Ação publicada";
head.append(node("h3", "", item.name), node("span", "routing-tag", tag));
card.append(head, node("p", "routing-meta", item.phase || "Ambiente ativo"));
if (state?.nextAction) {
const text = contract.status === "stale-cache"
? `Último estado conhecido: ${state.nextAction}`
: state.nextActionKind === "planned"
? `Planejado: ${state.nextAction}`
: `Próxima ação publicada: ${state.nextAction}`;
card.append(node("p", "routing-operational", text));
}
if (lens === "alerts" && state?.alerts?.length) card.append(node("p", "routing-alert", state.alerts[0]));
const why = node("details", "routing-why"), summary = node("summary", "", "Por que aparece aqui?");
why.append(summary, node("p", "", routeReason(contract)));
const link = node("a", "routing-open", "Abrir projeto →");
link.href = item.href;
card.append(why, link);
return card;
}
function renderRouting() {
if (!routeList || !routeText || !routeButtons.length) return;
routeButtons.forEach(button => {
const active = button.dataset.routeLens === lens;
button.classList.toggle("is-active", active);
button.setAttribute("aria-pressed", String(active));
});
routeText.textContent = lensExplanation();
const items = routedProjects();
if (items.length) return routeList.replaceChildren(...items.map(routeCard));
const text = lens === "resume"
? "Ainda não há um último acesso registrado neste navegador."
: lens === "alerts"
? "Nenhum alerta publicado nesta lente."
: lens === "published"
? "Nenhuma próxima ação publicada está disponível nesta lente."
: "O foco ainda não pôde ser identificado.";
routeList.replaceChildren(node("p", "routing-empty", text));
}
function render() {
const cards = [...contracts.values()].filter(visible).map(operationalCard).sort((a, b) => a.order - b.order);
list.replaceChildren(...cards.map(item => item.article));
panel.hidden = cards.length === 0;
renderFocus();
renderRouting();
}
routeButtons.forEach(button => button.addEventListener("click", () => {
const next = button.dataset.routeLens;
if (!LENSES.has(next)) return;
lens = next;
try { localStorage.setItem(LENS_KEY, next); } catch {}
renderRouting();
}));
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
contracts.set(detail.id, { id: detail.id, status: detail.status, contract: detail.contract || null, checkedAt: detail.checkedAt || null });
render();
});
})();