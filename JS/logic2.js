// Create a map object
function CreateMap(map){

    let street = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});
  
    let topo = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", 
      {attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'});
      
    //let streetmap = L.map("map", {
     // center: [31.00, -100.00],
      //zoom: 7,
      //layers: [street, map]});
   
    let PUBLIC_API_KEY ="pk.eyJ1Ijoic2NvbHNvbjgyIiwiYSI6ImNrdTYzbjhrdjU3ODMyb28yZmlrMHpybjYifQ.jzpQ-HWh3lT55X-v0IQoHA";
  
    let overlayMaps = {
      // Add Tectonic Plates
      "Diesel Stations": map,
      "Electric Stations": map};
  
    let dark = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token={accessToken}",
      {attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        accessToken: PUBLIC_API_KEY});
  
    let myMap = L.map("map", {
      center: [39.417, -101.810],
      layers:[street,map],
      zoom: 4
    });
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo,
      Dark: dark};
  
      // Adding the tile layer
      L.control.layers(baseMaps, overlayMaps, {
          collapsed: false
        }).addTo(myMap);
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
        
  }
  
  let url = "https://developer.nrel.gov/api/alt-fuel-stations/v1.json?api_key=RjZpx6DxeHBP4d17uK9Uifu6qhas3674psy6dJ7Q&limit=10&fuel_type=ELEC&state=TX"
  
  function markers(){
      d3.json(url).then(function(data){
          console.log(data);
          let gasmarkers=[]
          let stations = data.fuel_stations;
          var LeafIconOptions = L.Icon.extend({
              options: {
                  iconSize:     [38, 95],
                  shadowSize:   [50, 64],
                  iconAnchor:   [19, 64],
                  shadowAnchor: [4, 62],
                  popupAnchor:  [-3, -76]
              }
          });
          //let elevations=[];
         // for (let i = 0; i < stations.length; i++) {
          //    elevations.push(stations[i].geometry.coordinates[2])
         // }
          //let minimum=d3.min(elevations)
         // let maximum=d3.max(elevations)
         // console.log(minimum)
         // console.log(maximum)
         // let ColorScale=d3.scaleSequential(d3.interpolateRdYlGn).domain([90,minimum]);
         var greenIcon = new LeafIconOptions({iconUrl: 'icons/flash.svg'})
          for (let i = 0; i < stations.length; i++) {
            //let location = stations[i].geometry;
            let properties=stations[i].station_name; 
            let fueltype = stations[i].fuel_type_code
            let long=stations[i].longitude;
            let lat=stations[i].latitude;
            //let elev=location.coordinates[2];
            //let markeradius=properties.mag*3;
           // let scalecolor= ColorScale(elev);
  
            let gasmarker = L.marker([lat, long],{icon: greenIcon})
            .bindPopup("<h3>" + properties+ "<h3><h3>Fuel Type: " + fueltype + "</h3>");
            gasmarkers.push(gasmarker);
  
          }
          console.log(gasmarkers)
          CreateMap(L.layerGroup(gasmarkers));
  
  
      })
  
  }
  d3.json("https://developer.nrel.gov/api/alt-fuel-stations/v1.json?api_key=RjZpx6DxeHBP4d17uK9Uifu6qhas3674psy6dJ7Q&limit=10&fuel_type=ELEC&state=TX").then(markers);