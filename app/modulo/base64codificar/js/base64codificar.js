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

		this.codificar_btn_procesar = this.querySelector('[modulo-elemento="codificar-btn-procesar"]')
		this.codificar_salida = this.querySelector('[modulo-elemento="codificar-salida"]')

		this.codificar_imp_archivo = this.querySelector('[modulo-elemento="codificar-imp-archivo"]')

		this.codificar_entrada.addEventListener('AreaTextoCambio', this.codificar)
		this.codificar_btn_procesar.onclick = this.codificar
		this.codificar_imp_archivo.addEventListener('CargadorDeArchivosCarga', this.codificarArchivo);

	}

	codificar(){

		this.mensaje = ''
		if(!this.codificar_entrada.texto){
			return
		}

		this.mensaje = this._('Procesando')

		setTimeout(this.codifireal, 100)
	}

	codifireal(){
		try{
			this.codificar_salida.texto = btoa(this.codificar_entrada.texto)
			this.mensaje = ''
		}
		catch(er){
			console.error(er)
			this.mensaje = this._('Imposible realizar la acción.')
		}
	}


	codificarArchivo(e){

		const arch = this.codificar_imp_archivo.archivos[0]
		if(!arch) return

		this.codificar_entrada.texto = ''
		this.codificar_salida.texto = ''
		let reader = new FileReader();
    reader.onload = (e) => {
    	const data =  String(e.target.result).split(",")[1]
    	this.codificar_salida.texto = data
    };
    reader.readAsDataURL(arch);

	}

}

customElements.define("base-64-codificar", Base64Codificar);
