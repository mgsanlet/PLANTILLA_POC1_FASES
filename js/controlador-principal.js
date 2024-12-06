import { VistaPrincipal } from './vista-principal.js';
import { Modelo } from './modelo.js';

class ControladorPrincipal {
    
    #vista = null;
    #webcam = null;
    #modelo = null;
    #listoParaCapturar = true;

    // Máquina de estados
    #estados = [
        { objetivo: "Cara",  mensaje: "Fase 1. Detecta una cara" },
        { objetivo: "Cara",  mensaje: "Fase 2. Detecta una mano" },
        { objetivo: "Cara",   mensaje: "Fase 3. Detecta un ojo" },
        { objetivo: "Cara", mensaje: "Fase 4.  Detecta una oreja" }
    ];
    #estadoActual = 0;

    constructor() {
        this.init();
    }

    getEstadoActual() {
        return this.#estados[this.#estadoActual]
    }

    esUltimoEstado() {
        return this.#estadoActual === 3;
    }

    reiniciarJuego() {
        this.#estadoActual = 0;
    }

    // ********* SET UP **********

    async init() {
        console.log('Iniciando aplicación');
        // Preparar vista
        this.#vista = new VistaPrincipal(this);
        this.#vista.capturarEventos();
        this.#webcam = this.#vista.getVideo(); // El controlador trata el vídeo de la vista como un elemento de webcam
        this.iniciarWebcam();
        this.#vista.mostrarMensaje(this.#estados[this.#estadoActual].mensaje); // Mostrar mensaje inicial del estado
        
        // Preparar modelo
        this.#modelo = new Modelo();
        this.#modelo.init();
    }

    // Inicializa la webcam
    iniciarWebcam() {
        const constraints = { video: true };
        const getUserMedia = navigator.mediaDevices?.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia;
        //Se asegura de conectar con la webcam según distintos navegadores

        if (!getUserMedia) {
            console.error("La API getUserMedia no es compatible con este navegador.");
            return;
        }

        getUserMedia.call(navigator.mediaDevices, constraints)
            .then(stream => {
            if (this.#webcam) {
                this.#webcam.srcObject = stream;
            }
        })
            .catch(error => {
            console.error("Error al acceder a la webcam:", error);
        });
    }

    async comenzarCaptura() {
        let progreso = 0;

        const actualizarProgreso = () => {
            progreso += 1;
            this.#vista.actualizarSlider(progreso);

            if (progreso >= 100) {
                clearInterval(intervalo);
                this.capturarImagen();
            }
        };

        const intervalo = setInterval(actualizarProgreso, 30);
    }

    // ********* LÓGICA DE PREDICCIÓN DE IMÁGENES **********

    async capturarImagen() {
        const canvas = document.createElement('canvas');
        canvas.width = this.#webcam.videoWidth;
        canvas.height = this.#webcam.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(this.#webcam, 0, 0, canvas.width, canvas.height);

        const urlImagen = canvas.toDataURL('image/png');
        this.#vista.mostrarImagenCapturada(urlImagen);

        console.log("Imagen capturada");
        // Llama a la función de predicción con el canvas
        const prediccion = await this.#modelo.predecir(canvas, 0.85);
        // Verifica la predicción y cambia de estado si es correcta
        this.verificarPrediccion(prediccion);
    }

    verificarPrediccion(prediccion) {
        const estado = this.#estados[this.#estadoActual];
        if (prediccion === estado.objetivo) {
            
            if (this.esUltimoEstado()) {
                // Juego completado
                this.#vista.mostrarMensaje(`¡Fase ${this.#estadoActual + 1} completada!¡Fin del juego!`);
                this.#vista.mostrarRespuesta("¡Felicidades! Has completado todas las fases.");
                this.#vista.cambiarTextoBoton("Reiniciar");
                this.#listoParaCapturar = false;
                this.reiniciarJuego();
            } else {
                this.#vista.mostrarRespuesta(`¡Predicción correcta! Avanzando a la siguiente fase.`);
                this.#estadoActual++;
                this.#vista.mostrarMensaje(`¡Fase ${this.#estadoActual} completada!`);
                this.#listoParaCapturar = false;
                this.#vista.cambiarTextoBoton("Continuar");
            }

        } else {
            this.#vista.mostrarRespuesta(`Predicción incorrecta. El objetivo era: ${estado.objetivo}`);
            this.#vista.mostrarMensaje(`Objetivo: ${estado.objetivo}. Intenta de nuevo.`);
            this.#listoParaCapturar = false;
            this.#vista.cambiarTextoBoton("Reintentar");
        }
    }

    capturarOReiniciar(){
        if(this.#listoParaCapturar){
            this.comenzarCaptura();
        }else{
            this.#vista.reiniciarVista();
            this.#listoParaCapturar = true;
        }
    }
}

window.onload = () => new ControladorPrincipal();