$(document).ready(function(){

  $('#map').height(window.innerHeight);

  // variables that will carry the data.
  var restaurants = L.markerClusterGroup({showCoverageOnHover: false, disableClusteringAtZoom: 15});
  var fords = L.markerClusterGroup({showCoverageOnHover: false, disableClusteringAtZoom: 15});
  var toilets = L.markerClusterGroup({showCoverageOnHover: false, disableClusteringAtZoom: 15});
  var drnkWater = L.markerClusterGroup({showCoverageOnHover: false, disableClusteringAtZoom: 15});
  var GdPost = L.markerClusterGroup({showCoverageOnHover: false, disableClusteringAtZoom: 15});
  var alpHuts = L.markerClusterGroup({showCoverageOnHover: false, disableClusteringAtZoom: 15});
  var fords = L.markerClusterGroup({showCoverageOnHover: false, disableClusteringAtZoom: 15});
  var rtMarkers = false;
  var rtMarkersLayer = L.markerClusterGroup({showCoverageOnHover: false, disableClusteringAtZoom: 15});

  var Hikes = L.layerGroup();

// variables that will carry the map and basemaps.

  var map = L.map('map', {
    center: [ 48.208174, 16.373819],
    zoom: 10,
    minZoom: 8
  });

  var lonviahikingUrl = L.tileLayer('http://tile.lonvia.de/hiking/{z}/{x}/{y}.png');

  var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  var Stamen_Terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    ext: 'png'
  });

  var Esri_WorldTopoMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
  });

  var paths = L.tileLayer('https://api.mapbox.com/styles/v1/sidgis/cjrrkuomp0lxn2to4v7vei96z/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2lkZ2lzIiwiYSI6ImNqa3phcGZ0djBwcXEzcG53eGVzNXRpdmQifQ.JO3UVPg-WqaXki7mKcQhAw');

  var tracks = L.tileLayer('https://api.mapbox.com/styles/v1/sidgis/cjrrqzd8d2lvt2so5ubx1r2jx/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2lkZ2lzIiwiYSI6ImNqa3phcGZ0djBwcXEzcG53eGVzNXRpdmQifQ.JO3UVPg-WqaXki7mKcQhAw');

  var stairs = L.tileLayer('https://api.mapbox.com/styles/v1/sidgis/cjrtg8dp40ge92smswcbcj6c1/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2lkZ2lzIiwiYSI6ImNqa3phcGZ0djBwcXEzcG53eGVzNXRpdmQifQ.JO3UVPg-WqaXki7mKcQhAw');

  var footBridges = L.tileLayer('https://api.mapbox.com/styles/v1/sidgis/cjrumjjht0mtt1foagkqrgssj/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic2lkZ2lzIiwiYSI6ImNqa3phcGZ0djBwcXEzcG53eGVzNXRpdmQifQ.JO3UVPg-WqaXki7mKcQhAw');

  var baseLayers = {
    "OpenStreetMap": OpenStreetMap_Mapnik,
    "Stamen Terrain": Stamen_Terrain,
    "Esri World Topo Map": Esri_WorldTopoMap
  };

//variables that will carry icons.

  var restIcon = L.icon({
      iconUrl: 'https://cdn4.iconfinder.com/data/icons/ios-web-user-interface-multi-circle-flat-vol-6/512/Food_fork_kitchen_knife_meanns_restaurant-512.png',
      iconSize: [24,24]
    });

  var toiletsIcon = L.icon({
    iconUrl: 'https://cdn0.iconfinder.com/data/icons/streamline-emoji-1/48/095-pile-of-poo-128.png',
    iconSize: [24,24]
    // iconAnchor: [32,74],
    // popupAnchor: [0,-50]
  });

  var drnkWaterIcon = L.icon({
    iconUrl: 'https://cdn2.iconfinder.com/data/icons/circle-icons-1/64/water-128.png',
    iconSize: [24,24]
  });  

  var guidePostIcon = L.icon({
    iconUrl: 'https://cdn4.iconfinder.com/data/icons/Project_Icons___Version_1_1_9_by_bogo_d/PNG/Sign%20Post.png',
    iconSize: [24,24]
  });

  var alpineHutsIcon = L.icon({
    iconUrl: 'https://cdn2.iconfinder.com/data/icons/vivid/48/home-512.png',
    iconSize: [24,24]
  });

  var routeMarkersIcon = L.icon({
    iconUrl: 'https://cdn1.iconfinder.com/data/icons/icons-for-a-site-1/64/advantage_nearby-512.png',
    iconSize: [24,24]
  });

  var fordsIcon = L.icon({
    iconUrl: 'src/img/noun_River Crossing_6286.png',
    iconSize: [24,24]
  });

  L.control.layers(baseLayers, null, {collapsed:false}).addTo(map);

//Adding data to the map from geojson files.

  $.getJSON('data/Raw_Fords.geojson', function(data) {
    var fordsLayer = L.geoJson(data, {
      onEachFeature: function(feature, layer){
        layer.setIcon(fordsIcon);
      }
    });
    fords.addLayer(fordsLayer);
  });

  $.getJSON('data/Rests1.geojson', function(data) {
    var rests = L.geoJson(data, {
      onEachFeature: function(feature, layer){
        layer.setIcon(restIcon);
        layer.bindTooltip('<strong>Name</strong>: '+feature.properties.name+'<br>'+'<strong>Opening hours</strong>: '+feature.properties.opening_hours+'<br>'+'<strong>Elevation</strong>: '+feature.properties.ele);
      }
    });
    restaurants.addLayer(rests);
    //map.addLayer(restaurants);
    //map.fitBounds(rests.getBounds());
    map.setMaxBounds(rests.getBounds());
  });

  $.getJSON('data/Final_Drinking_Water.geojson', function(data) {
    var drinkingWater = L.geoJson(data, {
      onEachFeature: function(feature, layer){
        layer.setIcon(drnkWaterIcon);
      }
    });
    drnkWater.addLayer(drinkingWater);
    //map.addLayer(drnkWater);
  });

  $.getJSON('data/route_marker.geojson', function(data) {
    rtMarkers = L.geoJson(data, {
      onEachFeature: function(feature, layer){
        layer.setIcon(routeMarkersIcon);
      }
    });
    rtMarkersLayer.addLayer(rtMarkers);
    //map.addLayer(rtMarkers);
  });

  $.getJSON('data/All_Alpine_Huts.geojson', function(data) {
    var alpineHuts = L.geoJson(data, {
      onEachFeature: function(feature, layer) {
        layer.setIcon(alpineHutsIcon);
      }
    });
    alpHuts.addLayer(alpineHuts);
    //map.addLayer(alpHuts);
  });

  $.getJSON('data/Guide_Post.geojson', function(data) {
    var guidePost = L.geoJson(data, {
      onEachFeature: function(feature, layer){
        layer.setIcon(guidePostIcon);
      }
    });
    GdPost.addLayer(guidePost);
    //map.addLayer(GdPost);
  });

  $.getJSON('data/Final_Toilets.geojson', function(e) {
    var toiletss = L.geoJson(e, {
      onEachFeature: function(feature, layer) {
        layer.setIcon(toiletsIcon);
      }
    });
    toilets.addLayer(toiletss);
    //map.addLayer(toilets);
  });

  // function onEachFeature(feature, layer) {
  //   if (feature.properties) {
  //     layer.bindTooltip("https://hiking.waymarkedtrails.org/api/symbols?osmc:symbol="+feature.properties.symbol);
  //   }
  // }

  // $.getJSON('data/routes/network_Nwn_Markers.geojson', function(e) {
  //   nwnHighwaysMarker = L.geoJson(e, {
  //     style: style
  //   }).addTo(map);
  //   nwnHighwaysMarker.setIcon(iconn);
  // });

  // $.getJSON('data/routes/network_Nwn_Markers.geojson', function(res) {
  //   Nwn_Markers = L.geoJSON(res);
  //   Nwn_Markers.addTo(map);
  //   //console.log()
    
  //     generateIcons(res.features)

  //   function generateIcons(model){
  //     let lastSymbol = model;
  //     for(var i=0;i<model.length;i++){
  //         lastSymbol = model[i].properties.symbol;
  //         console.log(lastSymbol)
  //         var images = document.querySelectorAll('.leaflet-marker-icon')
  //         images[i].src = 'https://hiking.waymarkedtrails.org/api/symbols?osmc:symbol=' + lastSymbol;   
  //     }
  //   }

  //   // window.onload = function(){
  //   //   var images = document.querySelectorAll('.leaflet-marker-icon')

  //   //     for(var i=0;i<images.length;i++){
  //   //       images[i].src = 'https://hiking.waymarkedtrails.org/api/symbols?osmc:symbol=' + _res.features[0].properties.relations[0].reltags.symbol
  //   //     }
  //   // }

  //   // function generateInside(allFeatures){
  //   //   var final = allFeatures.properties.relations[0].reltags.symbol
  //   //   console.log(final)
  //   //   return final; 
  //   // }
    
  // }); 



//Clustering hiking trails according to zoom levels and "network" property (nwn, rwn, and lwn)
//lwn will be shown starting from zoom level 12 to the end of zoom (18)
//rwn will be shown starting from zoom level 11 to the end of zoom (18)
//nwn will be shown starting from zoom level 8 to the end of zoom (18)

  // $.getJSON('data/routes/Hiking_Trails1.json', function(e) {
  //   nwnHiking = L.geoJson(e, {
  //     filter: function(feature, layer) {
  //       return feature.properties.network == "nwn";
  //     }, style: function(feature, layer) {
  //       return {color:'#0000FF', weight:3};
  //     }
  //   }).addTo(Hikes);
  //   map.addLayer(Hikes);
  // });
  
  // map.on('zoomend', function() {
  //   var currentZoom = map.getZoom();
  //   if(currentZoom >= 12) {
  //     //map.removeLayer(Hikes);
  //     $.getJSON('data/routes/Hiking_Trails1.json', function(data) {
  //       var lwnHiking = L.geoJson(data, {
  //         filter: function(feature, layer) {
  //           return feature.properties.network == "lwn";
  //         }, style: function(feature, layer) {
  //           return {color:'#0000FF', weight:1};
  //         }
  //       }).addTo(Hikes);
  //       map.addLayer(Hikes);
  //     });
  //   } else {
  //     map.removeLayer(Hikes);
  //   }
  // });

  // map.on('zoomend', function() {
  //   var currentZoom = map.getZoom();
  //   if(currentZoom >= 10) {
  //     $.getJSON('data/Stairs.geojson', function(e) {
  //       stairsLayer = L.geoJson(e, {
  //         style: function(feature, layer) {
  //           return {color: '#000000', weight:1};
  //         }
  //       }).addTo(stairs);
  //     });
  //   }
  // });

  // map.on('zoomend', function() {
  //   var currentZoom = map.getZoom();
  //   if(currentZoom >= 11) {
  //     //map.removeLayer(Hikes);
  //     $.getJSON('data/routes/Hiking_Trails1.json', function(data) {
  //       var rwnHiking = L.geoJson(data, {
  //         filter: function(feature, layer) {
  //           return feature.properties.network == "rwn";
  //         }, style: function(feature, layer) {
  //           return {color:'#0000FF', weight:2};
  //         }
  //       }).addTo(Hikes);
  //       map.addLayer(Hikes);
  //     });
  //   } else {
  //     map.removeLayer(Hikes);
  //   }
  // });

  // map.on('zoomend', function() {
  //   var currentZoom = map.getZoom();
  //   if(currentZoom >= 8) {
  //     //map.removeLayer(Hikes);
  //     $.getJSON('data/routes/Hiking_Trails1.json', function(data) {
  //       var nwnHiking = L.geoJson(data, {
  //         filter: function(feature, layer) {
  //           return feature.properties.network == "nwn";
  //         }, style: function(feature, layer) {
  //           return {color:'#0000FF', weight:3};
  //         }
  //       }).addTo(Hikes);
  //       map.addLayer(Hikes);
  //     });
  //   } else {
  //     map.removeLayer(Hikes);
  //   }
  // });

    $.getJSON('data/1420.json', function(e) {
    newTest = L.geoJson(e, {
      style: function(feature, layer) {
        return {color:'#FF0000', weight:3};
      }
    }).addTo(map);
  });


//elements that will be shown on the layer list of markers.
  var overlays = {
    "Restaurants": restaurants,
    "Toilets": toilets,
    "Drinking Water": drnkWater,
    "Guide Posts": GdPost,
    "Alpine Huts": alpHuts,
    "Route Markers": rtMarkersLayer,
    "Hiking Trails": lonviahikingUrl,
    "Paths": paths,
    "Tracks": tracks,
    "Stairs": stairs,
    "Foot Bridges": footBridges,
    "Fords": fords
  };


//elements that will be shown on the layer list of lines.
  var lines_overlays = {
    "Hiking Trails": Hikes
  };

  L.control.layers(null, overlays, {collapsed:false}).addTo(map);
  //L.control.layers(null, lines_overlays, {collapsed:false, autoZIndex: false}).addTo(map);

});