/*
*    @author     Julio Viera 2023
*/
export class Util
{
	static construirOpciones(opciones, seleccionado = '')
	{
		let ops = []
        for(const i in opciones)
		{
			const op = document.createElement('option')
			op.value = i
			op.text = opciones[i]

			if(i == seleccionado) op.selected = true

			ops.push(op)
		}

		return ops
	}

	// formato de opciones {codigo:###, nombre:%%%%%}
	static construirOpcionesCodigoNombre(opciones, seleccionado = '')
	{
		let ops = []
        for(const o of opciones)
		{
			const op = document.createElement('option')
			op.value = o.codigo
			op.text = o.nombre

			if(o.codigo == seleccionado) op.selected = true

			ops.push(op)
		}

		return ops
	}

    static mostrar(i, modo)
    {
        if(i instanceof Element) i.style.display = modo == undefined ? 'block' : modo
        else try{document.querySelector(i).style.display = modo == undefined ? 'block' : modo}catch(e){}
    }
    static ocultar(i)
    {
        if(i instanceof Element) i.style.display = 'none'
        else try{document.querySelector(i).style.display = 'none'}catch(e){}
    }

    static obtenerCookie(nombre)
    {
        const reg = RegExp('^' + nombre + '=')

        for(const iter of document.cookie.split(';'))
        {
            const ck = iter.trimStart();

            if(reg.test(ck)) return decodeURIComponent(ck.replace(reg, ''));
        }

        return null;
    }


    static ponerCookie(nombre, valor, segundos, ruta = '/', dominio = '') {
			const fecha = new Date();
			fecha.setTime(fecha.getTime() + (segundos * 1000));
			let cstr = nombre + '=' + encodeURIComponent(valor) + ';expires=' + fecha.toUTCString() + ';path=' + ruta + (dominio != '' ? ';domain=' + dominio : '');
			document.cookie = cstr;
		}
		static borrarCookie(nombre, ruta = '/', dominio = '') {
			document.cookie = nombre + '=; Path=' + ruta + ';domain=' + dominio +'; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		}

    static crearElemento(etiqueta = 'div', atributos = {}, hijos = [])
    {
        const elem = document.createElement(etiqueta)
        for(const a in atributos)
        {
            if(typeof atributos[a] === 'function') elem[a] = atributos[a]
            else elem.setAttribute(a, atributos[a])
        }

        if(hijos instanceof Array)
        {
        	for(const h of hijos)
          {
          	if(h instanceof Node) elem.appendChild(h)
           	else elem.appendChild(document.createTextNode(h))
          }
        }
        else if(hijos instanceof Node) elem.appendChild(hijos)
        else elem.appendChild(document.createTextNode(hijos))

        elem.mostrar = function(modo = '') {
			    if(!modo && this._modo_display && this._modo_display != 'none') modo = this._modo_display
			    else if(!modo) modo = 'block'

			    this.style.display = modo
        }

        elem.ocultar = function() {
          if(this.style.display != 'none') this._modo_display = this.style.display

          this.style.display = 'none'
        }

        return elem
    }

    static quitarClase(e, c)
    {
        let elem;
        if(e instanceof Element) elem = e
        else elem = document.querySelector(e)

        if(elem) elem.classList.remove(c);
    }
    static agregarClase(e, c)
    {
        let elem;
        if(e instanceof Element) elem = e
        else elem = document.querySelector(e)

        if(elem) elem.classList.add(c);
    }

	static vistaFoto(file, previa, max = 1024000, msj = null)
	{
		Util.ocultar(previa)
		if(msj) msj.innerHTML = ''

		const arch_foto = file.files[0]

		if(!arch_foto) return false

		if(arch_foto.size > max)
		{
			if(msj) msj.innerHTML = 'La foto es muy grande.'
			file.value = ''
			return false
		}

		if(arch_foto.type != 'image/jpeg' && arch_foto.type != 'image/jpg' && arch_foto.type != 'image/jpe' && arch_foto.type != 'image/png' && arch_foto.type != 'image/tiff' && arch_foto.type != 'image/tif')
		{
			if(msj) msj.innerHTML = 'La foto no tiene un formato válido.'
			file.value = ''
			return false
		}

		previa.src = URL.createObjectURL(arch_foto)
		Util.mostrar(previa)

		return true
	}

	static vistaVideo(file, previa, max = 1024000, msj = null)
	{
		Util.ocultar(previa)
		if(msj) msj.innerHTML = ''

		const arch_video = file.files[0]

		if(!arch_video) return false

		if(arch_video.size > max)
		{
			if(msj) msj.innerHTML = 'El vídeo es muy grande.'
			file.value = ''
			return false
		}

		if(arch_video.type != 'video/mp4' && arch_video.type != 'video/ogg' && arch_video.type != 'video/webm')
		{
			if(msj) msj.innerHTML = 'El vídeo no tiene un formato válido.'
			file.value = ''
			return false
		}

		previa.src = URL.createObjectURL(arch_video)
		Util.mostrar(previa)

		return true
	}




	static opcionesDeSelect(select)
	{
		const opciones = {}
		if(select)
		{
			for(let opt of select.options)
			{
				opciones[opt.value] = opt.text
			}
		}
		return opciones
	}
	static opcionesSeleccionadasDeSelect(select)
	{
		const seleccionados = {}
		for(let opcion of select.options)
		{
			if(opcion.selected) seleccionados[opcion.value] = opcion.text
		}
		return seleccionados
	}
	static ponerOpcionSelect(select, val, tx)
	{
		if(!select) return
		const opciones = Util.opcionesDeSelect(select)

		if(!opciones[val])
		{
			var opt = document.createElement("option")
			opt.value = val
			opt.text = tx
			select.add(opt, 0)
		}
	}
	static quitarOpcionSelect(select, val)
	{
		for(let opcion of select.options)
		{
			if(opcion.value == val) opcion.remove()
		}
	}

	static valoresDeSelect(select, seleccionados = false)
	{
		const valores = []
		if(select)
		{
			for(let opt of select.options)
			{
				if(!seleccionados || opt.selected) valores.push(opt.value)
			}
		}
		return valores
	}

	static limitarRangoCampoNumerico(nodo_input)
	{
		nodo_input.addEventListener('change', (e) => {
			const val = parseFloat(e.target.value)
			const min = parseFloat(e.target.getAttribute('min'))
			const max = parseFloat(e.target.getAttribute('max'))

			if(isNaN(min))
			{
				console.error('(limitarRangoCampoNumerico) Falta atributo min sobre: ', nodo_input)
			}
			if(isNaN(max))
			{
				console.error('(limitarRangoCampoNumerico) Falta atributo max sobre: ', nodo_input)
			}

			if(val < min) e.target.value = min
			if(val > max) e.target.value = max
		})

		nodo_input.addEventListener('keyup', (e) => {
			const val = parseFloat(e.target.value)
			const min = parseFloat(e.target.getAttribute('min'))
			const max = parseFloat(e.target.getAttribute('max'))

			if(isNaN(min))
			{
				console.error('(limitarRangoCampoNumerico) Falta atributo min sobre: ', nodo_input)
			}
			if(isNaN(max))
			{
				console.error('(limitarRangoCampoNumerico) Falta atributo max sobre: ', nodo_input)
			}

			if(val < min) e.target.value = min
			if(val > max) e.target.value = max
		})

	}

	static esEmail(email)
	{
  	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  	return re.test(email);
	}

	static validarClave(clave, clave2 = null, config = {min: 8, max: 30, mayuscula: true, minuscula: true, numero: true, simbolo: true})
	{
		if(!clave)
		{
			return "- Ingresa la <b>Contrase&ntilde;a</b>.<br/>";
		}
		else if(clave2 && clave != clave2)
		{
			return "- Las <b>Contrase&ntilde;as</b> deben ser iguales. ";
	  }
	  else if (clave.length < config.min || clave.length > config.max)
	  {
	    return "- La <b>Contrase&ntilde;a</b> debe contener entre " + config.min + " y " + config.max + " caract&eacute;res. ";
	  }
	  else if (config.mayuscula && /[A-ZÑÁÉÍÓÚ]/.test(clave) == false)
	  {
	    return "- La <b>Contrase&ntilde;a</b> debe tener al menos un caract&eacute;r en mayuscula. ";
	  }
	  else if (config.minuscula && /[a-zñáéíóú]/.test(clave) == false)
	  {
	    return "- La <b>Contrase&ntilde;a</b> debe tener al menos un caract&eacute;r en minuscula. ";
	  }
	  else if (config.numero && /[0-9]/.test(clave) == false)
	  {
	    return "- La <b>Contrase&ntilde;a</b> debe contener al menos un número. ";
	  }
	  else if (config.simbolo && /[#$%&?¿¡!._+*~{}\[\]\-]/.test(clave) == false)
	  {
	    return "- La <b>Contrase&ntilde;a</b> debe tener al menos un simbolo especial. ";
	  }

		return ''
	}

	static uuid(){
		if(window.isSecureContext){
			return crypto.randomUUID()
		}

		return Util.__generateUUID()
	}

	static __generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
	}


	/*
	*	trata de identificar el mime type desde el inicio de la cadena base64
	* https://en.wikipedia.org/wiki/List_of_file_signatures
	*/
	static mimeTypeDeBase64(base64) {
		const firmas = {
			"JVBERi0": "application/pdf",
			"R0lGODdh": "image/gif",
			"R0lGODlh": "image/gif",
			"Qk02U": "image/bmp",
			"iVBORw0KGgo": "image/png",
			"/9j/": "image/jpg",
			"TU0AK": "image/tiff",
			"AAABukQABAAEAUNDW": "video/mpeg",
			"AAAAHGZ0eXBtcDQyAAAAAG1wNDJtcDQxaXNvNA": "video/mp4",
			"T2dnUwACA": "video/ogg",
			"GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQJChYECGFOAZwEA": "video/webm",
			"UklGR": "video/x-msvideo",
			"UEs": "application/vnd.openxmlformats-officedocument.",
			"PK": "application/zip",
			"T2dnUwACAAAAAAAAAA": "video/ogg", // el de audio es igual "T2dnUwACAAAAAAAAAA": "audio/ogg",
			"PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0i": "image/svg+xml",
			"SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjQ1LjEwMAAAAAAAAAAAAAAA": "audio/mpeg",
		}

		for (const f in firmas) {
			if (base64.indexOf(f) === 0) return firmas[f];
		}

		return null
	}

	static blobDeBase64(base64, mime = null) {
		if (!mime) mime = this.mimeTypeDeBase64(base64.substring(0, 100))
		if (!mime) {
			console.error('No se puede determinar MimeType de Base64.')
			return null
		}

		const data = atob(base64);
		const uInt8Array = new Uint8Array(data.length);

		for (let i = 0; i < data.length; i++) {
			uInt8Array[i] = data.charCodeAt(i);
		}

		try {
			return new Blob([uInt8Array], { type: mime })
		}
		catch (er) {
			console.error(er)
		}
		return null
	}
}
