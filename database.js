// SECCIÓN 3: Conexión con Google Sheets (CORRECCIÓN DEPARTAMENTO)
const SHEET_ID = '1cDyqp27r2gE0h-0U307WK_9uae2L_LzbCWpk4_AoHfk'; 
const TAB_NAME = 'MaestraSemanalLunes';

async function obtenerDatosDesdeDrive() {
    // Aseguramos que seleccionamos D, E y AK
    const query = encodeURIComponent('SELECT D, E, AK');
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${TAB_NAME}&tq=${query}`;

    try {
        const respuesta = await fetch(url);
        const texto = await respuesta.text();
        const jsonText = texto.substring(texto.indexOf("{"), texto.lastIndexOf("}") + 1);
        const data = JSON.parse(jsonText);
        
        return data.table.rows.map(fila => ({
            codigo: fila.c[0]?.v?.toString() || "",
            nombre: (fila.c[1]?.v || "").trim(),
            // Mejoramos la captura: si es nulo o vacío, intentamos obtener el valor formateado (.f)
            departamento: (fila.c[2]?.v || fila.c[2]?.f || "No especificado").trim()
        }));
    } catch (error) {
        console.error("Error al obtener departamento:", error);
        return [];
    }
}
