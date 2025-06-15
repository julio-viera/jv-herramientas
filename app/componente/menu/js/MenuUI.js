import { Componente } from "../../Componente.js"

export class MenuUIGrupo {
	constructor(id, nombre, items = []) {
		this.id = id
		this.nombre = nombre
		this.items = items
	}
}

export class MenuUIGrupoItem {
	constructor(id, nombre, accion, icono = null) {
		this.id = id
		this.nombre = nombre
		this.accion = accion
		this.icono = icono
	}
}

export class MenuUI extends Componente {
	constructor() {
		super()

		this.vaciar = this.vaciar.bind(this)
		this.agregarGrupo = this.agregarGrupo.bind(this)
		this.construir = this.construir.bind(this)
		this.cargarUI = this.cargarUI.bind(this)

		this.grupos = []
	}

	connectedCallback() {
		super.connectedCallback()
		this.transicion = false
	}

	disconnectedCallback() {
		super.disconnectedCallback()
	}

	vaciar() {
		this.grupos = []
		this.innerHTML = ""
	}

	agregarGrupo(grupo) {
		if (!(grupo instanceof MenuUIGrupo)) {
			console.error("agregarGrupo el parametro no es instancia de MenuUIGrupo")
			return
		}

		for (const item of grupo.items) {
			if (!(item instanceof MenuUIGrupoItem)) {
				console.error(
					"agregarGrupo el item de grupo no es instancia de MenuUIGrupoItem",
				)
				return
			}
		}

		for (const i in this.grupos) {
			if (this.grupos[i].id == grupo.id) {
				this.grupos[i] = grupo
				return
			}
		}

		this.grupos.push(grupo)
	}

	construir() {
		this.innerHTML = ""

		for (const grupo of this.grupos) {
			const nodo_titulo = this.crear(
				"div",
				{ class: "menu-titulo" },
				grupo.nombre,
			)
			const items = []

			for (const item of grupo.items) {

				const link = this.crear(
					"a",
					{ menu_item_id: item.id, href: item.accion }
				)

				if(item.icono){
					link.innerHTML = item.icono
					link.appendChild(this.crear('span', {}, item.nombre))
				}
				else{
					link.innerHTML = item.nombre
				}

				items.push(
					this.crear(
						"div",
						{ class: "menu-item", title: item.nombre },
						link
					)
				)
			}

			const nodo_items = this.crear("div", { class: "menu-items" }, items)

			this.appendChild(
				this.crear("div", { class: "menu-grupo", grupo_id: grupo.id }, [
					nodo_titulo,
					nodo_items,
				]),
			)
		}

		this.cargarUI()
	}

	cargarUI() {
		const grupos = this.querySelectorAll(".menu-grupo")
		for (const grupo of grupos) {
			grupo.addEventListener("mouseover", (e) => {
				const items = grupo.querySelector(".menu-items")
				if (items) items.classList.add("activo")
			})

			grupo.addEventListener("mouseout", (e) => {
				const items = grupo.querySelector(".menu-items")
				if (items) items.classList.remove("activo")
			})
		}
	}
}

customElements.define("ui-menu", MenuUI)
