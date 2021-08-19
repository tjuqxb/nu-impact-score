var loader = new PIXI.Loader();
let container;
let renderer;
let pixiContainer;
let filterProcess;
let pMarkers = [];
let markerTexture;
loader.add('marker', './images/marker-icon.png');
document.addEventListener('DOMContentLoaded', function () {
  getJSON('./data/output.json', function (markers) {
    // table part
    //get country names
    countries = new Set();
    markers.forEach((record) => {
      countries.add(record.country);
    });
    let countryList = [...countries];
    const nary = countryList.sort((a, b) => {
      return a.localeCompare(b);
    });
    colNames = Object.keys(markers[0]);
    orig_data = markers;
    data = getContent(markers);
    filterData = data;
    colNames.forEach((elem) => {
      if (elem !== 'country') {
        let option = document.createElement('option');
        option.value = elem;
        option.text = elem;
        document.getElementById('filter-options').appendChild(option);
      }
    });
    nary.forEach((elem) => {
      let option = document.createElement('option');
      option.value = elem;
      option.text = elem;
      document.getElementById('country-options').appendChild(option);
    });
    gridObj = new gridjs.Grid({
      columns: colNames,
      data: filterData,
      pagination: {
        enabled: true,
        limit: 5,
        summary: false,
      },
      sort: true,
      search: {
        enabled: true,
      },
    });
    gridObj.render(document.getElementById('inner_table'));

    // map
    (function () {
      loader.load(function (loader, resources) {
        markerTexture = resources.marker.texture;
        var map = L.map('map').setView([46.953387, 2.892341], 6);
        L.tileLayer(
          '//stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png',
          {
            subdomains: 'abcd',
            attribution:
              'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
            minZoom: 2,
            maxZoom: 18,
          }
        ).addTo(map);
        map.attributionControl.setPosition('bottomleft');
        map.zoomControl.setPosition('bottomright');
        var pixiOverlay = (function () {
          var frame = null;
          var firstDraw = true;
          var prevZoom;
          //var markerLatLng = [51.5, -0.09];
          pixiContainer = new PIXI.Container();
          pixiContainer.interactive = true;
          pixiContainer.buttonMode = true;

          //console.log(filterData);
          data.forEach((record) => {
            var marker = new PIXI.Sprite(markerTexture);
            marker.latLng = [
              parseFloat(record[colNames.indexOf('latitude')]),
              parseFloat(record[colNames.indexOf('longitude')]),
            ];
            let t = document.createElement('table');
            let r0 = t.insertRow(0);
            let r1 = t.insertRow(1);
            for (let i = 0; i < colNames.length; i++) {
              let c0 = r0.insertCell(i);
              let c1 = r1.insertCell(i);
              c0.innerHTML = colNames[i];
              c1.innerHTML = record[i];
            }

            marker.popup = L.popup({
              className: 'pixi-popup',
              maxWidth: 'auto',
            })
              .setLatLng(marker.latLng)
              .setContent(t)
              .openOn(map);
            marker.interactive = true;

            pixiContainer.addChild(marker);
            pMarkers.push(marker);
          });
          var doubleBuffering =
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

          return L.pixiOverlay(
            function (utils) {
              if (frame) {
                cancelAnimationFrame(frame);
                frame = null;
              }
              var zoom = utils.getMap().getZoom();
              container = utils.getContainer();
              renderer = utils.getRenderer();
              var project = utils.latLngToLayerPoint;
              var scale = utils.getScale();

              if (firstDraw) {
                var getRenderer = utils.getRenderer;
                utils.getMap().on('click', function (e) {
                  // not really nice but much better than before
                  // good starting point for improvements
                  var interaction = utils.getRenderer().plugins.interaction;
                  var pointerEvent = e.originalEvent;
                  var pixiPoint = new PIXI.Point();
                  // get global click position in pixiPoint:
                  interaction.mapPositionToPoint(
                    pixiPoint,
                    pointerEvent.clientX,
                    pointerEvent.clientY
                  );
                  // get what is below the click if any:
                  var target = interaction.hitTest(pixiPoint, container);
                  if (target && target.popup) {
                    target.popup.openOn(map);
                  }
                });
                pMarkers.forEach((marker) => {
                  var markerCoords = project(marker.latLng);
                  marker.x = markerCoords.x;
                  marker.y = markerCoords.y;
                  marker.anchor.set(0.5, 1);
                  marker.scale.set(1 / scale);
                  marker.currentScale = 1 / scale;
                  if (firstDraw || prevZoom !== zoom) {
                    marker.currentScale = marker.scale.x;
                    marker.targetScale = 1 / scale;
                  }
                });
              }
              if (firstDraw || prevZoom !== zoom) {
                pMarkers.forEach((marker) => {
                  marker.currentScale = marker.scale.x;
                  marker.targetScale = 1 / scale;
                });
              }
              var duration = 100;
              var start;
              function animate(timestamp) {
                var progress;
                if (start === null) start = timestamp;
                progress = timestamp - start;
                var lambda = progress / duration;
                if (lambda > 1) lambda = 1;
                lambda = lambda * (0.4 + lambda * (2.2 + lambda * -1.6));
                pMarkers.forEach((marker) => {
                  marker.scale.set(
                    marker.currentScale +
                      lambda * (marker.targetScale - marker.currentScale)
                  );
                });

                renderer.render(container);
                if (progress < duration) {
                  frame = requestAnimationFrame(animate);
                }
              }

              if (!firstDraw && prevZoom !== zoom) {
                start = null;
                frame = requestAnimationFrame(animate);
              }

              firstDraw = false;
              prevZoom = zoom;
              renderer.render(container);
            },
            pixiContainer,
            {
              doubleBuffering: doubleBuffering,
              autoPreventDefault: false,
            }
          );
        })();
        pixiOverlay.addTo(map);
      });
    })();
  });
});
