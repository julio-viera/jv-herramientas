import { Componente } from "../../Componente.js"

export class MenuUIItem extends Componente {
	constructor(id, nombre, nivel, accion = null, grupo = null, mapeo_iconos = null) {
		super()

		this.construir = this.construir.bind(this)
		this.cargarUI = this.cargarUI.bind(this)

		this.id = id
		this.nombre = nombre
		this.nivel = nivel
		this.accion = accion
		this.mapeo_iconos = mapeo_iconos
		this.grupo = []
		if(grupo && Array.isArray(grupo)){
			for(const json of grupo){
				const item = new MenuUIItem(
					json.id,
					json.nombre,
					this.nivel + 1,
					json.accion,
					json.grupo,
					this.mapeo_iconos
				)

				this.grupo.push(item)
			}
		}
	}

	connectedCallback() {
		this.construir()
	}
	disconnectedCallback() { }


	construir() {
		this.innerHTML = ""

		const link = this.crear("a", { menu_item_id: this.id, href: (this.accion ? this.accion : 'javascript:;') })

		const div_l = this.crear('div', {class: 'menu-item-cont-accion'})

		if(this.mapeo_iconos && this.mapeo_iconos[this.id]){
			div_l.innerHTML = this.mapeo_iconos[this.id]
		}

		div_l.appendChild(this.crear('span', {}, this.nombre))

		link.appendChild(div_l)

		this.appendChild(
			this.crear("div", { class: "menu-grupo", grupo_id: this.id, grupo_nivel: this.nivel }, [
				this.crear("div", { class: "menu-item" }, link),
				this.crear("div", { class: "menu-items" + (this.nivel > 1 ? ' menu-items-subnivel' : '') }, this.grupo)
			])
		)

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

customElements.define("ui-menu-item", MenuUIItem)


export class MenuUI extends Componente {
	constructor() {
		super()

		this.cargarJson = this.cargarJson.bind(this)
		this.vaciar = this.vaciar.bind(this)
	}

	connectedCallback() {
		super.connectedCallback()
		this.transicion = false
	}

	disconnectedCallback() {
		super.disconnectedCallback()
	}

	cargarJson(json, mapeo_iconos = {}){

		if(!json || !json.grupo) return false

		this.vaciar()

		for(const inicial of json.grupo){

			this.appendChild(
				new MenuUIItem(
					inicial.id,
					inicial.nombre,
					1,
					inicial.accion,
					inicial.grupo,
					mapeo_iconos
				)
			)

		}

		return true
	}

	vaciar() {
		this.innerHTML = ""
	}

}

customElements.define("ui-menu", MenuUI)
