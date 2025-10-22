import { Componente } from "../../Componente.js"

export class VisorDoc extends Componente {
	constructor(props) {
		const p_ini = {...props, usar_mensaje: true}
		super(p_ini)

		this.abrir = this.abrir.bind(this)
		this.cerrar = this.cerrar.bind(this)
		this.construirUI = this.construirUI.bind(this)
		this.cambioTexto = this.cambioTexto.bind(this)
		this.copiarTexto = this.copiarTexto.bind(this)
		this.pegarTexto = this.pegarTexto.bind(this)
		this.limpiarTexto = this.limpiarTexto.bind(this)
		this.actualizarEstadisticas = this.actualizarEstadisticas.bind(this)
		this.ponerTamanioFuente = this.ponerTamanioFuente.bind(this)

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

		if(this.props.usar_btn_maximizar == true || this.getAttribute('btn_maximizar') == 'true') this.props.usar_btn_maximizar = true
		else this.props.usar_btn_maximizar = false

		if(this.props.usar_btn_copiar == true || this.getAttribute('btn_copiar') == 'true') this.props.usar_btn_copiar = true
		else this.props.usar_btn_copiar = false

		if(this.props.usar_btn_pegar == true || this.getAttribute('btn_pegar') == 'true') this.props.usar_btn_pegar = true
		else this.props.usar_btn_pegar = false

		if(this.props.usar_btn_limpiar == true || this.getAttribute('btn_limpiar') == 'true') this.props.usar_btn_limpiar = true
		else this.props.usar_btn_limpiar = false

		if(this.props.usar_btn_descargar == true || this.getAttribute('btn_descargar') == 'true') this.props.usar_btn_descargar = true
		else this.props.usar_btn_descargar = false

		this.archivo_descargar = 'texto'
		if(this.props.archivo_descargar && this.props.archivo_descargar.trim() != '') this.archivo_descargar = this.props.archivo_descargar.trim()
		else if(this.getAttribute('archivo_descargar')?.trim()) this.archivo_descargar = this.getAttribute('archivo_descargar').trim()

		if(this.props.usar_mensajes == true || this.getAttribute('usar_mensajes') == 'true') this.props.usar_mensajes = true
		else this.props.usar_mensajes = false

		if(this.props.mostrar_estadisticas == true || this.getAttribute('mostrar_estadisticas') == 'true') this.props.mostrar_estadisticas = true
		else this.props.mostrar_estadisticas = false

		if(this.props.usar_cambiar_tamanio_texto == true || this.getAttribute('usar_cambiar_tamanio_texto') == 'true') this.props.usar_cambiar_tamanio_texto = true
		else this.props.usar_cambiar_tamanio_texto = false

		this.doc_titulo = ''
		if(this.props.doc_titulo && this.props.doc_titulo.trim() != '') this.doc_titulo = this.props.doc_titulo.trim()
		else if(this.getAttribute('doc_titulo')?.trim()) this.doc_titulo = this.getAttribute('doc_titulo').trim()

		this.doc_descripcion = ''
		if(this.props.doc_descripcion && this.props.doc_descripcion.trim() != '') this.doc_descripcion = this.props.doc_descripcion.trim()
		else if(this.getAttribute('doc_descripcion')?.trim()) this.doc_descripcion = this.getAttribute('doc_descripcion').trim()

		if(this.props.colapsar_linea == true || this.getAttribute('colapsar_linea') == 'true') this.props.colapsar_linea = true
		else this.props.colapsar_linea = false


		this.btn_maximizar = this.crear("div", { class: "visordoc-btn", title: this._('Maximizar')}, this.crearDeCadena(this._iconos('ui').maximizar))
		this.btn_copiar_texto = this.crear("div", { class: "visordoc-btn", title: this._('Copiar')}, this.crearDeCadena(this._iconos('ui').copiar))
		this.btn_pegar_texto = this.crear("div", { class: "visordoc-btn", title: this._('Pegar')}, this.crearDeCadena(this._iconos('ui').pegar))
		this.btn_limpiar_texto = this.crear("div", { class: "visordoc-btn", title: this._('Limpiar')}, this.crearDeCadena(this._iconos('ui').limpiar))
		this.btn_descargar_texto = this.crear("a", { class: "visordoc-btn", title: this._('Descargar')}, this.crearDeCadena(this._iconos('ui').descargar))
		this.range_tamanio_texto = this.crear("input", { class: "range-vertical", type: "range", min: 0.5, max: 2.0, step: 0.1, value: 1.0})
		this._mensaje_estado = this.crear("div", { class: "visordoc-mensaje" }, '')
		this._estadisticas = this.crear("div", { class: "visordoc-estadisticas" }, '')
		this._doc_titulo = this.crear("div", { class: "visordoc-area-titulo" }, this.doc_titulo)
		this._doc_descripcion = this.crear("div", { class: "visordoc-area-descripcion" }, this.doc_descripcion)
		this.range_tamanio_texto.value = 1.0

		if(!this.props.usar_btn_maximizar) this.btn_maximizar.ocultar()
		if(!this.props.usar_btn_copiar) this.btn_copiar_texto.ocultar()
		if(!this.props.usar_btn_pegar) this.btn_pegar_texto.ocultar()
		if(!this.props.usar_btn_limpiar) this.btn_limpiar_texto.ocultar()
		if(!this.props.usar_btn_descargar) this.btn_descargar_texto.ocultar()
		if(!this.props.usar_mensajes) this._mensaje_estado.ocultar()
		if(!this.props.mostrar_estadisticas) this._estadisticas.ocultar()
		if(!this.doc_titulo) this._doc_titulo.ocultar()
		if(!this.doc_descripcion) this._doc_descripcion.ocultar()
		if(!this.props.usar_cambiar_tamanio_texto) this.range_tamanio_texto.ocultar()


		this._cont_cabecera = this.crear("div", {class: 'visordoc-cabecera'}, [this._doc_titulo, this._doc_descripcion])
		this._cont_botones = this.crear("div", {class: 'visordoc-cont-botones'}, [this.btn_maximizar, this.btn_copiar_texto, this.btn_pegar_texto, this.btn_limpiar_texto, this.btn_descargar_texto, this.range_tamanio_texto])
		this._cont_mensaje = this.crear("div", {class: 'visordoc-cont-mensaje'}, [this._mensaje_estado])
		this._cont_estadisticas = this.crear("div", {class: 'visordoc-cont-estadisticas'}, [this._estadisticas])
		this._doc = this.crear("div", {class: 'visordoc-doc', tabindex: 0})
		this._cont_doc = this.crear("div", {class: 'visordoc-cont'}, [this._doc])
		this._cont_contenido = this.crear("div", {class: 'visordoc-contenido'}, [this._cont_botones, this._cont_doc])

		this.append(this._cont_cabecera, this._cont_contenido, this._estadisticas, this._cont_mensaje)
		this._construido = true

		if(this.props.colapsar_linea) this._doc.agregarClase('visordoc-doc-colapsar-linea')

		this.btn_maximizar.onclick = (e) => {
			if (this.abierto) this.cerrar();
			else this.abrir();
		}
		this.addEventListener('BaseUIComponenteLightboxCerrar', (e) => {
			this._abierto = false
		})

		this.btn_copiar_texto.onclick = this.copiarTexto
		this.btn_pegar_texto.onclick = this.pegarTexto
		this.btn_limpiar_texto.onclick = this.limpiarTexto

		this._doc.addEventListener('change', this.cambioTexto);

		this._doc.addEventListener('keydown', (e) => {

			if(e.ctrlKey){
				if(e.code == 'KeyC' && this.props.usar_btn_copiar){
					this.copiarTexto()
				}
				else if(e.code == 'KeyV' && this.props.usar_btn_pegar){
					this.pegarTexto()
				}
			}
		});

		this.range_tamanio_texto.addEventListener('input', (e) => {
			this.ponerTamanioFuente(this.range_tamanio_texto.value)
		});

		let c_espacio = 0;
		if (this.props.mostrar_estadisticas) c_espacio++;
		if (this.props.usar_mensajes) c_espacio++;
		if (this.doc_titulo != '') c_espacio++;
		if (this.doc_descripcion != '') c_espacio++;

		if (c_espacio) this.agregarClase('visor_doc_espacio_' + c_espacio);

	}

	abrir(){
		this.abrirLightbox()
		this._abierto = true
	}
	cerrar(){
		this.cerrarLightbox()
		this._abierto = false
	}

	get texto() {
		return this._doc.innerText
	}
	set texto(t) {
		this._doc.innerText = t
		this._doc.dispatchEvent(new Event('change'))
	}

	get abierto() { return this._abierto }

	get mensajeEstado() {
		return this._mensaje_estado.innerText
	}

	set mensajeEstado(m) {
		if (this._mensaje_estado) this._mensaje_estado.innerText = m
	}

	cambioTexto(){

		this.mensajeEstado = ''

		const mime_type = 'text/plain'
		const data = this.texto
		const blob = new Blob([data], { type: mime_type })
		this.btn_descargar_texto.setAttribute('href', URL.createObjectURL(blob))
		this.btn_descargar_texto.setAttribute('download', this.archivo_descargar + '.txt')

		const ev = new Event('VisorDocCambio');
		ev.visordoc = this;
		this.dispatchEvent(ev);

		this.actualizarEstadisticas()
	}

	actualizarEstadisticas(){
		if(!this.props.mostrar_estadisticas) return

		const sin_espacios = this.texto.trim()
		if(sin_espacios == '') return

		const palabras = sin_espacios.split(/\s+/).length
		const lineas = this.texto.split(/\n/).length
		const caracteres = this.texto.length
		const encoder = new TextEncoder();
    const byteArray = encoder.encode(this.texto);
    const bytes = byteArray.length;
		const bk = bytes / 1024;
		const bm = bytes / 1024 / 1024;

		let est = this._('Cantidad de carácteres') + " " + caracteres + " | "
		est += this._('Cantidad de palabras') + " " + palabras + " | "
		est += this._('Cantidad de lineas') + " " + lineas + " | "
		est += this._('Peso') + " " + bk.toFixed(2) + "KB " + (bm > 1.0 ? bm.toFixed(4) + "MB" : '')

		this._estadisticas.innerHTML = est
	}

	ponerTamanioFuente(tamanio){
		this._cont_doc.style.fontSize = tamanio + 'em'
	}


	pegarTexto(){
  	navigator.clipboard.readText()
    .then((datos) => {
    	this.mensajeEstado = this._('Pegado');
     	this.texto = datos
    })
    .catch(er => {
   		console.error(er)
      this.mensajeEstado = this._('Imposible realizar la acción.')
    })

  }

  copiarTexto(){

   	var t = '';
		if (window.getSelection) {
	    t = window.getSelection().toString();
		} else if (document.getSelection) {
	    t = document.getSelection().toString();
		} else if (document.selection) {
	    t = document.selection.createRange().text;
		}

		if(!t) t = this.texto;

		if (!t) return;

  	navigator.clipboard.writeText(t)
   	.then(() => {
   		this.mensajeEstado = this._('Copiado');
    })
    .catch(er => {
  		console.error(er)
     	this.mensajeEstado = this._('Imposible realizar la acción.')
    })

  }

  limpiarTexto(){
		this.mensajeEstado = ''
  	this.texto = ''
 		const ev = new Event('VisorDocLimpio');
		ev.visordoc = this;
		this.dispatchEvent(ev);
  }
}

customElements.define("ui-visor-doc", VisorDoc)
