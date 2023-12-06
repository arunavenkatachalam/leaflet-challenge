// Load the GeoJSON data
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// Get the data with d3
d3.json(url).then(function(earthquake_data){
        console.log(earthquake_data);
    createFeatures(earthquake_data.features);
    });


function createMarker(feature, latlng) {
    return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color:"#000",
        weight: 0.5,
        opacity: 0.5,
        fillOpacity: 1
    });
}

function createFeatures(earthquake_data) {
    // Binding a popup to each layer
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h2>" + feature.properties.title +
        "</h2><hr><h3>Time:" + new Date(feature.properties.time) +"</a></h3><h3>"+`Mag: ${feature.properties.mag}`+"</h3><h3>"+`Type: ${feature.properties.type}`+"</h3><h4>"+`Rms: ${feature.properties.rms}`+"</h4>");
        
       }

       let earthquake = L.geoJSON(earthquake_data, {
        onEachFeature: onEachFeature,
        
        pointToLayer: createMarker
          });
      
       // Create Map
        createMap(earthquake);
}


// Increase marker size based on magnitude
function markerSize(magnitude) {
  return magnitude * 5;
  }
  
  // Change marker color based on depth
  function markerColor(depth) {
  return depth > 90 ? '#d73027' :
          depth > 70 ? '#fc8d59' :
          depth > 50 ? '#fee08b' :
          depth > 30 ? '#d9ef8b' :
          depth > 10 ? '#91cf60' :
                       '#1a9850' ;          
  }

  

  function createMap(earthquake) {
    // Define the tileLayer for streetmap
    const streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });

    // Define the tileLayer for satelliteMap 
    const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    // Define the tileLayer for outdoorsMap 
    var outdoorsMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Tiles &copy; OpenTopoMap'
    });

    // Define the tileLayer for grayscale map
    const grayscale = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

  // Define a baseMaps object to hold our base layers
  const baseMaps = {
    "Street Map": streetmap,
  };

  // Create overlay object to hold our overlay layer
  const overlayMaps = {
    Earthquakes: earthquake
  };

   // Creating the map object
  var myMap = L.map("map", {
    center: [
      42.1888, -120.3458
    ],
    zoom: 4,
    layers: [satelliteMap, earthquake]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);


// Set up the legend and Add the Legend

let legend = L.control({position: 'bottomright'});

legend.onAdd = function () {

    let div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 60, 90],
        labels = [],
        legendInfo = "<h5>Magnitude</h5>";

    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')+ '<br>';
    }    

    return div;

    };

    // Add legend to map
    legend.addTo(myMap);
}
