import { Modulo } from '../../Modulo.js'

export default class Inicio extends Modulo {
	constructor() {
		super({ usar_transicion: true, usar_mensaje: true })

		this._mod_id = 'inicio'
		this._mod_nombre = this._('Inicio')

		this.cargar = this.cargar.bind(this)
		this.tomaUI = this.tomaUI.bind(this)
		this.cargarInicio = this.cargarInicio.bind(this)
		this.descargar = this.descargar.bind(this)

		this._cargado = false
	}

	connectedCallback() {
		super.connectedCallback()
	}

	disconnectedCallback() { super.disconnectedCallback() }

	cargar(app_config) {
		if (this._cargado) return

		super.cargar(app_config)

		this.cargarIndexDefecto()
		this.addEventListener('ModuloCargado', this.tomaUI)
	}

	tomaUI(){

		this.app_nombre = this.querySelector('[modulo-elemento="app_nombre"]')
		this.app_descripcion = this.querySelector('[modulo-elemento="app_descripcion"]')
		this.app_menu = this.querySelector('[modulo-elemento="app_menu"]')

		this.cargarInicio()
	}

	cargarInicio(){

		if(this.app_nombre) this.app_nombre.innerHTML = this.configuracion.app.nombre
		//if(this.app_descripcion) this.app_descripcion.innerHTML = this.configuracion.app.descripcion

		this.app_menu.innerHTML = ''

		for (const grupo of window.App.menu.grupos) {

			for (const item of grupo.items) {

				const link = this.crear(
					"a",
					{ menu_item_id: item.id, href: item.accion }
				)

				if(item.icono){
					link.innerHTML = item.icono
					link.appendChild(this.crear('span', {}, item.nombre))
				}
				else{
					link.innerHTML = item.nombre
				}

				this.app_menu.append(
					this.crear(
						"div",
						{ class: "menu-item", title: item.nombre },
						link
					)
				)
			}

		}

	}

	descargar() {}
}

customElements.define('ui-inicio', Inicio)
