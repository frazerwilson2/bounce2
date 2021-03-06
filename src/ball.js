'use strict';

var socket = io();

var ballpos;
var getBall = '/api/getball';

var getBallFunc = function getBallFunc() {
  // $.ajax({
  //   url: '/api/getball',
  //   success: function(success){
  //     ballpos = {lat: success.loc.lat, lng: success.loc.lon};
  //     console.log(ballpos);
  //   },
  //   dataType: 'json'
  // });

  fetch(getBall).then(function (blob) {
    return blob.json();
  }).then(function (data) {
    ballpos = {
      lat: data.loc.lat,
      lng: data.loc.lon
    };
    console.log(ballpos);
  });
};
getBallFunc();

// calc distance from ball
function distance(lon1, lat1, lon2, lat2) {
  var R = 6371; // Radius of the earth in km
  var dLat = (lat2 - lat1).toRad(); // Javascript functions in radians
  var dLon = (lon2 - lon1).toRad();
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c * 1000; // Distance in km
  console.clear();
  return numberWithCommas(Math.round(d)) + ' M';
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Converts numeric degrees to radians */
if (typeof Number.prototype.toRad === "undefined") {
  Number.prototype.toRad = function () {
    return this * Math.PI / 180;
  };
}

function initMap() {
  var uluru = { lat: 41.77131167976406, lng: -1.40625 };
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: uluru
  });
  var gmarkers = [];
  // var marker = new google.maps.Marker({
  //   position: uluru,
  //   map: map
  // });
  map.addListener('click', function (event) {
    var pos = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    socket.emit('chat message', 'click at ' + pos.lat + ", " + pos.lng);
    console.log(pos);
    console.log(distance(event.latLng.lng(), event.latLng.lat(), ballpos.lng, ballpos.lat));
    function removeMarkers() {
      for (i = 0; i < gmarkers.length; i++) {
        gmarkers[i].setMap(null);
      }
    };
    removeMarkers();
    var marker = new google.maps.Marker({
      position: pos,
      map: map,
      icon: 'rocket.png',
      title: 'Uluru (Ayers Rock)'
    });
    gmarkers.push(marker);
    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    infowindow.open(map, marker);
  });
  var contentString = '<div id="content">HERE</div>';
}

// mimick jquery
// function $(selector) { return document.querySelector(selector);  }
// function $$(selector) { return document.querySelectorAll(selector); }
// $("#someid"); //fetch the element with the id ‘someid’

socket.on('chat message', function (msg) {
  console.log(msg);
});
//# sourceMappingURL=ball.js.map
