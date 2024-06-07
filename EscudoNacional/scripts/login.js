import { Credentials } from "./Credentials.js";
import { EnumProyecto, RequestType } from "./Enum.js";
import { Fetcher } from "./Fetcher.js";

// Constantes para los elementos del DOM
const $modalLogin = document.querySelector(".modalLogin");
const $closeModal = document.querySelector(".modal__closeLogin");
const $confirmarModal = document.querySelector(".modal__confirmarLogin");
const $loginButton = document.querySelector("#loginButton");
const $logoutButton = document.querySelector("#logoutButton");
const USUARIO = document.querySelector("#usuario");
const PASSWORD = document.querySelector("#password");

// Lista de usuarios permitidos
const users = ["admin"];

// Inicializar eventos de login y logout
function initLogin() {
  attachLoginEvents();
}

function attachLoginEvents() {
  $loginButton.addEventListener("click", () => {
    $modalLogin.classList.add("modal--show");
  });

  $closeModal.addEventListener("click", (e) => {
    e.preventDefault();
    $modalLogin.classList.remove("modal--show");
  });

  $logoutButton.addEventListener("click", () => {
    performLogout(USUARIO.value, PASSWORD.value);
  });

  $confirmarModal.addEventListener("click", () => {
    const username = USUARIO.value.trim();
    const password = PASSWORD.value.trim();

    if (!username || !password) {
      alert("Los campos no pueden estar vacíos");
      return;
    }

    if (users.includes(username)) {
      performLogin(username, password);
    } else {
      alert("No tiene los permisos para acceder a esta aplicación");
      $modalLogin.classList.remove("modal--show");
    }
  });
}

async function performLogin(username, password) {
  try {
    const LOGIN_RESULT = await Fetcher.Instance.RequestData(
      "login",
      RequestType.POST,
      new Credentials(username, password, EnumProyecto.Escudo),
      true
    );

    if (LOGIN_RESULT.response) {
      Fetcher.Instance.isLogged = true;
      $modalLogin.classList.remove("modal--show");
      toggleVisibility($loginButton, false);
      toggleVisibility($logoutButton, true);
    } else {
      alert(LOGIN_RESULT.message);
    }
  } catch (error) {
    console.error("Error en el login:", error);
  }
}

async function performLogout(username, password) {
  try {
    const LOGOUT_RESULT = await Fetcher.Instance.RequestData(
      "logout",
      RequestType.POST,
      new Credentials(username, password, EnumProyecto.Escudo),
      true
    );

    if (!LOGOUT_RESULT.response) {
      alert("La sesión se ha cerrado correctamente");
      toggleVisibility($loginButton, true);
      toggleVisibility($logoutButton, false);
      Fetcher.Instance.isLogged = false;
    }
  } catch (error) {
    console.error("Error en el logout:", error);
  }
}

// Cambiar la visibilidad de un elemento
function toggleVisibility(element, show) {
  element.style.display = show ? "flex" : "none";
}

// Cerrar sesión antes de recargar la página
window.onbeforeunload = function () {
  if (Fetcher.Instance.isLogged) {
    $logoutButton.click();
  }
};

export { initLogin, USUARIO };
