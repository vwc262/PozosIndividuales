import { Credentials } from "../scripts/credential.js";
import { EnumProyecto, RequestType } from "../scripts/enum.js";
import { Fetcher } from "../scripts/fetcher.js";
import { ocultar_control_bombas } from "./control_bombas.js";

// Iniciar la lógica del botón de login/logout
document.addEventListener("DOMContentLoaded", () => {
  init_login(); // Asegura que los eventos se adjunten solo cuando el DOM esté listo
  toggleLoginLogout(); // Inicia la lógica de login/logout
});

const $confirmar_login = document.getElementById("confirmar_modal");
const modal = document.getElementById("modal");
const USUARIO = document.getElementById("user");
const PASSWORD = document.getElementById("password");
const btnLoginLogout = document.getElementById("header_Ajustes");

// Lista de usuarios permitidos
const users = ["admin", "Poncho"];

// Variable para el temporizador
let logoutTimer;

function init_login() {
  attachLoginEvents();
}

function attachLoginEvents() {
  // Cerrar el modal al hacer clic en el botón "Confirmar"
  $confirmar_login.addEventListener("click", () => {
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
      modal.classList.add("hidden_modal");
    }
  });
}

// Función para iniciar sesión
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
      modal.classList.add("hidden_modal");
      alert(LOGIN_RESULT.message);
      toggleLoginLogout(); // Cambiar el estado del botón a Logout
      startLogoutTimer(username, password); // Iniciar temporizador de sesión
    } else {
      alert(LOGIN_RESULT.message);
    }
  } catch (error) {
    console.error("Error en el login:", error);
  }
}

// Función para manejar el cambio de estado del botón y la lógica de Logout
function toggleLoginLogout() {
  if (Fetcher.Instance.isLogged) {
    btnLoginLogout.textContent = "Logout"; // Cambiar el texto del botón a Logout

    // Cambiar la funcionalidad a cerrar sesión
    btnLoginLogout.removeEventListener("click", handleLogin);
    btnLoginLogout.addEventListener("click", handleLogout);
  } else {
    btnLoginLogout.textContent = "Login"; // Cambiar el texto a Login si no está logueado
    btnLoginLogout.removeEventListener("click", handleLogout);
  }
}

// Función para cerrar sesión
function handleLogout() {
  ocultar_control_bombas();
  Fetcher.Instance.isLogged = false;
  alert("Has cerrado sesión correctamente.");
  modal.classList.remove("hidden"); // Mostrar nuevamente el modal de login
  toggleLoginLogout(); // Cambiar el estado del botón de vuelta a Login
  clearTimeout(logoutTimer); // Limpiar el temporizador de cierre de sesión
}

// Función para manejar el clic en el botón de inicio de sesión
function handleLogin() {
  // Evitar que la función corra si el modal no está visible
  if (modal.classList.contains("hidden")) return;

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
    modal.classList.add("hidden");
  }
}

function startLogoutTimer(username, password) {
  // Limpiar temporizador
  clearTimeout(logoutTimer);

  // cerrar sesión después de 10 minutos (600,000 ms)
  logoutTimer = setTimeout(() => {
    performLogin(username, password);
    alert(
      "Sesión cerrada automáticamente después de 10 minutos de inactividad."
    );
  }, 600000); // 10 minutos
}

window.onbeforeunload = function () {
  if (Fetcher.Instance.isLogged) {
    // Llamar a la función de logout antes de cerrar la página
    handleLogout();
  }
};

export { init_login, USUARIO };
