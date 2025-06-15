
export class MensajeUI extends HTMLElement {
	static _instancia

	constructor() {
		super()

		if (MensajeUI._instancia) return MensajeUI._instancia

		this.cerrar = this.cerrar.bind(this)

		this.mensaje_texto = null
		this.mensaje_cerrar = null
		this.msj_tout_id = null

		this.id = "ui-mensaje"

		this.mensaje_texto = document.createElement('div')
		this.mensaje_texto.id = "mensaje-texto"
		this.mensaje_cerrar = document.createElement("div")
		this.mensaje_cerrar.id = "mensaje-cerrar"
		this.mensaje_cerrar.innerHTML = "✕"

		this.appendChild(this.mensaje_texto)
		this.appendChild(this.mensaje_cerrar)

		this.mensaje_cerrar.onclick = this.cerrar

		MensajeUI._instancia = this
	}

	connectedCallback() { }
	disconnectedCallback() { }

	cerrar() {
		this.style.display = 'none'
	}

	set mensaje(m) {
		if (m == "") {
			this.cerrar()
			return
		}

		clearTimeout(this.msj_tout_id)
		this.mensaje_texto.innerHTML = m
		this.style.display = 'block'
		this.msj_tout_id = setTimeout(() => {
			this.cerrar()
		}, 30000)
	}

	get mensaje() {
		return this.mensaje_texto.innerHTML
	}
}
customElements.define("ui-mensaje", MensajeUI)
