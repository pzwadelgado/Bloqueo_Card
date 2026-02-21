// SECCIÓN 3: Conexión con Google Sheets
const SHEET_ID = '12sBRYs04Kc5CHw8EedtvFqwQp8O__LWCWYf27YZuYJs'; 
const TAB_NAME = 'Base Consolidada';

async function obtenerDatosDesdeDrive() {
    // Selección de columnas D (3), H(7), I(8), J(9), AL(37)
    const query = encodeURIComponent('SELECT D, H, I, J, AL');
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${TAB_NAME}&tq=${query}`;

    try {
        const respuesta = await fetch(url);
        const texto = await respuesta.text();
        const jsonText = texto.substring(texto.indexOf("{"), texto.lastIndexOf("}") + 1);
        const data = JSON.parse(jsonText);
        
        return data.table.rows.map(fila => ({
            codigo: fila.c[0]?.v?.toString() || "",
            nombre: `${fila.c[1]?.v || ""} ${fila.c[2]?.v || ""} ${fila.c[3]?.v || ""}`.trim(),
            departamento: fila.c[4]?.v || "N/A"
        }));
    } catch (error) {
        console.error("Error en Drive:", error);
        return [];
    }
}