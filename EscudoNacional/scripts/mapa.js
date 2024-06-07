let map;

async function InitMap() {
  const MAP_POSITION = { lat: 19.246894, lng: -99.010269 };

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
