 //var zoneInfo = ['zone1','Description of Zone1'];
 var zoneInfo =[];
 
 function extractBoxIds() {
    $('#addZoneModal .form-control').each(function(index, element) {
         zoneInfo.push($(element).val());
     });
     return zoneInfo;
     }
   $('#zoneInfoBtn').click(function(){
     extractBoxIds();
     alert(zoneInfo);
 }); 

// map
var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            osm = L.tileLayer(osmUrl, { maxZoom: 18, attribution: osmAttrib }),
            map = new L.Map('map', { center: new L.LatLng(51.505, -0.04), zoom: 13 }),
            drawnItems = L.featureGroup().addTo(map);
            L.control.layers({
            'osm': osm.addTo(map)
            }, { 'drawlayer': drawnItems }).addTo(map);
        map.addControl(new L.Control.Draw({
        position: 'topright',
        edit: {
            featureGroup: drawnItems,
            polygon: {
                allowIntersection: false
            }
        },
        draw: {
          polyline: false,
          polygon: false,
         /* polygon: {
            enable:false,
            allowIntersection: false, // Restricts shapes to simple polygons
            drawError: {
                color: '#e1e100', // Color the shape will turn when intersects
                message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
            },
            shapeOptions: {
                color: 'orange'
            },
            
        }, */
          rectangle: false,
          marker: false,
          circlemarker: false,
          circle: false
        }
    }));
   
    // var layer = L.Polygon(latlngs).bindPopup('Hi There!').addTo(map);
    // layer.openPopup();
    // layer.closePopup();

    map.on(L.Draw.Event.CREATED, function (event) {
        var type = event.layerType;
         var layer = event.layer;
         if (type === 'polygon') {
          //  $('#addZoneModal').modal();   
         }
        drawnItems.addLayer(layer);
    });
    map.on(L.Draw.Event.EDITED, function (event) {
        var type = event.layerType;
        var layers = event.layers;
        var countOfEditedLayers = 0;
        layers.eachLayer(function (layer) {
            countOfEditedLayers++;
        });
        console.log("Edited " + countOfEditedLayers + " layers");
        if (type === 'polygon') {
            $('#addZoneModal').modal();
                     
         }
         
    });
    
    

    function handleFormSubmit(event) {
 
      event.preventDefault();
      
      const data = new FormData(event.target);
      
      const formJSON = Object.fromEntries(data.entries());
    
      // for multi-selects, we need special handling
      formJSON.status = data.getAll('status');
     // formJSON.geometry = data.getAll(data);
      
      const results = document.querySelector('.results pre');
      results.innerText = JSON.stringify(formJSON, null, 2);
      
      const newPoly = JSON.stringify(formJSON, null, 2);
      zoneInfo = JSON.parse(newPoly);

      window.localStorage.setItem("zoneInfo", JSON.stringify(zoneInfo));
      //let newObject = window.localStorage.getItem("zoneInfo");
      
     /*  var formArray = JSON.parse(localStorage.getItem('zoneInfo') || '[]');
      formArray.push(dataObject);
localStorage.setItem('zoneInfo', JSON.stringify(formArray)); */

      //zoneInfo.push(JSON.parse(newPoly));
     // zoneInfo = JSON.parse(newPoly);
     //console.log(zoneInfo.name);
    }
    const form = document.querySelector('#addZoneForm');
form.addEventListener('submit', handleFormSubmit);

    
    function getInfoFrom(object) {
             
        var popupFood = [];
     
          for (var key in object) {
          if (object.hasOwnProperty(key)) {
            var stringLine = "The " + key + " is " + object[key];
                    
            popupFood.push(stringLine);
          }
        }
       
        return popupFood;
      }

    // var yourObject = {
    //   name: 'name',
    //   description: 'description'
    // };
 
  //  zoneInfo =[ {
  //     "name": "Swapnali Atul Birmole",
  //     "description": "zone1 description",
  //     "status": [
  //       "on"
  //     ]
  //   }]
    /*  zoneInfo ; */
   
   

    let zname = $('#zName');
    let zdec = $('#zDec');
    let zstatus = $('#zStatus');
    
    function Zone(ZoneName, ZoneDec, ZoneStatus){
      this.zname = ZoneName,
      this.zdec = ZoneDec,
      this.zstatus = ZoneStatus
    }


    let zone = localStorage.getItem("zone");
    let zoneInfoNew = zone ? JSON.parse(zone) : []
    
    document.getElementById('addZone').addEventListener('click', addNewZone)
    
    function addNewZone() {
      let zone = new Zone(zname.value, zdec.value, zstatus.value);
      zoneInfoNew.push(zone);
      localStorage.setItem('zone', JSON.stringify(zoneInfoNew))
    }
    
    
    console.log(localStorage);







    let newObject = window.localStorage.getItem("zoneInfo");
    var yourObject = JSON.parse(newObject);
   var yourData = getInfoFrom(yourObject).join(" <br>");
  
      // var yourData = getInfoFrom(zoneInfo).join(" <br>");
     

      

    function makePopupContent(feature){
        return `
          ${feature.geometry.coordinates}   
        `;
      //   return `
      //   ${feature}  
      // `;
      }
      
      function setPupup(layer) {
        var feature = layer.toGeoJSON();
        var coords = makePopupContent(feature);
        //layer.bindPopup(yourData);
      }
      
   // Define you draw handler somewhere where you click handler can access it. N.B. pass any draw options into the handler
var polygonDrawer = new L.Draw.Polygon(map);

// Assumming you have a Leaflet map accessible
map.on('draw:created', function (e) {
    var type = e.layerType,
        layer = e.layer;
       
    // Do whatever you want with the layer.
    // e.type will be the type of layer that has been draw (polyline, marker, polygon, rectangle, circle)
    // E.g. add it to the map

    
    setPupup(layer);
    layer.on('draw:update', function(e) {
     
      setPupup(e.layer);
     
    });

   

    layer.addTo(map);
    layer.bindPopup(yourData);
});



// Click handler for you button to start drawing polygons
$('#draw_poly').click(function() {
    polygonDrawer.enable();
});



