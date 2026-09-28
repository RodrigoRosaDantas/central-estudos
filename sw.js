const CACHE_VERSION = 'central-shell-v27.3.0-quote-contrast-20260928';
const APP_SHELL = [
'./',
'./index.html',
'./404.html',
'./manifest.webmanifest',
'./assets/icon.svg',
'./css/app.css',
'./css/catalog-v4.css',
'./css/personalization-v5.css',
'./css/timeline-v8.css',
'./css/pro-v11.css',
'./css/operational-v13.css',
'./css/workspace-v24.css',
'./css/workspace-v26.css?v=quote-contrast-20260928',
'./css/workspace-v27.css',
'./js/app.js?v=27.3.0',
'./js/catalog-v4.js',
'./js/personalization-v5.js',
'./js/pwa-v6.js',
'./js/timeline-v8.js',
'./js/pro-v11.js',
'./js/contracts-v12.js',
'./js/command-context-v1.js?v=27.3.0',
'./js/operational-v13.js',
'./js/workspace-v24.js',
'./config/projects.json?v=27.3.0'
];
self.addEventListener('install', (event) => {
event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)));
});
self.addEventListener('activate', (event) => {
event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('central-shell-') && key !== CACHE_VERSION).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('message', (event) => {
if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', (event) => {
const request = event.request;
if (request.method !== 'GET') return;
const url = new URL(request.url);
const scopeUrl = new URL(self.registration.scope);
if (url.origin !== scopeUrl.origin || !url.pathname.startsWith(scopeUrl.pathname)) return;
if (request.mode === 'navigate') {
event.respondWith(fetch(request).then((response) => {
if (response && response.ok) {
const copy = response.clone();
caches.open(CACHE_VERSION).then((cache) => cache.put('./index.html', copy));
}
return response;
}).catch(() => caches.match('./index.html')));
return;
}
if (!APP_SHELL.some((path) => new URL(path, self.registration.scope).href === url.href)) return;
event.respondWith(fetch(request).then((response) => {
if (response && response.ok) {
const copy = response.clone();
caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
}
return response;
}).catch(() => caches.match(request)));
});
