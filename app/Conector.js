/*
*    @author     Julio Viera 2023
*/
export class Conector {
	constructor(config = {}) {
		this.config = config
		this.ruta_base = this.config && this.config.ruta_base ? this.config.ruta_base : ''
		this.cabeceras = this.config && this.config.cabeceras ? this.config.cabeceras : {}
	}

	agregarCabecera(nombre, valor) {
		this.cabeceras[nombre] = valor
	}
	quitarCabecera(nombre) {
		delete this.cabeceras[nombre]
	}

	async get(uri, cabeceras_extra = {}) {
		let cab = this.cabeceras ?? {}

		for (const cb in cabeceras_extra) {
			cab[cb] = cabeceras_extra[cb]
		}

		return fetch(this.ruta_base + uri, { method: 'GET', headers: cab }).then((res) => {
			if (res.status == 402) {
				window.App.mensaje = this._("No está logeado.")
				window.App.salir()
				return null
			}
			return res
		})
	}

	async post(uri, datos, cabeceras_extra = {}) {
		let cab = this.cabeceras ?? {}

		for (const cb in cabeceras_extra) {
			cab[cb] = cabeceras_extra[cb]
		}

		if (!(datos instanceof FormData)) {
			datos = this.construirParametros(datos)
			if (!cab['Content-Type']) cab['Content-Type'] = 'application/x-www-form-urlencoded'
		}

		return fetch(this.ruta_base + uri, { method: 'POST', headers: cab, body: datos }).then((res) => {
			if (res.status == 402) {
				window.App.mensaje = this._("No está logeado.")
				window.App.salir()
				return null
			}
			return res
		})
	}

	construirParametros(datos) {
		if (datos instanceof FormData) return datos

		if (Array.isArray(datos) || typeof datos === 'object') {
			let tmp = ''
			for (const k in datos) {
				tmp += '&' + encodeURIComponent(k) + '=' + encodeURIComponent(datos[k])
			}
			datos = tmp
		}
		return datos;
	}
}
