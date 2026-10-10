
const CACHE_NAME = "mi-pwa-cache-v1";

// Evento de instalación del Service Worker
self.addEventListener("install", (event) => {
    console.log("Service Worker: instalando");

    self.skipWaiting();
});

// Evento de activación
self.addEventListener("activate", (event) => {
    console.log("Service Worker: activado");

    event.waitUntil(self.clients.claim());
});

// Interceptar las peticiones
self.addEventListener("fetch", (event) => {
    console.log("Service Worker: petición interceptada", event.request.url);
});