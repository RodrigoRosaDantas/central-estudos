const CACHE_VERSION = 'central-shell-v28.1.0-mentor-integrity-20260929';
const APP_SHELL = [
'./',
'./index.html',
'./manifest.webmanifest',
'./assets/icon.svg',
'./css/app.css',
'./css/ecosystem-v1.css?v=28.1.0',
'./css/catalog-v4.css',
'./css/personalization-v5.css',
'./css/timeline-v8.css',
'./css/pro-v11.css',
'./css/workspace-v24.css',
'./css/workspace-v26.css?v=quote-desktop-20260928',
'./css/workspace-v27.css',
'./css/study-log-v1.css',
'./js/app.js?v=28.1.0',
'./js/personalization-v5.js',
'./js/pwa-v6.js',
'./js/timeline-v8.js',
'./js/pro-v11.js',
'./js/contracts-v12.js',
'./js/command-context-v1.js?v=28.1.0',
'./js/workspace-v24.js',
'./js/study-log-v1.js',
'./config/projects.json?v=28.1.0',
'./config/study-schedule-v1.json?v=28.1.0',
'./mentor/index.html',
'./mentor/mentor.css?v=28.1.0',
'./mentor/mentor.js?v=mentor-integrity-20260929'
];
const RUNTIME_CACHE = 'central-study-runtime-v28.1.0';
const RUNTIME_ASSETS = new Set([
'./js/study-sync-v1.js?v=local-logout-20260929',
'./js/study-planner-v1.js?v=28.1.0',
'./css/study-planner-v1.css?v=28.1.0',
'./css/home-v1.css?v=home-20260929d',
'./config/study-catalog-v1.json?v=28.1.0'
].map((path) => new URL(path, self.registration.scope).href));
self.addEventListener('install', (event) => {
event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)));
});
self.addEventListener('activate', (event) => {
event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => (key.startsWith('central-shell-') && key !== CACHE_VERSION) || (key.startsWith('central-study-runtime-') && key !== RUNTIME_CACHE)).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
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
if (RUNTIME_ASSETS.has(url.href)) {
event.respondWith(caches.open(RUNTIME_CACHE).then(async (cache) => {
const saved = await cache.match(request);
try {
const response = await fetch(request);
if (response && response.ok) cache.put(request, response.clone());
return response;
} catch {
return saved || new Response('', { status: 503 });
}
}));
return;
}
if (request.mode === 'navigate') {
const mentorNavigation = url.pathname.endsWith('/mentor/') || url.pathname.endsWith('/mentor/index.html');
const fallback = mentorNavigation ? './mentor/index.html' : './index.html';
event.respondWith(fetch(request).then((response) => {
if (response && response.ok) {
const copy = response.clone();
caches.open(CACHE_VERSION).then((cache) => cache.put(fallback, copy));
}
return response;
}).catch(() => caches.match(fallback)));
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
