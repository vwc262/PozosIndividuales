import { fetchTablaSimplificada } from "./APIService.js";

let map;

async function InitMap(DATA_GLOBAL) {
  const MAP_POSITION = {
    lat: DATA_GLOBAL.latitud,
    lng: DATA_GLOBAL.longitud,
  };

  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerView } = await google.maps.importLibrary("marker");

  map = new Map(document.getElementById("map"), {
    zoom: 16,
    center: MAP_POSITION,
    streetViewControl: false,
    mapId: "DEMO_MAP_ID",
  });

  const marker = new AdvancedMarkerView({
    map: map,
    position: MAP_POSITION,
    title: "Sorpasso",
  });
}

export default InitMap;
