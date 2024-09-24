import { fetchTablaSimplificada } from "./api_service.js";

let map;
let data_global;
let mapInitialized = false; // Indicador de si el mapa ya se ha inicializado

// Función para manejar la obtención de datos
async function obtenerDatosApi() {
  try {
    const data = await fetchTablaSimplificada();
    actualizarDatos(data); // Llamamos a la función para actualizar los datos
    // Solo inicializar el mapa si no ha sido inicializado y data_global no está vacío
    if (!mapInitialized && data_global) {
      InitMap(data_global);
      mapInitialized = true; // Indicamos que el mapa ya fue inicializado
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Función para actualizar el fondo de img_bomba_estado dependiendo del enlace de tipoSignal 7
function actualizarFondoBomba(signals) {
  const imgBombaEstado = document.querySelector(".img_bomba_estado");

  // Definir el mapeo de las URLs según el valor del enlace
  const urls = {
    0: "https://virtualwavecontrol.com.mx/RecursosWeb/Client/PozosSistemaLerma/Sitios/LN%20116/Particular/b/b1_0.png?v=1",
    1: "https://virtualwavecontrol.com.mx/RecursosWeb/Client/PozosSistemaLerma/Sitios/LN%20116/Particular/b/b1_1.png?v=1",
    2: "https://virtualwavecontrol.com.mx/RecursosWeb/Client/PozosSistemaLerma/Sitios/LN%20116/Particular/b/b1_2.png?v=1",
    3: "https://virtualwavecontrol.com.mx/RecursosWeb/Client/PozosSistemaLerma/Sitios/LN%20116/Particular/b/b1_3.png?v=1",
  };

  // Buscar la señal con tipoSignal 7
  const signalTipo7 = signals.find((signal) => signal.tipoSignal === 7);

  if (signalTipo7) {
    const enlace = signalTipo7.valor;
    // Asignar el background al div según el valor del enlace
    if (urls[enlace] !== undefined) {
      imgBombaEstado.style.backgroundImage = `url(${urls[enlace]})`;
    } else {
      imgBombaEstado.style.backgroundImage = `url(${urls[0]})`;
    }
  }
}

// Modificar la función actualizarDatos para incluir la actualización del fondo
function actualizarDatos(data) {
  asignarDatosHeader(data[1]); // Actualiza los headers
  crearTablaSignals(data[1].signals); // Genera la tabla de signals
  actualizarFondoBomba(data[1].signals); // Actualiza el fondo según la señal con tipoSignal 7
  data_global = data[1];
}

// Bomba 2 es la que se muestra, bomba 1 estado del dosificador

// Función para asignar los datos del header
function asignarDatosHeader(data) {
  const nombreSpan = document.querySelector(".header_nombre_sitio");
  const fechaSpan = document.querySelector(".header_fecha");
  const estadoSpan = document.querySelector(".header_estado");

  nombreSpan.textContent = data.nombre;
  fechaSpan.textContent = formatearFecha(data.tiempo);

  if (data.enlace === 0) {
    estadoSpan.textContent = "Fuera de línea";
    estadoSpan.style.color = "red";
  } else {
    estadoSpan.textContent = "En línea";
    estadoSpan.style.color = "rgb(0, 128, 0)";
  }
}

// Función para crear la tabla de señales
function crearTablaSignals(signals) {
  const tbody = document.getElementById("signals_table_body");
  tbody.innerHTML = ""; // Limpiamos el contenido actual

  signals.forEach((signal) => {
    const fila = document.createElement("tr");

    const celdaNombre = document.createElement("td");
    celdaNombre.textContent = signal.nombre;

    const celdaValor = document.createElement("td");
    celdaValor.textContent = signal.valor;

    fila.appendChild(celdaNombre);
    fila.appendChild(celdaValor);
    tbody.appendChild(fila);
  });
}

// Función para formatear la fecha
function formatearFecha(fechaString) {
  const fecha = new Date(fechaString);
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const año = fecha.getFullYear();
  const horas = String(fecha.getHours()).padStart(2, "0");
  const minutos = String(fecha.getMinutes()).padStart(2, "0");

  return `${dia}/${mes}/${año}, ${horas}:${minutos}`;
}

// Función para inicializar el mapa de Google una vez con los datos correctos
async function InitMap(data_global) {
  const MAP_POSITION = {
    lat: data_global.latitud,
    lng: data_global.longitud,
  };

  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerView } = await google.maps.importLibrary("marker");

  map = new Map(document.getElementById("map"), {
    zoom: 16,
    center: MAP_POSITION,
    streetViewControl: false,
    mapId: "DEMO_MAP_ID",
  });

  const marker = new AdvancedMarkerView({
    map: map,
    position: MAP_POSITION,
    title: `${data_global.nombre}`,
  });
}

// Función para alternar la visibilidad del contenedor de la tabla
function toggleTabla() {
  const tableContainer = document.querySelector(".table_container");
  const mapaContainer = document.querySelector(".mapa_container");

  // Si la tabla ya está visible, ocultarla
  if (!tableContainer.classList.contains("hidden")) {
    tableContainer.classList.add("hidden");
  } else {
    // Si la tabla no está visible, mostrarla y ocultar el mapa
    tableContainer.classList.remove("hidden");
    mapaContainer.classList.add("hidden");
  }
}

// Función para alternar la visibilidad del contenedor del mapa
function toggleMapa() {
  const mapaContainer = document.querySelector(".mapa_container");
  const tableContainer = document.querySelector(".table_container");

  // Si el mapa ya está visible, ocultarlo
  if (!mapaContainer.classList.contains("hidden")) {
    mapaContainer.classList.add("hidden");
  } else {
    // Si el mapa no está visible, mostrarlo y ocultar la tabla
    mapaContainer.classList.remove("hidden");
    tableContainer.classList.add("hidden");
  }
}

// Función para añadir los eventos de click a los botones
function setupClickEvents() {
  document
    .getElementById("header_Tabla")
    .addEventListener("click", toggleTabla);
  document.getElementById("header_Mapa").addEventListener("click", toggleMapa);
}

// Iniciar la actualización de datos cada 30 segundos (30000 ms)
window.onload = () => {
  obtenerDatosApi(); // Llamamos a la función cuando la página cargue
  setupClickEvents(); // Configuramos los eventos de click
  setInterval(obtenerDatosApi, 30000); // Actualizar datos cada 30 segundos
};
