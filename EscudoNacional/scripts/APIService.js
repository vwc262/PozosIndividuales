let domain = "http://localhost:65396";
let folderRoot = "VWC/PozosSistemaLerma";
let endpoint = "TablaSimplificada";
let data = {};

async function fetchTablaSimplificada() {
  const response = await fetch(
    "https://virtualwavecontrol.com.mx/core24/crud/ReadSignalsEstacion?idProyecto=12"
  );
  const data = await response.json();
  //console.log(data);
  return data;
}
