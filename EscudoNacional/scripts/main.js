import { EnumValorBomba } from "./Enum.js";
import InitParoArranque from "./arranqueYparo.js";
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

window.onload = () => {
  //console.log("pagina cargada");
  INIT();
  initLogin();
  InitMap();
  InitParoArranque();
};

function INIT() {
  ClickEvents();
  fetchTablaSimplificada()
    .then((response) => {
      DATA_GLOBAL = response[0];

      UpdateUI(DATA_GLOBAL);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  setInterval(() => {
    fetchTablaSimplificada()
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
  setSeñales();
  setBombaImg();
  setAlertasIcons();
}

function ClickEvents() {
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

function setSeñales() {
  const SIGNALS = DATA_GLOBAL.signals;
  const $TBody = document.getElementById("señales-tbody");

  let voltajeCounter = 0; // Contador para señales de voltaje
  let corrienteCounter = 0; // Contador para señales de Corriente

  $TBody.innerHTML = "";

  const excludedTypes = [11, 12, 13, 14, 15]; // Tipos de señal a excluir

  SIGNALS.forEach((signal) => {
    if (excludedTypes.includes(signal.tipoSignal)) {
      return;
    }

    const $TR = document.createElement("tr");
    const $TDName = document.createElement("td");
    const $TDValue = document.createElement("td");

    // Asignar clase al TR
    const className = signal.nombre
      .replace(/[0-9]/g, "")
      .replace(/\s+/g, "")
      .toLowerCase();
    $TR.classList.add(className);

    // Nombres y valores
    switch (signal.tipoSignal) {
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
        $TDName.textContent = "Voltaje bateria";
        $TDValue.textContent = `${signal.valor} V`;
        break;

      case 16:
        $TDName.textContent = `Voltaje ${String.fromCharCode(
          65 + voltajeCounter
        )}`;
        voltajeCounter++;
        $TDValue.textContent = `${signal.valor} V`;
        break;

      case 17:
        $TDName.textContent = `Corriente ${String.fromCharCode(
          65 + corrienteCounter
        )}`;
        corrienteCounter++;
        $TDValue.textContent = `${signal.valor} A`;
        break;

      case 18:
        // $TDName.textContent = signal.nombre.replace(/[0-9]/g, "");
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

    // Si el valor está fuera de rango
    if (signal.dentroRango == 0) {
      $TDValue.textContent = "- - -";
    }

    $TR.appendChild($TDName);
    $TR.appendChild($TDValue);
    $TBody.appendChild($TR);
  });
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

  console.log(SIGNAL);

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
