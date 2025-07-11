import { Modulo } from "../../Modulo.js"
import { QR } from "../../../componente/qr/js/qr.js"


export default class CodigosQR extends Modulo {
	constructor() {
		super({ usar_transicion: true, usar_mensaje: true })

		this._mod_id = 'codigos-qr'
		this._mod_nombre = this._("Códigos QR")

		this.cargar = this.cargar.bind(this)
		this.descargar = this.descargar.bind(this)
		this.tomaUI = this.tomaUI.bind(this)
		this.procesar = this.procesar.bind(this)
		this.crearQR = this.crearQR.bind(this)
		this.pegarEntrada = this.pegarEntrada.bind(this)

		this._cargado = false
	}

	connectedCallback() {
		super.connectedCallback()
	}

	disconnectedCallback() { }

	cargar(app_config, opciones) {
		if (this._cargado) return

		super.cargar(app_config, opciones)

		this.cargarIndexDefecto()

		this.addEventListener('ModuloCargado', this.tomaUI)
	}

	tomaUI(){

		this.entrada = this.querySelector('[modulo-elemento="entrada"]')
		this.btn_entrada_pegar = this.querySelector('[modulo-elemento="btn-entrada-pegar"]')
		this.salida_qr = this.querySelector('[modulo-elemento="salida-qr"]')

		this.btn_entrada_pegar.onclick = this.pegarEntrada
		this.entrada.onchange = this.procesar

		this.crearQR('Lorem ipsum')
	}

	procesar(){

		const datos = this.entrada.value.trim()

		if(datos == '') return

		this.crearQR(datos)
	}

	crearQR(datos){
		this.salida_qr.innerHTML = ''

		let qr_config = {}
		if(this._elqr) qr_config = {...this._elqr.config}

		qr_config.datos = datos

		this._elqr = new QR(qr_config)
		this.salida_qr.appendChild(this._elqr)
	}

	pegarEntrada(e){
  	navigator.clipboard.readText()
    .then((datos) => {
    	this.mensaje = this._('Pegado')
     	this.entrada.value = datos
      this.entrada.dispatchEvent(new Event('change'))
    })
    .catch(er => {
   		console.error(er)
      this.mensaje = this._('Imposible realizar la acción.')
    })

  }

	descargar() { }
}

customElements.define("ui-codigos-qr", CodigosQR)
