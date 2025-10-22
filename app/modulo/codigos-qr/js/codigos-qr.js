import { Modulo } from "../../Modulo.js"
import { QR } from "../../../componente/qr/js/qr.js"
import QrScanner from "../../../libs/qr-scanner/qr-scanner.min.js";


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

		this.lecturaQR = this.lecturaQR.bind(this)
		this.iniciarCamara = this.iniciarCamara.bind(this)
		this.detenerCamara = this.detenerCamara.bind(this)
		this.escanearImagen = this.escanearImagen.bind(this)
		this.seleccionarCamara = this.seleccionarCamara.bind(this)

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
		this.salida_qr = this.querySelector('[modulo-elemento="salida-qr"]')
		this.entrada.addEventListener('AreaTextoCambio', this.procesar)

		this.crearQR('Lorem ipsum')

		this.qr_video = this.querySelector('[modulo-elemento="qr-video"]')
		this.qr_listado_camaras = this.querySelector('[modulo-elemento="qr-listado-camaras"]')
		this.qr_iniciar_camara = this.querySelector('[modulo-elemento="qr-iniciar-camara"]')
		this.qr_parar_camara = this.querySelector('[modulo-elemento="qr-parar-camara"]')
		this.qr_archivo = this.querySelector('[modulo-elemento="qr-archivo"]')
		this.qr_lectura = this.querySelector('[modulo-elemento="qr-lectura"]')

  	this.qr_scanner = new QrScanner(
    								this.qr_video,
            				(res) => {
            					this.lecturaQR(res.data)
                  	},
                   	{
							        preferredCamera: 'environment',
							        highlightScanRegion: true,
							        highlightCodeOutline: true,
                    }
    );

    this.qr_listado_camaras.innerHTML = ''
		QrScanner.listCameras(true).then(lista => lista.forEach(camara => {
				const op = document.createElement('option')
				op.value = camara.id
				op.text = camara.label
				this.qr_listado_camaras.add(op)
		}));

		this.qr_listado_camaras.onchange = this.seleccionarCamara

		this.qr_archivo.addEventListener('CargadorDeArchivosCarga', (e) => {
			this.qr_lectura.texto = ''
			this.escanearImagen()
		});

		this.qr_iniciar_camara.onclick = this.iniciarCamara
		this.qr_parar_camara.onclick = this.detenerCamara

		this.util.ocultar(this.qr_parar_camara)
	}

	procesar(){

		const datos = this.entrada.texto.trim()

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

  lecturaQR(data) {
		this.qr_lectura.texto = data
  }

  iniciarCamara(){
  	this.qr_scanner.start()
   	this.util.ocultar(this.qr_iniciar_camara)
   	this.util.mostrar(this.qr_parar_camara)
  }
  detenerCamara(){
  	this.qr_scanner.stop()
  	this.util.mostrar(this.qr_iniciar_camara)
  	this.util.ocultar(this.qr_parar_camara)
  }

  escanearImagen()
  {
		this.mensaje = '';
  	const archivo = this.qr_archivo.archivos[0] ?? null
   	if(!archivo) return

	    QrScanner.scanImage(archivo)
		    .then((res) => {
					this.lecturaQR(res)
				})
				.catch(error => {
					console.log(error)
					this.mensaje = this._('La imagen no es un QR.')
				});
  }

  seleccionarCamara(e)
  {
   	if(!this.qr_listado_camaras.value) return

	    QrScanner.setCamera(this.qr_listado_camaras.value)
  }

	descargar() {
		this.detenerCamara()
	}
}

customElements.define("ui-codigos-qr", CodigosQR)
