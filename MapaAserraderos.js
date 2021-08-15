/**
 * Calculates and displays a car route from the Brandenburg Gate in the centre of Berlin
 * to Friedrichstraße Railway Station.
 *
 * A full list of available request parameters can be found in the Routing API documentation.
 * see:  http://developer.here.com/rest-apis/documentation/routing/topics/resource-calculate-route.html
 *
 * @param   {H.service.Platform} platform    A stub class to access HERE services
 */

var APIKEY = "0XJwbo2Q-sEDOPF5fk27JywrgA3WuKimWP5SXrNb188";

document.getElementById("my_file_reader").onchange = function () {
  var reader = new FileReader();
  reader.onload = function (e) {
    var data = e.target.result;
    data = data.replace("data:text/plain;base64,", "");

    var destinos = JSON.parse(window.atob(data));
    //return displayRoutes(destinos);
    return displayMarkers(destinos);
  };
  reader.readAsDataURL(this.files[0]);
};

$.getJSON("data.json", function (json) {
  console.log(json); // this will show the info it in firebug console
});

function addCircleToMap(map) {
  group.addObject(
    new H.map.Circle(
      // The central point of the circle
      { lat: -31.42276, lng: -58.08755 },
      // The radius of the circle in meters
      20000,
      {
        style: {
          strokeColor: "rgba(55, 85, 170, 0.6)", // Color of the perimeter
          lineWidth: 2,
          fillColor: "rgba(0, 128, 0, 0.6)", // Color of the circle
        },
      }
    )
  );
}

function addCircleToMap2(map) {
  group.addObject(
    new H.map.Circle(
      // The central point of the circle
      { lat: -31.42276, lng: -58.08755 },
      // The radius of the circle in meters
      60000,
      {
        style: {
          strokeColor: "rgba(55, 85, 170, 0.6)", // Color of the perimeter
          lineWidth: 2,
          fillColor: "rgba(0, 128, 0, 0.4)", // Color of the circle
        },
      }
    )
  );
}

function addCircleToMap3(map) {
  group.addObject(
    new H.map.Circle(
      // The central point of the circle
      { lat: -31.42276, lng: -58.08755 },
      // The radius of the circle in meters
      105000,
      {
        style: {
          strokeColor: "rgba(55, 85, 170, 0.6)", // Color of the perimeter
          lineWidth: 2,
          fillColor: "rgba(0, 128, 0, 0.2)", // Color of the circle
        },
      }
    )
  );
}

function displayRoutes(dataSet) {
  clearOldSuggestions();
  //console.log(origen,destino);

  var router = platform.getRoutingService(),
    routeRequestParams = {
      mode: "shortest;car;traffic:enabled",
      representation: "display",
      routeattributes: "waypoints,summary,shape,legs",
      maneuverattributes: "direction,action",
      waypoint0: "-31.600365,-60.708382", // ORIGEN
      //waypointi: latLonDestino  // DESTINO
    };
  var destinos = dataSet;
  for (let i = 0; i < destinos.length; i++) {
    var data = destinos[i];
    routeRequestParams["waypoint" + (i + 1)] =
      data.latitud + "," + data.longitud;
  }
  window.destinos = destinos;
  routeRequestParams["waypoint" + (destinos.length + 1)] =
    routeRequestParams.waypoint0;
  //console.log(routeRequestParams);
  //console.log(routeRequestParams);
  if (destinos.length > 1) {
    router.calculateRoute(routeRequestParams, onSuccess, onError);
  }
}

function displayMarkers(dataSet, supply) {
  clearOldSuggestions();
  var destinos = dataSet;
  //Create the svg mark-up
  svgMarker = `
  <svg xmlns="http://www.w3.org/2000/svg" width="replaceWidth" height="replaceHeight">
  <circle cursor="pointer" cy="replaceCY" cx="replaceCX" r="replaceR" stroke="#696969" stroke-width="1" fill="replaceColor" />
  <text cursor="pointer" x="50%" y="50%" text-anchor="middle" fill="white" style="replaceFont" dy=".3em">dataReplace</text>
</svg>
    `.trim();
  window.destinos = destinos;
  if (destinos.length > 1) {
    if (supply) {
      addCircleToMap(map), addCircleToMap2(map), addCircleToMap3(map);
    }
    for (let i = 0; i < destinos.length; i++) {
      if (destinos[i].latitud != 0) {
        if (destinos[i].tipo == "consumidor" && !supply) {
          //deliverNoSale = new H.map.DomIcon(svgMarkerNoSale.replace("dataReplace", i + 1).replace("replaceColor", "	#d9534f"));
          deliverNoSale = new H.map.DomIcon(
            svgMarker
              .replace("dataReplace", destinos[i].Identificador)
              .replace("replaceColor", "#d9534f")
              .replace("replaceWidth", 40)
              .replace("replaceHeight", 40)
              .replace("replaceCY", 40 / 2)
              .replace("replaceCX", 40 / 2)
              .replace("replaceR", 40 / 2 - 1)
              .replace(
                "replaceFont",
                "font-size:" + (40 / 2 - 1).toString() + "px"
              )
          );
          var useIcon = deliverNoSale;
        } else if (destinos[i].tipo == "planta") {
          deliverNoSale = new H.map.DomIcon(
            svgMarker
              .replace("dataReplace", destinos[i].Identificador)
              .replace("replaceColor", "#3b5998")
              .replace("replaceWidth", 44)
              .replace("replaceHeight", 44)
              .replace("replaceCY", 44 / 2)
              .replace("replaceCX", 44 / 2)
              .replace("replaceR", 44 / 2 - 1)
              .replace(
                "replaceFont",
                "font-size:" + (44 / 2 - 1).toString() + "px"
              )
          );
          var useIcon = deliverNoSale;
          //console.log(destinos[i]);
        } else if (supply) {
          //deliverNoSale = new H.map.DomIcon(svgMarkerNoSale.replace("dataReplace", i + 1).replace("replaceColor", "#5cb85c"));
          var sizeIcon = parseInt(destinos[i].size);
          deliverNoSale = new H.map.DomIcon(
            svgMarker
              .replace("dataReplace", destinos[i].Identificador)
              .replace("replaceColor", "#5cb85c")
              .replace("replaceWidth", sizeIcon)
              .replace("replaceHeight", sizeIcon)
              .replace("replaceCY", sizeIcon / 2)
              .replace("replaceCX", sizeIcon / 2)
              .replace("replaceR", sizeIcon / 2 - 1)
              .replace(
                "replaceFont",
                "font-size:" + (sizeIcon / 2 - 1).toString() + "px"
              )
          );
          var useIcon = deliverNoSale;
        } else {
          var useIcon = false;
        }
        if (useIcon) {
          var dataSale = JSON.stringify(destinos[i]);
          var marker = new H.map.DomMarker(
            {
              lat: destinos[i].latitud,
              lng: destinos[i].longitud,
            },
            { icon: useIcon }
          );
          marker.dataSale = dataSale;

          group.addObject(marker);

          map.getViewModel().setLookAtData({
            bounds: group.getBoundingBox(),
          });
        }
      }
    }
    group.addEventListener(
      "tap",
      function (evt) {
        map.setCenter(evt.target.getGeometry());
        viewSale(evt.target.dataSale);
      },
      false
    );
    // Add the maneuvers group to the map
    map.addObject(group);
  }
}

/**
 * This function will be called once the Routing REST API provides a response
 * @param  {Object} result          A JSONP object representing the calculated route
 *
 * see: http://developer.here.com/rest-apis/documentation/routing/topics/resource-type-calculate-route.html
 */
function onSuccess(result) {
  var route = result.response.route[0];
  /*
   * The styling of the route response on the map is entirely under the developer's control.
   * A representitive styling can be found the full JS + HTML code of this example
   * in the functions below:
   */
  addRouteShapeToMap(route);
  addManueversToMap(route);

  //addWaypointsToPanel(route.waypoint);
  //addManueversToPanel(route);
  //addSummaryToPanel(route.summary);
  // ... etc.
}

/**
 * This function will be called if a communication error occurs during the JSON-P request
 * @param  {Object} error  The error message received.
 */
function onError(error) {
  if (error == "NGEO_ERROR_ROUTE_NO_END_POINT") {
    alert("Hay ventas sin datos de latitud | longitud");
  } else {
    alert("Can't reach the remote server");
  }
}

/**
 * Boilerplate map initialization code starts below:
 */

// set up containers for the map  + panel
var mapContainer = document.getElementById("map"),
  routeInstructionsContainer = document.getElementById("panel");

//Step 1: initialize communication with the platform
// In your own code, replace variable window.apikey with your own apikey
//Step 1: initialize communication with the platform

var platform = new H.service.Platform({
  apikey: APIKEY,
  useCIT: false,
  useHTTPS: true,
});
var defaultLayers = platform.createDefaultLayers();
var group = new H.map.Group();

/*
group.addEventListener('tap', function (evt) {
    map.setCenter(evt.target.getGeometry());
    openBubble(
        evt.target.getGeometry(), evt.target.getData());
}, false);
*/

//Step 2: initialize a map - this map is centered over Europe
var map = new H.Map(mapContainer, defaultLayers.vector.normal.map, {
  center: { lat: 52.516, lng: 13.3779 },
  zoom: 3,
});

map.addObject(group);

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Now use the map as required...

function moveMapToConcordia(map) {
  map.setCenter({ lat: -31.39296, lng: -58.02089 });
  map.setZoom(9);
}
// Hold a reference to any infobubble opened
var bubble;
window.onload = function () {
  moveMapToConcordia(map);
};

/**
 * Opens/Closes a infobubble
 * @param  {H.geo.Point} position     The location on the map.
 * @param  {String} text              The contents of the infobubble.
 */
function openBubble(position, text) {
  if (!bubble) {
    bubble = new H.ui.InfoBubble(
      position,
      // The FO property holds the province name.
      { content: text }
    );
    ui.addBubble(bubble);
  } else {
    bubble.setPosition(position);
    bubble.setContent(text);
    bubble.open();
  }
}

function clearOldSuggestions() {
  group.removeAll();
  if (bubble) {
    bubble.close();
  }
}

/**
 * Creates a H.map.Polyline from the shape of the route and adds it to the map.
 * @param {Object} route A route as received from the H.service.RoutingService
 */
function addRouteShapeToMap(route) {
  var lineString = new H.geo.LineString(),
    routeShape = route.shape,
    polyline;

  routeShape.forEach(function (point) {
    var parts = point.split(",");
    lineString.pushLatLngAlt(parts[0], parts[1]);
  });

  polyline = new H.map.Polyline(lineString, {
    style: {
      lineWidth: 10,
      fillColor: "black",
      strokeColor: "rgba(0, 128, 255, 1)",
      lineDash: [0, 2],
      lineTailCap: "arrow-tail",
      lineHeadCap: "arrow-head",
    },
  });
  // Add the polyline to the map
  group.addObject(polyline);
  // And zoom to its bounding rectangle
  map.getViewModel().setLookAtData({
    bounds: group.getBoundingBox(),
  });
}

/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */

function addManueversToMap(route) {
  var base = new H.map.Icon(
      "https://img.icons8.com/dusk/25/000000/manufacturing.png"
    ),
    //deliverSale = new H.map.DomIcon('https://img.icons8.com/ios-filled/25/000000/order-on-the-way.png'),
    svgMarkerNoSale =
      '<svg width="24" height="24" ' +
      'xmlns="http://www.w3.org/2000/svg">' +
      '<rect stroke="white" fill="replaceColor" x="1" y="1" width="22" ' +
      'height="22" /><text x="12" y="18" font-size="12pt" ' +
      'font-family="Arial" font-weight="bold" text-anchor="middle" ' +
      'fill="white">dataReplace</text></svg>',
    i,
    j,
    svgMarker = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
        <circle cursor="pointer" cy=16 cx=16 r="13" stroke="#696969" stroke-width="3" fill="replaceColor" />
        <text cursor="pointer" x="50%" y="50%" text-anchor="middle" fill="white" font-family: 'Oswald' font-size="16px" dy=".3em">dataReplace</text>
    </svg>
`.trim();
  //alert(route.leg[0].maneuver.length);
  // Add a marker for each maneuver
  /*
    for (i = 0;  i < route.leg.length; i++) {
      for (j = 0;  j < route.leg[i].maneuver.length; j++) {
        // Get the next maneuver.
        maneuver = route.leg[i].maneuver[j];
        // Add a marker to the maneuvers group
        var marker =  new H.map.Marker({
          lat: maneuver.position.latitude,
          lng: maneuver.position.longitude});
        marker.instruction = maneuver.instruction;
        group.addObject(marker);
      }
    }
    */
  maneuver = route.leg[0].maneuver[0];
  // Add a marker to the maneuvers group
  var marker = new H.map.Marker(
    {
      lat: maneuver.position.latitude,
      lng: maneuver.position.longitude,
    },
    { icon: base }
  );
  var destinos = window.destinos;
  marker.instruction = maneuver.instruction;
  group.addObject(marker);
  for (i = 0; i < route.leg.length; i++) {
    //for (j = 0;  j < route.leg[i].maneuver.length; j++) {
    // Get the next maneuver.
    /*
        maneuver = route.leg[i].maneuver[0];
        // Add a marker to the maneuvers group
        var marker = new H.map.Marker({
            lat: maneuver.position.latitude,
            lng: maneuver.position.longitude
        }, { icon: base });
        marker.instruction = maneuver.instruction;
        group.addObject(marker);
        */

    maneuver = route.leg[i].maneuver[route.leg[i].maneuver.length - 1];
    // Add a marker to the maneuvers group
    //var svgMarkup = '<svg width="24" height="24"xmlns="http://www.w3.org/2000/svg"><rect stroke="white" fill="#1b468d" x="1" y="1" width="22" height="22" /><text x="12" y="18" font-size="12pt" font-family="Arial" font-weight="bold" text-anchor="middle"fill="white">' + i + '</text></svg>';
    //var nextPoint = new H.map.DomIcon(svgMarkup);

    if (i + 1 == route.leg.length) {
      var useIcon = base;
      var dataSale = "";
      var marker = new H.map.Marker(
        {
          lat: maneuver.position.latitude,
          lng: maneuver.position.longitude,
        },
        { icon: useIcon }
      );
      marker.instruction = maneuver.instruction;
      marker.dataSale = dataSale;
    } else {
      if (destinos[i].items == 0) {
        //deliverNoSale = new H.map.DomIcon(svgMarkerNoSale.replace("dataReplace", i + 1).replace("replaceColor", "	#d9534f"));
        deliverNoSale = new H.map.DomIcon(
          svgMarker
            .replace("dataReplace", i + 1)
            .replace("replaceColor", "	#d9534f")
        );
        var useIcon = deliverNoSale;
      } else {
        //deliverNoSale = new H.map.DomIcon(svgMarkerNoSale.replace("dataReplace", i + 1).replace("replaceColor", "#5cb85c"));
        deliverNoSale = new H.map.DomIcon(
          svgMarker
            .replace("dataReplace", i + 1)
            .replace("replaceColor", "#5cb85c")
        );
        var useIcon = deliverNoSale;
      }
      var dataSale = JSON.stringify(destinos[i]);
      var marker = new H.map.DomMarker(
        {
          lat: maneuver.position.latitude,
          lng: maneuver.position.longitude,
        },
        { icon: useIcon }
      );
      marker.instruction = maneuver.instruction;
      marker.dataSale = dataSale;
    }

    group.addObject(marker);
    //}
  }
  /*
    group.addEventListener('tap', function (evt) {
        map.setCenter(evt.target.getGeometry());
        openBubble(
            //evt.target.getGeometry(), evt.target.instruction);
            evt.target.getGeometry(), evt.target.dataSale);
    }, false);
    */
  group.addEventListener(
    "tap",
    function (evt) {
      map.setCenter(evt.target.getGeometry());
      viewSale(evt.target.dataSale);
    },
    false
  );
  // Add the maneuvers group to the map
  map.addObject(group);
}

/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addWaypointsToPanel(waypoints) {
  var nodeH3 = document.createElement("h3"),
    waypointLabels = [],
    i;

  for (i = 0; i < waypoints.length; i += 1) {
    waypointLabels.push(waypoints[i].label);
  }

  nodeH3.textContent = waypointLabels.join(" - ");

  routeInstructionsContainer.innerHTML = "";
  routeInstructionsContainer.appendChild(nodeH3);
}

/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addSummaryToPanel(summary) {
  $("#panel").empty();
  var summaryDiv = document.createElement("div"),
    content = "";
  content +=
    '<div class="col"><b>Distancia Recurrida:</b> ' +
    summary.distance / 1000 +
    " km.</div>";
  content +=
    '<div class="col"><b>Tiempo de Viaje:</b> ' +
    summary.travelTime.toHHMMSS() +
    "</div>";

  summaryDiv.className = "row w-100 text-center";
  summaryDiv.innerHTML = content;
  routeInstructionsContainer.appendChild(summaryDiv);
}

/**
 * Creates a series of H.map.Marker points from the route and adds them to the map.
 * @param {Object} route  A route as received from the H.service.RoutingService
 */
function addManueversToPanel(route) {
  var nodeOL = document.createElement("ol"),
    i,
    j;

  nodeOL.style.fontSize = "small";
  nodeOL.style.marginLeft = "5%";
  nodeOL.style.marginRight = "5%";
  nodeOL.className = "directions";

  // Add a marker for each maneuver
  for (i = 0; i < route.leg.length; i += 1) {
    for (j = 0; j < route.leg[i].maneuver.length; j += 1) {
      // Get the next maneuver.
      maneuver = route.leg[i].maneuver[j];

      var li = document.createElement("li"),
        spanArrow = document.createElement("span"),
        spanInstruction = document.createElement("span");

      spanArrow.className = "arrow " + maneuver.action;
      spanInstruction.innerHTML = maneuver.instruction;
      li.appendChild(spanArrow);
      li.appendChild(spanInstruction);

      nodeOL.appendChild(li);
    }
  }

  routeInstructionsContainer.appendChild(nodeOL);
}

Number.prototype.toMMSS = function () {
  return Math.floor(this / 60) + " minutes " + (this % 60) + " seconds.";
};

Number.prototype.toHHMMSS = function () {
  return (
    Math.floor(this / 3600) +
    " hs. " +
    Math.ceil((this / 3600 - Math.floor(this / 3600)) * 60) +
    " min "
  );
};

// Now use the map as required...
//calculateRouteFromAtoB(platform);

window.my_JSON_object = [
  {
    Nombre: "ASERRADERO ORCELLET",
    Identificador: "A1",
    latitud: -32.22696433409397,
    longitud: -58.14909864867021,
    "Capacidad productiva": 1838,
    "Oferta Aserrín": 950,
    "Oferta Chip": 2211,
    "Oferta Viruta": 258,
    tipo: "aserradero",
    size: 33,
  },
  {
    Nombre: "ASERRADERO SAN JOSE SRL",
    Identificador: "A2",
    latitud: -32.17698998889938,
    longitud: -58.2334871801827,
    "Capacidad productiva": 1794,
    "Oferta Aserrín": 927,
    "Oferta Chip": 2158,
    "Oferta Viruta": 252,
    tipo: "aserradero",
    size: 32,
  },
  {
    Nombre: "ASERRADERO FOLLONIER",
    Identificador: "A3",
    latitud: -32.216705427246914,
    longitud: -58.21915825573066,
    "Capacidad productiva": 1865,
    "Oferta Aserrín": 964,
    "Oferta Chip": 2243,
    "Oferta Viruta": 261,
    tipo: "aserradero",
    size: 34,
  },
  {
    Nombre: "ASERRADERO LOS CIPRESES",
    Identificador: "A4",
    latitud: -31.374284208575368,
    longitud: -58.0834308978701,
    "Capacidad productiva": 365,
    "Oferta Aserrín": 0,
    "Oferta Chip": 729,
    "Oferta Viruta": 0,
    tipo: "aserradero",
    size: 24,
  },
  {
    Nombre: "LOS PINOS",
    Identificador: "A5",
    latitud: -30.740113194845485,
    longitud: -57.96984224047468,
    "Capacidad productiva": 60,
    "Oferta Aserrín": 39,
    "Oferta Chip": 81,
    "Oferta Viruta": 0,
    tipo: "aserradero",
    size: 16,
  },
  {
    Nombre: "GIOVENALE CHRISTIAN",
    Identificador: "A6",
    latitud: -31.367345546406234,
    longitud: -58.02951371799592,
    "Capacidad productiva": 373,
    "Oferta Aserrín": 746,
    "Oferta Chip": 0,
    "Oferta Viruta": 0,
    tipo: "aserradero",
    size: 24,
  },
  {
    Nombre: "MARINGA MADERAS",
    Identificador: "A7",
    latitud: -30.939403719401906,
    longitud: -57.870915446138994,
    "Capacidad productiva": 363,
    "Oferta Aserrín": 188,
    "Oferta Chip": 437,
    "Oferta Viruta": 51,
    tipo: "aserradero",
    size: 24,
  },
  {
    Nombre: "ACOM CONCORDIA SOC.ANONIMA",
    Identificador: "A8",
    latitud: -31.374573416961965,
    longitud: -58.08465907952594,
    "Capacidad productiva": 58,
    "Oferta Aserrín": 38,
    "Oferta Chip": 78,
    "Oferta Viruta": 0,
    tipo: "aserradero",
    size: 16,
  },
  {
    Nombre: "DISTRIMADER SRL",
    Identificador: "A9",
    latitud: -31.789115109729753,
    longitud: -58.31356970159871,
    "Capacidad productiva": 349,
    "Oferta Aserrín": 180,
    "Oferta Chip": 420,
    "Oferta Viruta": 49,
    tipo: "aserradero",
    size: 23,
  },
  {
    Nombre: "ASERRADERO SAN RAMON",
    Identificador: "A10",
    latitud: -31.007173220048227,
    longitud: -57.90003406238971,
    "Capacidad productiva": 1816,
    "Oferta Aserrín": 938,
    "Oferta Chip": 2184,
    "Oferta Viruta": 255,
    tipo: "aserradero",
    size: 33,
  },
  {
    Nombre: "MADERCOL",
    Identificador: "A11",
    latitud: -31.01121286306625,
    longitud: -57.95441486473102,
    "Capacidad productiva": 57,
    "Oferta Aserrín": 30,
    "Oferta Chip": 69,
    "Oferta Viruta": 8,
    tipo: "aserradero",
    size: 16,
  },
  {
    Nombre: "SAN SEBASTIAN",
    Identificador: "A12",
    latitud: -31.01048590776489,
    longitud: -57.90107961856614,
    "Capacidad productiva": 366,
    "Oferta Aserrín": 733,
    "Oferta Chip": 0,
    "Oferta Viruta": 0,
    tipo: "aserradero",
    size: 24,
  },
  {
    Nombre: "ASERRADERO MALVASIO",
    Identificador: "A13",
    latitud: -31.470802006754102,
    longitud: -58.15596838954122,
    "Capacidad productiva": 1955,
    "Oferta Aserrín": 1010,
    "Oferta Chip": 2351,
    "Oferta Viruta": 274,
    tipo: "aserradero",
    size: 35,
  },
  {
    Nombre: "MADERAS EL TALA S.R.L.",
    Identificador: "A14",
    latitud: -31.386848232322954,
    longitud: -58.09875530141546,
    "Capacidad productiva": 372,
    "Oferta Aserrín": 192,
    "Oferta Chip": 448,
    "Oferta Viruta": 52,
    tipo: "aserradero",
    size: 24,
  },
  {
    Nombre: "ASERRADERO HAMBIS",
    Identificador: "A15",
    latitud: -31.674917711433498,
    longitud: -58.2325209539556,
    "Capacidad productiva": 351,
    "Oferta Aserrín": 181,
    "Oferta Chip": 422,
    "Oferta Viruta": 49,
    tipo: "aserradero",
    size: 23,
  },
  {
    Nombre: "ASERRADERO UBAJAY",
    Identificador: "A16",
    latitud: -31.839796651998327,
    longitud: -58.336752954918325,
    "Capacidad productiva": 59,
    "Oferta Aserrín": 39,
    "Oferta Chip": 80,
    "Oferta Viruta": 0,
    tipo: "aserradero",
    size: 16,
  },
  {
    Nombre: "ASERRADERO STELLA",
    Identificador: "A17",
    latitud: -31.78588459512616,
    longitud: -58.3106216294179,
    "Capacidad productiva": 1839,
    "Oferta Aserrín": 951,
    "Oferta Chip": 2212,
    "Oferta Viruta": 258,
    tipo: "aserradero",
    size: 33,
  },
  {
    Nombre: "ASERRADERO BENAY",
    Identificador: "A18",
    latitud: -31.787523555600433,
    longitud: -58.316636614975025,
    "Capacidad productiva": 354,
    "Oferta Aserrín": 183,
    "Oferta Chip": 426,
    "Oferta Viruta": 50,
    tipo: "aserradero",
    size: 23,
  },
  {
    Nombre: "BELPA S. A.",
    Identificador: "A19",
    latitud: -31.005531177696238,
    longitud: -57.900452359242216,
    "Capacidad productiva": 379,
    "Oferta Aserrín": 196,
    "Oferta Chip": 456,
    "Oferta Viruta": 53,
    tipo: "aserradero",
    size: 24,
  },
  {
    Nombre: "LOS MADEROS",
    Identificador: "A20",
    latitud: -31.004978060489755,
    longitud: -57.90143032393203,
    "Capacidad productiva": 60,
    "Oferta Aserrín": 39,
    "Oferta Chip": 80,
    "Oferta Viruta": 0,
    tipo: "aserradero",
    size: 16,
  },
  {
    Nombre: "LAS TABLAS",
    Identificador: "A21",
    latitud: -30.758776579157,
    longitud: -57.973206764606324,
    "Capacidad productiva": 1873,
    "Oferta Aserrín": 968,
    "Oferta Chip": 2253,
    "Oferta Viruta": 263,
    tipo: "aserradero",
    size: 34,
  },
  {
    Nombre: "C Y E MADERAS",
    Identificador: "A22",
    latitud: -30.763829041991283,
    longitud: -57.992896211406595,
    "Capacidad productiva": 58,
    "Oferta Aserrín": 38,
    "Oferta Chip": 78,
    "Oferta Viruta": 0,
    tipo: "aserradero",
    size: 16,
  },
  {
    Nombre: "ASERRADERO SAN CAYETANO",
    Identificador: "A23",
    latitud: -31.431744473724184,
    longitud: -58.12476991883693,
    "Capacidad productiva": 1812,
    "Oferta Aserrín": 937,
    "Oferta Chip": 2180,
    "Oferta Viruta": 254,
    tipo: "aserradero",
    size: 33,
  },
  {
    Nombre: "VICTOR RAMON ZEROLENI S.R.L.",
    Identificador: "A24",
    latitud: -31.013051161983867,
    longitud: -57.90189033563924,
    "Capacidad productiva": 1902,
    "Oferta Aserrín": 983,
    "Oferta Chip": 2287,
    "Oferta Viruta": 267,
    tipo: "aserradero",
    size: 34,
  },
  {
    Nombre: "ASERRADERO LITORAL",
    Identificador: "A25",
    latitud: -31.391044216932762,
    longitud: -58.01726696162737,
    "Capacidad productiva": 1794,
    "Oferta Aserrín": 927,
    "Oferta Chip": 2157,
    "Oferta Viruta": 252,
    tipo: "aserradero",
    size: 32,
  },
  {
    Nombre: "AMBAR MADERAS",
    Identificador: "A26",
    latitud: -31.009619564859705,
    longitud: -57.894499623642545,
    "Capacidad productiva": 4803,
    "Oferta Aserrín": 2482,
    "Oferta Chip": 5777,
    "Oferta Viruta": 674,
    tipo: "aserradero",
    size: 52,
  },
  {
    Nombre: "TROZAN MADERAS SRL",
    Identificador: "A27",
    latitud: -31.009833484683323,
    longitud: -57.90235895727562,
    "Capacidad productiva": 57,
    "Oferta Aserrín": 30,
    "Oferta Chip": 69,
    "Oferta Viruta": 8,
    tipo: "aserradero",
    size: 16,
  },
  {
    Nombre: "YUQUEMÍ MADERAS S.R.L.",
    Identificador: "A28",
    latitud: -31.40948636624948,
    longitud: -58.10222604398408,
    "Capacidad productiva": 359,
    "Oferta Aserrín": 186,
    "Oferta Chip": 432,
    "Oferta Viruta": 50,
    tipo: "aserradero",
    size: 23,
  },
  {
    Nombre: "CAJONERA SIVIERO HNOS",
    Identificador: "A29",
    latitud: -30.799760046854566,
    longitud: -57.91709726253893,
    "Capacidad productiva": 367,
    "Oferta Aserrín": 0,
    "Oferta Chip": 734,
    "Oferta Viruta": 0,
    tipo: "aserradero",
    size: 24,
  },
  {
    Nombre: "concepción del uruguay",
    Identificador: "P01",
    latitud: -31.42276,
    longitud: -58.08755,
    tipo: "planta",
  },
  {
    Nombre: "puerto de uruguay",
    Identificador: "C01",
    latitud: -32.48545714433949,
    longitud: -58.22246247372517,
    tipo: "consumidor",
  },
  {
    Nombre: "Ceibas",
    Identificador: "C02",
    latitud: -33.50066056167482,
    longitud: -58.80458141771032,
    tipo: "consumidor",
  },
  {
    Nombre: "Victoria",
    Identificador: "C03",
    latitud: -32.59963789349363,
    longitud: -60.18341212007158,
    tipo: "consumidor",
  },
  {
    Nombre: "Paraná",
    Identificador: "C04",
    latitud: -31.7920737,
    longitud: -60.2945864,
    tipo: "consumidor",
  },
];
