import { Modulo } from "../../Modulo.js"


export default class JwtModulo extends Modulo {
	constructor() {
		super({ usar_transicion: true, usar_mensaje: true })

		this._mod_id = 'jwt'
		this._mod_nombre = this._("JWT")

		this.cargar = this.cargar.bind(this)
		this.descargar = this.descargar.bind(this)
		this.tomaUI = this.tomaUI.bind(this)
		this.decodificarJWT = this.decodificarJWT.bind(this)

		this.pegar = this.pegar.bind(this)
		this.copiar = this.copiar.bind(this)
		this.limpiar = this.limpiar.bind(this)

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
	descargar() { }

	tomaUI(){
		this.entrada = this.querySelector('[modulo-elemento="entrada"]')
		this.btn_entrada_pegar = this.querySelector('[modulo-elemento="btn-entrada-pegar"]')
		this.btn_entrada_copiar = this.querySelector('[modulo-elemento="btn-entrada-copiar"]')
		this.btn_entrada_limpiar = this.querySelector('[modulo-elemento="btn-entrada-limpiar"]')

		this.btn_entrada_pegar.onclick = () => { this.pegar(this.entrada) }
		this.btn_entrada_copiar.onclick = () => { this.copiar(this.entrada) }
		this.btn_entrada_limpiar.onclick = () => { this.limpiar(this.entrada) }

		this.salida_cabecera = this.querySelector('[modulo-elemento="salida-cabecera"]')
		this.salida_carga = this.querySelector('[modulo-elemento="salida-carga"]')
		this.salida_firma = this.querySelector('[modulo-elemento="salida-firma"]')

		this.entrada.addEventListener('change', this.decodificarJWT)
	}

	decodificarJWT(){
		const jwt = this.entrada.value

		if(!jwt) return

		const partes = jwt.split('.')

		if(partes.length != 3){
			this.mensaje = this._('El JWT no parece válido.')
			return
		}

		this.mensaje = ''

		try{
			const json = atob(partes[0])
			this.salida_cabecera.value = JSON.stringify(JSON.parse(json), null, 2)
		}
		catch(er){
			console.error(er)
			if(er.name == 'InvalidCharacterError') this.mensaje = this._('No es un base64 válido.')
			else this.mensaje = this._('Imposible realizar la acción.')
		}

		try{
			const json = atob(partes[1])
			this.salida_carga.value = JSON.stringify(JSON.parse(json), null, 2)
		}
		catch(er){
			console.error(er)
			if(er.name == 'InvalidCharacterError') this.mensaje = this._('No es un base64 válido.')
			else this.mensaje = this._('Imposible realizar la acción.')
		}

		this.salida_firma.value = partes[2]

	}


	pegar(nodo){
  	navigator.clipboard.readText()
    .then((datos) => {
    	//this.mensaje = this._('Pegado');
     	nodo.value = datos
      nodo.dispatchEvent(new Event('change'))
    })
    .catch(er => {
   		console.error(er)
      this.mensaje = this._('Imposible realizar la acción.')
    })

  }

  copiar(nodo){
 		if(!nodo.value) return

  	navigator.clipboard.writeText(nodo.value)
   	.then(() => {
   		//this.mensaje = this._('Copiado');
    })
    .catch(er => {
  		console.error(er)
     	this.mensaje = this._('Imposible realizar la acción.')
    })

  }

	limpiar(nodo) {
		nodo.value = ''
		this.mensaje = ''
	}

}

customElements.define("ui-jwt-modulo", JwtModulo)
