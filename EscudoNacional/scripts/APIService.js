async function fetchTablaSimplificada(PROYECTO) {
  const response = await fetch(
    `https://virtualwavecontrol.com.mx/core24/crud/ReadSignalsEstacion?idProyecto=${PROYECTO}`
  );
  const data = await response.json();
  //console.log(data);
  return data;
}

export { fetchTablaSimplificada };
