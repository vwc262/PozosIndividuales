import { fetchTablaSimplificada } from "./api_service.js";
import { init_control_bombas } from "./control_bombas.js";
import { EnumValorBomba } from "./enum.js";

let map;
let data_global;
let mapInitialized = false; // Indicador de si el mapa ya se ha inicializado

let bomba_info = {
  valor: null,
  idSignal: null,
  idEstacion: null,
  ordinal: null,
  nombre: null,
};

let perilla_info = null;

// Función para manejar la obtención de datos
async function obtenerDatosApi() {
  try {
    const data = await fetchTablaSimplificada();
    console.log(data[1]);
    actualizarDatos(data); // Llamamos a la función para actualizar los datos
    init_control_bombas(data[1]);
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

  // Filtrar todas las señales con tipoSignal 7
  const signalsTipo7 = signals.filter((signal) => signal.tipoSignal === 7);

  // Verificar si hay al menos dos señales y usar la segunda
  if (signalsTipo7.length >= 2) {
    const secondSignal = signalsTipo7[1];
    const enlace = secondSignal.valor;

    // Asignar el background al div según el valor del enlace
    imgBombaEstado.style.backgroundImage = `url(${urls[enlace] || urls[0]})`;
  }
}

// Modificar la función actualizarDatos para incluir la actualización del fondo
function actualizarDatos(data) {
  data_global = data[1];
  asignarDatosHeader(data[1]); // Actualiza los headers
  crearTablaSignals(data[1].signals); // Genera la tabla de signals
  actualizarFondoBomba(data[1].signals); // Actualiza el fondo según la señal con tipoSignal 7
  datos_control_bombas(data[1].signals);
}

// Función para guardar los datos de la bomba y la perilla
function datos_control_bombas(data_bomba) {
  // Filtrar las señales con tipoSignal 8 (perillas)
  const perillaSignals = data_bomba.filter((signal) => signal.tipoSignal === 8);
  // Si hay al menos dos perillas, obtener la segunda
  if (perillaSignals.length >= 2) {
    perilla_info = perillaSignals[1]; // Segunda perilla
  }

  // Filtrar las señales con tipoSignal 7 (bombas)
  const bombaSignals = data_bomba.filter((signal) => signal.tipoSignal === 7);

  // Si existen al menos dos bombas, obtener la información de la segunda bomba
  if (bombaSignals.length >= 2) {
    bomba_info = {
      valor: bombaSignals[1].valor,
      idSignal: bombaSignals[1].idSignal,
      idEstacion: bombaSignals[1].idEstacion,
      ordinal: bombaSignals[1].ordinal,
      nombre: bombaSignals[1].nombre,
    };
  }

  // Llamar a la función para asignar los datos de la bomba y la perilla
  set_datos_bomba(perilla_info, bomba_info);
}

// Función para asignar los datos de la bomba y perilla
function set_datos_bomba(perilla_info, bomba_info) {
  const txt_estado_perilla = document.getElementById("txt_estado_perilla");
  const control_bba_estado = document.getElementById("control_bba_estado");
  const control_bba_nombre = document.getElementById("control_bba_nombre");
  const control_img_bomba = document.getElementById("control_img_bomba");

  control_bba_nombre.textContent = `${bomba_info.nombre} 1`;

  switch (perilla_info.valor) {
    case 0:
      txt_estado_perilla.textContent = "Off";
      break;
    case 1:
      txt_estado_perilla.textContent = "Remoto";
      break;
    case 2:
      txt_estado_perilla.textContent = "Local";
      break;
  }

  switch (bomba_info.valor) {
    case 0:
      control_bba_estado.textContent = "No Disponible";
      control_img_bomba.style.filter = "hue-rotate(0deg)";
      break;
    case 1:
      control_bba_estado.textContent = "Arrancada";
      control_img_bomba.style.filter = "hue-rotate(120deg)";
      break;
    case 2:
      control_bba_estado.textContent = "Apagada";
      control_img_bomba.style.filter =
        "hue-rotate(0deg) saturate(100%) brightness(50%) ";
      break;
    case 3:
      control_bba_estado.textContent = "Falla";
      control_img_bomba.style.filter = "hue-rotate(0deg)";
      break;
  }
}

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

// Función para crear la tabla de señales con unidades
function crearTablaSignals(signals) {
  const tbody = document.getElementById("signals_table_body");
  tbody.innerHTML = ""; // Limpiamos el contenido actual

  // Filtrar solo las señales con tipoSignal 1, 2, 3, 4
  const filteredSignals = signals.filter((signal) =>
    [1, 2, 3, 4].includes(signal.tipoSignal)
  );

  // Iterar sobre las señales filtradas y crear las filas
  filteredSignals.forEach((signal) => {
    const fila = document.createElement("tr");

    const celdaNombre = document.createElement("td");
    celdaNombre.textContent = signal.nombre;

    const celdaValor = document.createElement("td");
    const unidad = obtenerUnidad(signal);

    if (signal.dentroRango)  {
      celdaValor.textContent = `${signal.valor} ${unidad}`; // Mostrar valor con unidad si esta en rango
    } else {
      celdaValor.textContent = `---`; // Mostrar --- si no esta en rango
    }

    fila.appendChild(celdaNombre);
    fila.appendChild(celdaValor);
    tbody.appendChild(fila);
  });
}

// Función auxiliar para obtener la unidad según tipoSignal
function obtenerUnidad(signal) {
  switch (signal.tipoSignal) {
    case 1:
      // Aquí diferenciamos según el nombre de la señal en tipoSignal 7
      if (signal.nombre.includes("Nivel Dinamico")) {
        return "m"; // Nivel dinámico
      } else if (signal.nombre.includes("Hipoclorito")) {
        return "%"; // Hipoclorito
      } else if (signal.nombre.includes("Nivel Estatico")) {
        return "m"; // Nivel estático
      }
      break;
    case 2:
      return "kg/cm²";
    case 3:
      return "l/s";
    case 4:
      return "m²";
  }
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

function toggleModal() {
  const modal = document.getElementById("modal");
  const openModalBtn = document.getElementById("header_Ajustes");
  const closeModalBtn = document.getElementById("close_modal");

  // Abrir el modal al hacer clic en el botón "Ajustes"
  openModalBtn.addEventListener("click", () => {
    modal.classList.remove("hidden_modal");
  });

  // Cerrar el modal al hacer clic en el botón "Cerrar"
  closeModalBtn.addEventListener("click", () => {
    modal.classList.add("hidden_modal");
  });

  // Cerrar el modal si se hace clic fuera del contenido
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.add("hidden_modal");
    }
  });
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

  // Llamar a toggleModal para configurar los eventos del modal
  toggleModal();
}

// Iniciar la actualización de datos cada 30 segundos (30000 ms)
window.onload = () => {
  setupClickEvents();
  obtenerDatosApi(); // Llamamos a la función cuando la página cargue
  setupClickEvents(); // Configuramos los eventos de click
  setInterval(obtenerDatosApi, 30000); // Actualizar datos cada 30 segundos
};

export { datos_control_bombas, bomba_info, perilla_info, data_global };
