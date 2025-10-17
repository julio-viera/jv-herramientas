import { Componente } from "../../Componente.js"

export class AreaTexto extends Componente {
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
		this.actualizarResaltado = this.actualizarResaltado.bind(this)
		this.ponerTamanioFuente = this.ponerTamanioFuente.bind(this)
		this.cargarArchivo = this.cargarArchivo.bind(this)
		this.buscar = this.buscar.bind(this)

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

		this.area_titulo = ''
		if(this.props.area_titulo && this.props.area_titulo.trim() != '') this.area_titulo = this.props.area_titulo.trim()
		else if(this.getAttribute('area_titulo')?.trim()) this.area_titulo = this.getAttribute('area_titulo').trim()

		this.area_descripcion = ''
		if(this.props.area_descripcion && this.props.area_descripcion.trim() != '') this.area_descripcion = this.props.area_descripcion.trim()
		else if(this.getAttribute('area_descripcion')?.trim()) this.area_descripcion = this.getAttribute('area_descripcion').trim()

		if(this.props.usar_caja_busqueda == true || this.getAttribute('usar_caja_busqueda') == 'true') this.props.usar_caja_busqueda = true
		else this.props.usar_caja_busqueda = false


		this.btn_maximizar = this.crear("div", { class: "areatexto-btn", title: this._('Maximizar')}, this.crearDeCadena(this._iconos('ui').maximizar))
		this.btn_copiar_texto = this.crear("div", { class: "areatexto-btn", title: this._('Copiar')}, this.crearDeCadena(this._iconos('ui').copiar))
		this.btn_pegar_texto = this.crear("div", { class: "areatexto-btn", title: this._('Pegar')}, this.crearDeCadena(this._iconos('ui').pegar))
		this.btn_limpiar_texto = this.crear("div", { class: "areatexto-btn", title: this._('Limpiar')}, this.crearDeCadena(this._iconos('ui').limpiar))
		this.btn_descargar_texto = this.crear("a", { class: "areatexto-btn", title: this._('Descargar')}, this.crearDeCadena(this._iconos('ui').descargar))
		this.range_tamanio_texto = this.crear("input", { class: "range-vertical", type: "range", min: 0.5, max: 2.0, step: 0.1, value: 1.0})
		this._texto = this.crear("textarea", { class: 'areatexto-texto' })
		this._mensaje_estado = this.crear("div", { class: "areatexto-mensaje" }, '')
		this._estadisticas = this.crear("div", { class: "areatexto-estadisticas" }, '')
		this._area_titulo = this.crear("div", { class: "areatexto-area-titulo" }, this.area_titulo)
		this._area_descripcion = this.crear("div", { class: "areatexto-area-descripcion" }, this.area_descripcion)
		this.range_tamanio_texto.value = 1.0
		this.input_busqueda = this.crear("input", { class: "areatexto-inp-busqueda", type: "text", placeholder: '🔍'})

		if(!this.props.usar_btn_maximizar) this.btn_maximizar.ocultar()
		if(!this.props.usar_btn_copiar) this.btn_copiar_texto.ocultar()
		if(!this.props.usar_btn_pegar) this.btn_pegar_texto.ocultar()
		if(!this.props.usar_btn_limpiar) this.btn_limpiar_texto.ocultar()
		if(!this.props.usar_btn_descargar) this.btn_descargar_texto.ocultar()
		if(!this.props.usar_mensajes) this._mensaje_estado.ocultar()
		if(!this.props.mostrar_estadisticas) this._estadisticas.ocultar()
		if(!this.area_titulo) this._area_titulo.ocultar()
		if(!this.area_descripcion) this._area_descripcion.ocultar()
		if(!this.props.usar_cambiar_tamanio_texto) this.range_tamanio_texto.ocultar()


		this._cont_busqueda = this.crear("div", {class: 'areatexto-caja-busqueda'}, [this.input_busqueda])
		if(!this.props.usar_caja_busqueda) this._cont_busqueda.ocultar()


		this._cont_cabecera = this.crear("div", {class: 'areatexto-cabecera'}, [this._area_titulo, this._area_descripcion])
		this._cont_botones = this.crear("div", {class: 'areatexto-cont-botones'}, [this.btn_maximizar, this.btn_copiar_texto, this.btn_pegar_texto, this.btn_limpiar_texto, this.btn_descargar_texto, this.range_tamanio_texto])
		this._cont_mensaje = this.crear("div", {class: 'areatexto-cont-mensaje'}, [this._mensaje_estado])
		this._cont_estadisticas = this.crear("div", {class: 'areatexto-cont-estadisticas'}, [this._estadisticas])
		this._area_fondo_color = this.crear("div", {class: 'areatexto-fondo-color'})
		this._cont_conteo_lineas = this.crear("div", {class: 'areatexto-cont-conteo-lineas'}, ' ')
		this._cont_area = this.crear("div", {class: 'areatexto-cont-area'}, [this._cont_conteo_lineas, this._area_fondo_color, this._texto])
		this._cont_texto = this.crear("div", {class: 'areatexto-cont-texto'}, [this._cont_botones, this._cont_area])

		this.append(this._cont_cabecera, this._cont_texto, this._estadisticas, this._cont_mensaje)
		this._construido = true

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
		this._texto.addEventListener('input', this.cambioTexto)
		this._texto.addEventListener('change', this.cambioTexto)
		this._texto.addEventListener('scroll', (e) => {
			this._area_fondo_color.scrollTop = this._texto.scrollTop;
			this._cont_conteo_lineas.scrollTop = this._texto.scrollTop;
			let left = this._texto.scrollLeft
			if(left < 10) left = 0
			this._texto.scrollLeft = left;
			this._area_fondo_color.scrollLeft = left;
		})

		this._texto.addEventListener('dropover', (e) => {
			e.preventDefault();
		})

		this._texto.addEventListener('drop', (e) => {
			e.preventDefault();

			const archivos = e.dataTransfer.files;

      if (archivos.length > 0) {
      	this.cargarArchivo(archivos[0])
      }
		})

		const resizeObserver = new ResizeObserver((entries) => {
		  for (const entry of entries) {
					const espacio = entry.target.getBoundingClientRect()
					this._area_fondo_color.style.width = espacio.width + 'px'
					this._area_fondo_color.style.height = espacio.height + 'px'
		  }
		});
		resizeObserver.observe(this._texto);

		this.range_tamanio_texto.addEventListener('input', (e) => {
			this.ponerTamanioFuente(this.range_tamanio_texto.value)
		});

		this.input_busqueda.addEventListener('keydown', (e) => {
			if (e.keyCode == 13 || e.which == 13) {
				const tx = this.input_busqueda.value.trim();
				if (tx == '') return;
				this.buscar(tx);
			}
		});

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
		return this._texto.value
	}
	set texto(t) {
		this._texto.value = t
		this._texto.dispatchEvent(new Event('change'))
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
		const data = this._texto.value
		const blob = new Blob([data], { type: mime_type })
		this.btn_descargar_texto.setAttribute('href', URL.createObjectURL(blob))
		this.btn_descargar_texto.setAttribute('download', this.archivo_descargar + '.txt')

		const ev = new Event('AreaTextoCambio');
		ev.areatexto = this;
		this.dispatchEvent(ev);

		this.actualizarEstadisticas()
		this.actualizarResaltado()
	}

	actualizarEstadisticas(){
		if(!this.props.mostrar_estadisticas) return

		const sin_espacios = this._texto.value.trim()
		if(sin_espacios == '') return

		const palabras = sin_espacios.split(/\s+/).length
		const lineas = this._texto.value.split(/\n/).length
		const caracteres = this._texto.value.length
		const encoder = new TextEncoder();
    const byteArray = encoder.encode(this._texto.value);
    const bytes = byteArray.length;
		const bk = bytes / 1024;
		const bm = bytes / 1024 / 1024;

		let est = this._('Cantidad de carácteres') + " " + caracteres + " | "
		est += this._('Cantidad de palabras') + " " + palabras + " | "
		est += this._('Cantidad de lineas') + " " + lineas + " | "
		est += this._('Peso') + " " + bk.toFixed(2) + "KB " + (bm > 1.0 ? bm.toFixed(4) + "MB" : '')

		this._estadisticas.innerHTML = est
	}

	actualizarResaltado(){
		const lines = this._texto.value.split('\n');
		let todo = '';
		let contador = 0;
		let max_largo = 0;

		lines.forEach((texto, index) => {
			if(texto.length > max_largo) max_largo = texto.length
		})

		max_largo *= 2;

		this._area_fondo_color.innerHTML = '';
		this._cont_conteo_lineas.innerHTML = '';

		const todos = []
		const conteo_lineas = []
		lines.forEach((texto, index) => {
		  let clase = 'impar';
			contador++;
		  if (contador % 2 == 0) {
		    clase = 'par';
		  }

			texto = texto.padEnd(max_largo, " ");

			const nodo = document.createElement('span')
			nodo.setAttribute('class', "areatexto-fondo-color-linea areatexto-fondo-color-linea-" + clase)
			nodo.innerText = texto
			todos.push(nodo)
			todos.push(document.createElement('br'))

			const clinea = document.createElement('span')
			clinea.setAttribute('class', "areatexto-fondo-color-numero-linea areatexto-fondo-color-numero-linea-" + clase)
			clinea.innerText = contador
			conteo_lineas.push(clinea)
			conteo_lineas.push(document.createElement('br'))

		});

		this._area_fondo_color.append(...todos)
		this._cont_conteo_lineas.append(...conteo_lineas)
	}

	ponerTamanioFuente(tamanio){
		this._cont_area.style.fontSize = tamanio + 'em'
	}

	buscar(texto){
		console.log('busca: ', texto)
	}

	cargarArchivo(arch){

		if(!arch || this._cargando_archivo) return

		const reg = new RegExp("^(image|video|audio)");
		if(reg.test(arch.type)){
			this.mensajeEstado = this._('Tipo de archivo no soportado.')
			return
		}

		if(arch.size >= 67108864){  // 64MB
			this.mensajeEstado = this._('El archivo es muy grande.')
			return
		}

		const reader = new FileReader();

		this.mensajeEstado = this._('Cargando');
		this._cargando_archivo = true;
		reader.onload = () => {
			this._cargando_archivo = false;
		 	this._texto.value = reader.result;
			this._texto.dispatchEvent(new Event('change'))
		};
		reader.onerror = () => {
			this._cargando_archivo = false;
			this.mensajeEstado = this._('No se pudo leer el archivo.');
			return
		};
		reader.readAsText(arch);
	}

	pegarTexto(){
  	navigator.clipboard.readText()
    .then((datos) => {
    	this.mensajeEstado = this._('Pegado');
     	this._texto.value = datos
      this._texto.dispatchEvent(new Event('change'))
    })
    .catch(er => {
   		console.error(er)
      this.mensajeEstado = this._('Imposible realizar la acción.')
    })

  }

  copiarTexto(){
 		if(!this._texto.value) return

  	navigator.clipboard.writeText(this._texto.value)
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
  	this._texto.value = ''
		this._area_fondo_color.innerHTML = ''
		this._cont_conteo_lineas.innerHTML = ''
		const ev = new Event('AreaTextoLimpio');
		ev.visordoc = this;
		this.dispatchEvent(ev);
  }
}

customElements.define("ui-area-texto", AreaTexto)
