
const CACHE_NAME = "ejercicio-4-cache-v1";

const ARCHIVOS_ESTATICOS = [
    "./",
    "./index.html",
    "./manifest.json",
    "./css/styles.css",
    "./js/app.js",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];

// INSTALACIÓN: guardar los archivos estáticos
self.addEventListener("install", (event) => {
    console.log("SW: instalando y guardando archivos en caché");

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ARCHIVOS_ESTATICOS);
            })
            .then(() => self.skipWaiting())
    );
});

// ACTIVACIÓN: eliminar versiones anteriores de esta caché
self.addEventListener("activate", (event) => {
    console.log("SW: activado");

    event.waitUntil(
        caches.keys()
            .then((nombresCache) => {
                return Promise.all(
                    nombresCache
                        .filter((nombre) =>
                            nombre.startsWith("ejercicio-4-cache-") &&
                            nombre !== CACHE_NAME
                        )
                        .map((nombre) => caches.delete(nombre))
                );
            })
            .then(() => self.clients.claim())
    );
});

// FETCH: primero buscar en caché y luego consultar la red
self.addEventListener("fetch", (event) => {
    const solicitud = event.request;
    const url = new URL(solicitud.url);

    // Solo aplicar esta estrategia a peticiones GET del mismo origen
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
                    console.log("SW: recurso desde caché:", solicitud.url);
                    return respuestaCache;
                }

                console.log("SW: recurso solicitado a la red:", solicitud.url);

                return fetch(solicitud)
                    .then((respuestaRed) => {
                        if (respuestaRed.ok) {
                            const copiaRespuesta = respuestaRed.clone();

                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    return cache.put(
                                        solicitud,
                                        copiaRespuesta
                                    );
                                })
                                .catch((error) => {
                                    console.error(
                                        "SW: no se pudo guardar en caché:",
                                        error
                                    );
                                });
                        }

                        return respuestaRed;
                    });
            })
    );
});