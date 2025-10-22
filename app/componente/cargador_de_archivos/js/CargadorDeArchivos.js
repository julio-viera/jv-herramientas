import { Componente } from "../../Componente.js"

export class CargadorDeArchivos extends Componente {
	constructor(props) {
		const p_ini = {...props, usar_mensaje: true}
		super(p_ini)

		this.construirUI = this.construirUI.bind(this)
		this.cargarArchivos = this.cargarArchivos.bind(this)
		this._cargarArchivo = this._cargarArchivo.bind(this)

		this._abierto = false;
		this._construido = false;
		this._cargando_archivo = false;
	}

	connectedCallback() {
		super.connectedCallback()

		this.construirUI(this.props)
	}

	disconnectedCallback() {
		super.disconnectedCallback()
	}

	construirUI(props){

		if(this._construido) return

		this.props = props ?? {}

		if(this.props.usar_mensajes == true || this.getAttribute('usar_mensajes') == 'true') this.props.usar_mensajes = true
		else this.props.usar_mensajes = false

		if(this.props.mostrar_vista_previa == true || this.getAttribute('mostrar_vista_previa') == 'true') this.props.mostrar_vista_previa = true
		else this.props.mostrar_vista_previa = false

		this.comp_etiqueta = ''
		if (this.props.etiqueta && this.props.etiqueta.trim() != '') this.comp_etiqueta = this.props.etiqueta.trim();
		else if (this.getAttribute('etiqueta')?.trim() != '') this.comp_etiqueta = this.getAttribute('etiqueta').trim()

		this.maximo_archivos = 0
		if (this.props.maximo_archivos && this.props.maximo_archivos.trim() != '') this.maximo_archivos = parseInt(this.props.maximo_archivos);
		else if (this.getAttribute('maximo_archivos')?.trim() != '') this.maximo_archivos = parseInt(this.getAttribute('maximo_archivos'))

		this.tipos_archivos = '*'
		if (this.props.tipos_archivos && this.props.tipos_archivos.trim() != '') this.tipos_archivos = this.props.tipos_archivos.trim();
		else if (this.getAttribute('tipos_archivos')?.trim() != '') this.tipos_archivos = this.getAttribute('tipos_archivos').trim()

		this.peso_maximo_archivos_mb = 0
		if (this.props.peso_maximo_archivos_mb && this.props.peso_maximo_archivos_mb.trim() != '') this.peso_maximo_archivos_mb = parseInt(this.props.peso_maximo_archivos_mb);
		else if (this.getAttribute('peso_maximo_archivos_mb')?.trim() != '') this.peso_maximo_archivos_mb = parseInt(this.getAttribute('peso_maximo_archivos_mb'))


		this._cont_vistas_previas = this.crear("div", { class: "cargador-de-archivos-cont-vistas-previas" }, '')
		this._mensaje_estado = this.crear("div", { class: "cargador-de-archivos-mensaje" }, '')
		this._etiqueta = this.crear("div", { class: "cargador-de-archivos-etiqueta" }, this.comp_etiqueta)
		this._file = this.crear("input", { class: "cargador-de-archivos-file", type: "file", accept: this.tipos_archivos });
		if (this.maximo_archivos > 1) this._file.setAttribute('multiple', true);
		this._file_visible = this.crear("div", { class: "cargador-de-archivos-file-visible" }, [this.crearDeCadena(this._iconos('ui').cargar), this._etiqueta]);

		if(!this.props.usar_mensajes) this._mensaje_estado.ocultar()
		if(!this.comp_etiqueta) this._etiqueta.ocultar()


		this._cont_mensaje = this.crear("div", {class: 'cargador-de-archivos-cont-mensaje'}, [this._mensaje_estado])
		this._cont_file = this.crear("div", {class: 'cargador-de-archivos-cont-file'}, [this._file, this._file_visible])

		this.append(this._cont_file, this._cont_mensaje, this._cont_vistas_previas)
		this._construido = true


		this._file.addEventListener('change', this.cargarArchivos);
	}

	get mensajeEstado() {
		return this._mensaje_estado.innerText
	}

	set mensajeEstado(m) {
		if (this._mensaje_estado) this._mensaje_estado.innerText = m
	}

	get archivos() {
		const ar = [];
		for (const vista of this._cont_vistas_previas.childNodes) ar.push(vista.archivo);
		return ar;
	}

	cargarArchivos(e){

		for(const arch of e.target.files){
			this._cargarArchivo(arch);
		}

	}

	_cargarArchivo(arch){
		this.mensajeEstado = '';

		if (this._cont_vistas_previas.childNodes.length >= this.maximo_archivos){
			this.mensajeEstado = this._('Cantidad máxima de archivos cargados: ' + this.maximo_archivos);
			return;
		}

		if(this.peso_maximo_archivos_mb){
			if(arch.size >= (this.peso_maximo_archivos_mb * 1024 * 1024)){
				this.mensajeEstado = this._('El archivo es muy grande.' + ' ' + arch.name);
				return;
			}
		}

		let vista = new VistaArchivo({
			usar_btn_quitar: true,
			mostrar_vista_previa: this.props.mostrar_vista_previa,
			etiqueta: arch.name,
			archivo: arch
		});

		this._cont_vistas_previas.appendChild(vista);

		vista.addEventListener('VistaArchivoQuitar', (e) => {
			for(const cargado of this._cont_vistas_previas.childNodes){
				if (cargado.id == e.vista_archivo.id) {
					cargado.remove();
				}
			}
		});

		const ev = new Event('CargadorDeArchivosCarga');
		ev.cargador_de_archivos = this;
		this.dispatchEvent(ev);
	}


}

customElements.define("ui-cargador-de-archivos", CargadorDeArchivos)

export class VistaArchivo extends Componente {
	constructor(props) {
		const p_ini = { ...props, usar_mensaje: true }
		super(p_ini)

		this.construirUI = this.construirUI.bind(this)
		this.quitar = this.quitar.bind(this)
		this.crearVistaPrevia = this.crearVistaPrevia.bind(this)
		this.ponerArchivo = this.ponerArchivo.bind(this)

		this._abierto = false;
		this._construido = false;
		this._cargando_archivo = false;
		this._archivo = null;
	}

	connectedCallback() {
		super.connectedCallback()

		this.construirUI(this.props)
	}

	disconnectedCallback() {
		super.disconnectedCallback()
	}

	construirUI(props){
		if(this._construido) return

		this.props = props ?? {}

		if(this.props.usar_btn_quitar == true || this.getAttribute('usar_btn_quitar') == 'true') this.props.usar_btn_quitar = true
		else this.props.usar_btn_quitar = false

		if(this.props.mostrar_vista_previa == true || this.getAttribute('mostrar_vista_previa') == 'true') this.props.mostrar_vista_previa = true
		else this.props.mostrar_vista_previa = false

		this.comp_etiqueta = ''
		if (this.props.etiqueta && this.props.etiqueta.trim() != '') this.comp_etiqueta = this.props.etiqueta.trim();
		else if (this.getAttribute('etiqueta')?.trim() != '') this.comp_etiqueta = this.getAttribute('etiqueta').trim()

		this._btn_quitar = this.crear("button", { class: "btn btn-cruz" }, 'X');
		this._etiqueta = this.crear("div", { class: "vista-archivo-etiqueta" }, this.comp_etiqueta)
		this._cabecera = this.crear("div", { class: "vista-archivo-cabecera" }, [this._etiqueta, this._btn_quitar])
		this._vista_previa = this.crear("div", { class: "vista-archivo-cont" })

		if(!this.props.usar_btn_quitar) this._btn_quitar.ocultar()
		if(!this.props.mostrar_vista_previa) this._vista_previa.ocultar()


		this.append(this._cabecera, this._vista_previa)
		this._construido = true
		this._btn_quitar.onclick = this.quitar;

		this._archivo = null
		if (this.props.archivo) {
			this._archivo = this.props.archivo;
			this.ponerArchivo(this.archivo);
		}

	}

	get archivo() {
		return this._archivo;
	}

	quitar(){
		const ev = new Event('VistaArchivoQuitar');
		ev.vista_archivo = this;
		this.dispatchEvent(ev);
	}

	ponerArchivo(archivo){
		this._archivo = archivo;

		this._vista_previa.innerHTML = '';
		if (this._archivo) this.crearVistaPrevia(this._archivo);
	}


	crearVistaPrevia(archivo){
		let mime_type = archivo.type;
		let vista_previa = null;

		if(/^image\/.+$/.test(mime_type)){
			vista_previa = this.crear('img', {id: this.id + 'vista-previa', class: 'vista-archivo-item'})
			vista_previa.src = URL.createObjectURL(archivo);
		}
		else if(mime_type == 'application/pdf'){
		 	vista_previa = this.crear('embed', {id: this.id + 'vista-previa', class: 'vista-archivo-item', type: 'application/pdf', frameBorder: "0", scrolling: "auto"})
			vista_previa.src = URL.createObjectURL(archivo);
		}
		else if(/^video\/.+$/.test(mime_type)){
			vista_previa = this.crear('video', {id: this.id + 'vista-previa', class: 'vista-archivo-item', controls: true})
			vista_previa.src = URL.createObjectURL(archivo);
		}
		else if(/^audio\/.+$/.test(mime_type)){
			vista_previa = this.crear('audio', {id: this.id + 'vista-previa', class: 'vista-archivo-item', controls: true})
			vista_previa.src = URL.createObjectURL(archivo);
		}
		else if(/^text\/.+$/.test(mime_type)){
			const reader = new FileReader();

			reader.onload = () => {
			 	const muestra = reader.result.substring(0, 330);

				vista_previa = this.crear('textarea', {id: this.id + 'vista-previa', class: 'vista-archivo-item', disabled: true})
				vista_previa.value = muestra

				this._vista_previa.appendChild(vista_previa)
				this._vista_previa.mostrar()
				return
			};
			reader.onerror = () => {
				console.error('No se pudo leer el archivo.');
				return
			};
			reader.readAsText(archivo);
		}

		if(vista_previa){
			this._vista_previa.appendChild(vista_previa)
			this._vista_previa.mostrar()
		}
		else{
			this._vista_previa.ocultar()
		}
  }
}

customElements.define("ui-vista-archivo", VistaArchivo)
