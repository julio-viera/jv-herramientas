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

		this.pegar = this.pegar.bind(this)
		this.copiar = this.copiar.bind(this)
		this.limpiar = this.limpiar.bind(this)

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
		this.btn_entrada_pegar = this.querySelector('[modulo-elemento="btn-entrada-pegar"]');
		this.btn_entrada_copiar = this.querySelector('[modulo-elemento="btn-entrada-copiar"]');
		this.btn_entrada_limpiar = this.querySelector('[modulo-elemento="btn-entrada-limpiar"]');

		this.salida_indentacion = this.querySelector('[modulo-elemento="salida-indentacion"]');
		this.salida_indentacion_cantidad = this.querySelector('[modulo-elemento="salida-indentacion-cantidad"]');
		this.salida_indentacion_tabuladores = this.querySelector('[modulo-elemento="salida-indentacion-tabuladores"]');

		this.salida = this.querySelector('[modulo-elemento="salida"]');
		this.btn_salida_copiar = this.querySelector('[modulo-elemento="btn-salida-copiar"]');
		this.btn_salida_limpiar = this.querySelector('[modulo-elemento="btn-salida-limpiar"]');

		this.entrada.onchange = this.procesar;
		this.salida_indentacion.onchange = this.procesar;
		this.salida_indentacion_tabuladores.onchange = this.procesar;

		this.btn_entrada_pegar.onclick = () => { this.pegar(this.entrada) };
		this.btn_entrada_copiar.onclick = () => { this.copiar(this.entrada) };
		this.btn_entrada_limpiar.onclick = () => { this.limpiar(this.entrada) };

		this.btn_salida_copiar.onclick = () => { this.copiar(this.salida) };
		this.btn_salida_limpiar.onclick = () => { this.limpiar(this.salida) };
	}

	procesar(){

		this.salida_indentacion_cantidad.textContent = parseInt(this.salida_indentacion.value);

		if (!this.entrada.value.trim()) return;

		let entrada = '';
		try{
			entrada = JSON.parse(this.entrada.value);
		}
		catch(er){
			this.mensaje = this._('El JSON no es válido.') + ' ' + er;
			this.salida.value = '';
			return;
		}

		let indentacion = parseInt(this.salida_indentacion.value);
		if (this.salida_indentacion_tabuladores.checked) indentacion = "\t";

		this.salida.value = JSON.stringify(entrada, null, indentacion);
	}

	descargar() { }


	pegar(nodo){
  	navigator.clipboard.readText()
    .then((datos) => {
    	//this.mensaje = this._('Pegado');
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
   		//this.mensaje = this._('Copiado');
    })
    .catch(er => {
  		console.error(er)
     	this.mensaje = this._('Imposible realizar la acción.')
    })

  }
 	limpiar(nodo) {
		nodo.value = ''
		this.mensaje = ''
	}

}

customElements.define("ui-json-parseo", JsonParseoModulo)
