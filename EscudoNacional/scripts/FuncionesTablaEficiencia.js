var funcionesTabla = {
  DiametroInternoDeLaTuberia: 0.2,
  FrecuenciaDeRotacion: 1500,
  NivelTuberiaDeDescarga: 0.75,
  PerdidasDeFriccionEnLaColumna: 1.0,
  NivelEstatico: function () {
    return parseFloat(59).toFixed(2);
  },
  LecturaManometroDescarga: function (presion) {
    return parseFloat(presion * 10).toFixed(2);
  },
  PresionDescarga: function (NivelTuberiaDeDescarga, LecturaManometroDescarga) {
    return parseFloat(
      NivelTuberiaDeDescarga + LecturaManometroDescarga
    ).toFixed(2);
  },
  AreaTuberiaDescarga: function (DiametroInternoTuberia) {
    return parseFloat(
      (DiametroInternoTuberia =
        (Math.PI * DiametroInternoTuberia * DiametroInternoTuberia) / 4)
    ).toFixed(2);
  },
  Gasto: function (LecturaManometroDescarga) {
    return parseFloat(LecturaManometroDescarga / 1000).toFixed(2);
  },
  CargaDeVelocidad: function (Gasto, AreaTuberiaDescarga) {
    return parseFloat(
      ((Gasto / AreaTuberiaDescarga) * (Gasto / AreaTuberiaDescarga)) /
        (2 * 9.81)
    ).toFixed(2);
  },
  CargaALaDescarga: function (
    PresionDescarga,
    CargaDeVelocidad,
    PerdidasDeFriccionEnLaColumna
  ) {
    return parseFloat(
      PresionDescarga + CargaDeVelocidad + PerdidasDeFriccionEnLaColumna
    ).toFixed(2);
  },
  CargaTotal: function (NivelDimnamico, CargaALaDescarga) {
    return parseFloat(NivelDimnamico + CargaALaDescarga).toFixed(2);
  },
  PotenciaDeEntrada: function (
    CorrientePromedio,
    TensionPromedio,
    FactorDePotenciaPromedio
  ) {
    return parseFloat(
      (Math.sqrt(3) *
        CorrientePromedio *
        TensionPromedio *
        FactorDePotenciaPromedio) /
        1000
    ).toFixed(2);
  },
  PotenciaDeSalida: function (Gasto, CargaTotal) {
    return parseFloat(9.81 * Gasto * CargaTotal).toFixed(2);
  },
  EficienciaElectromecanica: function (PotenciaDeSalida, PotenciaDeEntrada) {
    return PotenciaDeEntrada != 0
      ? parseFloat(PotenciaDeSalida / PotenciaDeEntrada).toFixed(2)
      : 0;
  },
  Abatimiento: function (NivelDimnamico, NivelEstatico) {
    return parseFloat(NivelDimnamico - NivelEstatico).toFixed(2);
  },
  RendimientoHidraulico: function (Gasto, Abatimiento) {
    return Abatimiento != 0
      ? parseFloat((1000 * Gasto) / Abatimiento).toFixed(2)
      : 0;
  },
};

export default funcionesTabla;
