/**
 * Calculates and displays a car route from the Brandenburg Gate in the centre of Berlin
 * to Friedrichstraße Railway Station.
 *
 * A full list of available request parameters can be found in the Routing API documentation.
 * see:  http://developer.here.com/rest-apis/documentation/routing/topics/resource-calculate-route.html
 *
 * @param   {H.service.Platform} platform    A stub class to access HERE services
 */

var $table = $("#tableSale");
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

window.counterClicks = true;
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
          deliverNoSale = new H.map.DomIcon(
            svgMarker
              .replace("dataReplace", destinos[i].id)
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
              .replace("dataReplace", destinos[i].id)
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
        } else if (supply) {
          var sizeIcon = parseInt(destinos[i].size);
          deliverNoSale = new H.map.DomIcon(
            svgMarker
              .replace("dataReplace", destinos[i].id)
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
        if (useIcon != false) {
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
    if (window.counterClicks) {
      group.addEventListener(
        "tap",
        function (evt) {
          map.setCenter(evt.target.getGeometry());
          var dataSale = JSON.parse(evt.target.dataSale);
          if (dataSale.tipo == "aserradero") {
            viewSaleAserradero(evt.target.dataSale);
          } else if (dataSale.tipo == "consumidor") {
            viewSaleConsumo(evt.target.dataSale);
          } else {
            viewSalePlanta(evt.target.dataSale);
          }
          $("#clientHelp")[0].innerText = dataSale.id;
        },
        false
      );
      window.counterClicks = false;
    }
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

$("#ModalCenterSale").on("hidden.bs.modal", function () {
  resetSaleForm();
});

function viewSalePlanta(data) {
  $table.bootstrapTable("showColumn", "residuo");
  $table.bootstrapTable("showColumn", "producto");
  $table.bootstrapTable("showColumn", "prodMin");
  $table.bootstrapTable("showColumn", "prodMax");
  $table.bootstrapTable("hideColumn", "t1");
  $table.bootstrapTable("hideColumn", "t2");
  $table.bootstrapTable("hideColumn", "t3");
  $table.bootstrapTable("hideColumn", "t4");
  $table.bootstrapTable("hideColumn", "t5");
  $table.bootstrapTable("hideColumn", "t6");
  $table.bootstrapTable("hideColumn", "t7");
  $table.bootstrapTable("hideColumn", "t8");
  $table.bootstrapTable("hideColumn", "t9");
  $table.bootstrapTable("hideColumn", "t10");
  $table.bootstrapTable("hideColumn", "t11");
  $table.bootstrapTable("hideColumn", "t12");
  var dataSale = JSON.parse(data);
  $("#saleProduct").addClass("d-none");
  $("#date-input").attr("disabled", true);
  $("#time-input").attr("disabled", true);
  $("#toolbar").addClass("d-none");
  $("#ModalCenterSale").modal("show");
  var newId = 0;
  $table.bootstrapTable("insertRow", {
    index: 0,
    row: {
      residuo: "Aserrín",
      detalle: "<b class='text-secondary'>Stock</b>",
      invMin: dataSale.invAserrin[0],
      t0: dataSale.invAserrin[1],
      invMax: dataSale.invAserrin[2],
      t1: "as",
      t2: "asd",
    },
  });
  newId += 1;
  $table.bootstrapTable("insertRow", {
    index: 0,
    row: {
      residuo: "Chip",
      detalle: "<b class='text-secondary'>Stock</b>",
      invMin: dataSale.invChip[0],
      t0: dataSale.invChip[1],
      invMax: dataSale.invChip[2],
    },
  });
  newId += 1;
  $table.bootstrapTable("insertRow", {
    index: 0,
    row: {
      residuo: "Viruta",
      detalle: "<b class='text-secondary'>Stock</b>",
      invMin: dataSale.invViruta[0],
      t0: dataSale.invViruta[1],
      invMax: dataSale.invViruta[2],
    },
  });
  $table.bootstrapTable("insertRow", {
    index: 0,
    row: {
      producto: "Embolsado",
      detalle: "<b class='text-secondary'>Stock/Prod</b>",
      invMin: dataSale.invEmbolsado[0],
      t0: dataSale.invEmbolsado[1],
      invMax: dataSale.invEmbolsado[2],
      prodMin: dataSale.capProdEmbolsado[0],
      prodMax: dataSale.capProdEmbolsado[1],
    },
  });
  newId += 1;
  $table.bootstrapTable("insertRow", {
    index: 0,
    row: {
      producto: "A granel",
      detalle: "<b class='text-secondary'>Stock/Prod</b>",
      invMin: dataSale.invGranel[0],
      t0: dataSale.invGranel[1],
      invMax: dataSale.invGranel[2],
      prodMin: dataSale.capProdGranel[0],
      prodMax: dataSale.capProdGranel[1],
    },
  });
}

function residueFormatter(value, row) {
  var resultado = value === undefined ? "-" : '<b style="color:#7cb46b">' + value + '</b>';
  return resultado
}
function productFormatter(value, row) {
  var resultado = value === undefined ? "-" : '<b style="color:#96845a">' + value + '</b>';
  return resultado
}

function viewSaleAserradero(data) {
  var dataSale = JSON.parse(data);
  $table.bootstrapTable("hideColumn", "producto");
  $table.bootstrapTable("showColumn", "residuo");
  $table.bootstrapTable("hideColumn", "prodMin");
  $table.bootstrapTable("hideColumn", "prodMax");
  $table.bootstrapTable("showColumn", "t1");
  $table.bootstrapTable("showColumn", "t2");
  $table.bootstrapTable("showColumn", "t3");
  $table.bootstrapTable("showColumn", "t4");
  $table.bootstrapTable("showColumn", "t5");
  $table.bootstrapTable("showColumn", "t6");
  $table.bootstrapTable("showColumn", "t7");
  $table.bootstrapTable("showColumn", "t8");
  $table.bootstrapTable("showColumn", "t9");
  $table.bootstrapTable("showColumn", "t10");
  $table.bootstrapTable("showColumn", "t11");
  $table.bootstrapTable("showColumn", "t12");
  $("#saleProduct").addClass("d-none");
  $("#date-input").attr("disabled", true);
  $("#time-input").attr("disabled", true);
  $("#toolbar").addClass("d-none");
  $("#ModalCenterSale").modal("show");
  var newId = 0;
  $table.bootstrapTable("insertRow", {
    index: 0,
    row: {
      residuo: "Aserrín",
      detalle: "<b class='text-success'>Oferta</b>",
      invMin: dataSale.invAserrin[0],
      t0: dataSale.invAserrin[1],
      invMax: dataSale.invAserrin[2],
      t1: dataSale.oferAserrin[0],
      t2: dataSale.oferAserrin[1],
      t3: dataSale.oferAserrin[2],
      t4: dataSale.oferAserrin[3],
      t5: dataSale.oferAserrin[4],
      t6: dataSale.oferAserrin[5],
      t7: dataSale.oferAserrin[6],
      t8: dataSale.oferAserrin[7],
      t9: dataSale.oferAserrin[8],
      t10: dataSale.oferAserrin[9],
      t11: dataSale.oferAserrin[10],
      t12: dataSale.oferAserrin[11],
    },
  });
  newId += 1;
  $table.bootstrapTable("insertRow", {
    index: 0,
    row: {
      residuo: "Chip",
      detalle: "<b class='text-success'>Oferta</b>",
      invMin: dataSale.invChip[0],
      t0: dataSale.invChip[1],
      invMax: dataSale.invChip[2],
      t1: dataSale.oferChip[0],
      t2: dataSale.oferChip[1],
      t3: dataSale.oferChip[2],
      t4: dataSale.oferChip[3],
      t5: dataSale.oferChip[4],
      t6: dataSale.oferChip[5],
      t7: dataSale.oferChip[6],
      t8: dataSale.oferChip[7],
      t9: dataSale.oferChip[8],
      t10: dataSale.oferChip[9],
      t11: dataSale.oferChip[10],
      t12: dataSale.oferChip[11],
    },
  });
  newId += 1;
  $table.bootstrapTable("insertRow", {
    index: 0,
    row: {
      residuo: "Viruta",
      detalle: "<b class='text-success'>Oferta</b>",
      invMin: dataSale.invViruta[0],
      t0: dataSale.invViruta[1],
      invMax: dataSale.invViruta[2],
      t1: dataSale.oferViruta[0],
      t2: dataSale.oferViruta[1],
      t3: dataSale.oferViruta[2],
      t4: dataSale.oferViruta[3],
      t5: dataSale.oferViruta[4],
      t6: dataSale.oferViruta[5],
      t7: dataSale.oferViruta[6],
      t8: dataSale.oferViruta[7],
      t9: dataSale.oferViruta[8],
      t10: dataSale.oferViruta[9],
      t11: dataSale.oferViruta[10],
      t12: dataSale.oferViruta[11],
    },
  });
}

function viewSaleConsumo(data) {
  var dataSale = JSON.parse(data);
  $table.bootstrapTable("hideColumn", "residuo");
  $table.bootstrapTable("showColumn", "producto");
  $table.bootstrapTable("hideColumn", "prodMin");
  $table.bootstrapTable("hideColumn", "prodMax");
  $table.bootstrapTable("showColumn", "t1");
  $table.bootstrapTable("showColumn", "t2");
  $table.bootstrapTable("showColumn", "t3");
  $table.bootstrapTable("showColumn", "t4");
  $table.bootstrapTable("showColumn", "t5");
  $table.bootstrapTable("showColumn", "t6");
  $table.bootstrapTable("showColumn", "t7");
  $table.bootstrapTable("showColumn", "t8");
  $table.bootstrapTable("showColumn", "t9");
  $table.bootstrapTable("showColumn", "t10");
  $table.bootstrapTable("showColumn", "t11");
  $table.bootstrapTable("showColumn", "t12");
  $("#saleProduct").addClass("d-none");
  $("#date-input").attr("disabled", true);
  $("#time-input").attr("disabled", true);
  $("#toolbar").addClass("d-none");
  $("#ModalCenterSale").modal("show");
  var newId = 0;
  $table.bootstrapTable("insertRow", {
    index: 0,
    row: {
      producto: "Embolsado",
      detalle: "<b class='text-danger'>Demanda</b>",
      invMin: dataSale.invEmbolsado[0],
      t0: dataSale.invEmbolsado[1],
      invMax: dataSale.invEmbolsado[2],
      t1: dataSale.demEmbolsado[0],
      t2: dataSale.demEmbolsado[1],
      t3: dataSale.demEmbolsado[2],
      t4: dataSale.demEmbolsado[3],
      t5: dataSale.demEmbolsado[4],
      t6: dataSale.demEmbolsado[5],
      t7: dataSale.demEmbolsado[6],
      t8: dataSale.demEmbolsado[7],
      t9: dataSale.demEmbolsado[8],
      t10: dataSale.demEmbolsado[9],
      t11: dataSale.demEmbolsado[10],
      t12: dataSale.demEmbolsado[11],
    },
  });
  newId += 1;
  $table.bootstrapTable("insertRow", {
    index: 0,
    row: {
      producto: "Granel",
      detalle: "<b class='text-danger'>Demanda</b>",
      invMin: dataSale.invGranel[0],
      t0: dataSale.invGranel[1],
      invMax: dataSale.invGranel[2],
      t1: dataSale.demGranel[0],
      t2: dataSale.demGranel[1],
      t3: dataSale.demGranel[2],
      t4: dataSale.demGranel[3],
      t5: dataSale.demGranel[4],
      t6: dataSale.demGranel[5],
      t7: dataSale.demGranel[6],
      t8: dataSale.demGranel[7],
      t9: dataSale.demGranel[8],
      t10: dataSale.demGranel[9],
      t11: dataSale.demGranel[10],
      t12: dataSale.demGranel[11],
    },
  });
}

function resetSaleForm() {
  $table.bootstrapTable("removeAll");

  $("#clientHelp")[0].innerText = "No hay datos aún";
  $("#saleForm").trigger("reset");
}

function initTable() {
  $table.bootstrapTable("destroy").bootstrapTable({
    locale: $("#locale").val(),
    columns: [
      [
        {
          title: "Residuo",
          field: "residuo",
          rowspan: 2,
          align: "center",
          valign: "middle",
          visible: true,
          sortable: true,
          formatter: residueFormatter,
        },
        {
          title: "Producto",
          field: "producto",
          rowspan: 2,
          align: "center",
          valign: "middle",
          visible: true,
          sortable: true,
          formatter: productFormatter,
        },
        {
          title: "Detalle",
          field: "detalle",
          rowspan: 2,
          align: "center",
          valign: "middle",
          visible: true,
          sortable: true,
        },
        {
          title: "Stock Min",
          field: "invMin",
          rowspan: 2,
          align: "center",
          valign: "middle",
          visible: true,
          sortable: true,
        },
        {
          title: "Stock Max",
          field: "invMax",
          rowspan: 2,
          align: "center",
          valign: "middle",
          visible: true,
          sortable: true,
        },
        {
          title: "Producción Min",
          field: "prodMin",
          rowspan: 2,
          align: "center",
          valign: "middle",
          visible: false,
          sortable: true,
        },
        {
          title: "Producción Max",
          field: "prodMax",
          rowspan: 2,
          align: "center",
          valign: "middle",
          visible: false,
          sortable: true,
        },
        {
          title: "Semanas",
          field: "sem",
          colspan: 13,
          align: "center",
          visible: false,
        },
      ],
      [
        {
          field: "t0",
          title: "t0",
          sortable: true,
          align: "center",
        },
        {
          field: "t1",
          title: "t1",
          sortable: true,
          align: "center",
        },
        {
          field: "t2",
          title: "t2",
          sortable: true,
          align: "center",
        },
        {
          field: "t3",
          title: "t3",
          sortable: true,
          align: "center",
        },
        {
          field: "t4",
          title: "t4",
          sortable: true,
          align: "center",
        },
        {
          field: "t5",
          title: "t5",
          sortable: true,
          align: "center",
        },
        {
          field: "t6",
          title: "t6",
          sortable: true,
          align: "center",
        },
        {
          field: "t7",
          title: "t7",
          sortable: true,
          align: "center",
        },
        {
          field: "t8",
          title: "t8",
          sortable: true,
          align: "center",
        },
        {
          field: "t9",
          title: "t9",
          sortable: true,
          align: "center",
        },
        {
          field: "t10",
          title: "t10",
          sortable: true,
          align: "center",
        },
        {
          field: "t11",
          title: "t11",
          sortable: true,
          align: "center",
        },
        {
          field: "t12",
          title: "t12",
          sortable: true,
          align: "center",
        },
      ],
    ],
  });

  $table.on("all.bs.table", function (e, name, args) {});
}

$(function () {
  initTable();
  //$table.bootstrapTable('hideColumn', 'state');
  $("#locale").change(initTable);
  $table.bootstrapTable("hideLoading");
});

window.my_JSON_object = [
  {
    nombre: "ASERRADERO ORCELLET",
    id: "A1",
    latitud: -32.22696433409397,
    longitud: -58.14909864867021,
    capProd: 1838,
    oferAserrin: [
      19.41, 21.61, 15.38, 18.56, 18.01, 20.63, 17.94, 23.07, 22.7, 19.35, 15.5,
      20.75,
    ],
    oferChip: [
      45.17, 50.28, 35.79, 43.18, 41.9, 48.01, 41.76, 53.69, 52.84, 45.03,
      36.08, 48.29,
    ],
    oferViruta: [
      5.27, 5.87, 4.18, 5.04, 4.89, 5.6, 4.87, 6.26, 6.17, 5.25, 4.21, 5.64,
    ],
    invAserrin: [2, 28.5, 126],
    invChip: [5, 66.33, 270],
    invViruta: [1, 7.73, 11],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "ASERRADERO SAN JOSE SRL",
    id: "A2",
    latitud: -32.17698998889938,
    longitud: -58.2334871801827,
    capProd: 1794,
    oferAserrin: [
      16.42, 14.95, 13.43, 25.08, 19.84, 17.76, 15.63, 12.58, 23.8, 21.91,
      22.22, 17.94,
    ],
    oferChip: [
      38.21, 34.8, 31.25, 58.38, 46.16, 41.33, 36.36, 29.26, 55.39, 50.99, 51.7,
      41.76,
    ],
    oferViruta: [
      4.46, 4.06, 3.65, 6.81, 5.39, 4.82, 4.24, 3.42, 6.46, 5.95, 6.03, 4.87,
    ],
    invAserrin: [1, 27.82, 111],
    invChip: [3, 64.75, 270],
    invViruta: [1, 7.55, 10],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "ASERRADERO FOLLONIER",
    id: "A3",
    latitud: -32.216705427246914,
    longitud: -58.21915825573066,
    capProd: 1865,
    oferAserrin: [
      25.57, 18.19, 16.79, 19.78, 19.1, 12.64, 17.82, 18.86, 19.47, 24.47,
      21.12, 11.96,
    ],
    oferChip: [
      59.51, 42.33, 39.06, 46.02, 44.46, 29.4, 41.47, 43.89, 45.31, 56.96,
      49.14, 27.84,
    ],
    oferViruta: [
      6.94, 4.94, 4.56, 5.37, 5.19, 3.43, 4.84, 5.12, 5.29, 6.65, 5.73, 3.25,
    ],
    invAserrin: [0, 28.91, 120],
    invChip: [1, 67.28, 276],
    invViruta: [0, 7.84, 10],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "ASERRADERO LOS CIPRESES",
    id: "A4",
    latitud: -31.374284208575368,
    longitud: -58.0834308978701,
    capProd: 365,
    oferAserrin: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    oferChip: [
      13.72, 18.44, 14.44, 14.66, 18.2, 14.2, 12.53, 11.83, 12.07, 17.03, 17.74,
      13.24,
    ],
    oferViruta: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    invAserrin: [0, 0, 0],
    invChip: [2, 13.16, 93],
    invViruta: [0, 0, 0],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "LOS PINOS",
    id: "A5",
    latitud: -30.740113194845485,
    longitud: -57.96984224047468,
    capProd: 60,
    oferAserrin: [
      0.57, 1.24, 1.06, 1.06, 1.06, 0.57, 0.67, 1.24, 0.57, 1.14, 0.85, 0.57,
    ],
    oferChip: [
      0.86, 1.85, 1.57, 1.57, 1.57, 0.86, 1, 1.85, 0.86, 1.71, 1.28, 0.86,
    ],
    oferViruta: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    invAserrin: [0, 0.93, 3],
    invChip: [0, 2.16, 6],
    invViruta: [0, 0, 0],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "GIOVENALE CHRISTIAN",
    id: "A6",
    latitud: -31.367345546406234,
    longitud: -58.02951371799592,
    capProd: 373,
    oferAserrin: [
      13.02, 18.67, 16.79, 17.74, 14.44, 10.18, 11.35, 16.07, 16.32, 17.96,
      18.44, 17.49,
    ],
    oferChip: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    oferViruta: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    invAserrin: [0, 5.78, 102],
    invChip: [0, 0, 0],
    invViruta: [0, 0, 0],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "MARINGA MADERAS",
    id: "A7",
    latitud: -30.939403719401906,
    longitud: -57.870915446138994,
    capProd: 363,
    oferAserrin: [
      3.79, 4.64, 4.03, 3.73, 3.97, 4.15, 3.73, 2.69, 3.73, 3.48, 2.57, 4.4,
    ],
    oferChip: [
      8.81, 10.8, 9.38, 8.67, 9.24, 9.66, 8.67, 6.25, 8.67, 8.1, 5.97, 10.23,
    ],
    oferViruta: [
      1.03, 1.26, 1.1, 1.02, 1.08, 1.13, 1.02, 0.73, 1.02, 0.95, 0.7, 1.2,
    ],
    invAserrin: [0, 5.63, 21],
    invChip: [0, 13.11, 51],
    invViruta: [0, 1.53, 2],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "ACOM CONCORDIA SOC.ANONIMA",
    id: "A8",
    latitud: -31.374573416961965,
    longitud: -58.08465907952594,
    capProd: 58,
    oferAserrin: [
      0.96, 0.77, 0.85, 0.67, 1.06, 0.57, 0.57, 0.67, 1.14, 1.06, 1.06, 0.77,
    ],
    oferChip: [
      1.43, 1.14, 1.28, 1, 1.57, 0.86, 0.86, 1, 1.71, 1.57, 1.57, 1.14,
    ],
    oferViruta: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    invAserrin: [0, 0.9, 3],
    invChip: [0, 2.09, 6],
    invViruta: [0, 0, 0],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "DISTRIMADER SRL",
    id: "A9",
    latitud: -31.789115109729753,
    longitud: -58.31356970159871,
    capProd: 349,
    oferAserrin: [
      4.58, 3.36, 3.79, 3.61, 2.87, 4.7, 3.48, 3.06, 3.3, 3.18, 3.18, 3.06,
    ],
    oferChip: [
      10.66, 7.82, 8.81, 8.38, 6.68, 10.94, 8.1, 7.11, 7.67, 7.39, 7.39, 7.11,
    ],
    oferViruta: [
      1.25, 0.92, 1.03, 0.98, 0.78, 1.28, 0.95, 0.83, 0.9, 0.87, 0.87, 0.83,
    ],
    invAserrin: [0, 5.41, 21],
    invChip: [1, 12.6, 48],
    invViruta: [0, 1.47, 2],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "ASERRADERO SAN RAMON",
    id: "A10",
    latitud: -31.007173220048227,
    longitud: -57.90003406238971,
    capProd: 1816,
    oferAserrin: [
      21.73, 18.86, 15.63, 20.69, 18.43, 21.55, 16.6, 13.55, 23.8, 15.57, 17.27,
      17.15,
    ],
    oferChip: [
      50.56, 43.89, 36.36, 48.15, 42.9, 50.14, 38.63, 31.53, 55.39, 36.22, 40.2,
      39.91,
    ],
    oferViruta: [
      5.9, 5.12, 4.24, 5.62, 5.01, 5.85, 4.51, 3.68, 6.46, 4.23, 4.69, 4.66,
    ],
    invAserrin: [1, 28.15, 114],
    invChip: [1, 65.53, 270],
    invViruta: [0, 7.64, 10],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "MADERCOL",
    id: "A11",
    latitud: -31.01121286306625,
    longitud: -57.95441486473102,
    capProd: 57,
    oferAserrin: [
      0.8, 0.8, 0.55, 0.37, 0.62, 0.74, 0.62, 0.62, 0.37, 0.8, 0.68, 0.43,
    ],
    oferChip: [
      1.85, 1.85, 1.28, 0.86, 1.43, 1.71, 1.43, 1.43, 0.86, 1.85, 1.57, 1,
    ],
    oferViruta: [
      0.22, 0.22, 0.15, 0.1, 0.17, 0.2, 0.17, 0.17, 0.1, 0.22, 0.19, 0.12,
    ],
    invAserrin: [0, 0.89, 3],
    invChip: [0, 2.06, 6],
    invViruta: [0, 0.24, 2],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "SAN SEBASTIAN",
    id: "A12",
    latitud: -31.01048590776489,
    longitud: -57.90107961856614,
    capProd: 366,
    oferAserrin: [
      16.79, 12.31, 17.25, 15.83, 10.18, 15.37, 19.62, 14.44, 15.61, 15.12,
      9.94, 17.49,
    ],
    oferChip: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    oferViruta: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    invAserrin: [0, 5.68, 93],
    invChip: [0, 0, 0],
    invViruta: [0, 0, 0],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "ASERRADERO MALVASIO",
    id: "A13",
    latitud: -31.470802006754102,
    longitud: -58.15596838954122,
    capProd: 1955,
    oferAserrin: [
      23.13, 22.34, 18.98, 17.52, 20.63, 22.89, 19.47, 15.87, 21.06, 11.78,
      20.26, 25.69,
    ],
    oferChip: [
      53.83, 51.98, 44.17, 40.76, 48.01, 53.26, 45.31, 36.93, 49, 27.41, 47.16,
      59.8,
    ],
    oferViruta: [
      6.28, 6.07, 5.16, 4.76, 5.6, 6.21, 5.29, 4.31, 5.72, 3.2, 5.5, 6.98,
    ],
    invAserrin: [2, 30.31, 120],
    invChip: [1, 70.54, 303],
    invViruta: [0, 8.23, 11],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "MADERAS EL TALA S.R.L.",
    id: "A14",
    latitud: -31.386848232322954,
    longitud: -58.09875530141546,
    capProd: 372,
    oferAserrin: [
      3.67, 2.81, 2.99, 2.63, 3.54, 3.91, 2.57, 3.79, 3.54, 3.97, 3.12, 4.58,
    ],
    oferChip: [
      8.53, 6.54, 6.96, 6.11, 8.24, 9.09, 5.97, 8.81, 8.24, 9.24, 7.25, 10.66,
    ],
    oferViruta: [
      1, 0.77, 0.82, 0.72, 0.97, 1.06, 0.7, 1.03, 0.97, 1.08, 0.85, 1.25,
    ],
    invAserrin: [0, 5.77, 21],
    invChip: [1, 13.43, 51],
    invViruta: [0, 1.57, 2],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "ASERRADERO HAMBIS",
    id: "A15",
    latitud: -31.674917711433498,
    longitud: -58.2325209539556,
    capProd: 351,
    oferAserrin: [
      4.76, 3.48, 4.83, 3.79, 4.7, 3.42, 3.24, 3.54, 4.46, 2.51, 3.24, 3.3,
    ],
    oferChip: [
      11.08, 8.1, 11.22, 8.81, 10.94, 7.96, 7.53, 8.24, 10.37, 5.83, 7.53, 7.67,
    ],
    oferViruta: [
      1.3, 0.95, 1.31, 1.03, 1.28, 0.93, 0.88, 0.97, 1.21, 0.68, 0.88, 0.9,
    ],
    invAserrin: [0, 5.44, 24],
    invChip: [0, 12.67, 54],
    invViruta: [0, 1.48, 2],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "ASERRADERO UBAJAY",
    id: "A16",
    latitud: -31.839796651998327,
    longitud: -58.336752954918325,
    capProd: 59,
    oferAserrin: [
      0.57, 1.34, 0.57, 0, 0.67, 1.14, 0.77, 0.57, 0.96, 0.77, 0.39, 1.14,
    ],
    oferChip: [
      0.86, 1.99, 0.86, 0, 1, 1.71, 1.14, 0.86, 1.43, 1.14, 0.57, 1.71,
    ],
    oferViruta: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    invAserrin: [0, 0.92, 3],
    invChip: [0, 2.14, 6],
    invViruta: [0, 0, 0],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "ASERRADERO STELLA",
    id: "A17",
    latitud: -31.78588459512616,
    longitud: -58.3106216294179,
    capProd: 1839,
    oferAserrin: [
      21.24, 16.48, 16.11, 18.8, 16.36, 17.03, 13.06, 16.72, 22.77, 17.15,
      14.71, 16.48,
    ],
    oferChip: [
      49.43, 38.35, 37.5, 43.75, 38.07, 39.63, 30.4, 38.92, 52.98, 39.91, 34.23,
      38.35,
    ],
    oferViruta: [
      5.77, 4.48, 4.38, 5.11, 4.44, 4.63, 3.55, 4.54, 6.18, 4.66, 4, 4.48,
    ],
    invAserrin: [1, 28.52, 108],
    invChip: [1, 66.37, 240],
    invViruta: [0, 7.74, 9],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "ASERRADERO BENAY",
    id: "A18",
    latitud: -31.787523555600433,
    longitud: -58.316636614975025,
    capProd: 354,
    oferAserrin: [
      4.4, 2.75, 4.22, 3.12, 2.69, 4.34, 4.09, 3.48, 4.09, 4.58, 2.87, 3.79,
    ],
    oferChip: [
      10.23, 6.4, 9.8, 7.25, 6.25, 10.09, 9.52, 8.1, 9.52, 10.66, 6.68, 8.81,
    ],
    oferViruta: [
      1.2, 0.75, 1.15, 0.85, 0.73, 1.18, 1.11, 0.95, 1.11, 1.25, 0.78, 1.03,
    ],
    invAserrin: [0, 5.49, 21],
    invChip: [1, 12.78, 54],
    invViruta: [0, 1.49, 2],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "BELPA S. A.",
    id: "A19",
    latitud: -31.005531177696238,
    longitud: -57.900452359242216,
    capProd: 379,
    oferAserrin: [
      4.64, 4.76, 4.52, 4.03, 4.4, 3.42, 2.75, 3.42, 3.36, 3.24, 2.99, 3.91,
    ],
    oferChip: [
      10.8, 11.08, 10.51, 9.38, 10.23, 7.96, 6.4, 7.96, 7.82, 7.53, 6.96, 9.09,
    ],
    oferViruta: [
      1.26, 1.3, 1.23, 1.1, 1.2, 0.93, 0.75, 0.93, 0.92, 0.88, 0.82, 1.06,
    ],
    invAserrin: [0, 5.88, 24],
    invChip: [1, 13.68, 54],
    invViruta: [0, 1.6, 2],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "LOS MADEROS",
    id: "A20",
    latitud: -31.004978060489755,
    longitud: -57.90143032393203,
    capProd: 60,
    oferAserrin: [
      1.24, 0.57, 1.34, 1.06, 1.24, 0.49, 1.24, 0.67, 0.49, 0.85, 0.96, 0.85,
    ],
    oferChip: [
      1.85, 0.86, 1.99, 1.57, 1.85, 0.72, 1.85, 1, 0.72, 1.28, 1.43, 1.28,
    ],
    oferViruta: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    invAserrin: [0, 0.93, 3],
    invChip: [0, 2.16, 6],
    invViruta: [0, 0, 0],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "LAS TABLAS",
    id: "A21",
    latitud: -30.758776579157,
    longitud: -57.973206764606324,
    capProd: 1873,
    oferAserrin: [
      23.07, 12.94, 23.13, 23.38, 16.3, 22.52, 23.8, 19.41, 21.36, 22.34, 22.58,
      15.08,
    ],
    oferChip: [
      53.69, 30.11, 53.83, 54.4, 37.92, 52.41, 55.39, 45.17, 49.71, 51.98,
      52.55, 35.08,
    ],
    oferViruta: [
      6.26, 3.52, 6.28, 6.35, 4.43, 6.12, 6.46, 5.27, 5.8, 6.07, 6.13, 4.1,
    ],
    invAserrin: [2, 29.04, 123],
    invChip: [2, 67.58, 297],
    invViruta: [0, 7.88, 12],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "C Y E MADERAS",
    id: "A22",
    latitud: -30.763829041991283,
    longitud: -57.992896211406595,
    capProd: 58,
    oferAserrin: [
      0.77, 0.57, 0.96, 1.34, 0.85, 1.34, 0.77, 0.85, 1.14, 1.14, 0.85, 1.14,
    ],
    oferChip: [
      1.14, 0.86, 1.43, 1.99, 1.28, 1.99, 1.14, 1.28, 1.71, 1.71, 1.28, 1.71,
    ],
    oferViruta: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    invAserrin: [0, 0.9, 6],
    invChip: [0, 2.1, 9],
    invViruta: [0, 0, 0],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "ASERRADERO SAN CAYETANO",
    id: "A23",
    latitud: -31.431744473724184,
    longitud: -58.12476991883693,
    capProd: 1812,
    oferAserrin: [
      16.91, 13.55, 21.24, 17.76, 19.17, 21.36, 13.43, 18.37, 15.87, 21.61,
      18.56, 15.69,
    ],
    oferChip: [
      39.34, 31.53, 49.43, 41.33, 44.6, 49.71, 31.25, 42.75, 36.93, 50.28,
      43.18, 36.5,
    ],
    oferViruta: [
      4.59, 3.68, 5.77, 4.82, 5.2, 5.8, 3.65, 4.99, 4.31, 5.87, 5.04, 4.26,
    ],
    invAserrin: [2, 28.1, 108],
    invChip: [2, 65.39, 270],
    invViruta: [0, 7.62, 10],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "VICTOR RAMON ZEROLENI S.R.L.",
    id: "A24",
    latitud: -31.013051161983867,
    longitud: -57.90189033563924,
    capProd: 1902,
    oferAserrin: [
      22.58, 21.06, 13.67, 12.76, 24.6, 13.92, 16.85, 14.16, 20.2, 16.11, 18.98,
      17.09,
    ],
    oferChip: [
      52.55, 49, 31.82, 29.69, 57.24, 32.39, 39.2, 32.95, 47.01, 37.5, 44.17,
      39.77,
    ],
    oferViruta: [
      6.13, 5.72, 3.71, 3.47, 6.68, 3.78, 4.58, 3.85, 5.49, 4.38, 5.16, 4.64,
    ],
    invAserrin: [1, 29.48, 108],
    invChip: [1, 68.62, 267],
    invViruta: [0, 8, 10],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "ASERRADERO LITORAL",
    id: "A25",
    latitud: -31.391044216932762,
    longitud: -58.01726696162737,
    capProd: 1794,
    oferAserrin: [
      19.47, 20.02, 17.09, 22.22, 18.19, 19.17, 22.77, 14.16, 13.25, 11.96,
      20.69, 24.23,
    ],
    oferChip: [
      45.31, 46.59, 39.77, 51.7, 42.33, 44.6, 52.98, 32.95, 30.82, 27.84, 48.15,
      56.39,
    ],
    oferViruta: [
      5.29, 5.44, 4.64, 6.03, 4.94, 5.2, 6.18, 3.85, 3.6, 3.25, 5.62, 6.58,
    ],
    invAserrin: [0, 27.8, 117],
    invChip: [3, 64.71, 279],
    invViruta: [0, 7.55, 10],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "AMBAR MADERAS",
    id: "A26",
    latitud: -31.009619564859705,
    longitud: -57.894499623642545,
    capProd: 4803,
    oferAserrin: [
      39.36, 57, 46.26, 38.69, 41.8, 49.49, 38.14, 57.55, 50.83, 53.7, 52.91,
      46.01,
    ],
    oferChip: [
      91.61, 132.65, 107.66, 90.05, 97.29, 115.18, 88.77, 133.93, 118.31,
      124.98, 123.14, 107.09,
    ],
    oferViruta: [
      10.69, 15.47, 12.56, 10.5, 11.35, 13.44, 10.35, 15.62, 13.8, 14.58, 14.36,
      12.49,
    ],
    invAserrin: [4, 74.46, 306],
    invChip: [12, 173.31, 675],
    invViruta: [0, 20.21, 26],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "TROZAN MADERAS SRL",
    id: "A27",
    latitud: -31.009833484683323,
    longitud: -57.90235895727562,
    capProd: 57,
    oferAserrin: [
      0.68, 0.31, 0.37, 0.31, 0.31, 0.62, 0.68, 0.86, 0.62, 0.68, 0.8, 0.86,
    ],
    oferChip: [
      1.57, 0.72, 0.86, 0.72, 0.72, 1.43, 1.57, 1.99, 1.43, 1.57, 1.85, 1.99,
    ],
    oferViruta: [
      0.19, 0.09, 0.1, 0.09, 0.09, 0.17, 0.19, 0.24, 0.17, 0.19, 0.22, 0.24,
    ],
    invAserrin: [0, 0.89, 3],
    invChip: [0, 2.06, 6],
    invViruta: [0, 0.24, 2],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "YUQUEMÍ MADERAS S.R.L.",
    id: "A28",
    latitud: -31.40948636624948,
    longitud: -58.10222604398408,
    capProd: 359,
    oferAserrin: [
      3.85, 3.42, 3.73, 3.73, 4.4, 2.81, 3.24, 3.97, 3.91, 3.06, 3.79, 3.42,
    ],
    oferChip: [
      8.95, 7.96, 8.67, 8.67, 10.23, 6.54, 7.53, 9.24, 9.09, 7.11, 8.81, 7.96,
    ],
    oferViruta: [
      1.05, 0.93, 1.02, 1.02, 1.2, 0.77, 0.88, 1.08, 1.06, 0.83, 1.03, 0.93,
    ],
    invAserrin: [0, 5.57, 21],
    invChip: [1, 12.96, 51],
    invViruta: [0, 1.51, 2],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "CAJONERA SIVIERO HNOS",
    id: "A29",
    latitud: -30.799760046854566,
    longitud: -57.91709726253893,
    capProd: 367,
    oferAserrin: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    oferChip: [
      13.24, 17.74, 14.9, 16.07, 17.74, 12.53, 14.2, 10.89, 13.48, 9.48, 19.62,
      15.61,
    ],
    oferViruta: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    invAserrin: [0, 0, 0],
    invChip: [1, 13.24, 87],
    invViruta: [0, 0, 0],
    tipo: "aserradero",
    size: 24,
  },
  {
    nombre: "concepción del uruguay",
    id: "P01",
    latitud: -31.42276,
    longitud: -58.08755,
    invEmbolsado: [192, 250, 453],
    invGranel: [192, 280, 327],
    capProdEmbolsado: [0, 1296],
    capProdGranel: [192, 576],
    invAserrin: [768, 856, 2304],
    invChip: [384, 1038, 1152],
    invViruta: [192, 424, 1152],
    tipo: "planta",
  },
  {
    nombre: "puerto de uruguay",
    id: "C01",
    latitud: -32.48545714433949,
    longitud: -58.22246247372517,
    demEmbolsado: [212, 194, 217, 214, 275, 210, 194, 186, 209, 187, 243, 221],
    demGranel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    invEmbolsado: [138, 173, 335],
    invGranel: [0, 0, 0],
    tipo: "consumidor",
  },
  {
    nombre: "Ceibas",
    id: "C02",
    latitud: -33.50066056167482,
    longitud: -58.80458141771032,
    demEmbolsado: [17, 17, 17, 16, 18, 13, 12, 11, 14, 13, 17, 14],
    demGranel: [76, 75, 57, 48, 62, 54, 53, 65, 70, 62, 61, 52],
    invEmbolsado: [7, 70, 80],
    invGranel: [36, 75, 120],
    tipo: "consumidor",
  },
  {
    nombre: "Victoria",
    id: "C03",
    latitud: -32.59963789349363,
    longitud: -60.18341212007158,
    demEmbolsado: [18, 13, 17, 16, 15, 15, 15, 14, 17, 14, 18, 13],
    demGranel: [61, 73, 60, 63, 58, 61, 43, 48, 70, 59, 53, 57],
    invEmbolsado: [8, 24, 63],
    invGranel: [35, 80, 122],
    tipo: "consumidor",
  },
  {
    nombre: "Paraná",
    id: "C04",
    latitud: -31.7920737,
    longitud: -60.2945864,
    demEmbolsado: [14, 11, 15, 14, 15, 18, 12, 16, 17, 14, 18, 12],
    demGranel: [61, 54, 58, 65, 62, 61, 53, 57, 78, 72, 60, 48],
    invEmbolsado: [8, 15, 48],
    invGranel: [33, 60, 190],
    tipo: "consumidor",
  },
];
