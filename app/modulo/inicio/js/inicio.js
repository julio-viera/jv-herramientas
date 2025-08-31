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
		this.agregarGrupoMenu = this.agregarGrupoMenu.bind(this)

		this._cargado = false
	}

	connectedCallback() {
		super.connectedCallback()
	}

	disconnectedCallback() { super.disconnectedCallback() }

	cargar(app_config, opciones) {
		if (this._cargado) return

		super.cargar(app_config, opciones)

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

		this.app_menu.innerHTML = ''

		if(this.opciones && this.opciones.app_ref && this.opciones.app_ref.icono && this.opciones.app_ref.icono.menu) this.mapeo_iconos = this.opciones.app_ref.icono.menu

		this.opciones.conector.get(this.configuracion.ruta.menu + "/" + this.configuracion.ui.idioma + ".json")
			.then(res => res.json())
			.then((json) => {

				if(json && json.grupo){
					for(const item of json.grupo){
						this.agregarGrupoMenu(item)
					}
				}

			})
			.catch((er) => {
				console.error(er)
				this.mensaje = this._('No se puede cargar:') + " Menu Inicio."
			})

	}

	descargar() {}

	agregarGrupoMenu(grupo, contenedor = null){

		const div = this.crear('div', {class: (grupo.accion ? 'menu-item' : ' ui-subtitulo')})
		const link = this.crear("a", { menu_item_id: grupo.id, href: (grupo.accion ? grupo.accion : 'javascript:;') })
		const div_l = this.crear('div', {class: 'menu-item-cont-accion'})

		if(this.mapeo_iconos && this.mapeo_iconos[grupo.id]){
			div_l.innerHTML = this.mapeo_iconos[grupo.id]
		}

		div_l.appendChild(this.crear('span', {}, grupo.nombre))
		link.appendChild(div_l)
		div.appendChild(link)

		if(!contenedor || !grupo.accion){
			contenedor = this.crear('div', {class: ''})
			this.app_menu.appendChild(contenedor)
		}

		contenedor.appendChild(div)

		if(grupo.grupo){
			for(const item of grupo.grupo){
				this.agregarGrupoMenu(item, contenedor)
			}
		}
	}

}

customElements.define('ui-inicio', Inicio)
