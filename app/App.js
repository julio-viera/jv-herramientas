/*
*    @author     Julio Viera 2023
*/
import { Util } from "./Util.js"
import { Conector } from "./Conector.js"
import { AlmacenajeLocal } from "./AlmacenajeLocal.js"
import { MenuUI } from "./componente/menu/js/MenuUI.js"
import { MensajeUI } from "./componente/mensaje/js/MensajeUI.js"
import { PanelAyuda } from "./componente/panel_ayuda/js/PanelAyuda.js"
import { PopUp } from "./componente/popup/js/PopUp.js"
import { PantallaCarga } from "./componente/pantalla_carga/js/PantallaCarga.js"
import { PantallaSinContenido } from "./componente/pantalla_sin_contenido/js/PantallaSinContenido.js"
import { AreaTexto } from "./componente/areatexto/js/AreaTexto.js"
import { VisorDoc } from "./componente/visor_doc/js/VisorDoc.js"

window.addEventListener("load", () => {
	window.App = new App()
})

export class Organizacion {
	nombre = ""
	logo = ""
	uuid = ""
}

export class Usuario {
	token = ""
	uuid = ""
	nombre = ""
	avatar = ""
	organizacion = null
	permisos = {}
}

export class App {
	static _instancia

	constructor() {
		if (App._instancia) return App._instancia

		this.modulos_map = {}
		this.modulo_actual = null
		this.configuracion = {}
		this.almacenaje = new AlmacenajeLocal()

		this.cargar = this.cargar.bind(this)
		this.comprobarCarga = this.comprobarCarga.bind(this)
		this.navegarHash = this.navegarHash.bind(this)
		this.comprobarCierre = this.comprobarCierre.bind(this)
		this.cargarModulo = this.cargarModulo.bind(this)
		this.presentarModulo = this.presentarModulo.bind(this)
		this.cargarIconos = this.cargarIconos.bind(this)
		this.cargarIdioma = this.cargarIdioma.bind(this)
		this.cargarMenu = this.cargarMenu.bind(this)
		this.iniciarUsuario = this.iniciarUsuario.bind(this)
		this.salir = this.salir.bind(this)
		this.presentarUsuario = this.presentarUsuario.bind(this)
		this.comprobarMensaje = this.comprobarMensaje.bind(this)
		this.infoApp = this.infoApp.bind(this)

		this.main = document.getElementsByTagName("main")[0]
		this.contenido = this.main.querySelector("#contenido")
		this.contenido_transicion = this.contenido.querySelector("#contenido-transicion")
		this.contenido_modulo_no_existe = new PantallaSinContenido()

		this.contenido.appendChild(this.contenido_modulo_no_existe)

		for(const nodo of document.querySelectorAll('[app_info]')){
			nodo.onclick = this.infoApp
		}

		this.pantalla_carga = new PantallaCarga()
		this.main.appendChild(this.pantalla_carga)
		this.pantalla_carga.mensaje = this._("Cargando")
		this.pantalla_carga.porcentaje_carga = 0

		this.ui_msj = new MensajeUI()
		this.main.appendChild(this.ui_msj)

		this.ui_ayuda = new PanelAyuda()
		this.main.appendChild(this.ui_ayuda)
		this.btn_ayuda = document.getElementById("btn-ayuda")
		if (this.btn_ayuda) {
			this.btn_ayuda.onclick = (e) => {

				if(this.ui_ayuda.abierto){
					this.ui_ayuda.cerrar()
					return
				}

				if (this.modulo_actual) {
					this.ui_ayuda.cargar(this.modulo_actual.rutaAyuda())
				}
			}
		}

		this.caja_menu = document.getElementById("caja-menu")
		this.menu = new MenuUI()
		this.caja_menu.appendChild(this.menu)

		this.btn_menu_mobile = document.getElementById("btn-menu-mobile")
		if (this.btn_menu_mobile) {
			this.btn_menu_mobile.onclick = (e) => {
				this.btn_menu_mobile.classList.toggle("desplegado")
				this.caja_menu.classList.toggle("abierto")
			}
		}

		this.app_configuracion = document.getElementsByTagName('app-configuracion')[0]
		this.btn_configuracion = document.getElementById('btn-menu-configuracion')
		if(this.btn_configuracion && this.app_configuracion){
			this.btn_configuracion.onclick = (e) => {
				this.app_configuracion.abrir()
			}
		}

		this.conector = new Conector({ ruta_base: '' })
		this.token = this.almacenaje.obtener("access-token")
		this.usuario = null

		if (this.token) {
			this.conector.agregarCabecera('Authorization', "Bearer " + this.token)
		}

		window.addEventListener("hashchange", this.navegarHash)
		window.addEventListener("beforeunload", this.comprobarCierre)

		this.estado_carga = {
			configuracion: false,
			idioma: false,
			icono: false,
			menu: false,
		}
		//setTimeout(this.cargar, 10)

		App._instancia = this

		this.pantalla_carga.mensaje = this._("Cargando configuración") + "..."
		this.pantalla_carga.porcentaje_carga = 10

		this.app_configuracion.addEventListener('AppConfiguracionCargada', this.cargar)
		this.app_configuracion.addEventListener('AppConfiguracionErrorCarga', (e) => {
			this.mensaje = this._('Error al cargar la configuración.')
			this.pantalla_carga.mensaje = this._('Error al cargar la configuración.')
		})
		this.app_configuracion.cargar()
	}

	cargar() {

		this.estado_carga.configuracion = true

		this.configuracion = this.app_configuracion.configuracion

		for(const app_nombre of this.main.querySelectorAll('[app_nombre]')){
			app_nombre.innerHTML = this.configuracion.app.nombre
		}
		for(const app_version of this.main.querySelectorAll('[app_version]')){
			app_version.innerHTML = this.configuracion.app.version
		}

		this.contenido_modulo_no_existe.idioma = this.configuracion.ui.idioma

		this.pantalla_carga.titulo = this.configuracion.app.nombre
		this.pantalla_carga.logo = this.configuracion.app.logos.mediano
		this.pantalla_carga.porcentaje_carga = 12

		for(const app_logo of this.main.querySelectorAll('[app_logo_chico]')){
			app_logo.onload = (e) => {
				e.target.style.display = 'block'
			}
			app_logo.src = this.configuracion.app.logos.chico
		}

		for(const app_logo of this.main.querySelectorAll('[app_logo_mediano]')){
			app_logo.onload = (e) => {
				e.target.style.display = 'block'
			}
			app_logo.src = this.configuracion.app.logos.mediano
		}

		for(const app_logo of this.main.querySelectorAll('[app_logo_grande]')){
			app_logo.onload = (e) => {
				e.target.style.display = 'block'
			}
			app_logo.src = this.configuracion.app.logos.grande
		}

		this.cargarIconos()
		this._carga_timeout_id = setTimeout(this.comprobarCarga, 10)
	}
	comprobarCarga() {
		let cargado = true
		for (const estado in this.estado_carga) {
			if (!this.estado_carga[estado]) {
				cargado = false
				break
			}
		}

		if (cargado) {

			if(this._carga_timeout_id){
				clearTimeout(this._carga_timeout_id)
				this._carga_timeout_id = null
			}

			this.navegarHash()
			this.pantalla_carga.mensaje = this._("Carga completada.")
			this.pantalla_carga.porcentaje_carga = 100
			this.pantalla_carga.ocultar()
		}
		else {
			this._carga_timeout_id = setTimeout(this.comprobarCarga, 10)
		}
	}

	navegarHash(e) {
		let hash = window.location.hash.replace("#", "")

		if (!hash) hash = "inicio"

		if (this.modulo_id != hash) {

			if (!this.comprobarCierre()) {
				window.location.hash = this.modulo_id
				return
			}

			this.modulo_id = hash
			if(this.ui_ayuda) this.ui_ayuda.cerrar()

			this.btn_menu_mobile.classList.remove("desplegado")
			this.caja_menu.classList.remove("abierto")

			if (this.modulos_map[this.modulo_id]) this.presentarModulo(this.modulo_id)
			else this.cargarModulo(this.modulo_id)
		}
	}

	comprobarCierre(e) {
		if (this.modulo_actual && this.modulo_actual.hayCambios()) {
			if (e) {
				e.preventDefault()
				return false
			}
			else return confirm(this._('Hay cambios pendientes. ¿Seguro que desea continuar?'))
		}
		return true
	}

	descargarModuloActual() {
		if (!this.modulo_actual) return

		if (this.modulo_actual.descargar) {
			this.modulo_actual.descargar()
			this.modulo_actual.remove()
		}
	}

	cargarModulo(modulo_id) {

		Util.mostrar(this.contenido_transicion, "flex")
		this.contenido_modulo_no_existe.ocultar()

		import('../' + this.configuracion.ruta.modulo + "/" + modulo_id + "/js/" + modulo_id + ".js")
			.then((res) => {
				this.modulos_map[modulo_id] = new res.default()
				this.presentarModulo(modulo_id)
			})
			.catch((er) => {
				console.error(er)
				this.descargarModuloActual()
				this.contenido_modulo_no_existe.mostrar()
			})
			.finally(() => {
				Util.ocultar(this.contenido_transicion)
			})
	}

	presentarModulo(modulo_id) {

		this.descargarModuloActual()

		Util.mostrar(this.contenido_transicion, "flex")
		this.contenido_modulo_no_existe.ocultar()

		if (this.modulos_map[modulo_id]) {
			this.modulo_actual = this.modulos_map[modulo_id]
			this.contenido.appendChild(this.modulo_actual)
			const opciones = {
				conector: this.conector,
				app_ref: this
			}
			this.modulo_actual.cargar(this.configuracion, opciones)

			document.title = this.modulo_actual.moduloNombre() + ' - ' + this.configuracion.app.nombre

			Util.ocultar(this.contenido_transicion)

			this.caja_menu.classList.remove("abierto")
			this.mensaje = ''
		} else {
			this.mensaje = this._("No existe el recurso.")
			this.contenido_modulo_no_existe.mostrar()
		}
	}

	cargarIconos() {

		this.pantalla_carga.mensaje = this._("Cargando Iconos") + "..."
		this.pantalla_carga.porcentaje_carga = 40

		fetch(this.configuracion.ruta.icono)
			.then(res => res.json())
			.then((res) => {
				if (res.ui) {
					window.ui_iconos = res
					this.icono = res
					this.estado_carga.icono = true

					this.cargarIdioma(this.configuracion.ui.idioma)
				} else {
					this.mensaje = this._('No se puede cargar:') + " Iconos."
				}
			})
			.catch((er) => {
				console.error(er)
				this.mensaje = this._('No se puede cargar:') + " Iconos."
			})
	}

	cargarIdioma(idioma) {

		this.pantalla_carga.mensaje = this._("Cargando idioma") + "..."
		this.pantalla_carga.porcentaje_carga = 50

		import('../' + this.configuracion.ruta.localizacion + "/textos/" + idioma + ".js")
			.then((res) => {
				if (res.ui_idioma) {
					window.ui_idioma = res.ui_idioma
					this.estado_carga.idioma = true

					this.cargarMenu(idioma)
				} else {
					this.mensaje = this._('No se puede cargar:') + " Idioma."
				}
			})
			.catch((er) => {
				console.error(er)
				this.mensaje = this._('No se puede cargar:') + " Idioma."
			})
	}

	cargarMenu(idioma) {

		this.pantalla_carga.mensaje = this._("Cargando menu") + "..."
		this.pantalla_carga.porcentaje_carga = 70

		this.getFetch(this.configuracion.ruta.menu + "/" + idioma + ".json")
			.then(res => res.json())
			.then((json) => {

				if(this.menu.cargarJson(json, this.icono.menu)) this.estado_carga.menu = true
				else this.mensaje = this._('No se puede cargar:') + " Menu."

			})
			.catch((er) => {
				console.error(er)
				this.mensaje = this._('No se puede cargar:') + " Menu."
			})
	}

	iniciarUsuario() {
		const usuario = this.almacenaje.obtener("usuario")

		if (usuario) {
			try {
				usuario = atob(usuario)
				usuario = JSON.parse(usuario)

				this.usuario = new Usuario()
				this.usuario.nombre = usuario.nombre
				this.usuario.uuid = usuario.uuid
				this.usuario.token = usuario.token
				this.usuario.avatar = usuario.avatar
				this.usuario.permisos = usuario.permisos

				this.usuario.organizacion = new Organizacion()
				this.usuario.organizacion.nombre = usuario.organizacion.nombre
				this.usuario.organizacion.logo = usuario.organizacion.logo
				this.usuario.organizacion.uuid = usuario.organizacion.uuid
			} catch (er) {
				console.error(er)
			}
		}

		this.presentarUsuario()
	}

	salir() {
		this.almacenaje.borrar("access-token")
		this.almacenaje.borrar("usuario")
		location.href = "/ingresar"
	}

	presentarUsuario() {
		if (this.usuario && this.usuario.nick) {
			Util.ocultar("#no-logueado1")
			Util.mostrar("#logueado1")
			Util.mostrar("#logueado2")
			Util.mostrar("#logueado3")

			const nombre = document.getElementById("nombre-usuario")
			if (nombre) nombre.innerHTML = this.usuario.nick

			const nombre2 = document.getElementById("nombre-usuario-2")
			if (nombre2) nombre2.innerHTML = this.usuario.nick

			if (this.usuario.foto) {
				const foto = document.getElementById("foto-usuario")
				if (foto) foto.src = this.usuario.foto
				const foto2 = document.getElementById("foto-usuario-2")
				if (foto2) foto2.src = this.usuario.foto
				const foto3 = document.getElementById("foto-usuario-3")
				if (foto3) foto3.src = this.usuario.foto
			}

			this.ponerNotificacionesSinLeer(this.usuario.notificaciones_sin_leer)
		} else {
			Util.mostrar("#no-logueado1")
			Util.ocultar("#logueado1")
			Util.ocultar("#logueado2")
			Util.ocultar("#logueado3")
		}
	}

	comprobarMensaje() {
		const mensaje = Util.obtenerCookie("mensaje")
		if (mensaje) {
			this.mensaje = mensaje
		}
	}

	infoApp(){
		const popop = new PopUp({
			id: 'ui-popop-defecto',
			modo: 'info',
			titulo: '<h1>' + this.configuracion.app.nombre + '</h1>',
			html: '<div><center>' +
			'<img class="logo-mediano" src="' + this.configuracion.app.logos.mediano + '"/><br /><br />' +
			'<p><b>' + this.configuracion.app.nombre + '</b></p>' +
			'<p>Versión: ' + this.configuracion.app.version + '</p>' +
			'<p><b>Autor: ' + this.configuracion.app.autor + '</b></p>' +
			'<p>Licencia: ' + this.configuracion.app.licencia + '</p>' +
			(this.configuracion.app.contacto ? '<p>Contacto: ' + this.configuracion.app.contacto + '</p>' : '') +
			'</center></div>'
		})
	}

	get mensaje() {
		return this.ui_msj.mensaje
	}

	set mensaje(m) {
		if (this.ui_msj) this.ui_msj.mensaje = m
	}

	_(t) {
		return window.ui_idioma && window.ui_idioma[t] ? window.ui_idioma[t] : t
	}
	_iconos(t) {
		return window.ui_iconos && window.ui_iconos[t] ? window.ui_iconos[t] : null
	}

	async getFetch(ruta) {
		return this.conector.get(ruta)
	}

	async postFetch(ruta, datos) {
		return this.conector.post(ruta, datos)
	}
}
