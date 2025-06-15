import { Componente } from "../../Componente.js"
import { QRCode } from "./QRCode.js"

export class QR extends Componente {
	constructor(props) {
		const p_ini = {...props, usar_mensaje: true}
		super(p_ini)

		this.abrir = this.abrir.bind(this)
		this.cerrar = this.cerrar.bind(this)
		this.asignarConfig = this.asignarConfig.bind(this)
		this.construirQR = this.construirQR.bind(this)
		this.obtenerImagenBase64 = this.obtenerImagenBase64.bind(this)
		this.copiarBase64 = this.copiarBase64.bind(this)
		this.copiarDatos = this.copiarDatos.bind(this)

		if(this.props.usar_btn_copiar_base64 == undefined) this.props.usar_btn_copiar_base64 = true
		if(this.props.usar_btn_copiar_data == undefined) this.props.usar_btn_copiar_data = true
		if(this.props.usar_btn_descargar == undefined) this.props.usar_btn_descargar = true
		if(this.props.usar_cambiar_tamanio == undefined) this.props.usar_cambiar_tamanio = true
		if(this.props.usar_color_claro == undefined) this.props.usar_color_claro = true
		if(this.props.usar_color_oscuro == undefined) this.props.usar_color_oscuro = true

		this.btn_copiar_base64 = this.crear("div", { class: "btn" }, this._('Copiar como Base64'))
		this.btn_copiar_data = this.crear("div", { class: "btn" }, this._('Copiar Datos'))
		this.btn_descargar = this.crear("a", { class: "btn" }, this._('Descargar'))
		this.cambiar_tamanio = this.crear("input", { type: "range", min: 50, max: 1000, step: 10, class: 'control' })
		this.color_oscuro = this.crear("input", { type: "color", value: '#000000', class: 'control' })
		this.color_claro = this.crear("input", { type: "color", value: '#ffffff', class: 'control' })

		this.qr_cont = this.crear("div", {class: ''})
		this.cabecera = this.crear("div", {class: 'flex-h'})
		this.contenido = this.crear("div", {class: ''}, this.qr_cont)
		this.pie = this.crear("div", {class: 'flex-h'})


		this._abierto = false
		this._config = {}
		this.append(this.cabecera, this.contenido, this.pie)

		this.qr_cont.onclick = this.abrir
		this.cambiar_tamanio.addEventListener('change', (e) => {
			this._config.ancho = this.cambiar_tamanio.value
			this._config.alto = this.cambiar_tamanio.value
			this.construirQR()
		})

		this.color_oscuro.addEventListener('change', (e) => {
			this._config.color_oscuro = this.color_oscuro.value
			this.construirQR()
		})

		this.color_claro.addEventListener('change', (e) => {
			this._config.color_claro = this.color_claro.value
			this.construirQR()
		})

		this.btn_copiar_base64.onclick = this.copiarBase64
		this.btn_copiar_data.onclick = this.copiarDatos
	}

	connectedCallback() {
		super.connectedCallback()
		this.cargarUI()
		this.construirQR(this.props)
	}

	disconnectedCallback() {
		super.disconnectedCallback()
	}

	get config(){
		return this._config
	}

	set config(c){
		this.asignarConfig(c)
	}

	cargarUI(){
		this.cabecera.innerHTML = ''
		this.pie.innerHTML = ''

		if(this.props.usar_btn_descargar) this.cabecera.appendChild(this.btn_descargar)
		if(this.props.usar_btn_copiar_base64) this.cabecera.appendChild(this.btn_copiar_base64)
		if(this.props.usar_btn_copiar_data) this.cabecera.appendChild(this.btn_copiar_data)
		if(this.props.usar_cambiar_tamanio) this.pie.appendChild(this.cambiar_tamanio)
		if(this.props.usar_color_claro) this.pie.appendChild(this.color_claro)
		if(this.props.usar_color_oscuro) this.pie.appendChild(this.color_oscuro)

	}

	asignarConfig(config){

		if(!config) config = {}

		this._config = {
			datos: config.datos ?? this._config.datos ?? 'test',
			ancho: config.ancho ?? this._config.ancho ?? 300,
			alto: config.alto ?? this._config.alto ?? 300,
			color_oscuro : config.color_oscuro ?? this._config.color_oscuro ?? "#000000",
			color_claro : config.color_claro ?? this._config.color_claro ?? "#ffffff",
			nivel_correccion : config.nivel_correccion ?? this._config.nivel_correccion ?? QRCode.CorrectLevel.H,
			usarSVG: config.usarSVG ?? this._config.usarSVG ?? false
		}
	}

	construirQR(config = null){

		this.asignarConfig(config)

		this.cambiar_tamanio.value = this._config.ancho
		this.color_oscuro.value = this._config.color_oscuro
		this.color_claro.value = this._config.color_claro

		this.qr_cont.innerHTML = ''
		this.qr_code = new QRCode(this.qr_cont, {
																					text: this._config.datos,
																					width: this._config.ancho,
																					height: this._config.alto,
																					colorDark : this._config.color_oscuro,
																					colorLight : this._config.color_claro,
																					correctLevel : this._config.nivel_correccion,
																					useSVG: this._config.usarSVG
																			});

		// modifique la libreria para que envie el evento en el contenedor
		this.qr_cont.addEventListener('QRCodeGenerado', () => {

			const mime_type = 'image/png'
			const data = this.util.blobDeBase64(this.obtenerImagenBase64(), 'image/png')
			const blob = new Blob([data], { type: mime_type })
			this.btn_descargar.setAttribute('href', URL.createObjectURL(blob))
			this.btn_descargar.setAttribute('download', 'qr.png')

		})
	}

	abrir(){
		this.abrirLightbox()
		this._abierto = true
	}
	cerrar(){
		this.cerrarLightbox()
		this._abierto = false
	}

	get abierto() { return this._abierto }

	obtenerImagenBase64(){
		const img_uri = this.qr_code.imagenComoBase64()

  	if(!img_uri) return null

   	return img_uri.split(',')[1]
	}

	copiarBase64(e){

		const data = this.obtenerImagenBase64()

  	if(!data) return

   	navigator.clipboard.writeText(data)
    .then(() => {
    	this.mensaje = this._('Copiado')
    })
    .catch(er => {
   		console.error(er)
      this.mensaje = this._('Imposible realizar la acción.')
    })
  }

  copiarDatos(e){

   	if(!this._config.datos) return

    navigator.clipboard.writeText(this._config.datos)
    .then(() => {
     	this.mensaje = this._('Copiado')
    })
    .catch(er => {
    	console.error(er)
      this.mensaje = this._('Imposible realizar la acción.')
    })
   }

}

customElements.define("ui-qr", QR)
