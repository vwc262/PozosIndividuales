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
  PresionDescarga: function (CargaALaDescarga, CargaTotal) {
    return parseFloat(CargaALaDescarga + CargaTotal).toFixed(2);
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
      (Math.SQRT2(3) *
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
    return parseFloat(PotenciaDeSalida / PotenciaDeSalida).toFixed(2);
  },
  Abatimiento: function (CargaDeVelocidad, PerdidasDeFriccionEnLaColumna) {
    return parseFloat(CargaDeVelocidad - PerdidasDeFriccionEnLaColumna).toFixed(
      2
    );
  },
  RendimientoHidraulico: function (Gasto, Abatimiento) {
    return parseFloat((1000 * Gasto) / Abatimiento).toFixed(2);
  },
};

export default funcionesTabla;
