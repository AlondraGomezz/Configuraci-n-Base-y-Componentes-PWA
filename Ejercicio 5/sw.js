
const CACHE_NAME = "ejercicio-5-offline-v1";

const ARCHIVOS_ESTATICOS = [
    "./",
    "./index.html",
    "./offline.html",
    "./manifest.json",
    "./css/styles.css",
    "./js/app.js",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

// 1. INSTALACIÓN: guardar los archivos necesarios
self.addEventListener("install", (event) => {
    console.log("SW5: instalando y guardando archivos");

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ARCHIVOS_ESTATICOS))
            .then(() => self.skipWaiting())
    );
});

// 2. ACTIVACIÓN: limpiar cachés anteriores de este ejercicio
self.addEventListener("activate", (event) => {
    console.log("SW5: activado");

    event.waitUntil(
        caches.keys()
            .then((nombresCache) => {
                return Promise.all(
                    nombresCache
                        .filter((nombre) =>
                            nombre.startsWith("ejercicio-5-offline-") &&
                            nombre !== CACHE_NAME
                        )
                        .map((nombre) => caches.delete(nombre))
                );
            })
            .then(() => self.clients.claim())
    );
});

// 3. INTERCEPTOR: buscar en caché, después en la red
// y mostrar una página de respaldo si falla una navegación.
self.addEventListener("fetch", (event) => {
    const solicitud = event.request;
    const url = new URL(solicitud.url);

    // Solo interceptar solicitudes GET del mismo origen.
    if (
        solicitud.method !== "GET" ||
        url.origin !== self.location.origin
    ) {
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME)
            .then((cache) => cache.match(solicitud))
            .then((respuestaCache) => {
                if (respuestaCache) {
                    console.log("SW5: recurso desde caché:", solicitud.url);
                    return respuestaCache;
                }

                console.log("SW5: recurso desde la red:", solicitud.url);

                return fetch(solicitud).catch(() => {
                    console.log("SW5: sin conexión:", solicitud.url);

                    // Si se solicitó una página, mostrar el respaldo offline.
                    if (solicitud.mode === "navigate") {
                        return caches.match("./offline.html")
                            .then((paginaOffline) => {
                                if (paginaOffline) {
                                    return paginaOffline;
                                }

                                return new Response(
                                    "<h1>Sin conexión a Internet</h1>",
                                    {
                                        status: 503,
                                        headers: {
                                            "Content-Type": "text/html; charset=utf-8"
                                        }
                                    }
                                );
                            });
                    }

                    // Para otros recursos que no estén en caché.
                    return new Response(
                        "Recurso no disponible sin conexión.",
                        {
                            status: 503,
                            headers: {
                                "Content-Type": "text/plain; charset=utf-8"
                            }
                        }
                    );
                });
            })
    );
});