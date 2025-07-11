import { Modulo } from "../../Modulo.js";

export default class Base64Decodificar extends Modulo {
	constructor() {
		super({ usar_transicion: true, usar_mensaje: true });

		this._mod_id = 'base64decodificar'
		this._mod_nombre = this._("Decodificar Base 64");

		this.cargar = this.cargar.bind(this);
		this.descargar = this.descargar.bind(this);
		this.tomaUI = this.tomaUI.bind(this)
		this.decodificar = this.decodificar.bind(this);
		this.decodereal = this.decodereal.bind(this)
		this.decodevista = this.decodevista.bind(this)
		this.crearVistaPrevia = this.crearVistaPrevia.bind(this)
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

		this.decodificar_entrada = this.querySelector('[modulo-elemento="decodificar-entrada"]')
		this.decodificar_btn_entrada_pegar = this.querySelector('[modulo-elemento="decodificar-btn-entrada-pegar"]')
		this.decodificar_btn_entrada_copiar = this.querySelector('[modulo-elemento="decodificar-btn-entrada-copiar"]')
		this.decodificar_btn_entrada_limpiar = this.querySelector('[modulo-elemento="decodificar-btn-entrada-limpiar"]')

		this.decodificar_btn_procesar = this.querySelector('[modulo-elemento="decodificar-btn-procesar"]')
		this.decodificar_salida = this.querySelector('[modulo-elemento="decodificar-salida"]')
		this.decodificar_btn_salida_copiar = this.querySelector('[modulo-elemento="decodificar-btn-salida-copiar"]')
		this.decodificar_btn_salida_limpiar = this.querySelector('[modulo-elemento="decodificar-btn-salida-limpiar"]')


		this.decodificar_link_descarga = this.querySelector('[modulo-elemento="decodificar-link-descarga"]')
		this.decodificar_contenedor_vista = this.querySelector('[modulo-elemento="decodificar-contenedor-vista"]')
		this.decodificar_panel_contenedor_vista = this.querySelector('[modulo-elemento="decodificar-panel-contenedor-vista"]')
		this.decodificar_mime_detectado = this.querySelector('[modulo-elemento="decodificar-mime-detectado"]')

		this.decodificar_btn_procesar.onclick = this.decodificar
		this.decodificar_btn_entrada_pegar.onclick = this.pegarEntrada
		this.decodificar_btn_entrada_copiar.onclick = this.copiarEntrada
		this.decodificar_btn_entrada_limpiar.onclick = this.limpiarEntrada
		this.decodificar_btn_salida_copiar.onclick = this.copiarSalida
		this.decodificar_btn_salida_limpiar.onclick = this.limpiarSalida

		this.util.ocultar(this.decodificar_panel_contenedor_vista)
	}

	decodificar(){

		if(!this.decodificar_entrada.value){
			this.mensaje = this._('Sin datos que procesar.')
			return
		}

		this.mensaje = this._('Procesando')
		this.util.ocultar(this.decodificar_panel_contenedor_vista)
		this.decodificar_mime_detectado.innerHTML = ''

		setTimeout(this.decodereal, 100)
		setTimeout(this.decodevista, 120)
	}

	decodereal(){
		try{
			this.decodificar_salida.value = atob(this.decodificar_entrada.value)
			this.mensaje = ''
		}
		catch(er){
			console.error(er)
			if(er.name == 'InvalidCharacterError') this.mensaje = this._('La entrada no es un base64 válido.')
			else this.mensaje = this._('Imposible realizar la acción.')
		}
	}

	decodevista(){
		const mime = this.util.mimeTypeDeBase64(this.decodificar_entrada.value.substring(0, 100))

    if(mime){
    	this.decodificar_mime_detectado.innerHTML = 'MimeType: ' + mime

     	this.crearVistaPrevia(this.decodificar_entrada.value, mime)
    }
	}

	crearVistaPrevia(blob_o_archivo, mime_type){

		this.decodificar_contenedor_vista.innerHTML = ''
    this.util.ocultar(this.decodificar_panel_contenedor_vista)
    this.decodificar_link_descarga.setAttribute('href', '')

  	this.vista_previa = null

   	if(!blob_o_archivo || !mime_type) return

	  if(/^image\/.+$/.test(mime_type)){
			this.vista_previa = this.crear('img', {id: this.id + 'vista-previa', class: 'vista-previa-img'})
	  }
	  else if(mime_type == 'application/pdf'){
	  	this.vista_previa = this.crear('embed', {id: this.id + 'vista-previa', class: 'vista-previa-pdf', type: 'application/pdf', frameBorder: "0", scrolling: "auto"})
	  }
	  else if(/^video\/.+$/.test(mime_type)){
			this.vista_previa = this.crear('video', {id: this.id + 'vista-previa', class: 'vista-previa-video', controls: true})
	  }
	  else if(/^audio\/.+$/.test(mime_type)){
			this.vista_previa = this.crear('audio', {id: this.id + 'vista-previa', class: 'vista-previa-audio', controls: true})
	  }

	  if(this.vista_previa){
			const data = this.util.blobDeBase64(blob_o_archivo, mime_type)
			const obj_url = URL.createObjectURL( (blob_o_archivo instanceof File) ? blob_o_archivo : data)

	    this.vista_previa.src = obj_url
			this.decodificar_contenedor_vista.innerHTML = ''
			this.decodificar_contenedor_vista.append(this.vista_previa)
			this.util.mostrar(this.decodificar_panel_contenedor_vista)

	   	const blob = new Blob([data], { type: mime_type })
	    this.decodificar_link_descarga.setAttribute('href', URL.createObjectURL(blob))
	    this.decodificar_link_descarga.setAttribute('download', this._('archivo'))
	  }
  }

  pegarEntrada(e){
  	navigator.clipboard.readText()
    .then((datos) => {
    	this.mensaje = this._('Pegado')
     	this.decodificar_entrada.value = datos
    })
    .catch(er => {
   		console.error(er)
      this.mensaje = this._('Imposible realizar la acción.')
    })

  }

  copiarEntrada(e){
 		if(!this.decodificar_entrada.value) return

  	navigator.clipboard.writeText(this.decodificar_entrada.value)
   	.then(() => {
   		this.mensaje = this._('Copiado')
    })
    .catch(er => {
  		console.error(er)
     	this.mensaje = this._('Imposible realizar la acción.')
    })

  }

	limpiarEntrada(e) {
		this.decodificar_entrada.value = ''
		this.mensaje = ''
	}

  copiarSalida(e){
 		if(!this.decodificar_salida.value) return

  	navigator.clipboard.writeText(this.decodificar_salida.value)
   	.then(() => {
   		this.mensaje = this._('Copiado')
    })
    .catch(er => {
  		console.error(er)
     	this.mensaje = this._('Imposible realizar la acción.')
    })

  }

	limpiarSalida(e) {
		this.decodificar_salida.value = ''
		this.mensaje = ''
	}

}

customElements.define("base-64-decodificar", Base64Decodificar);
