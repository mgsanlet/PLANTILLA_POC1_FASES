class Modelo{
    #URL = "./modelo/";
    #modelo = null;

    constructor(){
    }

    async init(){
        const modelURL = this.#URL + "model.json";
        const metadataURL = this.#URL + "metadata.json";

        // Cargar el modelo de Teachable Machine
        this.#modelo = await tmImage.load(modelURL, metadataURL);
        console.log("Modelo cargado exitosamente");
    }

    async predecir(canvas, umbral) {
        if (!this.#modelo) {
            console.error("Modelo no cargado");
            return;
        }

        const predicciones = await this.#modelo.predict(canvas);
        let clasePrediccion = "Desconocido";
        console.log("Predicción: ");
        predicciones.forEach(prediccion => {
            if (prediccion.probability > umbral){
                // Se formatea el resultado de la predicción si es confiable (supera el umbral determinado)
                clasePrediccion = `${prediccion.className}`;
            }

        });

        console.log(clasePrediccion);
        return clasePrediccion;
    }

}
export { Modelo };