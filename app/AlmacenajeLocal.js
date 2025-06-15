/*
*    @author     Julio Viera 2023
*/
export class AlmacenajeLocal {

	static _instancia = null

	constructor(props = {}) {

		if (AlmacenajeLocal._instancia) return AlmacenajeLocal._instancia

		this.guardar = this.guardar.bind(this)
		this.obtener = this.obtener.bind(this)
		this.borrar = this.borrar.bind(this)

		this.props = props
		this.log = props.log ?? false

		this.hay_storage = typeof (Storage) !== 'undefined'

		if (this.hay_storage) {
			const stor_size = new Blob(Object.values(localStorage)).size

			try {
				if (stor_size > 4194304) {
					console.warn('El local storage esta muy cargado.')
				}
			}
			catch (er) {
				console.error(er)
			}
		}

		if (this.log) console.info('Instancia creada AlmacenajeLocal. Existe Storage: ', this.hay_storage)

		AlmacenajeLocal._instancia = this
	}

	guardar(clave, valor) {
		if (!this.hay_storage) return false

		if (this.log) console.log('AlmacenajeLocal Guarda: ', clave, valor)
		localStorage.setItem(clave, JSON.stringify(valor))
		return true
	}

	obtener(clave, defecto = null) {
		if (!this.hay_storage) return defecto

		let valor = localStorage.getItem(clave)

		if (this.log) console.log('AlmacenajeLocal Obtiene: ', clave, valor)

		if (valor) {
			try {
				valor = JSON.parse(valor)
				return valor
			}
			catch (er) {
				console.error(er)
			}
		}

		return defecto
	}

	borrar(clave) {
		if (!this.hay_storage) return false

		if (this.log) console.log('AlmacenajeLocal Borra: ', clave)
		localStorage.removeItem(clave)
		return true;
	}
}
