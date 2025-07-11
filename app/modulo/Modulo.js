/*
*    @author     Julio Viera 2023
*/
import { BaseUI } from "../BaseUI.js"
import { AlmacenajeLocal } from "../AlmacenajeLocal.js"
import { Util } from "../Util.js"

export class Modulo extends BaseUI {
	constructor(p) {
		super(p)

		this.moduloId = this.moduloId.bind(this)
		this.moduloNombre = this.moduloNombre.bind(this)
		this.ruta = this.ruta.bind(this)
		this.rutaAyuda = this.rutaAyuda.bind(this)
		this.cargar = this.cargar.bind(this)
		this.descargar = this.descargar.bind(this)
		this.cargarIndexDefecto = this.cargarIndexDefecto.bind(this)
		this.hayCambios = this.hayCambios.bind(this)

		this.configuracion = {}
		this.opciones = {}
		this.almacenaje = new AlmacenajeLocal()
		this.util = Util

		this._transicion = null
		this._en_transicion = false
		this.ui_msj = null

		this._cargado = false

		this.contenido = this.crear("div", { class: "modulo-componente-contenido" })
		this.appendChild(this.contenido)
	}

	connectedCallback() {
		super.connectedCallback()

		this.agregarClase("modulo-componente")

		if (this.props.usar_transicion && this._transicion) {
			this._transicion.setAttribute("class", "modulo-transicion")
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback()
	}

	moduloId() { return this._mod_id }

	moduloNombre() { return this._mod_nombre }

	ruta(){
		return this.configuracion.ruta.modulo + "/" + this.moduloId() + '/'
	}

	rutaAyuda(){
		return this.ruta() + 'html/' + this.configuracion.ui.idioma + '/ayuda.html'
	}

	cargar(app_config, opciones) {
		this.configuracion = app_config ?? {}
		this.opciones = opciones
	}
	descargar() { }

	cargarIndexDefecto() {

		if (this._cargado) return

		this.transicion = true
		this.opciones.conector.get(this.ruta() + 'html/' + this.configuracion.ui.idioma + '/index.html')
			.then(res => res.text())
			.then((res) => {
				this.contenido.innerHTML = res

				let ev = new Event('ModuloCargado')
				ev.modulo = this
				this.dispatchEvent(ev)

				this._cargado = true
			})
			.catch((er) => {
				this.mensaje = er
			})
			.finally(() => {
				this.transicion = false
			})

	}

	hayCambios() {
		return false
	}

}

customElements.define("modulo-componente", Modulo)
