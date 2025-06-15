
export class PantallaSinContenido extends HTMLElement {
	constructor(props) {
		super()
		this.cargar = this.cargar.bind(this)
		this.mostrar = this.mostrar.bind(this)
		this.ocultar = this.ocultar.bind(this)

		this.props = props ?? {}
		this._idioma = this.props.idioma ?? 'es'
		this._cargado = false
	}

	connectedCallback() {
		this.cargar()
 	}

	disconnectedCallback() { }

	cargar(){

		if(this._cargado) return

		const url = 'app/componente/pantalla_sin_contenido/html/' + this._idioma +'/pantalla_sin_contenido.html'
		fetch(url)
			.then((res) => res.text())
			.then((res) => {
				this.innerHTML = res
			})
			.finally(() => {
				this._cargado = true
			})
	}

	get idioma(){
		return this._idioma
	}
	set idioma(i){
		if(this._idioma != i) this._cargado = false
		this._idioma = i
		this.cargar()
	}

	mostrar(modo = "") {
		if (!modo) modo = "block"

		this.style.display = modo
	}
	ocultar() {
		this.style.display = "none"
	}
}

customElements.define("ui-pantalla-sin-contenido", PantallaSinContenido)
