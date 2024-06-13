import { fetchTablaSimplificada } from "./APIService.js";
import { EnumProyecto, EnumValorBomba } from "./Enum.js";
import funcionesTabla from "./FuncionesTablaEficiencia.js";
import { InitParoArranque } from "./arranqueYparo.js";
import { initLogin } from "./login.js";
import InitMap from "./mapa.js";

let DATA_GLOBAL = [];

const $header_title = document.querySelector(".header_title");
const $header__status = document.querySelector("#header__status");
const $header__date = document.querySelector("#header__date");
const $BombaEstado = document.querySelector(".imgBombaSection");
const $TablaSeñales = document.querySelector(".tablaSeñales");
const $MapaButton = document.querySelector("#mapaButton");
const $TablaButton = document.querySelector("#tablaButton");
const $Map = document.querySelector(".map__Container");
const $alertasIcons = document.querySelector(".alertasIcons");
const $arranque__bombas = document.querySelector(".arranque__bombas");
const $señalesCat = document.querySelector("#señalesCat");
const $calculoCat = document.querySelector("#calculoCat");

let Presion_DeCampo;
let Gasto_DeCampo;
let DiametroInternoDeLaTuberia;

let FrecuenciaDeRotacion;
let Nivel_DeCampo;
let NivelEstatico;
let NivelTuberiaDeDescarga;
let LecturaManometroDescarga;

let PresionDescarga;
let AreaTuberiaDescarga;
let Gasto;
let CargaDeVelocidad;
let PerdidasDeFriccionEnLaColumna;

let CargaALaDescarga;
let CargaTotal;
let Corriente_DeCampo;
let Tension_DeCampo;
let FactorPotencia_DeCampo;
let PotenciaDeEntrada;
let PotenciaDeSalida;
let EficienciaElectromecanica;

let Abatimiento;
let RendimientoHidraulico;

let PROYECTO = EnumProyecto.Escudo;

if (PROYECTO != EnumProyecto.Escudo) {
  console.log("hola");
  $señalesCat.style.display = "none";
  $calculoCat.style.display = "none";
}

// Datos de ejemplo
const datosTabla = [
  {
    clase: "de-campo",
    celdas: ["Presión", "2.15"],
    id: "Presion_DeCampo",
  },
  {
    clase: "de-campo",
    celdas: ["Gasto", "54.4"],
    id: "Gasto_DeCampo",
  },
  { clase: "", celdas: ["", ""] },

  {
    clase: "de-campo",
    type: "caja",
    celdas: ["Nivel dinámico", "60"],
    id: "Nivel_DeCampo",
  },
  {
    clase: "de-campo",
    type: "caja",
    celdas: ["Nivel estático", "59"],
    id: "NivelEstatico",
  },

  {
    clase: "de-campo",
    celdas: ["Corriente promedio", "148"],
    id: "Corriente_DeCampo",
  },
  {
    clase: "de-campo",
    celdas: ["Tensión promedio", "455"],
    id: "Tension_DeCampo",
  },
  {
    clase: "de-campo",
    celdas: ["Factor potencia promedio", "0"],
    id: "FactorPotencia_DeCampo",
  },
  {
    clase: "calculos-buenos",
    celdas: ["Eficiencia electromecánica", "38%"],
    id: "EficienciaElectromecanica",
  },
  {
    clase: "calculos-buenos",
    celdas: ["Rendimiento hidráulico", "54.40"],
    id: "RendimientoHidraulico",
  },
  {
    clase: "constantes",
    type: "caja",
    celdas: ["Frecuencia de rotación", "1500"],
    id: "FrecuenciaDeRotacion",
  },
  {
    clase: "constantes",
    type: "caja",
    celdas: ["Diámetro interno de la tubería", "0.15"],
    id: "DiametroInternoDeLaTuberia",
  },

  {
    clase: "constantes",
    celdas: ["Nivel tubería de descarga", "0.75"],
    id: "NivelTuberiaDeDescarga",
  },
  {
    clase: "calculos",
    celdas: ["Lectura manómetro de descarga", "21.50"],
    id: "LecturaManometroDescarga",
  },
  {
    clase: "calculos",
    celdas: ["Presión descarga", "22.25"],
    id: "PresionDescarga",
  },
  {
    clase: "calculos",
    celdas: ["Area tubería descarga", "0.02"],
    id: "AreaTuberiaDescarga",
  },
  { clase: "calculos", celdas: ["Gasto", "0.054"], id: "Gasto" },
  {
    clase: "calculos",
    celdas: ["Carga de velocidad", "0.48"],
    id: "CargaDeVelocidad",
  },
  {
    clase: "constantes",
    type: "caja",
    celdas: ["Pérdidas de fricción en la columna", "1.00"],
    id: "PerdidasDeFriccionEnLaColumna",
  },
  {
    clase: "calculos",
    celdas: ["Carga a la descarga", "23.73"],
    id: "CargaALaDescarga",
  },
  {
    clase: "calculos",
    celdas: ["Carga total", "83.73"],
    id: "CargaTotal",
  },
  { clase: "calculos", celdas: ["Corriente A", ""], id: "corrientea" },
  { clase: "calculos", celdas: ["Corriente B", ""], id: "corrienteb" },
  { clase: "calculos", celdas: ["Corriente C", ""], id: "corrientec" },

  { clase: "calculos", celdas: ["Tensión AB", ""], id: "tensionab" },
  { clase: "calculos", celdas: ["Tensión AC", ""], id: "tensionac" },
  { clase: "calculos", celdas: ["tensión BC", ""], id: "tensionbc" },

  { clase: "calculos", celdas: ["Factor de potencia A", ""] },
  { clase: "calculos", celdas: ["Factor de potencia B", ""] },
  { clase: "calculos", celdas: ["Factor de potencia C", ""] },

  {
    clase: "calculos",
    celdas: ["Potencia de entrada", "116.64"],
    id: "PotenciaDeEntrada",
  },
  {
    clase: "calculos",
    celdas: ["Potencia de salida", "44.69"],
    id: "PotenciaDeSalida",
  },

  { clase: "", celdas: ["", ""] },
  {
    clase: "calculos",
    celdas: ["Abatimiento", "1.00"],
    id: "Abatimiento",
  },
];

window.onload = () => {
  INIT();
};

function INIT() {
  initLogin();
  InitParoArranque(PROYECTO);
  fetchTablaSimplificada(PROYECTO)
    .then((response) => {
      DATA_GLOBAL = response[0];

      console.log(DATA_GLOBAL);

      UpdateUI(DATA_GLOBAL);
      ClickEvents(DATA_GLOBAL);

      InitMap(DATA_GLOBAL);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  setInterval(() => {
    fetchTablaSimplificada(PROYECTO)
      .then((response) => {
        DATA_GLOBAL = response[0];

        //console.log(DATA_GLOBAL);

        UpdateUI(DATA_GLOBAL);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, 10000);
}

function UpdateUI(DATA) {
  $header_title.textContent = DATA.nombre;
  setHeaderEnlace(DATA);
  setFechaHeader(DATA);
  setBombaImg();
  setAlertasIcons();

  // Determinar qué tabla está activa
  if ($señalesCat.classList.contains("catActive")) {
    createTableSeñales();
  } else if ($calculoCat.classList.contains("catActive")) {
    // createTableCalculo(DATA);
    updateDatosCampo(DATA);
    updateDatosDependientes(DATA);
  }
}

function ClickEvents(DATA_GLOBAL) {
  $MapaButton.addEventListener("click", () => {
    if ($Map.classList.contains("mapActive")) {
      $Map.classList.remove("mapActive");
    } else {
      $Map.classList.add("mapActive");
      $TablaSeñales.classList.remove("tableActive");
    }
  });

  $TablaButton.addEventListener("click", () => {
    if ($TablaSeñales.classList.contains("tableActive")) {
      $TablaSeñales.classList.remove("tableActive");
    } else {
      $TablaSeñales.classList.add("tableActive");
      $Map.classList.remove("mapActive");
    }
  });

  selectCatTabla(DATA_GLOBAL);
}

function setHeaderEnlace(DATA) {
  $header__status.innerHTML = "";

  const ENLACE_VALUE = DATA.enlace;
  let ENLACE_txt;
  let ENLACE_color;

  switch (ENLACE_VALUE) {
    case 0:
      ENLACE_txt = "Fuera de línea";
      ENLACE_color = "red";
      break;
    case 1:
      ENLACE_txt = "En línea";
      ENLACE_color = "rgb(0, 128, 0)";
      break;
    case 2:
      ENLACE_txt = "En línea";
      ENLACE_color = "rgb(0, 128, 0)";
      break;
    case 3:
      ENLACE_txt = "En línea";
      ENLACE_color = "rgb(0, 128, 0)";
      break;
  }

  $header__status.style.color = ENLACE_color;
  $header__status.textContent = ENLACE_txt;
}

function setFechaHeader(DATA) {
  $header__date.innerHTML = "";

  const TIEMPO_VALUE = DATA.tiempo;
  const FechaFormat = FechaFormateada(TIEMPO_VALUE);

  $header__date.textContent = FechaFormat;
}

function FechaFormateada(TIEMPO) {
  const date = new Date(TIEMPO);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year}, ${hours}:${minutes}`;
}

function setBombaImg() {
  const SIGNALS = DATA_GLOBAL.signals;

  //console.log(SIGNALS);

  SIGNALS.forEach((signal) => {
    switch (signal.tipoSignal) {
      case 7:
        setBombaEstado(signal);
        break;
    }
  });
}

function selectCatTabla(DATA) {
  const activeClass = "catActive";

  $señalesCat.addEventListener("click", () => {
    document.querySelector(`.${activeClass}`)?.classList.remove(activeClass);
    $señalesCat.classList.add(activeClass);
    createTableSeñales();
  });

  $calculoCat.addEventListener("click", () => {
    document.querySelector(`.${activeClass}`)?.classList.remove(activeClass);
    $calculoCat.classList.add(activeClass);
    createTableCalculo(DATA);
    updateDatosDependientes(DATA);
    obtenerReferenciasTabla();
  });
}

function createTableSeñales() {
  const SIGNALS = DATA_GLOBAL.signals;
  const $TBody = document.getElementById("señales-tbody");

  let voltajeCounter = 0; // Contador para señales de voltaje
  let corrienteCounter = 0; // Contador para señales de corriente

  const señalesH = [1, 2, 3, 4, 5, 6, 7, 8]; // Señales hidráulicas
  const señalesE = [10, 16, 17, 18, 19]; // Señales eléctricas
  const excludedTypes = [11, 12, 13, 14, 15]; // Tipos de señal que no se agregan

  $TBody.innerHTML = "";

  //console.log(SIGNALS);

  // Función para crear filas de señales
  const createSignalRow = (signal) => {
    const $TR = document.createElement("tr");
    const $TDName = document.createElement("td");
    const $TDValue = document.createElement("td");

    // Asignar clase al TR
    const className = signal.nombre.split(" ")[0].toLowerCase();
    $TR.classList.add(className);

    // Nombres y valores
    switch (signal.tipoSignal) {
      case 1:
        $TDName.textContent = signal.nombre;

        $TDValue.textContent = `${signal.valor} m`;
        break;
      case 7:
        $TDName.textContent = "Estado bomba";
        switch (signal.valor) {
          case 0:
            $TDValue.textContent = "---";
            break;
          case 1:
            $TDValue.textContent = "Encendida";
            break;
          case 2:
            $TDValue.textContent = "Apagada";
            break;
          case 3:
            $TDValue.textContent = "Falla";
            break;
        }
        break;

      case 8:
        $TDName.textContent = "Estado perilla";
        switch (signal.valor) {
          case 0:
            $TDValue.textContent = "Off";
            break;
          case 1:
            $TDValue.textContent = "Remoto";
            break;
          case 2:
            $TDValue.textContent = "Local";
            break;
        }
        break;

      case 10:
        $TDName.textContent = "Voltaje batería";
        $TDValue.textContent = `${signal.valor} V`;
        break;

      case 16:
        $TDName.textContent = signal.nombre;
        voltajeCounter++;
        $TDValue.textContent = `${signal.valor} V`;
        break;

      case 17:
        $TDName.textContent = signal.nombre;
        corrienteCounter++;
        $TDValue.textContent = `${signal.valor} A`;
        break;

      case 18:
        $TDName.textContent = "Potencia total";
        $TDValue.textContent = `${signal.valor} kW`;
        break;

      case 19:
        $TDName.textContent = "Factor de potencia";
        $TDValue.textContent = `${signal.valor} %`;
        break;

      default:
        $TDName.textContent = signal.nombre.replace(/[0-9]/g, "");
        switch (signal.tipoSignal) {
          case 2:
            $TDName.textContent = "Presión";
            $TDValue.textContent = `${signal.valor} kg/cm²`;
            break;
          case 3:
            $TDValue.textContent = `${signal.valor} l/s`;
            break;
          case 4:
            $TDValue.textContent = `${signal.valor} m³`;
            break;
          default:
            $TDValue.textContent = `${signal.valor}`;
        }
    }

    // Si el valor está fuera de rango para tipoSignal 1, 2, 3, 4
    if (signal.dentroRango == 0 && [1, 2, 3, 4].includes(signal.tipoSignal)) {
      $TDValue.textContent = "- - -";
    }

    $TR.appendChild($TDName);
    $TR.appendChild($TDValue);
    return $TR;
  };

  // Agregar un caption y señales por categoría
  const appendSignalsByCategory = (category, captionText) => {
    const $TR = document.createElement("tr");
    const $TD = document.createElement("td");
    $TD.textContent = captionText;

    $TD.setAttribute("colspan", "2");

    $TR.appendChild($TD);

    $TR.classList.add("categoriaNombre");
    $TBody.appendChild($TR);

    SIGNALS.forEach((signal) => {
      if (
        category.includes(signal.tipoSignal) &&
        !excludedTypes.includes(signal.tipoSignal)
      ) {
        const $TR = createSignalRow(signal);
        $TBody.appendChild($TR);
      }
    });
  };

  // Agregar señales hidráulicas
  appendSignalsByCategory(señalesH, "Variables Hidráulicas");

  // Agregar señales eléctricas
  appendSignalsByCategory(señalesE, "Variables Eléctricas");
}

function createTableCalculo(DATA) {
  const $TBody = document.getElementById("señales-tbody");
  $TBody.innerHTML = "";
  // Filtrar y crear filas y celdas
  datosTabla.forEach((dato) => {
    // Filtrar datos vacíos
    const hasEmptyData = dato.celdas.some((celda) => celda.trim() === "");
    if (hasEmptyData) return;

    const $TR = document.createElement("tr");
    $TR.className = dato.clase;

    dato.celdas.forEach((celda, index) => {
      const $TD = document.createElement("td");
      if (index === 1 && dato.type === "caja") {
        // Se crean los input text y submit  si tienen la clase 'caja'
        const $inputTXT = document.createElement("input");
        const $inputSUBMIT = document.createElement("input");
        $inputSUBMIT.type = "submit";
        $inputSUBMIT.value = "Enviar";
        $inputTXT.type = "text";
        $inputTXT.placeholder = celda;
        $TD.append($inputTXT, $inputSUBMIT);

        // ClickEvent de los submit
        $inputSUBMIT.addEventListener("click", (e) => {
          e.preventDefault();
          console.log(DATA)
          const newValue = $inputTXT.value;
          if (newValue.trim() !== "") {
            celda = newValue; // Actualizar el valor en los datos
            updateDatosDependientes(DATA_GLOBAL);
          }
        });

      } else {
        $TD.textContent = celda;
      }
      if (index === 1 && dato.id) {
        $TD.id = dato.id;
      }
      $TR.appendChild($TD);
    });

    $TBody.appendChild($TR);
  });

  obtenerReferenciasTabla();
  updateDatosCampo(DATA);
}

function obtenerReferenciasTabla() {
  Presion_DeCampo = document.querySelector("#Presion_DeCampo");
  Gasto_DeCampo = document.querySelector("#Gasto_DeCampo");
  DiametroInternoDeLaTuberia = document.querySelector(
    "#DiametroInternoDeLaTuberia"
  );
  FrecuenciaDeRotacion = document.querySelector("#FrecuenciaDeRotacion");
  Nivel_DeCampo = document.querySelector("#Nivel_DeCampo");
  NivelEstatico = document.querySelector("#NivelEstatico");
  NivelTuberiaDeDescarga = document.querySelector("#NivelTuberiaDeDescarga");
  LecturaManometroDescarga = document.querySelector(
    "#LecturaManometroDescarga"
  );
  PresionDescarga = document.querySelector("#PresionDescarga");
  AreaTuberiaDescarga = document.querySelector("#AreaTuberiaDescarga");
  Gasto = document.querySelector("#Gasto");
  CargaDeVelocidad = document.querySelector("#CargaDeVelocidad");
  PerdidasDeFriccionEnLaColumna = document.querySelector(
    "#PerdidasDeFriccionEnLaColumna"
  );
  CargaALaDescarga = document.querySelector("#CargaALaDescarga");
  CargaTotal = document.querySelector("#CargaTotal");
  Corriente_DeCampo = document.querySelector("#Corriente_DeCampo");
  Tension_DeCampo = document.querySelector("#Tension_DeCampo");
  FactorPotencia_DeCampo = document.querySelector("#FactorPotencia_DeCampo");
  PotenciaDeEntrada = document.querySelector("#PotenciaDeEntrada");
  PotenciaDeSalida = document.querySelector("#PotenciaDeSalida");
  EficienciaElectromecanica = document.querySelector(
    "#EficienciaElectromecanica"
  );
  Abatimiento = document.querySelector("#Abatimiento");
  RendimientoHidraulico = document.querySelector("#RendimientoHidraulico");
}

function updateDatosCampo(DATA) {
  const presion = DATA.signals.filter((signal) => signal.tipoSignal == 2)[0];
  const gasto = DATA.signals.filter((signal) => signal.tipoSignal == 3)[0];
  let FACTOR_POTENCIA_PROM = DATA.signals.filter(
    (signal) => signal.tipoSignal == 19
  )[0];

  const TENSION_PROMEDIO = DATA.signals.filter(
    (signal) => signal.tipoSignal == 16
  )[3] ?? { valor: Math.random().toFixed(2) };
  const CORRIENTE_PROMEDIO = DATA.signals.filter(
    (signal) => signal.tipoSignal == 17
  )[3] ?? { valor: Math.random().toFixed(2) };

  updateElement("Presion_DeCampo", `${presion.valor} kg/cm²`);
  updateElement("Gasto_DeCampo", `${gasto.valor} l/s`);
  updateElement("FactorPotencia_DeCampo", `${FACTOR_POTENCIA_PROM.valor} %`);

  //updateElement("Corriente_DeCampo", `${CORRIENTE_PROMEDIO.valor} A`);
  //updateElement("Tension_DeCampo", `${TENSION_PROMEDIO.valor} V`);
}

function updateElement(id, value) {
  const element = document.getElementById(id);
  if (element) {
    if (element.classList.contains("caja")) {
      const input = element.querySelector("input[type='text']");
      if (input) {
        input.placeholder = value;
      }
    } else {
      element.innerHTML = value;
    }
  }
}

function updateDatosDependientes(DATA) {
  let presion = DATA.signals.filter((signal) => signal.tipoSignal == 2)[0];
  const gasto = DATA.signals.filter((signal) => signal.tipoSignal == 3)[0];

  let TENSION_PROMEDIO = 455;
  let CORRIENTE_PROMEDIO = 148;
  let NIVEL_DINAMICO = 60;
  let NIVEL_ESTATICO = 49;

  let FACTOR_POTENCIA_PROM = DATA.signals.filter(
    (signal) => signal.tipoSignal == 19
  )[0];
  // let TENSION_PROMEDIO = DATA.signals.filter(
  //   (signal) => signal.tipoSignal == 16
  // )[3];
  // let CORRIENTE_PROMEDIO = DATA.signals.filter(
  //   (signal) => signal.tipoSignal == 17
  // )[3];
  // const NIVEL_DINAMICO = DATA.signals.filter(
  //   (signal) => signal.tipoSignal == 1
  // )[0];
  // const NIVEL_ESTATICO = DATA.signals.filter(
  //   (signal) => signal.tipoSignal == 1
  // )[1];

  const nivelDinamicoInput = document
    .getElementById("Nivel_DeCampo")
    ?.querySelector("input[type='text']");
  const nivelEstaticoInput = document
    .getElementById("NivelEstatico")
    ?.querySelector("input[type='text']");
  const diametroInput = document
    .getElementById("DiametroInternoDeLaTuberia")
    ?.querySelector("input[type='text']");
  const frecuenciaInput = document
    .getElementById("FrecuenciaDeRotacion")
    ?.querySelector("input[type='text']");
  const perdidasFriccionInput = document
    .getElementById("PerdidasDeFriccionEnLaColumna")
    ?.querySelector("input[type='text']");

  // Validaciones, si el inpiut esta vacio usar los datos por defecto
  if (nivelDinamicoInput && nivelDinamicoInput.value.trim() !== "") {
    NIVEL_DINAMICO = parseFloat(nivelDinamicoInput.value);
  } else if (nivelDinamicoInput) {
    NIVEL_DINAMICO = parseFloat(nivelDinamicoInput.placeholder);
  }

  if (nivelEstaticoInput && nivelEstaticoInput.value.trim() !== "") {
    NIVEL_ESTATICO = parseFloat(nivelEstaticoInput.value);
  } else if (nivelEstaticoInput) {
    NIVEL_ESTATICO = parseFloat(nivelEstaticoInput.placeholder);
  }

  if (diametroInput && diametroInput.value.trim() !== "") {
    funcionesTabla.DiametroInternoDeLaTuberia = parseFloat(diametroInput.value);
  } else if (diametroInput) {
    funcionesTabla.DiametroInternoDeLaTuberia = parseFloat(
      diametroInput.placeholder
    );
  }

  if (frecuenciaInput && frecuenciaInput.value.trim() !== "") {
    funcionesTabla.FrecuenciaDeRotacion = parseFloat(frecuenciaInput.value);
  } else if (frecuenciaInput) {
    funcionesTabla.FrecuenciaDeRotacion = parseFloat(
      frecuenciaInput.placeholder
    );
  }

  if (perdidasFriccionInput && perdidasFriccionInput.value.trim() !== "") {
    funcionesTabla.PerdidasDeFriccionEnLaColumna = parseFloat(
      perdidasFriccionInput.value
    );
  } else if (perdidasFriccionInput) {
    funcionesTabla.PerdidasDeFriccionEnLaColumna = parseFloat(
      perdidasFriccionInput.placeholder
    );
  }

  const _potenciaEntrada = funcionesTabla.PotenciaDeEntrada(
    CORRIENTE_PROMEDIO,
    TENSION_PROMEDIO,
    FACTOR_POTENCIA_PROM.valor / 100
  );

  const _lecturaManometro = funcionesTabla.LecturaManometroDescarga(
    presion.valor
  );

  const _gasto = funcionesTabla.Gasto(gasto.valor);
  const _presionDescarga = funcionesTabla.PresionDescarga(
    funcionesTabla.NivelTuberiaDeDescarga,
    _lecturaManometro
  );

  const _areaTuberiaDescarga = funcionesTabla.AreaTuberiaDescarga(
    funcionesTabla.DiametroInternoDeLaTuberia
  );

  const _cargaVelocidad = funcionesTabla.CargaDeVelocidad(
    _gasto,
    _areaTuberiaDescarga
  );
  const _cargaDescarga = funcionesTabla.CargaALaDescarga(
    _presionDescarga,
    _cargaVelocidad,
    funcionesTabla.PerdidasDeFriccionEnLaColumna
  );

  const _cargaTotal = funcionesTabla.CargaTotal(
    NIVEL_DINAMICO,
    parseFloat(_cargaDescarga)
  );

  const _potenciaSalida = funcionesTabla.PotenciaDeSalida(
    gasto.valor / 1000,
    _cargaTotal
  );

  const _abatimiento = funcionesTabla.Abatimiento(
    NIVEL_DINAMICO,
    NIVEL_ESTATICO
  );

  const _eficienciaElectro = funcionesTabla.EficienciaElectromecanica(
    _potenciaSalida,
    _potenciaEntrada
  );

  const _rendimientoHidra = funcionesTabla.RendimientoHidraulico(
    gasto.valor / 1000,
    _abatimiento
  );

  // Actualizar los valores recalculados
  updateElement(
    "NivelTuberiaDeDescarga",
    `${funcionesTabla.NivelTuberiaDeDescarga} m`
  );
  updateElement("LecturaManometroDescarga", `${_lecturaManometro} m`);
  updateElement("PresionDescarga", `${_presionDescarga} m`);
  updateElement("AreaTuberiaDescarga", `${_areaTuberiaDescarga} m²`);
  updateElement("Gasto", `${_gasto} m³/s`);
  updateElement("CargaDeVelocidad", `${_cargaVelocidad} m`);
  updateElement("CargaALaDescarga", `${_cargaDescarga} m`);
  updateElement("CargaTotal", `${_cargaTotal} m`);
  updateElement("PotenciaDeEntrada", `${_potenciaEntrada} kW`);
  updateElement("PotenciaDeSalida", `${_potenciaSalida} kW`);
  updateElement("EficienciaElectromecanica", `${_eficienciaElectro} %`);
  updateElement("Abatimiento", `${_abatimiento} m`);
  updateElement("RendimientoHidraulico", `${_rendimientoHidra} l/s/m`);
}

function setBombaEstado(SIGNAL) {
  let Background;

  switch (SIGNAL.valor) {
    case 0:
      $BombaEstado.style.display = "none";
      break;
    case 1:
      $BombaEstado.style.display = "block";
      Background =
        "https://virtualwavecontrol.com.mx/RecursosWeb/Client/PozosSistemaLerma/Sitios/LN%20148/Particular/b/b1_1.png?v=1";
      break;
    case 2:
      $BombaEstado.style.display = "block";
      Background =
        "https://virtualwavecontrol.com.mx/RecursosWeb/Client/PozosSistemaLerma/Sitios/LN%20148/Particular/b/b1_2.png?v=1";
      break;
    case 3:
      $BombaEstado.style.display = "block";
      Background =
        "https://virtualwavecontrol.com.mx/RecursosWeb/Client/PozosSistemaLerma/Sitios/LN%20148/Particular/b/b1_3.png?v=1";
      break;
  }

  $BombaEstado.style.background = `url(${Background})`;
  $BombaEstado.style.backgroundSize = "cover";
  $BombaEstado.style.backgroundRepeat = "no-repeat";
}

function setAlertasIcons() {
  const SIGNALS = DATA_GLOBAL.signals;

  $alertasIcons.innerHTML = "";

  console.log(SIGNALS);

  SIGNALS.forEach((signal) => {
    switch (signal.tipoSignal) {
      case 7:
        createBombaCarrusel(signal);
        break;

      case 8:
        const $bomba = document.querySelector(".itemBombaImg");
        $bomba.perilla = signal.valor;
        break;

      case 12:
        setFallaAC(signal);
        break;

      case 15:
        setPuertaAbierta(signal);
        break;
    }
  });
}

function setFallaAC(SIGNAL) {
  switch (SIGNAL.valor) {
    case 0:
      const img = document.createElement("img");
      img.setAttribute(
        "src",
        "https://virtualwavecontrol.com.mx/RecursosWeb/Client/PozosSistemaLerma/Iconos/BackupEnergy.png?v=1"
      );

      $alertasIcons.appendChild(img);
      break;

    case 1:
      break;
  }
}

function setPuertaAbierta(SIGNAL) {
  switch (SIGNAL.valor) {
    case 0:
      // no puerta abierta
      const img = document.createElement("img");
      img.setAttribute(
        "src",
        "https://virtualwavecontrol.com.mx/RecursosWeb/Client/PozosSistemaLerma/Iconos/IsCaseClosed.png?v=1"
      );
      $alertasIcons.appendChild(img);
      break;
    case 1:
      // si puerta abierta
      break;
  }
}

function createBombaCarrusel(SIGNAL) {
  $arranque__bombas.innerHTML = "";
  let INDEX = 1;

  let isOn = EnumValorBomba.NoDisponible;

  const div = document.createElement("div");
  const spanEstado = document.createElement("span");
  const imgBomba = document.createElement("div");
  const spanNombre = document.createElement("span");

  imgBomba.idEstacion = SIGNAL.idEstacion;
  imgBomba.idSignal = SIGNAL.idSignal;
  imgBomba.ordinal = SIGNAL.ordinal;
  imgBomba.nombre = SIGNAL.nombre;
  imgBomba.enLinea = SIGNAL.valor;

  //console.log(SIGNAL);

  div.classList.add("item__bomba");
  spanEstado.classList.add("itemBombaStatus");
  imgBomba.classList.add("itemBombaImg");
  spanNombre.classList.add("itemBombaNombreF");

  spanNombre.textContent = `B${INDEX}`;
  INDEX++;

  switch (SIGNAL.valor) {
    case 0:
      spanEstado.textContent = "No Disponible";
      imgBomba.style.filter = "hue-rotate(0deg)"; // gris
      isOn = EnumValorBomba.NoDisponible;
      break;

    case 1:
      spanEstado.textContent = "ON";
      imgBomba.style.filter = "hue-rotate(120deg)"; // verde
      isOn = EnumValorBomba.Arrancada;
      break;

    case 2:
      spanEstado.textContent = "OFF";
      imgBomba.style.filter = "hue-rotate(0deg) saturate(100%) brightness(50%)"; // roja
      isOn = EnumValorBomba.Apagada;
      break;

    case 3:
      spanEstado.textContent = "FALLA";
      imgBomba.style.filter = "hue-rotate(0deg)"; // gris
      isOn = EnumValorBomba.Falla;
      break;
  }

  imgBomba.isOn = isOn;

  imgBomba.style.background = `url(https://virtualwavecontrol.com.mx/RecursosWeb/Client/PozosSistemaLerma/Control/btn_bomba.png?v=1)`;
  imgBomba.style.backgroundSize = "contain";
  imgBomba.style.backgroundRepeat = "no-repeat";

  div.append(spanEstado, imgBomba, spanNombre);

  $arranque__bombas.append(div);
}

export { INIT };
