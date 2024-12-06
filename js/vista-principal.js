class VistaPrincipal {
    #controlador = null;
    #video = null;
    #botonCaptura = null;
    #sliderTiempo = null;
    #contenedorImagen = null;
    #imagenCapturada = null;
    #contenedorRespuesta = null;
    #contenedorMensaje = null;
    

    constructor(controlador) {
        this.#controlador = controlador;
        this.#video = document.getElementById('video');
        this.#contenedorImagen = document.getElementById('contenedorImagen');
        this.#imagenCapturada = document.getElementById('imagenCapturada');
        this.#contenedorRespuesta = document.getElementById('contenedorRespuesta');
        this.#contenedorMensaje = document.getElementById('contenedorMensaje')
        this.#botonCaptura = document.getElementById('botonCaptura');
        this.#sliderTiempo = document.getElementById('sliderTiempo');
    }

    getVideo(){
        return this.#video;
    }

    // Configura los eventos de la vista
    capturarEventos() {
        this.#botonCaptura?.addEventListener('click', () => this.#controlador.capturarOReiniciar())
    }

    // ********* COMENZAR CAPTURA **********


    mostrarImagenCapturada(urlImagen) {

        this.#contenedorImagen.style.display = 'flex'; // Hace visible el contenedor de la imagen
        this.#imagenCapturada.src = urlImagen;
    }

    /*Mostrar el mensaje de prediccion*/
    mostrarRespuesta(mensaje) {
        this.#contenedorRespuesta.innerText = mensaje;
        this.#contenedorRespuesta.style.display = 'block';
    }

    /*Mostrar mensaje general*/
    mostrarMensaje(mensaje) {
        this.#contenedorMensaje.innerText = mensaje;
        this.#contenedorMensaje.style.display = 'block';
    }
    
    cambiarTextoBoton(textoBoton){
        
        this.#botonCaptura.innerText = textoBoton;
    }


    // ********* REINICIAR VISTA **********
    
    reiniciarVista() {
        this.esconderImagenCapturada();
        this.ocultarRespuesta();
        this.#botonCaptura.innerText = "Capturar imagen";
        this.actualizarSlider(0);
        this.mostrarMensaje(this.#controlador.getEstadoActual().mensaje);
    }

    esconderImagenCapturada() {
        this.#contenedorImagen.style.display = 'none'; // Hace invisible el contenedor de la imagen
        this.#imagenCapturada.src = '';
    }

    /*Ocultar la respuesta de la predicción*/
    ocultarRespuesta() {
        this.#contenedorRespuesta.style.display = 'none';
        this.#contenedorRespuesta.innerText = '';
    }

    // Actualiza el valor del slider
    actualizarSlider(progreso) {
        this.#sliderTiempo?.setAttribute('value', progreso);
    }
}

export { VistaPrincipal };