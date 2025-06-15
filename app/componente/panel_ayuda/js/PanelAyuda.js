import { Componente } from "../../Componente.js"

export class PanelAyuda extends Componente {
	constructor() {
		super({ usar_transicion: true, usar_mensaje: true })

		this.abrir = this.abrir.bind(this)
		this.cerrar = this.cerrar.bind(this)
		this.presentarContenido = this.presentarContenido.bind(this)

		this.btn_cerrar = this.crear("div", { id: "btn-cerrar-ayuda", class: "btn" }, "✕")
		this.contenido = this.crear("div", { id: "contenido-ayuda" })

		this.appendChild(this.btn_cerrar)
		this.appendChild(this.contenido)

		this.btn_cerrar.onclick = (e) => {
			this.ocultar()
		}

		this.cache = {}
		this._abierto = false
	}

	connectedCallback() {
		super.connectedCallback()
		this.transicion = false
	}

	disconnectedCallback() {
		super.disconnectedCallback()
	}

	abrir(ruta = null){
		if (!ruta) {
			this.contenido.innerHTML = ""
			this.mostrar()
		}
		else this.cargar(ruta)
	}
	cerrar(){
		this.ocultar()
		this._abierto = false
	}

	get abierto() { return this._abierto }

	cargar(ruta) {
		this.mostrar()
		this._abierto = true

		this.contenido.innerHTML = ""
		if(this.cache[ruta]){
			this.presentarContenido(this.cache[ruta])
			return
		}

		this.transicion = true
		fetch(ruta)
			.then((res) => {
				if(res.status == 200) return res.text()
				else throw this._('Contenido no disponible.')
			})
			.then((html) => {
				this.cache[ruta] = html
				this.presentarContenido(html)
			})
			.catch((er) => {
				console.error(er)
				this.presentarContenido(this._('Contenido no disponible.'))
			})
			.finally(() => {
				this.transicion = false
			})
	}

	presentarContenido(html){
		this.contenido.innerHTML = html
	}
}

customElements.define("ui-panel-ayuda", PanelAyuda)
