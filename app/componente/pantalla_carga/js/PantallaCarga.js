
export class PantallaCarga extends HTMLElement {
	constructor(props) {
		super()
		this.mostrar = this.mostrar.bind(this)
		this.ocultar = this.ocultar.bind(this)

		this.props = props ?? {}
		this._cargado = false
		this._titulo = ''
		this._logo = ''
		this._msj = ''
		this._porcentaje_carga = 0
	}

	connectedCallback() {

		if(this._cargado) return

		const url = this.props.html_url ?? 'app/componente/pantalla_carga/html/pantalla_carga.html'
		fetch(url)
			.then((res) => res.text())
			.then((res) => {
				this.innerHTML = res

				this.nodo_titulo = this.querySelector("[ui_pantalla_carga_titulo]")
				this.nodo_logo = this.querySelector("[ui_pantalla_carga_logo]")
				this.nodo_msj = this.querySelector("[ui_pantalla_carga_msj]")
				this.nodo_barra_carga = this.querySelector("[ui_pantalla_carga_barra]")

				if(this.nodo_logo && this.props.logo_url) this.logo = this.props.logo_url
				if(this.nodo_titulo && this.props.titulo) this.titulo = this.props.titulo
				if(this._msj) this.mensaje = this._msj
				this.porcentaje_carga = this._porcentaje_carga
			})
			.finally(() => {
				this._cargado = true
			})
 	}

	disconnectedCallback() { }

	get mensaje() {
		if(!this._msj) return ''

		return this._msj
	}

	set mensaje(m) {
		this._msj = m

		if(!this.nodo_msj || !this._msj) return

		this.nodo_msj.innerHTML = this._msj
	}


	get titulo() {
		if(!this._titulo) return ''

		return this._titulo
	}

	set titulo(m) {
		this._titulo = m

		if(!this.nodo_titulo || !this._titulo) return

		this.nodo_titulo.innerHTML = this._titulo
	}


	get logo() {
		if(!this._logo) return ''

		return this._logo
	}

	set logo(m) {
		this._logo = m

		if(!this.nodo_logo || !this._logo) return

		this.nodo_logo.onload = (e) => {
			e.target.style.display = 'block'
		}
		this.nodo_logo.src = this._logo
	}

	get porcentaje_carga(){
		return this._porcentaje_carga
	}

	set porcentaje_carga(p){
		if(isNaN(p)) p = 0
		else if (p < 0) p = 0
		else if (p > 100) p = 100

		this._porcentaje_carga = p

		if(!this.barra_carga) return

		this.barra_carga.value = p
	}

	mostrar(modo = "") {
		if (!modo) modo = "block"

		this.style.display = modo
	}
	ocultar() {
		this.style.display = "none"
	}
}

customElements.define("ui-pantalla-carga", PantallaCarga)
