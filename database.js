// SECCIÓN: Conexión con Google Apps Script (INMUNE A FILTROS)
const URL_API_SCRIPTS = 'https://script.google.com/macros/s/AKfycbxwj3vuDCM-hvSP2DdSdIuTYiuXiMt-yfy5X9kIpte8F6S-92qJCaKbxH2PCv8cOr460Q/exec';

async function obtenerDatosDesdeDrive() {
    try {
        // Llamamos a tu nuevo Script
        const respuesta = await fetch(URL_API_SCRIPTS);
        
        if (!respuesta.ok) {
            throw new Error("Error al conectar con el Script de Google");
        }

        const datos = await respuesta.json();

        // Si el script devuelve un error interno, lo mostramos
        if (datos.error) {
            console.error("Error del Script:", datos.error);
            return [];
        }

        // Devolvemos los datos mapeados para tu buscador
        return datos.map(fila => ({
            codigo: fila.codigo?.toString() || "",
            nombre: (fila.nombre || "").trim(),
            departamento: (fila.departamento || "No especificado").trim()
        }));

    } catch (error) {
        console.error("Error al obtener datos desde el Script:", error);
        return [];
    }
}
