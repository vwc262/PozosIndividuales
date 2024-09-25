import { bomba_info, perilla_info, data_global } from "./main.js";
import { USUARIO } from "../scripts/login.js";
import { Fetcher } from "./fetcher.js";
import {
  EnumControllerMapeo,
  EnumEstadoComando,
  EnumValorBomba,
  RequestType,
} from "./enum.js";

const btn_control_bombas = document.getElementById("btn_control_bombas");
const btn_close_panel = document.getElementById("btn_close_panel");
const panel_container = document.querySelector(".panel_container");

let codigo;
let isOnState = true;
let SITIO_ESTADO = null;

const imgs_switch_estado = [
  "https://virtualwavecontrol.com.mx/RecursosWeb/Client/PozosSistemaLerma/Control/BTN_ON.png?v=1",
  "https://virtualwavecontrol.com.mx/RecursosWeb/Client/PozosSistemaLerma/Control/BTN_STOP.png?v=1",
];

function init_control_bombas(data) {
  SITIO_ESTADO = data.enlace;
}

function attachControlEvents() {
  btn_control_bombas.addEventListener("click", () => {
    if (Fetcher.Instance.isLogged == true) {
      mostrar_control_bombas();
    } else {
      alert("Primero debe de iniciar sesión!");
    }
  });

  // Lógica para cerrar el panel cuando se haga clic en btn_close_panel
  const btn_close_panel = document.getElementById("btn_close_panel");
  btn_close_panel.addEventListener("click", ocultar_control_bombas);
}

function mostrar_control_bombas() {
  const control_container = document.querySelector(".control_bombas_container");
  const panel_container = document.querySelector(".panel_container");
  const base_control_bomba = document.getElementById("base_control_bomba");

  base_control_bomba.src =
    "https://virtualwavecontrol.com.mx/RecursosWeb/Client/PozosSistemaLerma/Control/transition.gif?v=1";
  // Cambiar la opacidad a 1 (hace que sea visible)
  control_container.style.opacity = "1";

  // Escuchar cuando la transición de opacidad haya terminado
  // Realizar la transformación de panel_container después de que la opacidad haya cambiado
  panel_container.style.transform = "translateY(10px)";
}

function ocultar_control_bombas() {
  const control_container = document.querySelector(".control_bombas_container");
  const panel_container = document.querySelector(".panel_container");
  const base_control_bomba = document.getElementById("base_control_bomba");

  // Realizar la transformación de panel_container hacia abajo
  panel_container.style.transform = "translateY(550px)";
  control_container.style.opacity = "0";
  base_control_bomba.src =
    "https://virtualwavecontrol.com.mx/RecursosWeb/WebCore24/TanquesPadierna/Control/transition_inicio.png?v=3.7";
}

function toggle_switch_accion() {
  let isOnState = true; // El estado inicial es "encendido"

  const control_switch = document.getElementById("control_switch"); // Acceso al elemento del switch
  const btn_confirmar = document.querySelector(".img_confirmar");
  const control_txt_apagar = document.getElementById("control_txt_apagar"); // Texto para "Apagar"
  const control_txt_encender = document.getElementById("control_txt_encender"); // Texto para "Encender"
  const control_txt_confirmar = document.getElementById(
    "control_txt_confirmar"
  ); // Texto de confirmar

  btn_confirmar.addEventListener("click", () => {
    EnviarComando();
  });

  // Agregar evento de click al switch
  control_switch.addEventListener("click", () => {
    // Restablecer colores a su valor original (115,115,115)
    control_txt_apagar.style.color = "rgb(115, 115, 115)";
    control_txt_encender.style.color = "rgb(115, 115, 115)";
    control_txt_confirmar.style.color = "goldenrod";

    // Alternar el estado de isOnState
    if (isOnState) {
      control_switch.src = imgs_switch_estado[1]; // Cambiar a "apagar"
      control_txt_apagar.style.color = "red"; // Pintar el texto de "Apagar" en rojo
      control_txt_confirmar.textContent = "Apagar Bomba";
    } else {
      control_switch.src = imgs_switch_estado[0]; // Cambiar a "encender"
      control_txt_encender.style.color = "green"; // Pintar el texto de "Encender" en verde
      control_txt_confirmar.textContent = "Encender Bomba";
    }

    // Cambiar el estado para el próximo clic
    isOnState = !isOnState;
  });
}

// por ejemplo aui necesito acceder a la estacion y al ordinal que viven en bomba_info
function armar_codigo() {
  const ID_ESTACION = 1;
  const ENCODER_ON = 1;
  const ENCODER_OFF = 2;

  const estacion = ID_ESTACION << 8;
  const ordinal = bomba_info.ordinal;
  const encoder = isOnState ? ENCODER_ON : ENCODER_OFF;

  return estacion | ordinal | encoder;
}

async function RequestComando() {
  const usuario = USUARIO.value;
  const codigo = armar_codigo();

  if (codigo === null) {
    console.error("Error al armar el codigo");
    return;
  }

  try {
    const COMANDO_RESULT = await Fetcher.Instance.RequestData(
      `${EnumControllerMapeo.INSERTCOMANDO}?IdProyecto=12`,
      RequestType.POST,
      {
        Usuario: `web24-${usuario}`,
        idEstacion: bomba_info.idEstacion,
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
  const en_linea = bomba_info.valor;
  const perilla_bomba = perilla_info.valor;
  const valor_bomba = bomba_info.valor;

  if (SITIO_ESTADO == 1 || SITIO_ESTADO == 2) {
    if (perilla_bomba == 1) {
      if (valor_bomba == EnumValorBomba.Arrancada || EnumValorBomba.Apagada) {
        let accion = isOnState;
        if (accion && valor_bomba != EnumValorBomba.Arrancada) {
          await RequestComando(); //para prender
        } else if (!accion && valor_bomba != EnumValorBomba.Apagada) {
          await RequestComando(); // para apagar
        } else {
          alert(
            `${
              accion ? "La bomba ya esta encendida" : "La bomba ya esta apagada"
            }`
          );
        }
      } else {
        alert("La bomba debe de estar encendida o apagada");
      }
    } else {
      alert("La perilla debe de estar en Remoto");
    }
  } else {
    alert("El sitio no esta en linea");
  }
}

function ObtenerEstadoComando() {
  let ALERT_SETTED = FALSE;
  let ESTADO_AUX = EnumEstadoComando.Insertado;

  const TIEMPO_INIT = new Date();
  const TOLERANCIA_MIN = 0.5;
  const USUARIO_COMANDO = USUARIO.value;
  const ID_ESTACION = bomba_info.idEstacion;
  const CODIGO = codigo;

  const _interval = setInterval(async () => {
    try {
      const RESULT_INTERVAL = await Fetcher.Instance.RequestData(
        `${EnumControllerMapeo.READESTADOCOMANDO}?IdProyecto=12`,
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
        alert("El comando se leyó exitosamente para ser ejecutado");
        ALERT_SETTED = true;
      } else if (ESTADO_AUX === EnumEstadoComando.Ejecutado && !ALERT_SETTED) {
        alert("El comando se ejecuto correctamente");
        clearInterval(_interval);
        ALERT_SETTED = true;
      }

      if (ESTADO_AUX !== RESULT_INTERVAL.estado) {
        ALERT_SETTED = false;
        ESTADO_AUX = RESULT_INTERVAL.estado;
      }

      if (
        new Date.getTime() - TIEMPO_INIT.getTime() >
        TOLERANCIA_MIN * (1000 * 60)
      ) {
        alert(
          "Ejecutar el comando tomó más de lo esperado; Error al ejecutar comando."
        );
        clearInterval(_interval);
      }
    } catch (error) {
      clearInterval(_interval);
    }
  }, 2000);
}

// Iniciar la lógica
document.addEventListener("DOMContentLoaded", () => {
  attachControlEvents();
  toggle_switch_accion();
});

export { init_control_bombas, ocultar_control_bombas };
