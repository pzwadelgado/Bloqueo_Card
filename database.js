// SECCIÓN 3: Conexión con Google Sheets (ACTUALIZADO)
const SHEET_ID = '1cDyqp27r2gE0h-0U307WK_9uae2L_LzbCWpk4_AoHfk'; 
const TAB_NAME = 'MaestraSemanalLunes';

async function obtenerDatosDesdeDrive() {
    // CAMBIO: Ahora seleccionamos D (Código), E (Nombre) y AL (Departamento)
    const query = encodeURIComponent('SELECT D, E, AL');
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${TAB_NAME}&tq=${query}`;

    try {
        const respuesta = await fetch(url);
        const texto = await respuesta.text();
        const jsonText = texto.substring(texto.indexOf("{"), texto.lastIndexOf("}") + 1);
        const data = JSON.parse(jsonText);
        
        return data.table.rows.map(fila => ({
            // fila.c[0] es la Columna D
            codigo: fila.c[0]?.v?.toString() || "",
            
            // CAMBIO: Ahora fila.c[1] es la Columna E (Nombre completo)
            nombre: (fila.c[1]?.v || "").trim(),
            
            // fila.c[2] es la Columna AL (Departamento)
            departamento: fila.c[2]?.v || "N/A"
        }));
    } catch (error) {
        console.error("Error al conectar con la nueva hoja de Drive:", error);
        return [];
    }
}
