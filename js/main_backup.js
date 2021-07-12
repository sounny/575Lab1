/*WA cities data and map*/
//function to instantiate the Leaflet map
function createMap(){
    //create the map
    var mymap = L.map('mapid', {
        center: [47.273015, -120.882275],
        zoom: 7
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(mymap);

    //call getData function
    getData(mymap);
};

function onEachFeature(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
};

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //scale factor to adjust symbol size evenly
    var scaleFactor = 0.001;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};

function createPropSymbols(data, mymap){
    //Determine which attribute to visualize with proportional symbols
    var attribute = "pop2021";
    //create marker options
    var geojsonMarkerOptions = {
        radius: 5,
        fillColor: "#6eb66e",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            //For each feature, determine its value for the selected attribute
            var attValue = Number(feature.properties[attribute]);

            //Give each feature's circle marker a radius based on its attribute value
            geojsonMarkerOptions.radius = calcPropRadius(attValue);

            //create circle markers
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }, 
	onEachFeature: onEachFeature
    }).addTo(mymap);
};

//function to retrieve the data and place it on the map
function getData(mymap){
    //load the data
    $.ajax("data/WAcities.geojson", {
        dataType: "json",
        success: function(response){
	    //call function to create proportional symbols
            createPropSymbols(response, mymap);
        }
    });
};


$(document).ready(createMap);