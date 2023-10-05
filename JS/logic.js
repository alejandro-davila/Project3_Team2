//---------------------------------------------------------- CREATING MAPS ----------------------------------------------------------
function CreateMap(map,CHADEMOMarkers,J1772Markers,J1772CMarkers,NACSMarkers,chargertype){
  let street = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});
  
  
//---------------------------------------------------------- MAPS (TOPOGRAPHIC) ----------------------------------------------------------
  let topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    {attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'});
  
 //---------------------------------------------------------- MAPS (DARK) ---------------------------------------------------------- 
  let PUBLIC_API_KEY ="pk.eyJ1Ijoic2NvbHNvbjgyIiwiYSI6ImNrdTYzbjhrdjU3ODMyb28yZmlrMHpybjYifQ.jzpQ-HWh1lT55X-v0IQoHA";
  let dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      accessToken: PUBLIC_API_KEY});

 //---------------------------------------------------------- MAPS Layout / Selection ---------------------------------------------------------- 
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo,
    Dark: dark};


  //---------------------------------------------------------- Starting Point of Map ----------------------------------------------------------
    let myMap = L.map("map", {
    center: [30.417, -100.810],
    layers:[street,map],
    zoom: 7});
  console.log(map)

//---------------------------------------------------------- Markers ----------------------------------------------------------
let marker1 = {
  "CHAdeMO": CHADEMOMarkers,
  "J-1772": J1772Markers,
  "J-1772 Combo": J1772CMarkers,
  "Tesla Destination": NACSMarkers
};
L.control.layers(baseMaps, null, {
collapsed: false
}).addTo(myMap);
// Create a control for overlay maps
let overlayControl = L.control.layers(null, marker1, {
collapsed: false});
overlayControl.setPosition('topright');
myMap.addControl(overlayControl);
// Create a button to clear the markers
let clearButton = L.Control.extend({
onAdd: function() {
let button = L.DomUtil.create('button');
button.textContent = 'Clear Markers';
button.addEventListener('click', function() {
  ClearMarkers(CHADEMOMarkers,J1772Markers,J1772CMarkers,NACSMarkers);
});
return button;
}
});
// Add the clear button to the map
myMap.addControl(new clearButton());
let overlayControlContainer = document.createElement('div');
overlayControlContainer.appendChild(overlayControl.getContainer());
document.getElementById('overlayControlContainer').appendChild(overlayControlContainer);
}
function ClearMarkers(CHADEMOMarkers,J1772Markers,J1772CMarkers,NACSMarkers){
markers.clearLayers();
}

//---------------------------------------------------------- JSON reader ----------------------------------------------------------
//let fuelurl = 'http://127.0.0.1:6660/stations'
let fuelurl = 'https://developer.nrel.gov/api/alt-fuel-stations/v1.json?api_key=RjZpx6DxeHBP4d17uK9Uifu6qhas3674psy6dJ7Q&limit=200&fuel_type=ELEC&state=TX'
function markers(){
  d3.json(fuelurl).then(function(data){
      console.log(data);
      let J1772Markers=[]
      let CHADEMOMarkers=[]
      let J1772CMarkers=[]
      let NACSMarkers=[]
      let chargertype=[]
      let stations = data;
      var IconOptions = L.Icon.extend({
          options: {
              iconUrl:'',
              iconSize:     [38, 95],
              iconAnchor:   [19, 64],
              popupAnchor:  [-3, -76]
          }
      });
      var J1772icon=new IconOptions({iconUrl:'icons/j1772.png'})
      var CHADEMOicon=new IconOptions({iconUrl:'icons/chademo.png'})
      var J1772Comboicon=new IconOptions({iconUrl:'icons/j1772combo.png'})
      var NACSicon=new IconOptions({iconUrl:'icons/Tesla.png'})
      for (let i = 0; i < stations.length; i++) {
        let properties=stations[i].station_name;
        let ev_network = stations[i].ev_network
        let long=stations[i].longitude;
        let lat=stations[i].latitude;
        if(stations[i].ev_dc_fast_num >=1){
          chargelevel="DC Fast Charger"
        }
        else if(stations[i].ev_level2_evse_num >=1){
          chargelevel="Level 2 Charger"
        }
        else if(stations[i].ev_level1_evse_num >=1){
          chargelevel="Level 1 Charger"
        }
        else{
          chargelevel="null"
        }
        for (let x in stations[i].ev_connector_types){
          chargertype.push(stations[i].ev_connector_types[x])
          
        if (stations[i].ev_connector_types.includes("J1772")){
          let J1772Marker = L.marker([lat, long],{icon: J1772icon})
          .bindPopup("<h5> " + properties+ "<h5><h8>EV Network: " + ev_network + "</h8><br><h8>Charge Level: " + chargelevel + "</h8>");
          J1772Markers.push(J1772Marker);
        }
        if (stations[i].ev_connector_types.includes("CHADEMO")){
          let CHADEMOMarker = L.marker([lat, long],{icon: CHADEMOicon})
          .bindPopup("<h5> " + properties+ "<h5> <h8>EV Network: " + ev_network + "</h8><br><h8>Charge Level: " + chargelevel + "</h8>");
          CHADEMOMarkers.push(CHADEMOMarker);
        }
        if (stations[i].ev_connector_types.includes("J1772COMBO")){
          let J1772CMarker = L.marker([lat, long],{icon: J1772Comboicon})
          .bindPopup("<h5> " + properties+ "<h5><h8>EV Network: " + ev_network + "</h8><br><h8>Charge Level: " + chargelevel + "</h8>");
          J1772CMarkers.push(J1772CMarker);
        }
        if (stations[i].ev_connector_types.includes("TESLA")&&chargelevel==="Level 2 Charger"){
          let NACSMarker = L.marker([lat, long],{icon: NACSicon})
          .bindPopup("<h5> " + properties+ "<h5><h8>EV Network: " + ev_network + "</h8><br><h8>Charge Level: " + chargelevel + "</h8>");
          NACSMarkers.push(NACSMarker);
        }
          }
      }
      var allMarkers = J1772Markers.concat(CHADEMOMarkers).concat(J1772CMarkers);
      CHADEMOMarkers=L.layerGroup(CHADEMOMarkers)
      J1772Markers =L.layerGroup(J1772Markers)
      J1772CMarkers=L.layerGroup(J1772CMarkers)
      NACSMarkers=L.layerGroup(NACSMarkers)
      var electriclayer = L.layerGroup(allMarkers);
      CreateMap(electriclayer,CHADEMOMarkers,J1772Markers,J1772CMarkers,NACSMarkers,chargertype);
  })
}
//---------------------------------------------------------- PRODUCES MAP ON SITE (DO NOT DELETE!!)----------------------------------------------------------
//d3.json('http://127.0.0.1:6660/stations').then(markers)

d3.json('https://developer.nrel.gov/api/alt-fuel-stations/v1.json?api_key=RjZpx6DxeHBP4d17uK9Uifu6qhas3674psy6dJ7Q&limit=200&fuel_type=ELEC&state=TX').then(markers)
//---------------------------------------------------------- PRODUCES MAP ON SITE (DO NOT DELETE!!)----------------------------------------------------------


