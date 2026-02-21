/**
 * SECCIÓN 4: MECÁNICA DEL SISTEMA (LOGIC.JS)
 * Este módulo gestiona la búsqueda, el renderizado y el procesamiento de imagen.
 */

let empleadosCache = []; // Almacenamiento temporal para no saturar el Drive

/**
 * Función Principal: Busca el empleado y activa la interfaz de carga
 */
async function buscarEmpleado() {
    const inputElement = document.getElementById('input-codigo');
    const btnBusqueda = event.target; // El botón que disparó la función
    const codBusqueda = inputElement.value.trim();

    if (!codBusqueda) {
        alert("Por favor, ingresa un código de trabajador.");
        return;
    }

    try {
        // Estado de carga visual
        btnBusqueda.innerText = "⌛ Buscando...";
        btnBusqueda.disabled = true;

        // Solo descargamos del Drive si el cache está vacío
        if (empleadosCache.length === 0) {
            empleadosCache = await obtenerDatosDesdeDrive();
        }

        // Buscamos coincidencia en Columna D (codigo)
        const empleado = empleadosCache.find(e => e.codigo === codBusqueda);

        if (empleado) {
            // Actualizamos UI con datos encontrados
            document.getElementById('nombre-detectado').innerText = empleado.nombre;
            document.getElementById('upload-section').style.display = 'block';
            
            // Renderizamos la estructura de las etiquetas (vacías de foto)
            renderizarEtiquetas(empleado);
            
            // Scroll suave hacia la sección de carga
            document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth' });
        } else {
            alert(`El código ${codBusqueda} no existe en la Base Consolidada.`);
            document.getElementById('upload-section').style.display = 'none';
        }

    } catch (error) {
        console.error("Error en el flujo de búsqueda:", error);
        alert("Hubo un error al conectar con la base de datos.");
    } finally {
        btnBusqueda.innerText = "🔍 Buscar";
        btnBusqueda.disabled = false;
    }
}

/**
 * SECCIÓN 4.1: Renderizado Inteligente (Pantalla vs Papel)
 * Este bloque sustituye la función anterior para mejorar la estética visual.
 */
function renderizarEtiquetas(emp) {
    const container = document.getElementById('print-area');
    container.innerHTML = ''; // Limpiamos el área antes de renderizar

    // PÁGINA 1: CARAS FRONTALES
    // La primera unidad es visible siempre; la segunda tiene la clase 'solo-impresion'
    container.innerHTML += `
        <div class="page-wrapper">
            <div class="grid-impresion">
                ${generarCardHTML(emp, 'face-a posicion-frente')}
                
                <div class="solo-impresion">
                    ${generarCardHTML(emp, 'face-a posicion-frente')}
                </div>
            </div>
        </div>
    `;

    // PÁGINA 2: REVERSOS
    container.innerHTML += `
        <div class="page-wrapper">
            <div class="grid-impresion">
                <div class="loto-card face-b posicion-reverso"></div>
                
                <div class="loto-card face-b posicion-reverso solo-impresion"></div>
            </div>
        </div>
    `;
    
    // Si el usuario ya cargó una foto, la aplicamos a los nuevos elementos generados
    if(document.getElementById('input-foto').files[0]) {
        procesarFoto();
    }
}

/**
 * Función Auxiliar: Genera el HTML interno de la tarjeta frontal para evitar repetir código.
 */
function generarCardHTML(emp, clases) {
    return `
        <div class="loto-card ${clases}">
            <div class="photo-box">
                <img class="foto-render" src="" alt="Foto">
            </div>
            <div class="text-overlay">
                <div class="field-nombre">${emp.codigo}: ${emp.nombre}</div>
                <div class="field-depto">${emp.departamento}</div>
            </div>
        </div>`;
}
    
    // Alerta de seguridad para actualizar las fotos cargadas
    if(document.getElementById('input-foto').files[0]) procesarFoto();




/**
 * Función de Procesamiento de Imagen: Lee el archivo y lo inyecta en los img
 */
function procesarFoto() {
    const fileSelector = document.getElementById('input-foto');
    const archivo = fileSelector.files[0];

    if (!archivo) return;

    const lector = new FileReader();

    lector.onload = function(e) {
        const todasLasFotos = document.querySelectorAll('.foto-render');
        todasLasFotos.forEach(img => {
            img.src = e.target.result;
            img.style.display = 'block';
        });
    };

    lector.onerror = function() {
        alert("No se pudo leer la imagen correctamente.");
    };

    lector.readAsDataURL(archivo);
}