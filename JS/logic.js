// Create a map object


//---------------------------------------------------------- MAPS (STREET, TOPO, DARK) ----------------------------------------------------------
function CreateMap(map,CHADEMOMarkers,J1772Markers,J1772CMarkers,chargertype){
  let street = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});

  let topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", 
    {attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'});
    
 
  
  let PUBLIC_API_KEY ="pk.eyJ1Ijoic2NvbHNvbjgyIiwiYSI6ImNrdTYzbjhrdjU3ODMyb28yZmlrMHpybjYifQ.jzpQ-HWh3lT55X-v0IQoHA";
  let dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      accessToken: PUBLIC_API_KEY});

  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo,
    Dark: dark};

  let myMap = L.map("map", {
    center: [30.417, -100.810],
    layers:[street,map],
    zoom: 7});


  console.log(map)

//---------------------------------------------------------- Markers ----------------------------------------------------------
    
    let marker1 = {
      "CHAdeMO": CHADEMOMarkers,
      "J-1772": J1772Markers,
      "J-1772 Combo": J1772CMarkers
    };
    
    
  L.control.layers(baseMaps, null, {
    collapsed: false
  }).addTo(myMap);  

  
  // Create a control for overlay maps
  let overlayControl = L.control.layers(null, marker1, {
    collapsed: false});
  overlayControl.setPosition('topright');
  myMap.addControl(overlayControl);

  let overlayControlContainer = document.createElement('div');

  overlayControlContainer.appendChild(overlayControl.getContainer());
  document.getElementById('overlayControlContainer').appendChild(overlayControlContainer);


}


//---------------------------------------------------------- JSON reader ----------------------------------------------------------
let fuelurl = "https://developer.nrel.gov/api/alt-fuel-stations/v1.json?api_key=RjZpx6DxeHBP4d17uK9Uifu6qhas3674psy6dJ7Q&limit=200&fuel_type=ELEC&state=TX"

function markers(){
  d3.json(fuelurl).then(function(data){
      console.log(data);
      let J1772Markers=[]
      let CHADEMOMarkers=[]
      let J1772CMarkers=[]
      let chargertype=[]
      let stations = data.fuel_stations;
      var IconOptions = L.Icon.extend({
          options: {
              iconUrl:'',
              iconSize:     [38, 95],
              iconAnchor:   [19, 64],
              popupAnchor:  [-3, -76]
          }
      });

      var J1772icon=new IconOptions({iconUrl:'icons/ad.png'})
      var CHADEMOicon=new IconOptions({iconUrl:'icons/sd.png'})
      var J1772Comboicon=new IconOptions({iconUrl:'icons/bg.png'})



      for (let i = 0; i < stations.length; i++) {
        let properties=stations[i].station_name; 
        let fueltype = stations[i].fuel_type_code
        let long=stations[i].longitude;
        let lat=stations[i].latitude;
        for (let x in stations[i].ev_connector_types){
          chargertype.push(stations[i].ev_connector_types[x])
          
        if (stations[i].ev_connector_types.includes("J1772")){
          let J1772Marker = L.marker([lat, long],{icon: J1772icon})
          .bindPopup("<h3>" + properties+ "<h3><h3>Fuel Type: " + fueltype + "</h3>");
          J1772Markers.push(J1772Marker);
        }
        if (stations[i].ev_connector_types.includes("CHADEMO")){
          let CHADEMOMarker = L.marker([lat, long],{icon: CHADEMOicon})
          .bindPopup("<h3>" + properties+ "<h3><h3>Fuel Type: " + fueltype + "</h3>");
          CHADEMOMarkers.push(CHADEMOMarker);
        }
        if (stations[i].ev_connector_types.includes("J1772COMBO")){
          let J1772CMarker = L.marker([lat, long],{icon: J1772Comboicon})
          .bindPopup("<h3>" + properties+ "<h3><h3>Fuel Type: " + fueltype + "</h3>");
          J1772CMarkers.push(J1772CMarker);
        }
          }
  



      }

      var allMarkers = J1772Markers.concat(CHADEMOMarkers);

      CHADEMOMarkers=L.layerGroup(CHADEMOMarkers)
      J1772Markers =L.layerGroup(J1772Markers)
      J1772CMarkers=L.layerGroup(J1772CMarkers)
      
      var electriclayer = L.layerGroup(allMarkers);

      CreateMap(electriclayer,CHADEMOMarkers,J1772Markers,J1772CMarkers,chargertype);


  })

}


//---------------------------------------------------------- PRODUCES MAP ON SITE (DO NOT DELETE!!)----------------------------------------------------------
d3.json('https://developer.nrel.gov/api/alt-fuel-stations/v1.json?api_key=RjZpx6DxeHBP4d17uK9Uifu6qhas3674psy6dJ7Q&limit=200&fuel_type=ELEC&state=TX').then(markers)
//---------------------------------------------------------- PRODUCES MAP ON SITE (DO NOT DELETE!!)----------------------------------------------------------




