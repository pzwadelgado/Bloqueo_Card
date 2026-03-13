// SECCIÓN 3: Conexión con Google Sheets (ACTUALIZADO A COL. AK)
const SHEET_ID = '1cDyqp27r2gE0h-0U307WK_9uae2L_LzbCWpk4_AoHfk'; 
const TAB_NAME = 'MaestraSemanalLunes';

async function obtenerDatosDesdeDrive() {
    // CAMBIO: Seleccionamos D (Código), E (Nombre) y AK (Departamento)
    const query = encodeURIComponent('SELECT D, E, AK');
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${TAB_NAME}&tq=${query}`;

    try {
        const respuesta = await fetch(url);
        const texto = await respuesta.text();
        const jsonText = texto.substring(texto.indexOf("{"), texto.lastIndexOf("}") + 1);
        const data = JSON.parse(jsonText);
        
        return data.table.rows.map(fila => ({
            // Columna D (Código)
            codigo: fila.c[0]?.v?.toString() || "",
            
            // Columna E (Nombre completo)
            nombre: (fila.c[1]?.v || "").trim(),
            
            // CAMBIO: Ahora fila.c[2] corresponde a la Columna AK (Departamento)
            departamento: fila.c[2]?.v || "N/A"
        }));
    } catch (error) {
        console.error("Error al conectar con la hoja MaestraSemanalLunes:", error);
        return [];
    }
}
