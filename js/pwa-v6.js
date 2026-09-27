(() => {
'use strict';
if (!('serviceWorker' in navigator)) return;
let reloadOnControllerChange = false;
const showUpdate = (registration) => {
const notice = document.getElementById('pwa-update-notice');
if (!notice || !registration.waiting) return;
notice.classList.remove('is-hidden');
notice.replaceChildren();
const text = document.createElement('span');
text.textContent = 'Uma atualização da Central está pronta.';
const button = document.createElement('button');
button.type = 'button';
button.className = 'button button-quiet';
button.textContent = 'Atualizar agora';
button.addEventListener('click', () => {
const waiting = registration.waiting;
if (!waiting) return;
button.disabled = true;
button.textContent = 'Atualizando…';
reloadOnControllerChange = true;
waiting.postMessage({ type: 'SKIP_WAITING' });
});
notice.append(text, button);
};
window.addEventListener('load', async () => {
try {
const registration = await navigator.serviceWorker.register('./sw.js', { scope: './' });
if (registration.waiting) showUpdate(registration);
registration.addEventListener('updatefound', () => {
const worker = registration.installing;
if (!worker) return;
worker.addEventListener('statechange', () => {
if (worker.state === 'installed' && navigator.serviceWorker.controller) showUpdate(registration);
});
});
let refreshing = false;
navigator.serviceWorker.addEventListener('controllerchange', () => {
if (!reloadOnControllerChange || refreshing) return;
refreshing = true;
window.location.reload();
});
} catch (error) {
console.info('PWA indisponível; a Central continua em modo web normal.', error);
}
});
})();