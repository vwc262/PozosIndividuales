import {
  EnumControllerMapeo,
  EnumEstadoComando,
  EnumProyecto,
  EnumValorBomba,
  RequestType,
} from "./Enum.js";
import { Fetcher } from "./Fetcher.js";
import { USUARIO } from "./login.js";

let $panelBombasIcon = document.querySelector(".panelBombasIcon");
let $arranqueContainer = document.querySelector(".arranque__paro");
let $base = document.querySelector(".baseImg");
let $panel = document.querySelector(".panel");
let $closeBtn = document.querySelector(".arranque__closeBtn");
let $accionImg = document.querySelector(".accionImg");
let $encenderTXT = document.querySelector(".encenderTXT");
let $apagarTXT = document.querySelector(".apagarTXT");
let $confirmarTXT = document.querySelector(".confirmarTXT");
let $buttonConfirmar = document.querySelector(".buttonConfirmar");

const $modalTitle = document.querySelector(".modal__title2");
const $modalText = document.querySelector(".modal__paragraph2");
const $modal = document.querySelector(".modal");
const $closeModal = document.querySelector(".modal__close2");

let codigo;
let isOnState = true;

let proyecto;
let DATOS = [];
let SITIO_ESTADO = 0;

const images = [
  "https://virtualwavecontrol.com.mx/RecursosWeb/Client/PozosSistemaLerma/Control/BTN_ON.png?v=1",
  "https://virtualwavecontrol.com.mx/RecursosWeb/Client/PozosSistemaLerma/Control/BTN_STOP.png?v=1",
];

function InitParoArranque(PROYECTO, DATA_GLOBAL) {
  DATOS = DATA_GLOBAL;
  proyecto = PROYECTO;
  SITIO_ESTADO = DATOS.enlace;

  ClickEvents();
}

function ClickEvents() {
  $panelBombasIcon.addEventListener("click", () => {
    if (Fetcher.Instance.isLogged) {
      showArranqueParo();
    } else {
      alert("Primero debe de iniciar sesión");
    }
  });

  $closeModal.addEventListener("click", hideModal);

  $closeBtn.addEventListener("click", hideArranqueParo);

  $accionImg.isOn = isOnState;
  $accionImg.addEventListener("click", CambiarAccion);

  $buttonConfirmar.addEventListener("click", EnviarComando);
}

function showArranqueParo() {
  $arranqueContainer.style.opacity = "1";
  $arranqueContainer.style.pointerEvents = "auto";
  $base.setAttribute(
    "src",
    "https://virtualwavecontrol.com.mx/RecursosWeb/Client/PozosSistemaLerma/Control/transition.gif?v=1"
  );
  $panel.style.transform = "translateY(0)";
}

function hideArranqueParo() {
  $panel.style.transform = "translateY(500px)";
  $arranqueContainer.style.opacity = "0";
  $arranqueContainer.style.pointerEvents = "none";
  $base.setAttribute(
    "src",
    "https://virtualwavecontrol.com.mx/RecursosWeb/WebCore24/TanquesPadierna/Control/transition_inicio.png?v=3.7"
  );
}

function showModal(title, text) {
  $modalTitle.textContent = title;
  $modalText.textContent = text;
  $modal.classList.add("modal--show");
}

function hideModal() {
  $modal.classList.remove("modal--show");
}

function CambiarAccion(ev) {
  const BackgroundButton = isOnState ? images[1] : images[0];

  $accionImg.setAttribute("src", `${BackgroundButton}`);

  $apagarTXT.style.color = isOnState ? "rgb(115, 115, 115)" : "green";
  $encenderTXT.style.color = isOnState ? "red" : "rgb(115, 115, 115)";

  const actionTXT = isOnState ? "Apagar B1" : "Encender B1";
  $confirmarTXT.style.color = "goldenrod";
  $confirmarTXT.textContent = actionTXT;

  isOnState = !isOnState;
  ev.currentTarget.isOnState = isOnState;
}

function ArmarCodigo() {
  let $Bomba = document.querySelector(".itemBombaImg");

  const ID_ESTACION = 62;
  const ENCODER_ON = 1;
  const ENCODER_OFF = 2;

  const estacion = ID_ESTACION << 8;
  const ordinal = ($Bomba.ordinal || 0) << 4;
  const encoder = isOnState ? ENCODER_ON : ENCODER_OFF;

  return estacion | ordinal | encoder;
}

async function RequestComando() {
  let $Bomba = document.querySelector(".itemBombaImg");
  const usuario = USUARIO.value;
  const codigo = ArmarCodigo();

  if (codigo === null) {
    console.error("Error al armar el código");
    return;
  }

  try {
    const COMANDO_RESULT = await Fetcher.Instance.RequestData(
      `${EnumControllerMapeo.INSERTCOMANDO}?IdProyecto=${proyecto}`,
      RequestType.POST,
      {
        Usuario: `web24-${usuario}`,
        idEstacion: $Bomba.idEstacion,
        Codigo: codigo,
        RegModbus: 2020,
      },
      true
    );

    if (COMANDO_RESULT.exito) {
      ObtenerEstadoComando();
    } else {
      console.error("Error en la respuesta del comando", COMANDO_RESULT);
    }
  } catch (error) {
    console.error("Error al enviar el comando", error);
  }
}

async function EnviarComando() {
  let $Bomba = document.querySelector(".itemBombaImg");

  const enLinea = $Bomba.enLinea;
  const perillaBomba = $Bomba.perilla;
  const valorBomba = $Bomba.enLinea;

  if (SITIO_ESTADO == 1 || SITIO_ESTADO == 2) {
    if (perillaBomba == 1) {
      if (
        valorBomba == EnumValorBomba.Arrancada ||
        valorBomba == EnumValorBomba.Apagada
      ) {
        let accion = document.querySelector(".accionImg").isOnState;
        if (accion && valorBomba != EnumValorBomba.Arrancada) {
          await RequestComando(); // para prender
        } else if (!accion && valorBomba != EnumValorBomba.Apagada) {
          await RequestComando(); // para apagar
        } else {
          showModal(
            "Aviso",
            accion ? "La bomba ya está encendida" : "La bomba ya está apagada"
          );
        }
      } else {
        showModal("Aviso", "La bomba debe estar encendida o apagada");
      }
    } else {
      showModal("Aviso", "La perilla debe estar en Remoto");
    }
  } else {
    showModal("Aviso", "El sitio no está en línea");
  }
}

async function ObtenerEstadoComando() {
  let $Bomba = document.querySelector(".itemBombaImg");

  let ALERT_SETTED = false;
  let ESTADO_AUX = EnumEstadoComando.Insertado;

  const TIEMPO_INIT = new Date();
  const TOLERANCIA_MIN = 0.5;
  const USUARIO_COMANDO = USUARIO.value;
  const ID_ESTACION = $Bomba.idEstacion;
  const CODIGO = codigo;

  const _interval = setInterval(async () => {
    try {
      const RESULT_INTERVAL = await Fetcher.Instance.RequestData(
        `${EnumControllerMapeo.READESTADOCOMANDO}?IdProyecto=${proyecto}`,
        RequestType.POST,
        {
          Usuario: `web24-${USUARIO_COMANDO}`,
          idEstacion: ID_ESTACION,
          Codigo: CODIGO,
          RegModbus: 2020,
        },
        true
      );

      if (ESTADO_AUX === EnumEstadoComando.Leido && !ALERT_SETTED) {
        showModal(
          "Estado Comando",
          "El comando se leyó exitosamente para ser ejecutado."
        );

        ALERT_SETTED = true;
      } else if (ESTADO_AUX === EnumEstadoComando.Ejecutado && !ALERT_SETTED) {
        showModal("Estado Comando", "El estado se ejecutó correctamente");
        clearInterval(_interval);
        ALERT_SETTED = true;
      }

      if (ESTADO_AUX !== RESULT_INTERVAL.estado) {
        ALERT_SETTED = false;
        ESTADO_AUX = RESULT_INTERVAL.estado;
      }

      if (
        new Date().getTime() - TIEMPO_INIT.getTime() >
        TOLERANCIA_MIN * (1000 * 60)
      ) {
        showModal(
          "Estado Comando",
          "Ejecutar el comando tomó más de lo esperado; Error al ejecutar comando."
        );

        clearInterval(_interval);
      }
    } catch (error) {
      clearInterval(_interval);
    }
  }, 2000);
}

export { InitParoArranque, hideArranqueParo };
