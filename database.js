// SECCIÓN 3: Conexión con Google Sheets (ACTUALIZADO)
const SHEET_ID = '1cDyqp27r2gE0h-0U307WK_9uae2L_LzbCWpk4_AoHfk'; 
const TAB_NAME = 'MaestraSemanalLunes';

async function obtenerDatosDesdeDrive() {
    // Mantenemos la selección de columnas D, H, I, J, AL según tu estructura anterior
    const query = encodeURIComponent('SELECT D, H, I, J, AL');
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${TAB_NAME}&tq=${query}`;

    try {
        const respuesta = await fetch(url);
        const texto = await respuesta.text();
        
        // Limpiamos el formato JSONP que devuelve Google para convertirlo en JSON puro
        const jsonText = texto.substring(texto.indexOf("{"), texto.lastIndexOf("}") + 1);
        const data = JSON.parse(jsonText);
        
        return data.table.rows.map(fila => ({
            codigo: fila.c[0]?.v?.toString() || "",
            // Une Nombre (H), Apellido 1 (I) y Apellido 2 (J)
            nombre: `${fila.c[1]?.v || ""} ${fila.c[2]?.v || ""} ${fila.c[3]?.v || ""}`.trim(),
            departamento: fila.c[4]?.v || "N/A" // Columna AL
        }));
    } catch (error) {
        console.error("Error al conectar con la nueva hoja de Drive:", error);
        return [];
    }
}
