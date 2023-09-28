// Creating the map object
let myMap = L.map("map", {
    center: [38.462157369546766, -98.35906921470897],
    zoom: 3
  });
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Load the GeoJSON data.
  let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
  // Get the data with d3.
  d3.json(geoData).then(function(data) {
  
    // Create a new choropleth layer.
    function getValue(x) {
        return x > 90 ? "#644D8E" :
               x > 70 ? "#8E5B91" :
               x > 50 ? "#C76B8F" :
               x > 30 ? "#DC828E" :
               x > 10 ? "#EC988E" :
               
                   "#FFCC99";
    }
    
    
    function style(feature) {
        return {
            fillColor: getValue(feature.geometry.coordinates[2]),
            stroke: true,
            color: "#000",
            weight: 1,
            fillOpacity: 0.8,
            radius: feature.properties.mag*4
        };
    }
    
    
    var dat = L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, style(feature));
        },
     
  
      // Binding a popup to each layer
      onEachFeature: function(feature, layer) {
        layer.bindPopup("<strong>" + feature.properties.place + "</strong><br /><br />magnitude: " +
          feature.properties.mag + "<br /><br />depth: " + feature.geometry.coordinates[2]);
      }
    }).addTo(myMap);
  
//     // Set up the legend.
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
      
      let colors = ["#FFCC99", "#EC988E", "#DC828E", "#C76B8F", "#8E5B91", "#644D8E"];
      let labels = [-10,10,30,50,70,90];
  
      for (let i = 0; i < labels.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
          + labels[i] + (labels[i + 1] ? "&ndash;" + labels[i + 1] + "<br>" : "+");
      }
      return div;
    };
  
     
  
    // Adding the legend to the map
    legend.addTo(myMap);
  
});
  
  