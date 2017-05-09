"use strict";

var socket = io();

var ballpos;
var getBall = '/api/getball';

var getBallFunc = function getBallFunc() {
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
  return Math.round(d);
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
  var removeMarkers = function removeMarkers() {
    for (var i = 0; i < gmarkers.length; i++) {
      gmarkers[i].setMap(null);
    }
    lookForBall();
  };
  map.addListener('click', function (event) {
    var pos = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    socket.emit('chat message', 'click at ' + pos.lat + ", " + pos.lng);
    console.log(pos);
    var ballDistance = distance(event.latLng.lng(), event.latLng.lat(), ballpos.lng, ballpos.lat);
    console.log(ballDistance);

    removeMarkers();
    var marker = new google.maps.Marker({
      position: pos,
      map: map,
      icon: 'rocket.png',
      title: 'Uluru (Ayers Rock)'
    });
    gmarkers.push(marker);
    var infowindow = new google.maps.InfoWindow({
      content: 'ball is ' + numberWithCommas(ballDistance) + 'M from here'
    });

    infowindow.open(map, marker);
  });
  var contentString = '<div id="content">HERE</div>';

  addClass($("#map"), 'working'); //fetch the element with the id ‘someid’

  map.addListener('dragend', function (event) {
    lookForBall();
  });
  map.addListener('zoom_changed', function (event) {
    lookForBall();
  });
  var lookForBall = function lookForBall() {
    console.log('look for ball');
    var z = map.getZoom();
    var cLat = map.getCenter().lat();
    var cLon = map.getCenter().lng();
    var closeness = distance(cLon, cLat, ballpos.lng, ballpos.lat);
    console.log(closeness);
    if (z >= 15 && closeness <= 100) {
      console.log('close enough');
      var ballMarker = new google.maps.Marker({
        position: { lat: ballpos.lat, lng: ballpos.lng },
        map: map,
        icon: 'ball.png',
        title: 'Uluru (Ayers Rock)'
      });
      gmarkers.push(ballMarker);
    };
  };
}

// mimick jquery
function $(selector) {
  return document.querySelector(selector);
};
function $$(selector) {
  return document.querySelectorAll(selector);
};
function addClass(el, cl) {
  el.classList.add(cl);
};

socket.on('chat message', function (msg) {
  console.log(msg);
});
//# sourceMappingURL=ball.js.map
