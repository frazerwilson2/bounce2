/*jshint esnext: true */
/*jslint node: true */
/* jshint browser: true */
    "use strict";

// global vars
var socket = io();
var ballpos;
var ownerId;
var getBall = '/api/getball';

var getBallFunc = function(){
  fetch(getBall)
  .then(blob => blob.json())
  .then(function(data){
    ownerId = data._id;
    var ballOwner = data.owner;
    updateBallOwnerText(ballOwner);
    ballpos = {
      lat: data.loc.lat, 
      lng: data.loc.lon
    };
   console.log(data);
  });
};
// get current ball location/owner
getBallFunc();

// calc distance from ball
function distance(lon1, lat1, lon2, lat2) {
  var R = 6371; // Radius of the earth in km
  var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
  var dLon = (lon2-lon1).toRad(); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c * 1000; // Distance in km
  console.clear();
  return Math.round(d);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  };
}

function updateBallOwnerText(name){
    $('#ballInfo .owner').innerHTML = name + ' has the ball';
}

var ballApp = ballApp || {};

function ballAppInit(){

// create map and events
        var uluru = {lat: 51.541084, lng: -0.1048659};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: uluru,
          styles: [
            {
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#1d2c4d"
                }
              ]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#8ec3b9"
                }
              ]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#1a3646"
                }
              ]
            },
            {
              "featureType": "administrative.country",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#4b6878"
                }
              ]
            },
            {
              "featureType": "administrative.land_parcel",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#64779e"
                }
              ]
            },
            {
              "featureType": "administrative.province",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#4b6878"
                }
              ]
            },
            {
              "featureType": "landscape.man_made",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#334e87"
                }
              ]
            },
            {
              "featureType": "landscape.natural",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#023e58"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#283d6a"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#6f9ba5"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#1d2c4d"
                }
              ]
            },
            {
              "featureType": "poi.business",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#023e58"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text",
              "stylers": [
                {
                  "visibility": "off"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#3C7680"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#304a7d"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#98a5be"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#1d2c4d"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#2c6675"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#255763"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#b0d5ce"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#023e58"
                }
              ]
            },
            {
              "featureType": "transit",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#98a5be"
                }
              ]
            },
            {
              "featureType": "transit",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#1d2c4d"
                }
              ]
            },
            {
              "featureType": "transit.line",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#283d6a"
                }
              ]
            },
            {
              "featureType": "transit.station",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#3a4762"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#0e1626"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#4e6d70"
                }
              ]
            }
          ],
          disableDefaultUI: true
        });
        var gmarkers = [];
        var removeMarkers = function(){
            for(var i=0; i<gmarkers.length; i++){
                gmarkers[i].setMap(null);
            }
            lookForBall();
        };
        map.addListener('click', function(event) {
          var pos = {lat: event.latLng.lat(), lng: event.latLng.lng()};
          console.log(pos);
          var ballDistance = distance(event.latLng.lng(), event.latLng.lat(), ballpos.lng, ballpos.lat);
          console.log(ballDistance);

          removeMarkers();
          var marker = new google.maps.Marker({
            position: pos,
            map: map,
            icon: 'dot.png',
            title: 'dot'
          });
          gmarkers.push(marker);
          var infowindow = new google.maps.InfoWindow({
            content: 'You are <span>' + numberWithCommas(ballDistance) + 'M</span> from the ball'
          });

          google.maps.event.addListener(infowindow, 'domready', function() {
             // Reference to the DIV which receives the contents of the infowindow using jQuery
             var iwOuter = $('.gm-style-iw');
             console.log(iwOuter.parentNode.childNodes[0].childNodes[3]);
             iwOuter.parentNode.childNodes[0].childNodes[3].classList.add('style-window');
             iwOuter.parentNode.childNodes[0].childNodes[2].childNodes[0].childNodes[0].classList.add('style-window');
             iwOuter.parentNode.childNodes[0].childNodes[2].childNodes[1].childNodes[0].classList.add('style-window');
          });
          
          infowindow.open(map, marker);
          
        });

        map.addListener('dragend', function(event){
          lookForBall();
        });
        map.addListener('zoom_changed', function(event){
          lookForBall();
        });
      var lookForBall = function() {
        console.log('look for ball');
            var z = map.getZoom();
            var cLat = map.getCenter().lat();
            var cLon = map.getCenter().lng();
            var closeness = distance(cLon, cLat, ballpos.lng, ballpos.lat);
            console.log(closeness);
            if(z >= 15 && closeness <= 100){
              console.log('close enough');
              var ballMarker = new google.maps.Marker({
                position: {lat: ballpos.lat, lng: ballpos.lng},
                map: map,
                icon: 'ball.png',
                title: 'Uluru (Ayers Rock)'
              });
              gmarkers.push(ballMarker);
              ballMarker.addListener('click', function(event) {
                console.log('take ball');
                window.location = '#!pagetwo';
              });     
            }
      };  // look for ball



};// init map


      // phonon initiate
      phonon.options({
          navigator: {
              defaultPage: 'home',
              animatePages: true,
              enableBrowserBackButton: true,
              templateRootDirectory: './tpl'
          },
          i18n: null // for this example, we do not use internationalization
      });

      var app = phonon.navigator();


      // global event works
      document.on('pagecreated', function(evt) {
        socket.on('ball change', function(msg){
          console.log(msg);
          var alert = phonon.alert('New ball owner is ' + msg + '!', 'The ball has changed hands', true, 'ok');
          alert.on('confirm', function() {
            updateBallOwnerText(msg);
          });
          alert.open();
        });
      });
      /**
       * The activity scope is not mandatory.
       * For the home page, we do not need to perform actions during
       * page events such as onCreate, onReady, etc
      */
      app.on({page: 'home', preventClose: false, content: null});

// TODO: rename to take ball page
      app.on({page: 'pagetwo', preventClose: true, content: 'pagetwo.html', readyDelay: 1}, function(activity) {

          var action = null;

          activity.onCreate(function() {
            $('#grabBall').addEventListener('click', function(){
              var ballName = $('#ballName').value;
              var ballCode = $('#ballCode').value;

            var request = new Request(getBall + '/' + ownerId + '/' + ballName + '/' + ballpos.lat + '/' + ballpos.lng, {
              method: 'POST',
            });

            // Now use it!
            fetch(request).then(function(res) { 
              socket.emit('ball change', ballName);
              window.location = '#!home';     
            });
            
          });

        });

        activity.onClose(function(self) {
            self.close();
        });

      });

      // Let's go!
      app.start();

      // mimick jquery
      function $(selector) { return document.querySelector(selector);  }
      function $$(selector) { return document.querySelectorAll(selector); }
      

  module.exports = ballApp;