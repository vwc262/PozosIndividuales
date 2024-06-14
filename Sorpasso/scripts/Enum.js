/**
 * @returns {{RequestType}}
 */
const RequestType = {
  GET: "GET",
  POST: "POST",
};

/**
 * @returns {EnumProyecto}
 */

const EnumProyecto = {
  Default: 0, // enum proyecto de lerma
  Sorpasso: 11,
  Escudo: 12,
};

/**
 * @returns {EnumControllerMapeo}
 */
const EnumControllerMapeo = {
  READ: "ReadSignalsEstacion",
  DELETE: "DeleteSignalMapeo",
  UPDATE: "UpdateSignalMapeo",
  INSERTCOMANDO: "InsertComando",
  READESTADOCOMANDO: "ReadEstadoComandos",
};

/**
 * @returns {EnumValorBomba}
 */
const EnumValorBomba = {
  NoDisponible: 0,
  Arrancada: 1,
  Apagada: 2,
  Falla: 3,
};

const EnumEstadoComando = {
  Default: 0,
  Insertado: 1,
  Leido: 2,
  Ejecutado: 3,
  Error: 4,
};

export {
  RequestType,
  EnumProyecto,
  EnumControllerMapeo,
  EnumValorBomba,
  EnumEstadoComando,
};
