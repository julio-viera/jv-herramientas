import { Modulo } from "../../Modulo.js";

export default class UnirLineas extends Modulo {
	constructor() {
		super({ usar_transicion: true, usar_mensaje: true });

		this._mod_id = 'unir-lineas'
		this._mod_nombre = this._("Unir Lineas");

		this.cargar = this.cargar.bind(this);
		this.descargar = this.descargar.bind(this);
		this.tomaUI = this.tomaUI.bind(this)
		this.procesar = this.procesar.bind(this);

		this.pegarEntrada = this.pegarEntrada.bind(this)
		this.limpiarEntrada = this.limpiarEntrada.bind(this)
		this.copiarSalida = this.copiarSalida.bind(this)
		this.limpiarSalida = this.limpiarSalida.bind(this)
		this.copiarFiltradas = this.copiarFiltradas.bind(this)
		this.limpiarFiltradas = this.limpiarFiltradas.bind(this)

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

	cargar(app_config) {
		if (this._cargado) return

		super.cargar(app_config)

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
		this.link_descarga = this.querySelector('[modulo-elemento="link-descarga"]')
		this.cantidad_no_validos = this.querySelector('[modulo-elemento="cantidad_no_validos"]')
		this.salida_no_validos = this.querySelector('[modulo-elemento="salida_no_validos"]')
		this.link_descarga_filtrados = this.querySelector('[modulo-elemento="link-descarga-filtrados"]')


		this.btn_entrada_pegar = this.querySelector('[modulo-elemento="btn-entrada-pegar"]')
		this.btn_entrada_limpiar = this.querySelector('[modulo-elemento="btn-entrada-limpiar"]')

		this.btn_salida_copiar = this.querySelector('[modulo-elemento="btn-salida-copiar"]')
		this.btn_salida_limpiar = this.querySelector('[modulo-elemento="btn-salida-limpiar"]')

		this.btn_filtradas_copiar = this.querySelector('[modulo-elemento="btn-filtradas-copiar"]')
		this.btn_filtradas_limpiar = this.querySelector('[modulo-elemento="btn-filtradas-limpiar"]')

		this.btn_procesar.onclick = this.procesar

		this.btn_entrada_pegar.onclick = this.pegarEntrada
		this.btn_entrada_limpiar.onclick = this.limpiarEntrada

		this.btn_salida_copiar.onclick = this.copiarSalida
		this.btn_salida_limpiar.onclick = this.limpiarSalida

		this.btn_filtradas_copiar.onclick = this.copiarFiltradas
		this.btn_filtradas_limpiar.onclick = this.limpiarFiltradas

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
    this.salida.value = ''
    this.salida_no_validos.value = ''


    this.link_descarga.style.display = 'none'
    this.link_descarga.setAttribute('href', '')

    this.link_descarga_filtrados.style.display = 'none'
    this.link_descarga_filtrados.setAttribute('href', '')

    const separador = this.separador.value

    const entrada = this.entrada.value.trim()

    if(!entrada)
    {
  		this.mensaje = this._('Sin datos que procesar.')
      return
    }

    const verf_tmp = this.verificador.value.trim()
    let verificador = null

    if(verf_tmp) verificador = new RegExp(verf_tmp)

    const separador_linea = "\n"
    const items = entrada.split(separador_linea)
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

    const resultado = items_validos.join(separador)

    this.salida.value = resultado
    this.cantidad.innerHTML = this._('Cantidad de elementos:') + items_validos.length

    const blob = new Blob([resultado], { type: 'text/plain;charset=utf-8,' })
    this.link_descarga.setAttribute('href', URL.createObjectURL(blob))
    this.link_descarga.setAttribute('download', 'lineas_unidas.txt')
    this.link_descarga.style.display = 'block'


    const resultado_no_validos = items_no_validos.join(separador_linea)

    this.salida_no_validos.value = resultado_no_validos
    this.cantidad_no_validos.innerHTML = this._('Cantidad de elementos:') + items_no_validos.length

    if(items_no_validos.length > 0){
	    const blob = new Blob([resultado_no_validos], { type: 'text/plain;charset=utf-8,' })
	    this.link_descarga_filtrados.setAttribute('href', URL.createObjectURL(blob))
	    this.link_descarga_filtrados.setAttribute('download', 'lineas_filtradas.txt')
	    this.link_descarga_filtrados.style.display = 'block'
    }
	}


	pegarEntrada(e){
  	navigator.clipboard.readText()
    .then((datos) => {
    	this.mensaje = this._('Pegado')
     	this.entrada.value = datos
    })
    .catch(er => {
   		console.error(er)
      this.mensaje = this._('Imposible realizar la acción.')
    })

  }

	limpiarEntrada(e) {
		this.entrada.value = ''
		this.mensaje = ''
	}


	copiarSalida(e){

  	if(!this.salida.value) return

   	navigator.clipboard.writeText(this.salida.value)
    .then(() => {
    	this.mensaje = this._('Copiado')
    })
    .catch(er => {
   		console.error(er)
      this.mensaje = this._('Imposible realizar la acción.')
    })
  }

	limpiarSalida(e) {
		this.salida.value = ''
		this.mensaje = ''
	}

	copiarFiltradas(e){

  	if(!this.salida_no_validos.value) return

   	navigator.clipboard.writeText(this.salida_no_validos.value)
    .then(() => {
    	this.mensaje = this._('Copiado')
    })
    .catch(er => {
   		console.error(er)
      this.mensaje = this._('Imposible realizar la acción.')
    })
  }

	limpiarFiltradas(e) {
		this.salida_no_validos.value = ''
		this.mensaje = ''
	}

}

customElements.define("unir-lineas", UnirLineas);
