var funcionesTabla = {
  DiametroInternoDeLaTuberia: 0.2,
  FrecuenciaDeRotacion: 1500,
  NivelTuberiaDeDescarga: 0.75,
  PerdidasDeFriccionEnLaColumna: 1.0,
  NivelEstatico: function () {
    return parseFloat(59);
  },
  LecturaManometroDescarga: function (presion) {
    return parseFloat(presion * 10);
  },
  PresionDescarga: function (NivelTuberiaDeDescarga, LecturaManometroDescarga) {
    return parseFloat(NivelTuberiaDeDescarga + LecturaManometroDescarga);
  },
  AreaTuberiaDescarga: function (DiametroInternoTuberia) {
    return parseFloat(
      (DiametroInternoTuberia =
        (Math.PI * DiametroInternoTuberia * DiametroInternoTuberia) / 4)
    );
  },
  Gasto: function (LecturaManometroDescarga) {
    return parseFloat(LecturaManometroDescarga / 1000);
  },
  CargaDeVelocidad: function (Gasto, AreaTuberiaDescarga) {
    return parseFloat(
      ((Gasto / AreaTuberiaDescarga) * (Gasto / AreaTuberiaDescarga)) /
        (2 * 9.81)
    );
  },
  CargaALaDescarga: function (
    PresionDescarga,
    CargaDeVelocidad,
    PerdidasDeFriccionEnLaColumna
  ) {
    return parseFloat(
      PresionDescarga + CargaDeVelocidad + PerdidasDeFriccionEnLaColumna
    );
  },
  CargaTotal: function (NivelDimnamico, CargaALaDescarga) {
    return parseFloat(NivelDimnamico + CargaALaDescarga);
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
    );
  },
  PotenciaDeSalida: function (Gasto, CargaTotal) {
    return parseFloat(9.81 * Gasto * CargaTotal);
  },
  EficienciaElectromecanica: function (PotenciaDeSalida, PotenciaDeEntrada) {
    return PotenciaDeEntrada != 0
      ? parseFloat((PotenciaDeSalida / PotenciaDeEntrada) * 100)
      : 0;
  },
  Abatimiento: function (NivelDimnamico, NivelEstatico) {
    return parseFloat(NivelDimnamico - NivelEstatico);
  },
  RendimientoHidraulico: function (Gasto, Abatimiento) {
    return Abatimiento != 0 ? parseFloat((1000 * Gasto) / Abatimiento) : 0;
  },
};

export default funcionesTabla;
