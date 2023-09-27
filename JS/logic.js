// Store our API endpoint.
var queryUrl =
  "https://developer.nrel.gov/api/alt-fuel-stations/v1.json?api_key=RjZpx6DxeHBP4d17uK9Uifu6qhas3674psy6dJ7Q&limit=10&fuel_type=ELEC&state=TX";

//----------------------- POP UP WINDOW -----------------------vvvvvvvv
  // Perform a GET request.
d3.json(queryUrl).then(function (data) {
  // Give each fuel_stations a popup.
  function bindPopuptoStation(fuel_stations, layer) {
    layer.bindPopup(
      `<h3>Location: ${fuel_stations.properties}<br>
      Property: ${fuel_stations.properties}<br>
      Click <a href="${fuel_stations.properties}" target="_blank">ME!</a> for more info.
      </h3><hr><p>${new Date(fuel_stations.updated_at)}</p>`)}
//----------------------- POP UP WINDOW -----------------------^^^^^^^





//----------------------- MARKERS -----------------------vvvvvvvv
    function generateFuelType(fuel_station) {
      return {
        color: generateFuelColor(fuel_station.fuel_type_code),
        radius: generateFuelRadius(fuel_station.latitude, fuel_station.longitude)}}

    function generateQuakeRadius(latitude, longitude) {
      return 10}

    function generateFuelMarker(fuel_station, layer) {
      const style = generateFuelType(fuel_station);
      return L.circleMarker(layer, style)}
//----------------------- MARKERS -----------------------^^^^^^^





//----------------------- MAPS -----------------------vvvvvvvv
  var fuel_stations = L.geoJSON(data.features, {
    onEachFeature: bindPopuptoStation,
    style: generateFuelType,
    pointToLayer: generateFuelMarker});
  console.log(fuel_stations);

//---------------------- Create the base layers---------------//
  var street = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});
                        
    ///---------------https://wordpress.org/support/topic/how-do-you-get-topo-map/
  var topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", 
    {attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'});
    
      //---------------https://docs.mapbox.com/api/maps/styles/ ----- 
  var PUBLIC_API_KEY =
    "pk.eyJ1Ijoic2NvbHNvbjgyIiwiYSI6ImNrdTYzbjhrdjU3ODMyb28yZmlrMHpybjYifQ.jzpQ-HWh3lT55X-v0IQoHA";

     //---------------https://docs.mapbox.com/help/troubleshooting/migrate-legacy-static-tiles-api/
  let dark = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      accessToken: PUBLIC_API_KEY});

  let satellite = L.tileLayer(
    "https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      accessToken: PUBLIC_API_KEY});
//---------------------- Create the base layers---------------//
//----------------------- MAPS -----------------------^^^^^^^



//----------------------- MAP SELECTOR -----------------------vvvvvvvv
  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": street,
    "Topographic Map": topo,
    Dark: dark,
    Satellite: satellite};
//----------------------- MAP SELECTOR -----------------------^^^^^^^


  // Create map, streetmap and fuel layers.
  var myMap = L.map("map", {
    center: [31.00, -100.00],
    zoom: 7,
    layers: [street, fuel_stations]});

  var Diesel_map = new L.LayerGroup();

  d3.json("https://developer.nrel.gov/api/alt-fuel-stations/v1.json?api_key=RjZpx6DxeHBP4d17uK9Uifu6qhas3674psy6dJ7Q&limit=10&fuel_type=ELEC&state=TX")
  .then(function (tectonicPlateData) {
    L.geoJson(tectonicPlateData).addTo(Diesel_map);
    Diesel_map.addTo(myMap);
    console.log(Diesel_map)});

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    // Add Tectonic Plates
    "Diesel Stations": Diesel_map,
    "Electric Stations": fuel_stations};

  // Creating a layer control.
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false})
    .addTo(myMap);

  //----------------------- Color Legend -----------------------vvvvvvvv

  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0];
    var colors = ["#FFFF99","#FFFF00","#FFB266","#FF9933",
      "#FF8000","#CC6600","#CC0000","#990000","#660000","#330000"];

    // Add the minimum and maximum.
    var legendInfo = `
      <h2>Fuel Markers</h2>

      <div class="labels">
      <div class="min">
      ${limits[0]}
      </div>
      
      <div class="max">
      ${limits[limits.length - 1]}
      </div>
      </div>
      <ul>`;

    limits.forEach(function (limit, index) {
      legendInfo += '<li style="background-color: ' + colors[index] + '"></li>'});

    legendInfo += "</ul>";
    div.innerHTML = legendInfo;
    return div};
  // Adding the legend to the map
  legend.addTo(myMap);
});
    //----------------------- Color Legend -----------------------^^^^^^^
