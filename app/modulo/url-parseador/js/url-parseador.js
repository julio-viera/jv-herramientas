import { Modulo } from "../../Modulo.js"


export default class URLParseador extends Modulo {
	constructor() {
		super({ usar_transicion: true, usar_mensaje: true })

		this._mod_id = 'url-parseador'
		this._mod_nombre = this._("URL Parseador")

		this.cargar = this.cargar.bind(this)
		this.descargar = this.descargar.bind(this)
		this.tomaUI = this.tomaUI.bind(this)
		this.procesar = this.procesar.bind(this)

		this.pegarEntrada = this.pegarEntrada.bind(this)
		this.copiarEntrada = this.copiarEntrada.bind(this)
		this.limpiarEntrada = this.limpiarEntrada.bind(this)

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
		this.url_entrada = this.querySelector('[modulo-elemento="url-entrada"]')
		this.btn_url_pegar = this.querySelector('[modulo-elemento="btn-url-pegar"]')
		this.btn_url_copiar = this.querySelector('[modulo-elemento="btn-url-copiar"]')
		this.btn_url_limpiar = this.querySelector('[modulo-elemento="btn-url-limpiar"]')

		this.url_protocolo = this.querySelector('[modulo-elemento="url-protocolo"]')
		this.url_usuario = this.querySelector('[modulo-elemento="url-usuario"]')
		this.url_clave = this.querySelector('[modulo-elemento="url-clave"]')
		this.url_host = this.querySelector('[modulo-elemento="url-host"]')
		this.url_puerto = this.querySelector('[modulo-elemento="url-puerto"]')
		this.url_ruta = this.querySelector('[modulo-elemento="url-ruta"]')
		this.url_parametros = this.querySelector('[modulo-elemento="url-parametros"]')
		this.url_parametros_desplegados = this.querySelector('[modulo-elemento="url-parametros-desplegados"]')

		this.btn_url_pegar.onclick = this.pegarEntrada
		this.btn_url_copiar.onclick = this.copiarEntrada
		this.btn_url_limpiar.onclick = this.limpiarEntrada

		this.url_entrada.addEventListener('change', this.procesar)
	}

	procesar(){

		const entrada = this.url_entrada.value.trim()
		console.log(entrada)
		if(!entrada){
			return
		}

		try{
			this._url = new URL(entrada)
		}
		catch(er){
			console.error(er)
			this.mensaje = this._('La URL no es válida.')
			return
		}

		this.url_protocolo.innerHTML = this._url.protocol
		this.url_usuario.innerHTML = this._url.username
		this.url_clave.innerHTML = this._url.password
		this.url_host.innerHTML = this._url.hostname
		this.url_puerto.innerHTML = this._url.port
		this.url_ruta.innerHTML = this._url.pathname
		this.url_parametros.innerHTML = this._url.search

		this.url_parametros_desplegados.innerHTML = ''
		this._url.searchParams.forEach((valor, nombre) => {
			const nodo = this.crear('div', {class: 'grilla-c2'}, [
				this.crear('div', {}, nombre),
				this.crear('div', {}, decodeURIComponent(valor))
			])

			this.url_parametros_desplegados.appendChild(nodo)
		})
	}


	pegarEntrada(e){
  	navigator.clipboard.readText()
    .then((datos) => {
    	//this.mensaje = this._('Pegado');
     	this.url_entrada.value = datos
      this.url_entrada.dispatchEvent(new Event('change'))
    })
    .catch(er => {
   		console.error(er)
      this.mensaje = this._('Imposible realizar la acción.')
    })

  }

  copiarEntrada(e){
 		if(!this.url_entrada.value) return

  	navigator.clipboard.writeText(this.url_entrada.value)
   	.then(() => {
   		//this.mensaje = this._('Copiado');
    })
    .catch(er => {
  		console.error(er)
     	this.mensaje = this._('Imposible realizar la acción.')
    })

  }

	limpiarEntrada(e) {
		this.url_entrada.value = ''
		this.mensaje = ''
	}

}

customElements.define("ui-url-parseador-modulo", URLParseador)
