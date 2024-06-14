/**
 * @returns {Credentials}
 */
class Credentials {
  /**
   *
   * @param {string} usuario
   * @param {string} psw
   * @param {string} idProyecto //11
   */
  constructor(usuario, psw, idProyecto) {
    this.usuario = usuario;
    this.contrasena = psw;
    this.idProyecto = idProyecto;
  }
}

export { Credentials };
