/*jshint esnext: true */
/*jslint node: true */
/* jshint browser: true */
    "use strict";

// global vars
var socket = io();
var ballpos;
var ownerId;
var getBall = '/api/getball';
var isBallOwner = false;
var marker;
var currentpos = {};

// get current ball location/owner
(function(){
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
})();


function ballAppInit(){
  grabLoc(createMaps);
};

var grabLoc = function(callback){
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
      currentpos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      callback();
      // infoWindow.setPosition(pos);
      // infoWindow.setContent('Location found.');
      // infoWindow.open(map);
      // map.setCenter(pos);
    }, function() {
      alert('didnt get location');
    });
  } else {
    // Browser doesn't support Geolocation
    alert('you wont allow geo, loser!');
  }
}

function createMaps(){

// create map and events
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: currentpos,
          styles: [{"elementType":"geometry","stylers":[{"color":"#1d2c4d"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#8ec3b9"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#1a3646"}]},{"featureType":"administrative.country","elementType":"geometry.stroke","stylers":[{"color":"#4b6878"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text.fill","stylers":[{"color":"#64779e"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"color":"#4b6878"}]},{"featureType":"landscape.man_made","elementType":"geometry.stroke","stylers":[{"color":"#334e87"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#023e58"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#283d6a"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#6f9ba5"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"color":"#1d2c4d"}]},{"featureType":"poi.business","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"geometry.fill","stylers":[{"color":"#023e58"}]},{"featureType":"poi.park","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#3C7680"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#304a7d"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#98a5be"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"color":"#1d2c4d"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#2c6675"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#255763"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#b0d5ce"}]},{"featureType":"road.highway","elementType":"labels.text.stroke","stylers":[{"color":"#023e58"}]},{"featureType":"transit","elementType":"labels.text.fill","stylers":[{"color":"#98a5be"}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"color":"#1d2c4d"}]},{"featureType":"transit.line","elementType":"geometry.fill","stylers":[{"color":"#283d6a"}]},{"featureType":"transit.station","elementType":"geometry","stylers":[{"color":"#3a4762"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#0e1626"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#4e6d70"}]}],
          disableDefaultUI: true
        });
        var gmarkers = [];
        var removeMarkers = function(){
            for(var i=0; i<gmarkers.length; i++){
                gmarkers[i].setMap(null);
            }
        };

        var watchOptions = {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 100
        };

        var watch = navigator.geolocation.watchPosition(function(position){
          console.log(position);
          currentpos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          map.setCenter(currentpos);
          var ballDistance = distance(currentpos.lng, currentpos.lat, ballpos.lng, ballpos.lat);
          showMarker(currentpos, ballDistance);
        }, 
        (err)=>{
          console.log(err);
        }, watchOptions);

        map.addListener('click', function(event) {
          grabLoc(()=>{
            if(isBallOwner){
              showMarker(currentpos, 0);
              return;
            }
            var ballDistance = distance(currentpos.lng, currentpos.lat, ballpos.lng, ballpos.lat);
            showMarker(currentpos , ballDistance);
          });
        });

        // map.addListener('dragend', function(event){
        //   lookForBall();
        // });
        // map.addListener('zoom_changed', function(event){
        //   lookForBall();
        // });

      var showBall = function() {
        console.log('look for ball');
        // console.log('close enough');
        var ballMarker = new google.maps.Marker({
          position: {lat: ballpos.lat, lng: ballpos.lng},
          map: map,
          icon: 'ball.png',
          title: 'Uluru (Ayers Rock)'
        });
        gmarkers.push(ballMarker);
        ballMarker.addListener('click', function(event) {
          if(!isBallOwner){
            console.log('take ball');
            window.location = '#!getball';
          }
        });     
      };  // look for ball

      var showMarker = function(pos, distance){
          var closeCheck = distance < 100;
          var z = map.getZoom();
          console.log(distance, closeCheck);
          removeMarkers();
          if(z >= 15 && closeCheck){
            showBall();
          }

          marker = new google.maps.Marker({
            position: isBallOwner ? {lat: ballpos.lat, lng: ballpos.lng} : pos,
            map: map,
            icon: isBallOwner ? 'ball.png' : 'dot.png',
            title: 'dot'
          });
          gmarkers.push(marker);

          var windowContent;
          if(!isBallOwner){
            windowContent = 'You are <span>' + numberWithCommas(distance) + 'M</span> from the ball';
          }
          else {
            windowContent = 'Last bounced here';
          }
          var infowindow = new google.maps.InfoWindow({
            content: windowContent
          });

          google.maps.event.addListener(infowindow, 'domready', function() {
             var iwOuter = $('.gm-style-iw');
             iwOuter.parentNode.childNodes[0].childNodes[3].classList.add('style-window');
             iwOuter.parentNode.childNodes[0].childNodes[2].childNodes[0].childNodes[0].classList.add('style-window');
             iwOuter.parentNode.childNodes[0].childNodes[2].childNodes[1].childNodes[0].classList.add('style-window');
          });
          
          infowindow.open(map, marker);
      };

};// init map

  // mimick jquery
  function $(selector) { return document.querySelector(selector);  }
  function $$(selector) { return document.querySelectorAll(selector); }
  
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

  // Let's go!
app.start();
