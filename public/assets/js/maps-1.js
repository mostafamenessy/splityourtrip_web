(function ($) {
    "use strict";
    function mainMap() {
      var ib = new InfoBox();
      function locationData(
        locationImg,
        locationPrice,
        locationURL,
        locationTitle,
        locationHotel,
        locationBath,
        locationMinus,
      ) {
        return (
          "" +
          '<div class="map-listing-item">' +
          '<div class="inner-box">' +
          '<div class="infoBox-close"><i class="icon-close"></i></div>' +
          '<div class="image-box">' +
          '<figure class="image"><img src="' +
          locationImg +
          '" alt=""></figure>' +
          "</div>" +
          '<div class="content">' +
          '<div class="price">' + locationPrice + '</div>' +
          '<h4><a href=' +
          locationURL +
          '>' +
          locationTitle +
          "</a></h4>" +
          '<div class="icon-box">' +
          '<div class="item">' +
          '<i class="flaticon-hotel"></i>' +
          '<p>' + locationHotel + '</p>' +
          '</div>' +
          '<div class="item">' +
          '<i class="flaticon-bath-tub"></i>' +
          '<p>' + locationBath + '</p>' +
          '</div>' +
          '<div class="item">' +
          '<i class="flaticon-minus-front"></i>' +
          '<p>' + locationMinus + '</p>' +
          '</div>' +
          '</div>' +
          "</div>" +
          "</div>"
        );
      }
  
      var locations = [
        [
          locationData(
            './../images/image-box/map-location-1.jpg',
            '$815,000',
            'property-single-v1.html',
            'Archer House',
            '4',
            '3',
            '2660',
          ),

          40.707370,
          -74.001643,
          1,
          '<div></div>',
        ],
      ];
  
      var mapZoomAttr = $("#map-1").attr("data-map-zoom");
      var mapScrollAttr = $("#map-1").attr("data-map-scroll");
      if (typeof mapZoomAttr !== typeof undefined && mapZoomAttr !== false) {
        var zoomLevel = parseInt(mapZoomAttr);
      } else {
        var zoomLevel = 5;
      }
      if (typeof mapScrollAttr !== typeof undefined && mapScrollAttr !== false) {
        var scrollEnabled = parseInt(mapScrollAttr);
      } else {
        var scrollEnabled = false;
      }
      var map = new google.maps.Map(document.getElementById("map-1"), {
        zoom: zoomLevel,
        scrollwheel: false,
        center: new google.maps.LatLng(40.706243, -74.000303),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoomControl: true,
        zoomControlOptions: {
          position: google.maps.ControlPosition.TOP_LEFT,
        },
        mapTypeControl: false,
        scaleControl: false,
        panControl: false,
        navigationControl: false,
        streetViewControl: false,
        gestureHandling: "cooperative",
      });
      
      var boxText = document.createElement("div");
      boxText.className = "map-box";
      var currentInfobox;
      var boxOptions = {
        content: boxText,
        disableAutoPan: false,
        alignBottom: true,
        maxWidth: 0,
        pixelOffset: new google.maps.Size(-134, -55),
        zIndex: null,
        boxStyle: { width: "360px" },
        closeBoxMargin: "0",
        closeBoxURL: "",
        infoBoxClearance: new google.maps.Size(25, 25),
        isHidden: false,
        pane: "floatPane",
        enableEventPropagation: false,
      };
      var markerCluster, overlay, i;
      var allMarkers = [];
      var clusterStyles = [
        { textColor: "white", url: "", height: 50, width: 50 },
      ];
      var markerIco;
      for (i = 0; i < locations.length; i++) {
        markerIco = locations[i][4];
        var overlaypositions = new google.maps.LatLng(
            locations[i][1],
            locations[i][2]
          ),
          overlay = new CustomMarker(
            overlaypositions,
            map,
            { marker_id: i },
            markerIco
          );
        allMarkers.push(overlay);
        google.maps.event.addDomListener(
          overlay,
          "click",
          (function (overlay, i) {
            return function () {
              ib.setOptions(boxOptions);
              boxText.innerHTML = locations[i][0];
              ib.close();
              ib.open(map, overlay);
              currentInfobox = locations[i][3];
              google.maps.event.addListener(ib, "domready", function () {
                $(".infoBox-close").click(function (e) {
                  e.preventDefault();
                  ib.close();
                  $(".map-marker-container").removeClass(
                    "clicked infoBox-opened"
                  );
                });
              });
            };
          })(overlay, i)
        );
      }
      var options = {
        imagePath: "images/",
        styles: clusterStyles,
        minClusterSize: 2,
      };
      markerCluster = new MarkerClusterer(map, allMarkers, options);
      google.maps.event.addDomListener(window, "resize", function () {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
      });

    }
    var map = document.getElementById("map-1");
    if (typeof map != "undefined" && map != null) {
      google.maps.event.addDomListener(window, "load", mainMap);
    }
  
    function CustomMarker(latlng, map, args, markerIco) {
      this.latlng = latlng;
      this.args = args;
      this.markerIco = markerIco;
      this.setMap(map);
    }
    CustomMarker.prototype = new google.maps.OverlayView();
    CustomMarker.prototype.draw = function () {
      var self = this;
      var div = this.div;
      if (!div) {
        div = this.div = document.createElement("div");
        div.className = "map-marker-container";
        div.innerHTML =
          '<div class="marker-container">' +
          '<div class="marker-card">' +
          '<div class="front face">' +
          self.markerIco +
          "</div>" +
          '<div class="back face">' +
          self.markerIco +
          "</div>" +
          '<div class="marker-arrow"></div>' +
          "</div>" +
          "</div>";
        google.maps.event.addDomListener(div, "click", function (event) {
          $(".map-marker-container").removeClass("clicked infoBox-opened");
          google.maps.event.trigger(self, "click");
          $(this).addClass("clicked infoBox-opened");
        });
        if (typeof self.args.marker_id !== "undefined") {
          div.dataset.marker_id = self.args.marker_id;
        }
        var panes = this.getPanes();
        panes.overlayImage.appendChild(div);
      }
      var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
      if (point) {
        div.style.left = point.x + "px";
        div.style.top = point.y + "px";
      }
    };
    CustomMarker.prototype.remove = function () {
      if (this.div) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
        $(this).removeClass("clicked");
      }
    };
    CustomMarker.prototype.getPosition = function () {
      return this.latlng;
    };
    

})(this.jQuery);
