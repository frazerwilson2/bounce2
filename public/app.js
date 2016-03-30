var app = angular.module('bounceApp', ['ui.router', 'ngAnimate']);

app.controller('indexCtrl', function($scope, $rootScope, $http, BounceService, $state) {

$scope.start = true;
$scope.startSwitch = function() {
  $scope.start = !$scope.start;
}

$scope.joinFunc = function(name) {
// checkForPlayer
checkplayer = BounceService.checkForPlayer(name);
checkplayer.then(function successCallback(response) {
    console.log(response.data);
    if(response.data.name){
        localStorage.setItem('user', name);
        $state.go('play');
    }
    else {
      $state.go('join');
    }
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    console.log(response);
  });
}

// newPlayer
$scope.joinFunc = function(name) {
newplayer = BounceService.newPlayer(name);
newplayer.then(function successCallback(response) {
    console.log(response.data);
        localStorage.setItem('user', name);
        $state.go('play');
  }, function errorCallback(response) {
    console.log(response);
  });
}

$scope.quit = function() {
  localStorage.removeItem('user');
  $state.go('index');
  $rootScope.$emit('logged', false);
}

$scope.logged = false;
$rootScope.$on('logged', function(event, data) {
if(data) {
  $scope.logged = true;
}
else {
 $scope.logged = false; 
}
})

$rootScope.$on('loading', function(evt, data) {
$scope.loading = data;
});

getThePlayers();
function getThePlayers() {
playersfunc = BounceService.getPlayers();
playersfunc.then(function successCallback(response) {
    $scope.players = response.data;
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    console.log(response);
  });
}

  });

app.controller('playCtrl', function($scope, $rootScope, $http, BounceService, $state) {

$scope.player = localStorage.getItem('user');
getDetail();
function getDetail() {
// checkForPlayer
checkplayer = BounceService.checkForPlayer($scope.player);
checkplayer.then(function successCallback(response) {
    $scope.currentUser = response.data;
  }, function errorCallback(response) {
    console.log(response);
  });
}

// ballData
getBallData();
function getBallData() {
ballfunc = BounceService.ballData();
ballfunc.then(function successCallback(response) {
    var latest = response.data.length;
    $scope.ballOwner = response.data[latest - 1];
    timeSince();
  }, function errorCallback(response) {
    console.log(response);
  });
}

// getBall
$scope.getBall = function() {
  gitit = BounceService.getBall($scope.currentUser._id, $scope.currentUser.name, $scope.loc.lat, $scope.loc.lon);
  gitit.then(function successCallback(response) {
    getDetail();
    getBallData();
  }, function errorCallback(response) {
    console.log(response);
  });
}

  $rootScope.$emit('loading', false);
 $scope.getLocation = function() {
  $rootScope.$emit('loading', true);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        $scope.loc = "Geolocation is not supported by this browser.";
        $scope.$apply();
        $rootScope.$emit('loading', false);
    }
}
function showPosition(position) {
    $scope.loc = {"lat": position.coords.latitude,"lon": position.coords.longitude};
    $rootScope.$emit('loading', false);
    $scope.$apply();
    $scope.distance = distance($scope.loc.lon, $scope.loc.lat, $scope.ballOwner.loc.lon, $scope.ballOwner.loc.lat);
    $scope.$apply();
}

$scope.getLocation();
$scope.range = 15;

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            $scope.loc = "User denied the request for Geolocation."
            $rootScope.$emit('loading', false);
            $scope.$apply();
            break;
        case error.POSITION_UNAVAILABLE:
            $scope.loc = "Location information is unavailable."
            $rootScope.$emit('loading', false);
            $scope.$apply();
            break;
        case error.TIMEOUT:
            $scope.loc = "The request to get user location timed out."
            $rootScope.$emit('loading', false);
            $scope.$apply();
            break;
        case error.UNKNOWN_ERROR:
            $scope.loc = "An unknown error occurred."
            $rootScope.$emit('loading', false);
            $scope.$apply();
            break;
    }
}

function distance(lon1, lat1, lon2, lat2) {
  var R = 6371; // Radius of the earth in km
  var dLat = (lat2-lat1).toRad();  // Javascript functions in radians
  var dLon = (lon2-lon1).toRad(); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c * 1000; // Distance in km
  return d;
}

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

function timeSince() {
var _initial = '2016-01-21T10:17:28.593Z';
var fromTime = new Date(_initial);
var fromTime = new Date($scope.ballOwner.taketime);
var toTime = new Date();

var differenceTravel = toTime.getTime() - fromTime.getTime();
var seconds = Math.floor((differenceTravel) / (1000));

 function secondsToString(seconds)
{
var numyears = Math.floor(seconds / 31536000);
var numdays = Math.floor((seconds % 31536000) / 86400); 
var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
return numyears + " years " +  numdays + " days " + numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";

}
console.log(fromTime);
console.log(toTime);
console.log(secondsToString(seconds));
$scope.timeStreak = secondsToString(seconds);
}

});

app.run(function($rootScope, $urlRouter, $state) {
    $rootScope.$on('$locationChangeSuccess', function(evt) {
      var checkuser = localStorage.getItem('user');
      if(checkuser){
        $rootScope.$emit('logged', checkuser);
      }
      // if(!checkuser) {
      //   $state.go('index');
      // }
      // else {
      //  $state.go('play'); 
      // }
    });
  });
