import { Componente } from "../../Componente.js"

export class PopUp extends Componente {
	constructor(props) {
		super(props)

		this.abrir = this.abrir.bind(this)
		this.cerrar = this.cerrar.bind(this)
		this.modo = this.modo.bind(this)
		this.configPopup = this.configPopup.bind(this)
		this.cancelar = this.cancelar.bind(this)
		this.confirmar = this.confirmar.bind(this)
		this.aceptar = this.aceptar.bind(this)


		this.btn_cancelar = this.crear("div", { class: "btn-popup" }, this._('Cancelar'))
		this.btn_confirmar = this.crear("div", { class: "btn-popup" }, this._('Confirmar'))
		this.btn_aceptar = this.crear("div", { class: "btn-popup" }, this._('Aceptar'))


		this.cabecera = this.crear("div", { class: 'ui-popup-cabecera' })
		this.contenido = this.crear("div", { class: 'ui-popup-contenido' })
		this.pie = this.crear("div", { class: 'ui-popup-pie' })

		this._titulo = this.crear("div", { class: 'ui-popup-titulo' })
		this.cabecera.appendChild(this._titulo)

		this.appendChild(this.cabecera)
		this.appendChild(this.contenido)
		this.appendChild(this.pie)

		this.btn_cancelar.onclick = this.cancelar
		this.btn_confirmar.onclick = this.confirmar
		this.btn_aceptar.onclick = this.aceptar

		this.addEventListener('BaseUIComponenteLightboxCerrar', this.cerrar)

		this._abierto = false

		if(this.props.modo){
			this.modo(this.props)
		}
	}

	connectedCallback() {
		super.connectedCallback()
	}

	disconnectedCallback() {
		super.disconnectedCallback()
	}

	configPopup(config){
		const c = {
			id: 'ui-popop-defecto',
			modo: 'info',
			titulo: 'Información',
			html: 'Información',
			btn_aceptar: true,
			btn_cancelar: false,
			btn_confirmar: false
		}

		if(config.id) c.id = config.id

		if (config.modo == 'info') {
			c.modo = 'info'
			c.btn_aceptar = true
			c.btn_cancelar = false
			c.btn_confirmar = false
		}
		else{
			console.error('Modo de UI-PopUp no válido.', modo)
			return null
		}

	 	if(config.titulo) c.titulo = config.titulo

		if(config.html) c.html = config.html

		return c
	}

	modo(config = {id: 'ui-popop-defecto', modo: 'info', titulo: 'Información', html: ''}){

		this.contenido.innerHTML = ''
		this.pie.innerHTML = ''
		this._titulo.innerHTML = ''

		this.config = this.configPopup(config)
		if(!this.config) return

		if(this.config.btn_aceptar) this.pie.appendChild(this.btn_aceptar)
		if(this.config.btn_cancelar) this.pie.appendChild(this.btn_cancelar)
		if(this.config.btn_confirmar) this.pie.appendChild(this.btn_confirmar)

		this._titulo.innerHTML = this.config.titulo
		this.contenido.innerHTML = this.config.html

		this.abrir()
	}

	abrir(){
		this.abrirLightbox({cerra_en_click_fondo: false})
		this._abierto = true

		const en_dom = document.getElementById(this.id)
		if(!en_dom) document.body.appendChild(this)
	}
	cerrar(){
		this.cerrarLightbox()
		this._abierto = false

		const en_dom = document.getElementById(this.id)
		if(en_dom) this.remove()
	}

	get abierto() { return this._abierto }

	cancelar(e){
		const ev = new Event('PopUpCancelar')
		ev.popup = this
		this.dispatchEvent(ev)

		if(this.props.fn_cancelar){
			this.props.fn_cancelar(this.id)
		}

		this.cerrar()
	}
	confirmar(e){
		const ev = new Event('PopUpConfirmar')
		ev.popup = this
		this.dispatchEvent(ev)

		if(this.props.fn_confirmar){
			this.props.fn_confirmar(this.id)
		}

		this.cerrar()
	}
	aceptar(e){
		const ev = new Event('PopUpAceptar')
		ev.popup = this
		this.dispatchEvent(ev)

		if(this.props.fn_aceptar){
			this.props.fn_aceptar(this.id)
		}

		this.cerrar()
	}
}

customElements.define("ui-popup", PopUp)
