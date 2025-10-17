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

		this.decodificar_btn_procesar = this.querySelector('[modulo-elemento="decodificar-btn-procesar"]')
		this.decodificar_salida = this.querySelector('[modulo-elemento="decodificar-salida"]')


		this.decodificar_link_descarga = this.querySelector('[modulo-elemento="decodificar-link-descarga"]')
		this.decodificar_contenedor_vista = this.querySelector('[modulo-elemento="decodificar-contenedor-vista"]')
		this.decodificar_panel_contenedor_vista = this.querySelector('[modulo-elemento="decodificar-panel-contenedor-vista"]')
		this.decodificar_mime_detectado = this.querySelector('[modulo-elemento="decodificar-mime-detectado"]')

		this.decodificar_entrada.addEventListener('VisorDocCambio', this.decodificar)
		this.decodificar_salida.addEventListener('VisorDocLimpio', (e) => {
			this.util.ocultar(this.decodificar_panel_contenedor_vista)
			this.decodificar_mime_detectado.innerHTML = ''
		})

		this.decodificar_btn_procesar.onclick = this.decodificar

		this.util.ocultar(this.decodificar_panel_contenedor_vista)
	}

	decodificar(){

		if(!this.decodificar_entrada.texto){
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
			this.decodificar_salida.texto = atob(this.decodificar_entrada.texto)
			this.mensaje = ''
		}
		catch(er){
			console.error(er)
			if(er.name == 'InvalidCharacterError') this.mensaje = this._('La entrada no es un base64 válido.')
			else this.mensaje = this._('Imposible realizar la acción.')
		}
	}

	decodevista(){
		const mime = this.util.mimeTypeDeBase64(this.decodificar_entrada.texto.substring(0, 100))

    if(mime){
    	this.decodificar_mime_detectado.innerHTML = 'MimeType: ' + mime

     	this.crearVistaPrevia(this.decodificar_entrada.texto, mime)
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

}

customElements.define("base-64-decodificar", Base64Decodificar);
