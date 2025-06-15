/*
*    @author     Julio Viera 2023
*/
import { MensajeUI } from "./componente/mensaje/js/MensajeUI.js"

export class BaseUI extends HTMLElement {
	constructor(p) {
		super()

		this.propiedadesBase = this.propiedadesBase.bind(this)
		this.mostrar = this.mostrar.bind(this)
		this.ocultar = this.ocultar.bind(this)
		this.abrirLightbox = this.abrirLightbox.bind(this)
		this.cerrarLightbox = this.cerrarLightbox.bind(this)

		this.props = p ?? {}

		this._transicion = null
		this._en_transicion = false
		this.ui_msj = null

		this.propiedadesBase(this.props)
	}

	connectedCallback() {
		this._modo_display = this.style.display

		this.agregarClase("base-ui-componente")

		if (this.props.usar_transicion && !this._transicion) {
			this._icono_espera = this.crear('div', { class: 'icono-espera' }, this.crear('span', { class: 'icono-espera-puntos' }))
			this._transicion = this.crear("div", { class: "base-ui-transicion" }, this._icono_espera)
			this.appendChild(this._transicion)
		}

		if (this.props.usar_mensaje && !this.ui_msj) {
			this.ui_msj = new MensajeUI()
		}
	}

	disconnectedCallback() { }

	propiedadesBase(props) {
		if (props.id) {
			this.props.id = props.id
			this.id = this.props.id
		}
		else {
			this.id = BaseUI.uuid()
		}

		if (props.name) {
			this.props.name = props.name
			this.name = this.props.name
		}

		if (props.value) {
			this.props.value = props.value
			this.value = this.props.value
		}

		if (props.log) {
			this.props.log = props.log
			this.log = this.props.log
		}

		if (props.class) {
			this.props.class = props.class
			this.setAttribute('class', this.props.class)
		}

		if (props.title) {
			this.props.title = props.title
			this.setAttribute('title', this.props.title)
			this._titulo_original = this.props.title
		}

		if (props.activo === false) {
			this.props.activo = false
			this.activo = false
		}
		else {
			this.props.activo = true
			this.activo = true
		}

	}

	get activo() {
		return !this.hasAttribute("disabled")
	}

	set activo(val) {
		if (!val) {
			this.setAttribute("disabled", "")
			let ev = new Event('BaseUIComponenteDesactivado')
			this.dispatchEvent(ev)
		}
		else {
			this.removeAttribute("disabled")
			let ev = new Event('BaseUIComponenteActivado')
			this.dispatchEvent(ev)
		}
	}

	get mensaje() {
		return this.ui_msj.mensaje
	}

	set mensaje(m) {
		if (this.ui_msj) this.ui_msj.mensaje = m
	}

	mostrar(modo = "") {
		if (!modo && this._modo_display && this._modo_display != "none") modo = this._modo_display
		else if (!modo) modo = "block"

		let ev = new Event('BaseUIComponenteMostrar')
		ev.modo = modo
		this.dispatchEvent(ev)

		this.style.display = modo
	}
	ocultar() {

		let ev = new Event('BaseUIComponenteOcultar')
		this.dispatchEvent(ev)

		this.style.display = "none"
	}

 	quitarClase(c)
  {
    if(this.classList.contains(c)) this.classList.remove(c);
  }
  agregarClase(c)
  {
  	if(!this.classList.contains(c)) this.classList.add(c);
  }


	get estado() {
		if (this.hasAttribute("estado")) return this.getAttribute("estado")
		else return null
	}

	set estado(estado) {
		if (!estado) {
			if (this.hasAttribute("estado")) {
				let ev = new Event('BaseUIComponenteRemueveEstado')
				ev.estado = this.getAttribute("estado")
				this.removeAttribute("estado")
				this.dispatchEvent(ev)
			}
		}
		else {
			let ev = new Event('BaseUIComponentePoneEstado')
			ev.estado = estado
			this.setAttribute("estado", estado)
			this.dispatchEvent(ev)
		}
	}

	set transicion(mostrar) {
		if (!this._transicion) return

		if (mostrar) {
			this._transicion.mostrar()
			this._en_transicion = true
		}
		else {
			this._transicion.ocultar()
			this._en_transicion = false
		}
	}

	get transicion() {
		return this._en_transicion
	}


	abrirLightbox(config = {cerra_en_click_fondo: true}) {
		if (this.hasAttribute('lightbox')) return

		this.setAttribute('lightbox', '1')

		if (!this._fondo_lightbox) {
			this._fondo_lightbox = document.createElement('div')
			this._fondo_lightbox.setAttribute('class', 'base-ui-componente-lightbox-fondo')
			if(config.cerra_en_click_fondo) this._fondo_lightbox.setAttribute('cerrar_click', 'si')
			this._fondo_lightbox.onclick = this.cerrarLightbox
			document.body.appendChild(this._fondo_lightbox)
		}

		let ev = new Event('BaseUIComponenteLightboxAbrir')
		this.dispatchEvent(ev)
	}
	cerrarLightbox(e) {
		if (!this.hasAttribute('lightbox')) return

		if(e && e.type == 'click' && this._fondo_lightbox && this._fondo_lightbox.getAttribute('cerrar_click') !== 'si') return

		this.removeAttribute('lightbox')

		if (this._fondo_lightbox) {
			this._fondo_lightbox.remove()
			this._fondo_lightbox = null
		}

		let ev = new Event('BaseUIComponenteLightboxCerrar')
		this.dispatchEvent(ev)
	}

	crear(etiqueta = "div", atributos = {}, hijos = []) {
		return BaseUI.crearElemento(etiqueta, atributos, hijos)
	}

	static crearElemento(etiqueta = "div", atributos = {}, hijos = []) {
		const elem = document.createElement(etiqueta)
		BaseUI.asignarAtributos(elem, atributos)
		BaseUI.asignarElementos(elem, hijos)

		elem.mostrar = function (modo = "") {
			if (!modo && this._modo_display && this._modo_display != "none") modo = this._modo_display
			else if (!modo) modo = "block"

			this.style.display = modo
		}

		elem.ocultar = function () {
			if (this.style.display != "none") this._modo_display = this.style.display

			this.style.display = "none"
		}

		elem.estado = function () {
			if (this.hasAttribute("estado")) return this.getAttribute("estado")
			else return null
		}

		elem.ponerEstado = function (estado) {
			if (!estado) this.removeAttribute("estado")
			else this.setAttribute("estado", estado)
		}

		return elem
	}
	static asignarAtributos(elem, atributos) {
		for (const a in atributos) {
			if (elem.type == "checkbox" && a == "checked" && atributos[a] === false) continue
			else if (a == "required" && atributos[a] === false) continue
			else if (a == "disabled" && atributos[a] === false) continue
			else if (elem.tagName == "option" && a == "selected" && atributos[a] === false) continue

			if (typeof atributos[a] === "function") elem[a] = atributos[a]
			else elem.setAttribute(a, atributos[a])
		}
	}
	static asignarElementos(elem, hijos) {
		if (hijos instanceof Array) {
			for (const h of hijos) {
				if (h instanceof Node) elem.appendChild(h)
				else elem.appendChild(document.createTextNode(h))
			}
		}
		else if (hijos instanceof Node) elem.appendChild(hijos)
		else if (hijos) elem.appendChild(document.createTextNode(hijos))
	}

	static uuid(){
		if(window.isSecureContext){
			return crypto.randomUUID()
		}

		return this.__generateUUID()
	}

	static __generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
	}

	_(t) {
		return window.ui_idioma && window.ui_idioma[t] ? window.ui_idioma[t] : t
	}
}

customElements.define("base-ui", BaseUI)
