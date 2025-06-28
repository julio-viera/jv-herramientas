import { Modulo } from "../../Modulo.js"
import { Bcrypt, CryptoAssertError } from "./bcrypt.js"

export default class ClavesBcrypt extends Modulo {
	constructor() {
		super({ usar_transicion: true, usar_mensaje: true })

		this._mod_id = 'claves-bcrypt'
		this._mod_nombre = this._("Contraseñas Bcrypt")

		this.cargar = this.cargar.bind(this)
		this.tomaUI = this.tomaUI.bind(this)
		this.descargar = this.descargar.bind(this)
		this.procesarEncriptar = this.procesarEncriptar.bind(this)
		this.procesarComparar = this.procesarComparar.bind(this)

		this.pegar = this.pegar.bind(this)
		this.copiar = this.copiar.bind(this)

		this._cargado = false
	}

	connectedCallback() {
		super.connectedCallback()
	}

	disconnectedCallback() { }

	cargar(app_config) {
		if (this._cargado) return

		super.cargar(app_config)

		this.cargarIndexDefecto()

		this.addEventListener('ModuloCargado', this.tomaUI)
	}

	tomaUI(){
		this.entrada = this.querySelector('[modulo-elemento="entrada"]')
		this.btn_entrada_pegar = this.querySelector('[modulo-elemento="btn-entrada-pegar"]')
		this.salida = this.querySelector('[modulo-elemento="salida"]')
		this.btn_salida_copiar = this.querySelector('[modulo-elemento="btn-salida-copiar"]')

		this.comparar_texto = this.querySelector('[modulo-elemento="comparar-texto"]')
		this.btn_comparar_texto_pegar = this.querySelector('[modulo-elemento="btn-comparar-texto-pegar"]')
		this.comparar_bcrypt = this.querySelector('[modulo-elemento="comparar-bcrypt"]')
		this.btn_comparar_bcrypt_pegar = this.querySelector('[modulo-elemento="btn-comparar-bcrypt-pegar"]')
		this.comparar_resultado = this.querySelector('[modulo-elemento="comparar-resultado"]')

		this.entrada.onchange = this.procesarEncriptar
		this.comparar_texto.onchange = this.procesarComparar
		this.comparar_bcrypt.onchange = this.procesarComparar

		this.btn_entrada_pegar.onclick = () => { this.pegar(this.entrada) }
		this.btn_salida_copiar.onclick = () => { this.copiar(this.salida) }
		this.btn_comparar_texto_pegar.onclick = () => { this.pegar(this.comparar_texto) }
		this.btn_comparar_bcrypt_pegar.onclick = () => { this.pegar(this.comparar_bcrypt) }

	}

	procesarEncriptar(){
		const entrada = this.entrada.value.trim()

		if(!entrada){
			this.salida.value = ''
			return
		}

		this.salida.value = Bcrypt.hash(entrada)
	}

	procesarComparar(){
		const texto = this.comparar_texto.value.trim()
		const encry = this.comparar_bcrypt.value.trim()

		if(!texto || !encry){
			this.comparar_resultado.innerHTML = '--'
			return
		}

		try{

			if(Bcrypt.compare(texto, encry)){
				this.comparar_resultado.innerHTML = this._('Sí')
			}
			else{
				this.comparar_resultado.innerHTML = this._('No')
			}
		}
		catch(er){
			console.error(er)
			if(er.name == 'CryptoAssertError') this.mensaje = this._('Formato no válido.')
				else this.mensaje = this._('Imposible realizar la acción.')
		}

	}

	descargar() { }


	pegar(nodo){
  	navigator.clipboard.readText()
    .then((datos) => {
    	this.mensaje = this._('Pegado')
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
   		this.mensaje = this._('Copiado')
    })
    .catch(er => {
  		console.error(er)
     	this.mensaje = this._('Imposible realizar la acción.')
    })

  }
}

customElements.define("ui-claves-bcrypt", ClavesBcrypt)
