import { Modulo } from "../../Modulo.js"


export default class MimeTypesModulo extends Modulo {
	constructor() {
		super({ usar_transicion: true, usar_mensaje: true })

		this._mod_id = 'mime-types'
		this._mod_nombre = this._("MIME Types")

		this.cargar = this.cargar.bind(this)
		this.tomaUI = this.tomaUI.bind(this)
		this.descargar = this.descargar.bind(this)
		this.cargarMimes = this.cargarMimes.bind(this)
		this.dibujarMimes = this.dibujarMimes.bind(this)
		this.mostrarMimes = this.mostrarMimes.bind(this)
		this.filtrarMimes = this.filtrarMimes.bind(this)

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
	descargar() { }

	tomaUI(){

		this.cont_listado_mime_types = this.querySelector('[modulo-elemento="listar-mime-types"]')
		this.btn_filtro_todos = this.querySelector('[modulo-elemento="btn-mimes-todos"]')
		this.filtro_buscar = this.querySelector('[modulo-elemento="filtro-mime-type-buscar"]')
		this.filtro_video = this.querySelector('[modulo-elemento="filtro-mime-types-de-video"]')
		this.filtro_imagen = this.querySelector('[modulo-elemento="filtro-mime-types-de-imagen"]')
		this.filtro_sonido = this.querySelector('[modulo-elemento="filtro-mime-types-de-sonido"]')
		this.filtro_texto = this.querySelector('[modulo-elemento="filtro-mime-types-de-texto"]')

		this.btn_filtro_todos.onclick = this.mostrarMimes
		this.filtro_buscar.onchange = this.filtrarMimes
		this.filtro_video.onchange = this.filtrarMimes
		this.filtro_imagen.onchange = this.filtrarMimes
		this.filtro_sonido.onchange = this.filtrarMimes
		this.filtro_texto.onchange = this.filtrarMimes

		this.cargarMimes()
	}

	cargarMimes(){

		this.transicion = true
		fetch(this.ruta() + 'data/mime_types_min.json')
			.then(res => res.json())
			.then((json) => {
				if(json.mime_types) {
					this.mime_types = json.mime_types

					this.dibujarMimes()
				}
				else this.mensaje = this._('No disponible.')
			})
			.catch((er) => {
				console.error(er)
			})
			.finally(() => {
				this.transicion = false
			})

	}


	dibujarMimes(){

		this.cont_listado_mime_types.innerHTML = ''

		let i = 0;
		for(const m of this.mime_types){

			const nodo = new MimeTypeItem({mime_type: m.t, nombre: m.n, extension: m.e, listado_pos: i++})

			this.cont_listado_mime_types.appendChild(nodo)
		}

	}

	mostrarMimes(){

		this.filtro_buscar.value = ''
		this.filtro_video.checked = false
		this.filtro_texto.checked = false
		this.filtro_imagen.checked = false
		this.filtro_sonido.checked = false

		for (const nodo of this.cont_listado_mime_types.childNodes) {
			nodo.mostrar()
		}
	}

	filtrarMimes(){

		for(const nodo of this.cont_listado_mime_types.childNodes){
			if(
				(!this.filtro_buscar.value || nodo.buscar(this.filtro_buscar.value))
				&&
				(this.filtro_video.checked == false || nodo.esTipo('video'))
				&&
				(this.filtro_imagen.checked == false || nodo.esTipo('image'))
				&&
				(this.filtro_sonido.checked == false || nodo.esTipo('audio'))
				&&
				(this.filtro_texto.checked == false || nodo.esTipo('text'))
			) nodo.mostrar()
			else nodo.ocultar()

		}

	}
}

customElements.define("ui-mime-types-modulo", MimeTypesModulo)




class MimeTypeItem extends HTMLElement {
	constructor(props) {
		super()

		this.mostrar = this.mostrar.bind(this)
		this.ocultar = this.ocultar.bind(this)
		this.esTipo = this.esTipo.bind(this)
		this.buscar = this.buscar.bind(this)

		this.props = props ?? {}
		this._mime_type = this.props.mime_type ?? ''
		this._nombre = this.props.nombre ?? ''
		this._extension = this.props.extension ?? ''

		this.setAttribute('class', 'grilla-c3 pd-1' + (this.props.listado_pos % 2 == 0 ? ' par' : ' impar'))

		this.n_mime_type = document.createElement('div')
		this.n_nombre = document.createElement('div')
		this.n_extension = document.createElement('div')

		this.append(this.n_nombre, this.n_mime_type, this.n_extension)

		this.nombre = this._nombre
		this.mime_type = this._mime_type
		this.extension = this._extension

		this._modo_display = 'grid'
	}

	connectedCallback() {
	}

	disconnectedCallback() {
	}

	get mime_type() {
		return this._mime_type
	}
	set mime_type(m) {
		this._mime_type = m
		this.n_mime_type.innerHTML = m
	}
	get nombre() {
		return this._nombre
	}
	set nombre(m) {
		this._nombre = m
		this.n_nombre.innerHTML = m
	}
	get extension() {
		return this._extension
	}
	set extension(m) {
		this._extension = m
		this.n_extension.innerHTML = m
	}

	mostrar(modo = "") {
		if (!modo && this._modo_display && this._modo_display != "none") modo = this._modo_display
		else if (!modo) modo = "block"

		this.style.display = modo
	}
	ocultar() {
		this.style.display = "none"
	}

	esTipo(tipo){
		const exp = new RegExp('^' + tipo + '\/')
		return exp.test(this._mime_type)
	}

	buscar(busqueda){
		const exp = new RegExp(busqueda)
		return (exp.test(this._nombre) || exp.test(this._mime_type) || exp.test(this._extension))
	}

}

customElements.define("ui-mime-type-item", MimeTypeItem)
