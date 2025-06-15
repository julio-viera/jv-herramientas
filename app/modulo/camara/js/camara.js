import { Modulo } from "../../Modulo.js"


export default class CamaraModulo extends Modulo {
	constructor() {
		super({ usar_transicion: true, usar_mensaje: true })

		this._mod_id = 'camara'
		this._mod_nombre = this._("Camara")

		this.cargar = this.cargar.bind(this)
		this.descargar = this.descargar.bind(this)
		this.tomaUI = this.tomaUI.bind(this)

		this.iniciarMedia = this.iniciarMedia.bind(this)
		this.seleccionarMedia = this.seleccionarMedia.bind(this)
		this.capturarImagen = this.capturarImagen.bind(this)
		this.detenerMedia = this.detenerMedia.bind(this)
		this.grabacionIniciar = this.grabacionIniciar.bind(this)
		this.grabacionDetener = this.grabacionDetener.bind(this)

		this._cargado = false
	}

	connectedCallback() {
		super.connectedCallback()
	}

	disconnectedCallback() { }

	cargar(app_config) {
		if (this._cargado){
			this.iniciarMedia()
			return
		}

		super.cargar(app_config)

		this.cargarIndexDefecto()

		this.addEventListener('ModuloCargado', this.tomaUI)
	}
	descargar() {
		this.detenerMedia()
  }

	tomaUI(){

		this.btn_iniciar_camara = this.querySelector('[modulo-elemento="btn-iniciar-camara"]')
		this.btn_detener_camara = this.querySelector('[modulo-elemento="btn-detener-camara"]')
		this.btn_captura_camara = this.querySelector('[modulo-elemento="btn-captura-camara"]')
		this.video_camara = this.querySelector('[modulo-elemento="video-camara"]')
		this.imagen_camara = this.querySelector('[modulo-elemento="imagen-camara"]')
		this.btn_descargar_imagen_camara = this.querySelector('[modulo-elemento="btn-descargar-imagen-camara"]')
		this.listado_camaras = this.querySelector('[modulo-elemento="listado-camaras"]')
		this.listado_microfonos = this.querySelector('[modulo-elemento="listado-microfonos"]')

		this.grabacion_video = this.querySelector('[modulo-elemento="grabacion-video"]')
		this.btn_descargar_grabacion_video = this.querySelector('[modulo-elemento="btn-descargar-grabacion-video"]')
		this.btn_iniciar_grabacion = this.querySelector('[modulo-elemento="btn-grabar-video-iniciar"]')
		this.btn_detener_grabacion = this.querySelector('[modulo-elemento="btn-grabar-video-detener"]')

		this.btn_iniciar_camara.onclick = this.iniciarMedia
		this.btn_captura_camara.onclick = this.capturarImagen
		this.btn_detener_camara.onclick = this.detenerMedia

		this.btn_iniciar_grabacion.onclick = this.grabacionIniciar
		this.btn_detener_grabacion.onclick = this.grabacionDetener

		this.listado_camaras.addEventListener('change', this.seleccionarMedia)
		this.listado_microfonos.addEventListener('change', this.seleccionarMedia)

		this.util.ocultar(this.btn_detener_grabacion)
		this.util.ocultar(this.btn_detener_camara)
		this.util.mostrar(this.btn_iniciar_camara)

		this.iniciarMedia()
	}


	iniciarMedia(){

		this.listado_camaras.innerHTML = ''
		this.listado_microfonos.innerHTML = ''

		if(!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices){
			this.mensaje = this._('No se puede acceder a la Camara.') + ' ' + this._('Compruebe los permisos.')
			return
		}

		navigator.mediaDevices.enumerateDevices()
    .then((devices) => {

      devices.forEach((device) => {
        //console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`)

        const op = document.createElement('option')
        op.text = device.label
        op.value = device.deviceId

        if(device.kind == 'audioinput'){
        	this.listado_microfonos.add(op)
        }
        else if(device.kind == 'videoinput'){
        	this.listado_camaras.add(op)
        }
        else if(device.kind == 'audiooutput'){
        }
      })

      this.listado_camaras.dispatchEvent(new Event('change'))
    })
    .catch((er) => {
    	console.error(er)
    	this.mensaje = this._('No se puede obtener Camaras.')
    })
	}

	seleccionarMedia(){

		this.detenerMedia()

		navigator.mediaDevices.getUserMedia({
				audio: {
					deviceId: { exact: this.listado_microfonos.value }
				},
				video: {
					width: {ideal: 900},
					height: {ideal: 500},
					frameRate: {ideal: 30},
					deviceId: { exact: this.listado_camaras.value }
				}
			})
      .then((stream) => {
       	this.stream = stream
        this.video_camara.srcObject = this.stream

        this.mensaje = this._('Camara transmitiendo.') + ' ' +  this.listado_camaras.options[this.listado_camaras.selectedIndex].text

    		this.util.mostrar(this.btn_detener_camara)
       	this.util.ocultar(this.btn_iniciar_camara)

      })
      .catch((er) => {
      		console.error(er)
       	this.mensaje = this._('No se puede acceder a la Camara.')
      })

	}

	capturarImagen(){

		this.imagen_camara.width = this.video_camara.videoWidth;
    this.imagen_camara.height = this.video_camara.videoHeight;

    const context = this.imagen_camara.getContext('2d');

    context.drawImage(this.video_camara, 0, 0, this.imagen_camara.width, this.imagen_camara.height);

		const dataURL = this.imagen_camara.toDataURL('image/png');

		this.imagen_camara.src = dataURL

    this.btn_descargar_imagen_camara.href = dataURL;
    this.btn_descargar_imagen_camara.download = 'imagen.png';

	}


	detenerMedia(){
		if(!this.stream) return

		this.util.ocultar(this.btn_detener_camara)
		this.util.mostrar(this.btn_iniciar_camara)

		this.grabacionDetener()

		this.stream.getTracks().forEach((track) => {
			//console.log('Track de stream', track)
      if (track.readyState == 'live') {
          track.stop();
      }
    })
	}

	grabacionIniciar(){

		if(!this.stream) return

		this.grabacion_media = new MediaRecorder(this.stream)

	  this.grabacion_media.ondataavailable = (e) => {
				const arrData = []
				arrData.push(e.data)

				let dataBlob = new Blob(arrData, { type: "video/webm" })
        this.grabacion_video.src = URL.createObjectURL(dataBlob)
        this.btn_descargar_grabacion_video.href = this.grabacion_video.src
        this.btn_descargar_grabacion_video.download = this._('Grabación') + ".webm"

        this.mensaje = this._('Grabación terminada.') + ' ' + Math.round(dataBlob.size / 1024 / 1024, 4) + ' MB. ' + dataBlob.type
			}

		this.grabacion_media.onstop = (e) => {
		}

		this.grabacion_media.onerror = (e) => {
			console.error('Error grabación', e)
			this.mensaje = this._('Error en la Grabación.')
		}

	  this.grabacion_media.start()
		this.mensaje = this._('Grabación iniciada.')

		this.util.mostrar(this.btn_detener_grabacion)
		this.util.ocultar(this.btn_iniciar_grabacion)
	}

	grabacionDetener(){
		if(!this.grabacion_media) return

		this.grabacion_media.stop()
		this.util.ocultar(this.btn_detener_grabacion)
		this.util.mostrar(this.btn_iniciar_grabacion)
	}

}

customElements.define("ui-camara-modulo", CamaraModulo)
