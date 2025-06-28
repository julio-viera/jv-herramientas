
const log = false
const version = 5
const nombre_cache = 'app-cache'


self.addEventListener("install", event => {
	if (log) console.log(`[Service Worker]  Instalando. v${version}`)

	event.waitUntil(
		caches.open(nombre_cache)

			.then(async (cache) => {

				let respuesta

				if (log) console.log(`([Service Worker]  cache: ${nombre_cache}`)

				const precachear = await fetch('sw_cache_rutas.json')
					.then(res => res.json())
					.then(json => {
						return json.rutas
					})
					.catch(er => {
						console.error(er)
						if(log) console.log(`[Service Worker] No se puede obtener rutas.`)
						return null
					})

				if (log) console.log(`([Service Worker]  Rutas de Cache:`, precachear)


				if (log) console.log(`[Service Worker]  Borra caches viejos deprecados.`)

				cache.keys().then((keys) => {
					keys.forEach((request, index, array) => {

						const url = new URL(request.url)

						if (log) console.log(`[Service Worker] Comprueba cache en precarga: ${url.pathname}`)

						if (!precachear.includes(url.pathname)) {
							if (log) console.log(`[Service Worker] Borra cache en precarga: ${url.pathname}`)
							cache.delete(request)
						}
					})
				})


				try {
					respuesta = await cache.addAll(precachear)
					if (log) console.log(`[Service Worker]  Instalando. v${version}`)
				}
				catch (err) {
					console.error('[Service Worker] Error en la precarga cache.addAll')
					for (let item of precachear) {
						try {
							respuesta = await cache.add(item)
						}
						catch (err) {
							console.error('[Service Worker] Error en la precarga de cache: ', item)
						}
					}
				}

				return respuesta
			})
			.catch(er => {
				console.error(er)
			})

	)

})

self.addEventListener("activate", event => {
	if (log) console.log(`[Service Worker]  Activado. v${version}`)
})


self.addEventListener('fetch', e => {

	e.respondWith(

		(async () => {

			if (log) console.log(`[Service Worker] Pedido: ${e.request.url}`)

			const r = await caches.match(e.request)

			if (r) {
				if (log) console.log(`[Service Worker] Devuelve de cache: ${e.request.url}`)
				return r
			}

			if (log) console.log(`[Service Worker] Pide a la red: ${e.request.url}`)
			const response = await fetch(e.request)

			return response
		})(),

	)

})


self.addEventListener('message', (e) => {
	if (log) console.log(`[Service Worker] Mensaje: `, e)

	if (e.data === 'SW_SKIP_WAITING') {
		self.skipWaiting()
	}
})
