import { Modulo } from "../../Modulo.js"


export default class URLParametros extends Modulo {
	constructor() {
		super({ usar_transicion: true, usar_mensaje: true })

		this._mod_id = 'url-parametros'
		this._mod_nombre = this._("URL Parametros")

		this.cargar = this.cargar.bind(this)
		this.tomaUI = this.tomaUI.bind(this)
		this.codificarParametros = this.codificarParametros.bind(this)
		this.decodificarParametros = this.decodificarParametros.bind(this)
		this.descargar = this.descargar.bind(this)

		this.pegarEncoEntrada = this.pegarEncoEntrada.bind(this)
		this.copiarEncoEntrada = this.copiarEncoEntrada.bind(this)
		this.limpiarEncoEntrada = this.limpiarEncoEntrada.bind(this)
		this.copiarEncoSalida = this.copiarEncoSalida.bind(this)

		this.pegarDecoEntrada = this.pegarDecoEntrada.bind(this)
		this.copiarDecoEntrada = this.copiarDecoEntrada.bind(this)
		this.limpiarDecoEntrada = this.limpiarDecoEntrada.bind(this)
		this.copiarDecoSalida = this.copiarDecoSalida.bind(this)

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

		this.encode_entrada = this.querySelector('[modulo-elemento="param-encode-entrada"]')
		this.btn_encode_pegar = this.querySelector('[modulo-elemento="btn-param-encode-pegar"]')
		this.btn_encode_copiar = this.querySelector('[modulo-elemento="btn-param-encode-copiar"]')
		this.btn_encode_limpiar = this.querySelector('[modulo-elemento="btn-param-encode-limpiar"]')

		this.btn_encode_salida_copiar = this.querySelector('[modulo-elemento="btn-param-encode-salida-copiar"]')
		this.encode_salida = this.querySelector('[modulo-elemento="param-encode-salida"]')


		this.decode_entrada = this.querySelector('[modulo-elemento="param-decode-entrada"]')
		this.btn_decode_pegar = this.querySelector('[modulo-elemento="btn-param-decode-pegar"]')
		this.btn_decode_copiar = this.querySelector('[modulo-elemento="btn-param-decode-copiar"]')
		this.btn_decode_limpiar = this.querySelector('[modulo-elemento="btn-param-decode-limpiar"]')

		this.btn_decode_salida_copiar = this.querySelector('[modulo-elemento="btn-param-decode-salida-copiar"]')
		this.decode_salida = this.querySelector('[modulo-elemento="param-decode-salida"]')



		this.btn_encode_pegar.onclick = this.pegarEncoEntrada
		this.btn_encode_copiar.onclick = this.copiarEncoEntrada
		this.btn_encode_limpiar.onclick = this.limpiarEncoEntrada
		this.btn_encode_salida_copiar.onclick = this.copiarEncoSalida

		this.encode_entrada.addEventListener('change', this.codificarParametros)


		this.btn_decode_pegar.onclick = this.pegarDecoEntrada
		this.btn_decode_copiar.onclick = this.copiarDecoEntrada
		this.btn_decode_limpiar.onclick = this.limpiarDecoEntrada
		this.btn_decode_salida_copiar.onclick = this.copiarDecoSalida

		this.decode_entrada.addEventListener('change', this.decodificarParametros)
	}

	codificarParametros(){
		const params = this.encode_entrada.value.trim()

		if(!params) return

		this.encode_salida.value = encodeURI(params)
	}

	decodificarParametros(){
		const params = this.decode_entrada.value.trim()

		if(!params) return

		this.decode_salida.value = decodeURI(params)
	}

	pegarEncoEntrada(e){
  	navigator.clipboard.readText()
    .then((datos) => {
    	//this.mensaje = this._('Pegado');
     	this.encode_entrada.value = datos
      this.encode_entrada.dispatchEvent(new Event('change'))
    })
    .catch(er => {
   		console.error(er)
      this.mensaje = this._('Imposible realizar la acción.')
    })

  }

  copiarEncoEntrada(e){
 		if(!this.encode_entrada.value) return

  	navigator.clipboard.writeText(this.encode_entrada.value)
   	.then(() => {
   		//this.mensaje = this._('Copiado');
    })
    .catch(er => {
  		console.error(er)
     	this.mensaje = this._('Imposible realizar la acción.')
    })

  }

	limpiarEncoEntrada(e) {
		this.encode_entrada.value = ''
		this.encode_salida.value = ''
		this.mensaje = ''
	}


	copiarEncoSalida(e){
 		if(!this.encode_salida.value) return

  	navigator.clipboard.writeText(this.encode_salida.value)
   	.then(() => {
   		//this.mensaje = this._('Copiado');
    })
    .catch(er => {
  		console.error(er)
     	this.mensaje = this._('Imposible realizar la acción.')
    })
  }


  pegarDecoEntrada(e){
   	navigator.clipboard.readText()
     	.then((datos) => {
     	//this.mensaje = this._('Pegado');
      	this.decode_entrada.value = datos
       	this.decode_entrada.dispatchEvent(new Event('change'))
      })
      .catch(er => {
    		console.error(er)
       	this.mensaje = this._('Imposible realizar la acción.')
      })
  }

  copiarDecoEntrada(e){
  	if(!this.decode_entrada.value) return

   	navigator.clipboard.writeText(this.decode_entrada.value)
    	.then(() => {
    		//this.mensaje = this._('Copiado');
     	})
     	.catch(er => {
    		console.error(er)
      	this.mensaje = this._('Imposible realizar la acción.')
      })
  }

	limpiarDecoEntrada(e) {
		this.decode_entrada.value = ''
		this.decode_salida.value = ''
		this.mensaje = ''
	}


	copiarDecoSalida(e){
  	if(!this.decode_salida.value) return

   	navigator.clipboard.writeText(this.decode_salida.value)
    	.then(() => {
    		//this.mensaje = this._('Copiado');
     	})
     	.catch(er => {
    		console.error(er)
      	this.mensaje = this._('Imposible realizar la acción.')
      })
  }
}

customElements.define("ui-url-parametros-modulo", URLParametros)
