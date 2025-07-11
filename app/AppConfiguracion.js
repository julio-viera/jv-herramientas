/*
*    @author     Julio Viera 2025
*/

import { AlmacenajeLocal } from "./AlmacenajeLocal.js"
import { BaseUI } from "./BaseUI.js"

export class AppConfiguracion extends BaseUI {

	constructor(p) {
		super(p)

		this.construirUI = this.construirUI.bind(this)
		this.abrir = this.abrir.bind(this)
		this.cerrar = this.cerrar.bind(this)
		this.cargar = this.cargar.bind(this)

		this.almacenaje = new AlmacenajeLocal()
		this.addEventListener('BaseUIComponenteLightboxCerrar', this.cerrar)
	}

	connectedCallback() {
		super.connectedCallback()
	}

	disconnectedCallback() {
		super.disconnectedCallback()
	}

	abrir(){
		if(!this._abierto){

			if(!this._ui_construida){
				this.construirUI()
				this._ui_construida = true
			}

			this.mostrar()
			this.abrirLightbox()
			this._abierto = true
		}
	}

	cerrar(){
		if(this._abierto){
			this.ocultar()
			this.cerrarLightbox()
			this._abierto = false
		}
	}

	get configuracion(){
		return this._configuracion
	}

	construirUI(){
		this.innerHTML = ''
		this.contenido = this.crear("div", { class: "config-contenedor" })
		this.appendChild(this.contenido)

		this.contenedor_ui = this.crear("div", { class: "config-panel" })
		this.contenido.appendChild(this.contenedor_ui)
		this.contenedor_ui.appendChild(this.crear('h1', {class: 'ui-titulo'}, this._('Configuración')))


		this.ui_idioma = this.crear('select', { class: 'control' })
		this.ui_idioma.value = this.almacenaje.obtener('ui-idioma') ?? ''
		this.ui_idioma.onchange = (e) => {
			this.almacenaje.guardar('ui-idioma', this.ui_idioma.value)
			location.reload()
		}

		this.ui_idioma_label = this.crear('label', {}, this._('Idioma'))
		let item = this.crear('div', {class: 'config-item'}, [
			this.ui_idioma_label,
			this.ui_idioma
		])


		if(this._configuracion.app && this._configuracion.app.idiomas){
			for(const codigo in this._configuracion.app.idiomas){
				const nombre = this._configuracion.app.idiomas[codigo]
				var opt = document.createElement("option")
				opt.value = codigo
				opt.text = this._(nombre)
				if(codigo == this._configuracion.ui.idioma) opt.selected = true
				this.ui_idioma.add(opt, 0)
			}
		}

		this.contenedor_ui.appendChild(item)


		this.ui_tema = this.crear('select', { class: 'control' })
		this.ui_tema.value = this.almacenaje.obtener('ui-tema') ?? ''
		this.ui_tema.onchange = (e) => {
			this.almacenaje.guardar('ui-tema', this.ui_tema.value)
			document.documentElement.setAttribute('data-theme', this.ui_tema.value)
		}

		this.ui_tema_label = this.crear('label', {}, this._('Tema'))
		item = this.crear('div', {class: 'config-item'}, [
			this.ui_tema_label,
			this.ui_tema
		])

		if(this._configuracion.app && this._configuracion.app.temas){
			for(const codigo in this._configuracion.app.temas){
				const nombre = this._configuracion.app.temas[codigo]
				var opt = document.createElement("option")
				opt.value = codigo
				opt.text = this._(nombre)
				if(codigo == this._configuracion.ui.tema) opt.selected = true
				this.ui_tema.add(opt, 0)
			}
		}


		this.contenedor_ui.appendChild(item)


		this.ui_escala = this.crear('input', { class: 'control config-escala-ui', type: 'range', min: '0.7', max: '2.0', step: '0.05', value: '1.0'})
		this.ui_escala.value = this.almacenaje.obtener('ui-escala') ?? 1.0
		this.ui_escala.onchange = (e) => {
			this.almacenaje.guardar('ui-escala', this.ui_escala.value)
			document.documentElement.style.fontSize = Math.ceil(14.0 * parseFloat(this.ui_escala.value)) + 'px'
		}

		this.ui_escala_label = this.crear('label', {}, this._('Escala de la interfaz'))
		item = this.crear('div', {class: 'config-item'}, [
			this.ui_escala_label,
			this.ui_escala
		])


		this.contenedor_ui.appendChild(item)



		this.ui_distribucion = this.crear('select', { class: 'control' })
		this.ui_distribucion.value = this.almacenaje.obtener('ui-distribucion') ?? ''
		this.ui_distribucion.onchange = (e) => {
			this.almacenaje.guardar('ui-distribucion', this.ui_distribucion.value)
			document.getElementsByTagName('main')[0].setAttribute('data-distribucion', this.ui_distribucion.value)
		}


		this.ui_distribucion_label = this.crear('label', {}, this._('Posición de la barra'))
		item = this.crear('div', {class: 'config-item'}, [
			this.ui_distribucion_label,
			this.ui_distribucion
		])


		if(this._configuracion.app && this._configuracion.app.interfaz){
			for(const codigo in this._configuracion.app.interfaz){
				const nombre = this._configuracion.app.interfaz[codigo]
				var opt = document.createElement("option")
				opt.value = codigo
				opt.text = this._(nombre)
				if(codigo == this._configuracion.ui.distribucion) opt.selected = true
				this.ui_distribucion.add(opt, 0)
			}
		}

		this.contenedor_ui.appendChild(item)


		this.btn_restaurar = this.crear('button', { class: 'btn' }, this._('Restaurar'))
		this.btn_restaurar.onclick = (e) => {

			this.almacenaje.borrar('ui-idioma')
			this.almacenaje.borrar('ui-tema')
			this.almacenaje.borrar('ui-escala')
			this.almacenaje.borrar('ui-distribucion')

			location.reload()
		}


		this.btn_restaurar_label = this.crear('label', {}, this._('Configuración'))
		item = this.crear('div', {class: 'config-item'}, [
			this.btn_restaurar_label,
			this.btn_restaurar
		])

		this.contenedor_ui.appendChild(item)

	}


	cargar() {

		fetch("config/config.json")
			.then(res => res.json())
			.then((json) => {
				if (json && json.app) {
					this._configuracion = json
					this._configuracion.defecto = {
						ui: {...json.ui},
						app: {...json.app}
					}



					let tema_inicio = this._configuracion.ui.tema
					if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		    		console.log('modo oscuro')
						tema_inicio = 'oscuro'
					}

					this._configuracion.ui.escala = parseFloat(this.almacenaje.obtener("ui-escala") ?? this._configuracion.ui.escala ?? 1.0)
					this._configuracion.ui.idioma = this.almacenaje.obtener("ui-idioma") ?? this._configuracion.ui.idioma ?? "es"
					this._configuracion.ui.tema = this.almacenaje.obtener("ui-tema") ?? tema_inicio
					this._configuracion.ui.distribucion = this.almacenaje.obtener("ui-distribucion") ?? this._configuracion.ui.distribucion ?? "arriba"


					window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
						console.log('cambio modo oscuro tema', event.matches)
						const seleccionado = this.almacenaje.obtener("ui-tema")
						if(!seleccionado){
							if(event.matches){
								this.almacenaje.guardar('ui-tema', 'oscuro')
								document.documentElement.setAttribute('data-theme', 'oscuro')
							}
							else{
								document.documentElement.setAttribute('data-theme', 'original')
							}
						}
					});

					document.documentElement.style.fontSize = Math.ceil(14.0 * this._configuracion.ui.escala) + "px"
					document.documentElement.setAttribute('data-theme', this._configuracion.ui.tema)
					document.getElementsByTagName('main')[0].setAttribute('data-distribucion', this._configuracion.ui.distribucion)

					const evento = new Event('AppConfiguracionCargada')
					this.dispatchEvent(evento)
				}
			})
			.catch((er) => {
				console.error(er)
				const evento = new Event('AppConfiguracionErrorCarga')
				this.dispatchEvent(evento)
			})
			.finally(() => {})
	}

}


customElements.define("app-configuracion", AppConfiguracion)
