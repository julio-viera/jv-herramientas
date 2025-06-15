import { Modulo } from '../../Modulo.js'

export default class ConfiguracionUI extends Modulo {
	constructor() {
		super({ usar_transicion: true, usar_mensaje: true })

		this._mod_id = 'configuracion'
		this._mod_nombre = this._('Configuración')

		this.cargar = this.cargar.bind(this)
		this.descargar = this.descargar.bind(this)
		this.tomaUI = this.tomaUI.bind(this)
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

	descargar() {}

	tomaUI(e){

		this.ui_escala = this.querySelector('#escala-ui')
		this.ui_escala.value = this.almacenaje.obtener('ui-escala') ?? 1.0
		this.ui_escala.onchange = (e) => {
			this.almacenaje.guardar('ui-escala', this.ui_escala.value)
			document.documentElement.style.fontSize = Math.ceil(14.0 * parseFloat(this.ui_escala.value)) + 'px'
		}

		this.ui_idioma = this.querySelector('#idioma-ui')
		this.ui_idioma.value = this.almacenaje.obtener('ui-idioma') ?? ''
		this.ui_idioma.onchange = (e) => {
			this.almacenaje.guardar('ui-idioma', this.ui_idioma.value)
			location.reload()
		}

		if(this.configuracion.app && this.configuracion.app.idiomas){
			for(const codigo in this.configuracion.app.idiomas){
				const nombre = this.configuracion.app.idiomas[codigo]
				var opt = document.createElement("option")
				opt.value = codigo
				opt.text = this._(nombre)
				if(codigo == this.configuracion.ui.idioma) opt.selected = true
				this.ui_idioma.add(opt, 0)
			}
		}

		this.ui_tema = this.querySelector('#tema-ui')
		this.ui_tema.value = this.almacenaje.obtener('ui-tema') ?? ''
		this.ui_tema.onchange = (e) => {
			this.almacenaje.guardar('ui-tema', this.ui_tema.value)
			document.documentElement.setAttribute('data-theme', this.ui_tema.value)
			//location.reload()
		}
		if(this.configuracion.app && this.configuracion.app.temas){
			for(const codigo in this.configuracion.app.temas){
				const nombre = this.configuracion.app.temas[codigo]
				var opt = document.createElement("option")
				opt.value = codigo
				opt.text = this._(nombre)
				if(codigo == this.configuracion.ui.tema) opt.selected = true
				this.ui_tema.add(opt, 0)
			}
		}

		this.ui_distribucion = this.querySelector('#ui-distribucion')
		this.ui_distribucion.value = this.almacenaje.obtener('ui-distribucion') ?? ''
		this.ui_distribucion.onchange = (e) => {
			this.almacenaje.guardar('ui-distribucion', this.ui_distribucion.value)
			document.getElementsByTagName('main')[0].setAttribute('data-distribucion', this.ui_distribucion.value)
		}

		if(this.configuracion.app && this.configuracion.app.interfaz){
			for(const codigo in this.configuracion.app.interfaz){
				const nombre = this.configuracion.app.interfaz[codigo]
				var opt = document.createElement("option")
				opt.value = codigo
				opt.text = this._(nombre)
				if(codigo == this.configuracion.ui.distribucion) opt.selected = true
				this.ui_distribucion.add(opt, 0)
			}
		}


		this.btn_restaurar = this.querySelector('#ui-restaurar')
		this.btn_restaurar.onclick = (e) => {

			this.ui_distribucion.value = this.configuracion.defecto.ui.distribucion
			this.ui_distribucion.dispatchEvent(new Event('change'))

			this.ui_tema.value = this.configuracion.defecto.ui.tema
			this.ui_tema.dispatchEvent(new Event('change'))

			this.ui_escala.value = this.configuracion.defecto.ui.escala
			this.ui_escala.dispatchEvent(new Event('change'))

			this.ui_idioma.value = this.configuracion.defecto.ui.idioma
			this.ui_idioma.dispatchEvent(new Event('change'))
		}

	}
}

customElements.define('ui-configuracion', ConfiguracionUI)
