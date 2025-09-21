import { Modulo } from "../../Modulo.js";

export default class Base64Codificar extends Modulo {
	constructor() {
		super({ usar_transicion: true, usar_mensaje: true });

		this._mod_id = 'base64codificar'
		this._mod_nombre = this._("Codificar en Base64");

		this.cargar = this.cargar.bind(this);
		this.descargar = this.descargar.bind(this);
		this.tomaUI = this.tomaUI.bind(this)
		this.codificar = this.codificar.bind(this);
		this.codifireal = this.codifireal.bind(this)
		this.codificarArchivo = this.codificarArchivo.bind(this);

		this.pegarEntrada = this.pegarEntrada.bind(this)
		this.copiarEntrada = this.copiarEntrada.bind(this)
		this.limpiarEntrada = this.limpiarEntrada.bind(this)
		this.copiarSalida = this.copiarSalida.bind(this)
		this.limpiarSalida = this.limpiarSalida.bind(this)

		this._cargado = false;
	}

	connectedCallback() {
		super.connectedCallback();
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

		this.codificar_entrada = this.querySelector('[modulo-elemento="codificar-entrada"]')
		this.codificar_btn_entrada_pegar = this.querySelector('[modulo-elemento="codificar-btn-entrada-pegar"]')
		this.codificar_btn_entrada_copiar = this.querySelector('[modulo-elemento="codificar-btn-entrada-copiar"]')
		this.codificar_btn_entrada_limpiar = this.querySelector('[modulo-elemento="codificar-btn-entrada-limpiar"]')

		this.codificar_btn_procesar = this.querySelector('[modulo-elemento="codificar-btn-procesar"]')
		this.codificar_salida = this.querySelector('[modulo-elemento="codificar-salida"]')
		this.codificar_btn_salida_copiar = this.querySelector('[modulo-elemento="codificar-btn-salida-copiar"]')
		this.codificar_btn_salida_limpiar = this.querySelector('[modulo-elemento="codificar-btn-salida-limpiar"]')

		this.codificar_btn_copiar_salida = this.querySelector('[modulo-elemento="codificar-btn-copiar-salida"]')
		this.codificar_link_descarga = this.querySelector('[modulo-elemento="codificar-link-descarga"]')
		this.codificar_mime_detectado = this.querySelector('[modulo-elemento="codificar-mime-detectado"]')
		this.codificar_imp_archivo = this.querySelector('[modulo-elemento="codificar-imp-archivo"]')

		this.codificar_entrada.onchange = this.codificar
		this.codificar_btn_procesar.onclick = this.codificar
		this.codificar_imp_archivo.onchange = this.codificarArchivo
		this.codificar_btn_entrada_pegar.onclick = this.pegarEntrada
		this.codificar_btn_entrada_copiar.onclick = this.copiarEntrada
		this.codificar_btn_entrada_limpiar.onclick = this.limpiarEntrada
		this.codificar_btn_salida_copiar.onclick = this.copiarSalida
		this.codificar_btn_salida_limpiar.onclick = this.limpiarSalida

	}

	codificar(){

		if(!this.codificar_entrada.value){
			this.mensaje = this._('Sin datos que procesar.')
			return
		}

		this.mensaje = this._('Procesando')
		this.codificar_mime_detectado.innerHTML = ''

		setTimeout(this.codifireal, 100)
	}

	codifireal(){
		try{
			this.codificar_salida.value = btoa(this.codificar_entrada.value)
			this.mensaje = ''
		}
		catch(er){
			console.error(er)
			this.mensaje = this._('Imposible realizar la acción.')
		}
	}


	codificarArchivo(e){

		const arch = this.codificar_imp_archivo.files[0]
		if(!arch) return

		this.codificar_entrada.value = ''
		this.codificar_salida.value = ''
		let reader = new FileReader();
    reader.onload = (e) => {
    	const data =  String(e.target.result).split(",")[1]
    	this.codificar_salida.value = data
    };
    reader.readAsDataURL(arch);

	}

  pegarEntrada(e){
  	navigator.clipboard.readText()
    .then((datos) => {
    	//this.mensaje = this._('Pegado');
     	this.codificar_entrada.value = datos
    })
    .catch(er => {
   		console.error(er)
      this.mensaje = this._('Imposible realizar la acción.')
    })

  }

  copiarEntrada(e){
 		if(!this.codificar_entrada.value) return

  	navigator.clipboard.writeText(this.codificar_entrada.value)
   	.then(() => {
   		//this.mensaje = this._('Copiado');
    })
    .catch(er => {
  		console.error(er)
     	this.mensaje = this._('Imposible realizar la acción.')
    })

  }

	limpiarEntrada(e) {
		this.codificar_entrada.value = ''
		this.mensaje = ''
	}


	copiarSalida(e){

  	if(!this.codificar_salida.value) return

   	navigator.clipboard.writeText(this.codificar_salida.value)
    .then(() => {
    	//this.mensaje = this._('Copiado');
    })
    .catch(er => {
   		console.error(er)
      this.mensaje = this._('Imposible realizar la acción.')
    })
  }

	limpiarSalida(e) {
		this.codificar_salida.value = ''
		this.mensaje = ''
	}


}

customElements.define("base-64-codificar", Base64Codificar);
