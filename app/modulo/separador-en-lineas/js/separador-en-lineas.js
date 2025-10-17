import { Modulo } from "../../Modulo.js";

export default class SeparadorEnLineas extends Modulo {
	constructor() {
		super({ usar_transicion: true, usar_mensaje: true });

		this._mod_id = 'separador-en-lineas'
		this._mod_nombre = this._("Separar en Líneas");

		this.cargar = this.cargar.bind(this);
		this.descargar = this.descargar.bind(this);
		this.tomaUI = this.tomaUI.bind(this)
		this.procesar = this.procesar.bind(this);

		this.expresiones = [
			{'codigo': 'letras', 'nombre': 'Letras', 'regexp': '^[a-zA-ZñáéíóúÑÁÉÍÓÚüÜ]+$'},
			{'codigo': 'numeros', 'nombre': 'Números', 'regexp': '^\\d+$'},
			{'codigo': 'cantidad-min-caracteres', 'nombre': 'Cantidad mínima de caracteres.', 'regexp': '^.{3,}'},
			{'codigo': 'cantidad-max-caracteres', 'nombre': 'Cantidad máxima de caracteres.', 'regexp': '^.{1,3}$'},

		]

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

		this.entrada = this.querySelector('[modulo-elemento="entrada"]')
		this.verificador = this.querySelector('[modulo-elemento="verificador"]')
		this.expresiones_regulares = this.querySelector('[modulo-elemento="expresiones-regulares"]')
		this.separador = this.querySelector('[modulo-elemento="separador"]')
		this.btn_procesar = this.querySelector('[modulo-elemento="btn-procesar"]')
		this.cantidad = this.querySelector('[modulo-elemento="cantidad"]')
		this.salida = this.querySelector('[modulo-elemento="salida"]')
		this.cantidad_no_validos = this.querySelector('[modulo-elemento="cantidad_no_validos"]')
		this.salida_no_validos = this.querySelector('[modulo-elemento="salida_no_validos"]')

		this.btn_procesar.onclick = this.procesar

		this.expresiones_regulares.innerHTML = '<option value="">-- ' + this._('Filtros de ejemplo.') + ' --</option>'
		for(const exp of this.expresiones){
			const op = document.createElement('option')
			op.value = exp.codigo
			op.text = this._(exp.nombre)

			this.expresiones_regulares.add(op)
		}

		this.expresiones_regulares.onchange = (e) => {
			for(const exp of this.expresiones){
				if(this.expresiones_regulares.value == exp.codigo){
					this.verificador.value = exp.regexp
					break
				}
			}
		}
	}

	procesar(){

		this.mensaje = ''
    this.cantidad.innerHTML = ''
    this.cantidad_no_validos.innerHTML = ''
    this.salida.texto = ''
    this.salida_no_validos.texto = ''

    const separador = this.separador.value.trim()

    if(!separador)
    {
      this.mensaje = this._('Debe asignar un separador.')
      return
    }

    const entrada = this.entrada.texto.trim()

    if(!entrada)
    {
  		this.mensaje = this._('Sin datos que procesar.')
      return
    }

    const verf_tmp = this.verificador.value.trim()
    let verificador = null

    if(verf_tmp) verificador = new RegExp(verf_tmp)

    const separador_linea = "\n"
    const items = entrada.split(separador)
    const items_validos = []
    const items_no_validos = []

    for(const l of items)
    {
        let i = l.trim()

        if(i == '') continue

        if(!verificador || verificador.test(i))
        {
         	items_validos.push(i)
        }
        else items_no_validos.push(i)

    }

    const resultado = items_validos.join(separador_linea)

    this.salida.texto = resultado
    this.cantidad.innerHTML = this._('Cantidad de elementos:') + items_validos.length

    const resultado_no_validos = items_no_validos.join(separador_linea)

    this.salida_no_validos.texto = resultado_no_validos
    this.cantidad_no_validos.innerHTML = this._('Cantidad de elementos:') + items_no_validos.length

	}

}

customElements.define("separador-en-lineas", SeparadorEnLineas);
