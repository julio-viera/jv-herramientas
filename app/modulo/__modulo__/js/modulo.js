import { Modulo } from "../../Modulo.js"


export default class EjemploModulo extends Modulo {
	constructor() {
		super({ usar_transicion: true, usar_mensaje: true })

		this._mod_id = 'ejemplo_modulo'
		this._mod_nombre = this._("Ejemplo Modulo")

		this.cargar = this.cargar.bind(this)
		this.tomaUI = this.tomaUI.bind(this)
		this.procesar = this.procesar.bind(this)
		this.descargar = this.descargar.bind(this)

		this._cargado = false
	}

	connectedCallback() {
		super.connectedCallback()
	}

	disconnectedCallback() { }

	cargar(app_config) {
		if (this._cargado) return

		super.cargar(app_config)

		this.cargarIndexDefecto()

		this.addEventListener('ModuloCargado', this.tomaUI)
	}

	tomaUI(){

	}

	procesar(){

	}

	descargar() { }
}

customElements.define("ui-ejemplo-modulo", EjemploModulo)
