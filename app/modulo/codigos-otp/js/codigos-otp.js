import { Modulo } from "../../Modulo.js";
import { QR } from "../../../componente/qr/js/qr.js"

import {encrypt_sha1, OTP_DEFAULT_BASE32_CHARS, OTP, TOTP, HOTP, OTPURI} from "/app/libs/js-otp/JSOTP.js"


class OtpDatos{
	_intervalo = 30
	_digitos = 6
	_largo_bits = 128
	_hash_algo = 'SHA1'
	_secreto = OTP.random_base32(64).join('')
	_nombre_organizacion = ''
	_nombre_app = ''
	_uri = ''

	constructor(props){

		this.props = props ?? {}

		this.actualizar = this.actualizar.bind(this)
		this.generarNuevoSecreto = this.generarNuevoSecreto.bind(this)

		this._intervalo = this.props.intervalo ?? 30
		this._digitos = this.props.digitos ?? 6
		this._largo_bits = this.props.largo_bits ?? 128
		this._secreto = this.props.secreto ?? this.generarNuevoSecreto(this._largo_bits)
		this._nombre_organizacion = this.props.nombre_organizacion ?? ''
		this._nombre_app = this.props.nombre_app ?? ''

		this.actualizar()
	}

	actualizar(){
		this.totp = new TOTP(this._secreto, this._largo_bits, encrypt_sha1, this._hash_algo, this._digitos, this._intervalo);
		this._uri = OTPURI.build_uri(this.totp, this._nombre_organizacion, this._nombre_app, 0);

		//let codigo = this.totp.now()
		let codigo = this.totp.at(1, 0)
		console.log('codigo at', codigo, ' verificacion', this.totp.verify(codigo, 0, 1))

		codigo = this.totp.now()
		console.log('codigo now', codigo, ' verificacion', this.totp.verify(codigo, parseInt(new Date().getTime() / 1000), 1))
	}

	generarNuevoSecreto(largo_bits = 32){
		this._largo_bits = largo_bits
		this._secreto = OTP.random_base32(this._largo_bits).join('')
		return this._secreto
	}

	verificarCodigo(codigo){
		const valido = this.totp.verify(codigo, parseInt(new Date().getTime() / 1000), 4)
		console.log('verifica codigo', codigo, valido)
		console.log('codigo 2', codigo, ' verificacion', this.totp.verify(codigo, 0, 4))
		console.log('codigo 3', codigo, ' verificacion', this.totp.verify(codigo, parseInt(new Date().getTime()), 4))
		console.log('codigo 4', codigo, ' verificacion', this.totp.verify(codigo, parseInt(new Date().getTime() / 1000), 4))
		return valido
	}

	get secreto(){
		return this._secreto
	}

	get codigo(){
		return this.totp.now()
	}

	get uri(){
		return this._uri
	}
	set nombre_app(p){
		this._nombre_app = p
		this.actualizar()
	}
	get nombre_app(){
		return this._nombre_app
	}
	set nombre_organizacion(p){
		this._nombre_organizacion = p
		this.actualizar()
	}
	get nombre_organizacion(){
		return this._nombre_organizacion
	}
	set intervalo(p){
		this._intervalo = p
		this.actualizar()
	}
	get intervalo(){
		return this._intervalo
	}
	set digitos(p){
		this._digitos = p
		this.actualizar()
	}
	get digitos(){
		return this._digitos
	}
	get largo_bits(){
		return this.largo_bits
	}
	get hash_algo(){
		return this._hash_algo
	}

}

export default class CodigosOtp extends Modulo {
	constructor() {
		super({ usar_transicion: true, usar_mensaje: true });

		this._mod_id = 'codigos-otp'
		this._mod_nombre = this._("Códigos OTP");

		this.cargar = this.cargar.bind(this);
		this.descargar = this.descargar.bind(this);
		this.tomaUI = this.tomaUI.bind(this)
		this.nuevoOtpSecreto = this.nuevoOtpSecreto.bind(this)
		this.actualizarOtpCodigoActual = this.actualizarOtpCodigoActual.bind(this)
		this.verificarOtpCodigoActual = this.verificarOtpCodigoActual.bind(this)
		this.procesar = this.procesar.bind(this);
		this.procesarArchivo = this.procesarArchivo.bind(this);

		this.pegarEntrada = this.pegarEntrada.bind(this)
		this.copiarEntrada = this.copiarEntrada.bind(this)
		this.limpiarEntrada = this.limpiarEntrada.bind(this)
		this.copiarSalida = this.copiarSalida.bind(this)
		this.limpiarSalida = this.limpiarSalida.bind(this)

		this._cargado = false;

		this.otp_actual = new OtpDatos()
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

	tomaUI(){

		this.otp_secreto = this.querySelector('[modulo-elemento="otp-secreto"]')
		this.otp_uri = this.querySelector('[modulo-elemento="otp-uri"]')
		this.otp_qr = this.querySelector('[modulo-elemento="otp-qr"]')
		this.otp_codigo = this.querySelector('[modulo-elemento="otp-codigo"]')
		this.otp_nombre_organizacion = this.querySelector('[modulo-elemento="otp-nombre-organizacion"]')
		this.otp_nombre_app = this.querySelector('[modulo-elemento="otp-nombre-app"]')
		this.btn_otp_secreto_nuevo = this.querySelector('[modulo-elemento="btn-otp-secreto-nuevo"]')
		this.btn_otp_secreto_copiar = this.querySelector('[modulo-elemento="btn-otp-secreto-copiar"]')

		this.otp_codigo_verificar = this.querySelector('[modulo-elemento="otp-codigo-verificar"]')
		this.btn_otp_codigo_verificar = this.querySelector('[modulo-elemento="btn-otp-codigo-verificar"]')
		this.otp_codigo_verificar_resultado = this.querySelector('[modulo-elemento="otp-codigo-verificar-resultado"]')

		this.btn_otp_secreto_nuevo.onclick = this.nuevoOtpSecreto

		this.btn_otp_codigo_verificar.onclick = this.verificarOtpCodigoActual
		this.otp_codigo_verificar.onchange = this.verificarOtpCodigoActual

		this.nuevoOtpSecreto()

	}

	nuevoOtpSecreto(e){

		if(this.otp_actual_codigo_intervalor) clearInterval(this.otp_actual_codigo_intervalor)

		this.otp_actual = new OtpDatos()
		this.otp_actual.nombre_organizacion = this.otp_nombre_organizacion.value,
		this.otp_actual.nombre_app = this.otp_nombre_app.value

		this.otp_secreto.innerHTML = this.otp_actual.secreto
		this.otp_uri.innerHTML = this.otp_actual.uri

		this.otp_qr.innerHTML = ''
		const elqr = new QR({
			datos: this.otp_actual.uri
		})
		this.otp_qr.appendChild(elqr)

		this.otp_codigo.innerHTML = this.otp_actual.codigo


		this.otp_actual_codigo_intervalor = setInterval(this.actualizarOtpCodigoActual, this.otp_actual.intervalo * 1000)
	}

	actualizarOtpCodigoActual(e){
		this.otp_codigo.innerHTML = this.otp_actual.codigo
	}

	verificarOtpCodigoActual(e){
		this.otp_codigo_verificar_resultado.innerHTML = ''
		const codigo = this.otp_codigo_verificar.value

		if(!codigo) return

		if(this.otp_actual.verificarCodigo(codigo)) this.otp_codigo_verificar_resultado.innerHTML = this._('Código Válido!')
		else this.otp_codigo_verificar_resultado.innerHTML = this._('El código no es válido.')
	}

	procesar(){

		//this.testLib()

		if(!this.entrada.value){
			this.mensaje = this._('Sin datos que procesar.')
			return
		}

		this.mensaje = this._('Procesando...')
		this.mime_detectado.innerHTML = ''

		let INTERVAL	= 30;
		let DIGITS		= 6;

		let BASE32_SECRET = "JBSWY3DPEHPK3PXP";
		let SHA1_DIGEST = "SHA1";

		let SHA1_BITS = 160;

		let tdata = new TOTP(this.entrada.value, SHA1_BITS, encrypt_sha1, SHA1_DIGEST, DIGITS, INTERVAL)

		let name1 = "Empresa";
		let whatever1 = "Aplicación";

		let uri1 = OTPURI.build_uri(tdata, name1, whatever1, 0);

		console.log('OTP URI', uri1)

		let codigo1 = tdata.now();
		console.log("TOTP codigo1: `" + codigo1 + "`");
		// totp.at
		let codigo2 = tdata.at(1, 0);
		console.log("TOTP codigo2: `" + codigo2 + "`");

		let valido1 = tdata.verify(codigo1, parseInt(new Date().getTime() / 1000), 1)
		console.log('valido1', valido1)

		let valido2 = tdata.verify(codigo2, parseInt(new Date().getTime()), 1)
		console.log('valido2', valido2)

		this.salida.value = ''
	}


	procesarArchivo(e){

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
    	this.mensaje = this._('Pegado.')
     	this.codificar_entrada.value = datos
    })
    .catch(er => {
   		console.error(er)
      this.mensaje = this._('No se pudo pegar.')
    })

  }

  copiarEntrada(e){
 		if(!this.codificar_entrada.value) return

  	navigator.clipboard.writeText(this.codificar_entrada.value)
   	.then(() => {
   		this.mensaje = this._('Copiado.')
    })
    .catch(er => {
  		console.error(er)
     	this.mensaje = this._('No se pudo copiar.')
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
    	this.mensaje = this._('Copiado.')
    })
    .catch(er => {
   		console.error(er)
      this.mensaje = this._('No se pudo copiar.')
    })
  }

	limpiarSalida(e) {
		this.codificar_salida.value = ''
		this.mensaje = ''
	}


	descargar() { }

	testLib(){
		////////////////////////////////////////////////////////////////
			// Initialization Stuff                                       //
			////////////////////////////////////////////////////////////////

			let INTERVAL	= 30;
			let DIGITS		= 6;

			let BASE32_SECRET = "JBSWY3DPEHPK3PXP";
			let SHA1_DIGEST = "SHA1";

			let SHA1_BITS = 160;

			let tdata = new TOTP(BASE32_SECRET, SHA1_BITS, encrypt_sha1, SHA1_DIGEST, DIGITS, INTERVAL);
			let hdata = new HOTP(BASE32_SECRET, SHA1_BITS, encrypt_sha1, SHA1_DIGEST, DIGITS);

			console.log("\\\\ totp tdata \\\\");
			console.log("tdata.digits: `" + tdata.digits + "`");
			console.log("tdata.interval: `" + tdata.interval + "`");
			console.log("tdata.bits: `" + tdata.bits + "`");
			console.log("tdata.method: `" + tdata.method + "`");
			console.log("tdata.digest: `" + tdata.digest + "`");
			console.log("tdata.base32_secret: `" + tdata.base32_secret + "`");
			console.log("// totp tdata //\n");

			console.log("\\\\ hotp hdata \\\\");
			console.log("hdata.digits: `" + hdata.digits + "`");
			console.log("hdata.bits: `" + hdata.bits + "`");
			console.log("hdata.method: `" + hdata.method + "`");
			console.log("hdata.digest: `" + hdata.digest + "`");
			console.log("hdata.base32_secret: `" + hdata.base32_secret + "`");
			console.log("// hotp hdata //\n");

			console.log("Current Time: `" + parseInt(new Date().getTime()/1000) + "`");


			////////////////////////////////////////////////////////////////
			// URI Example                                                //
			////////////////////////////////////////////////////////////////

			let name1 = "name1";
			let name2 = "name2";
			let whatever1 = "account@whatever1.com";
			let whatever2 = "account@whatever2.com";

			// show example of URIs

			// totp uri
			let uri1 = OTPURI.build_uri(tdata, name1, whatever1, 0);

			// hotp uri
			let counter = 52;
			let uri2 = OTPURI.build_uri(hdata, name2, whatever2, counter);


			console.log("TOTP URI 1: `" + uri1 + "`\n");
			console.log("HOTP URI 2: `" + uri2 + "`\n");


			////////////////////////////////////////////////////////////////
			// BASE32 Stuff                                               //
			////////////////////////////////////////////////////////////////

			// Already seeded the random generator and popped the first result

			let BASE32_LEN = 16;

			let base32_new_secret = tdata.random_base32(BASE32_LEN, OTP_DEFAULT_BASE32_CHARS);
			console.log("Generated BASE32 Secret: `" + base32_new_secret + "`");

			console.log(""); // line break for readability


			////////////////////////////////////////////////////////////////
			// TOTP Stuff                                                 //
			////////////////////////////////////////////////////////////////

			// Get TOTP for a time block
			//   1. Generate and load totp key into buffer
			//   2. Check for error

			// totp.now
			let totp_err_1 = tdata.now();
			console.log("TOTP Generated: `" + totp_err_1 + "`");

			// totp.at
			let totp_err_2 = tdata.at(1, 0);
			console.log("TOTP Generated: `" + totp_err_2 + "`");


			// Do a verification for a hardcoded code
			// Won't succeed, this code is for a timeblock far into the past
			let tv1 = tdata.verify(576203, parseInt(new Date().getTime()/1000), 4);

			// Will succeed, timeblock 0 for JBSWY3DPEHPK3PXP == 282760
			let tv2 = tdata.verify(282760, 0, 4);
			console.log("TOTP Verification 1: `" + tv1 + "`");
			console.log("TOTP Verification 2: `" + tv2 + "`");

			console.log(""); // line break for readability


			////////////////////////////////////////////////////////////////
			// HOTP Stuff                                                 //
			////////////////////////////////////////////////////////////////

			// Get HOTP for token 1
			//   1. Generate and load hotp key into buffer
			//   2. Check for error

			let hotp_err_1 = hdata.at(1);
			console.log("HOTP Generated at 1: `" + hotp_err_1 + "`");

			// Do a verification for a hardcoded code
			// Will succeed, 1 for JBSWY3DPEHPK3PXP == 996554
			let hv = hdata.verify(996554, 1);
			console.log("HOTP Verification 1: `" + hv + "`");

	}

}

customElements.define("ui-codigos-otp", CodigosOtp);
