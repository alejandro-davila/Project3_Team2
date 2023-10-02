// Create a map object


//---------------------------------------------------------- MAPS (STREET, TOPO, DARK) ----------------------------------------------------------
function CreateMap(map){

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






//---------------------------------------------------------- Markers ----------------------------------------------------------
    
    let marker1 = {
      "Tesla (Fast)": map,
      "CCS/SAE": map,
      "CHAdeMO": map,
      "J-1772": map,
      "Tesla": map,
      "Tesla (Roadster)": map,
      "NEMA 14-50": map,
      "Wall": map,
      "NEMA TT-30": map,
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



// Function to show a warning message when any marker is clicked
function showWarningMessage(e) {
  let marker = e.target;
  
  // Create a popup with the warning message content
  let popupContent = `
    <div class="warning-popup">
      <img src="warning-icon.png" alt="Warning Icon" width="50" height="50">
      <p>Are you sure?</p>
    </div>
  `;
  
  // Bind the popup to the marker
  marker.bindPopup(popupContent).openPopup();
}

// Iterate through the marker1 object and add a click event listener to each marker
for (let markerName in marker1) {
  if (marker1.hasOwnProperty(markerName)) {
    let marker = marker1[markerName];
    marker.addEventListener('click', showWarningMessage);
  }
}}







//---------------------------------------------------------- JSON reader ----------------------------------------------------------
let fuelurl = "https://developer.nrel.gov/api/alt-fuel-stations/v1.json?api_key=RjZpx6DxeHBP4d17uK9Uifu6qhas3674psy6dJ7Q&limit=10&fuel_type=ELEC&state=TX"

function markers() {
  d3.json(fuelurl).then(function (data) {
    console.log(data);
    let gasmarkers = [];
    let stations = data.fuel_stations;
    
    // Define icon URLs for different fuel types
    var iconMapping = {
      ELEC: 'icons/electric-icon.png',
      CNG: 'icons/cng-icon.png',
      LNG: 'icons/lng-icon.png',
      HY: 'icons/hydrogen-icon.png',
      BD: 'icons/biodiesel-icon.png',
      E85: 'icons/e85-icon.png',
      LPG: 'icons/lpg-icon.png',
    };

    for (let i = 0; i < stations.length; i++) {
      let properties = stations[i].station_name;
      let fueltype = stations[i].fuel_type_code;
      let long = stations[i].longitude;
      let lat = stations[i].latitude;

      // Select the appropriate icon URL based on the fuel type
      var iconUrl = iconMapping[fueltype] || 'icons/default-icon.png';

      let gasmarker = L.marker([lat, long], { 
        icon: L.icon({
          iconUrl: iconUrl,
          iconSize: [38, 95],
          shadowSize: [50, 64],
          iconAnchor: [19, 64],
          shadowAnchor: [4, 62],
          popupAnchor: [-3, -76],
        })
      }).bindPopup("<h3>" + properties + "</h3><h3>Fuel Type: " + fueltype + '</h3>');

      gasmarkers.push(gasmarker);
    }

    CreateMap(L.layerGroup(gasmarkers));
  });
}



//---------------------------------------------------------- PRODUCES MAP ON SITE (DO NOT DELETE!!)----------------------------------------------------------
d3.json('https://developer.nrel.gov/api/alt-fuel-stations/v1.json?api_key=RjZpx6DxeHBP4d17uK9Uifu6qhas3674psy6dJ7Q&limit=10&fuel_type=ELEC&state=TX').then(markers)
//---------------------------------------------------------- PRODUCES MAP ON SITE (DO NOT DELETE!!)----------------------------------------------------------




