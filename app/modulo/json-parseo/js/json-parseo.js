import { Modulo } from "../../Modulo.js"


export default class JsonParseoModulo extends Modulo {
	constructor() {
		super({ usar_transicion: true, usar_mensaje: true })

		this._mod_id = 'json-parseo'
		this._mod_nombre = this._("Parseo JSON")

		this.cargar = this.cargar.bind(this)
		this.tomaUI = this.tomaUI.bind(this)
		this.procesar = this.procesar.bind(this)
		this.descargar = this.descargar.bind(this)

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
		this.entrada = this.querySelector('[modulo-elemento="entrada"]');

		this.salida_indentacion = this.querySelector('[modulo-elemento="salida-indentacion"]');
		this.salida_indentacion_cantidad = this.querySelector('[modulo-elemento="salida-indentacion-cantidad"]');
		this.salida_indentacion_tabuladores = this.querySelector('[modulo-elemento="salida-indentacion-tabuladores"]');

		this.salida = this.querySelector('[modulo-elemento="salida"]');

		this.entrada.addEventListener('AreaTextoCambio', this.procesar);
		this.salida_indentacion.onchange = this.procesar;
		this.salida_indentacion_tabuladores.onchange = this.procesar;

	}

	procesar(){

		this.salida_indentacion_cantidad.textContent = parseInt(this.salida_indentacion.value);

		if (!this.entrada.texto.trim()) return;

		let entrada = '';
		try{
			entrada = JSON.parse(this.entrada.texto);
		}
		catch(er){
			this.mensaje = this._('El JSON no es válido.') + ' ' + er;
			this.salida.texto = '';
			return;
		}

		let indentacion = parseInt(this.salida_indentacion.value);
		if (this.salida_indentacion_tabuladores.checked) indentacion = "\t";

		this.salida.texto = JSON.stringify(entrada, null, indentacion);
	}

	descargar() { }


}

customElements.define("ui-json-parseo", JsonParseoModulo)
