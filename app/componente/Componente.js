/*
*    @author     Julio Viera 2023
*/
import { BaseUI } from "../BaseUI.js"
import { Util } from "../Util.js"

export class Componente extends BaseUI {
	constructor(p) {
		super(p)
		this.util = Util
	}

	connectedCallback() {
		super.connectedCallback()
	}

	disconnectedCallback() {
		super.disconnectedCallback()
	}
}

customElements.define("base-componente", Componente)
