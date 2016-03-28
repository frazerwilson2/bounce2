var app = angular.module('bounceApp', ['ui.router']);

app.controller('indexCtrl', function($scope, $rootScope, $http, BounceService, $state) {

$scope.joinFunc = function(name) {
// checkForPlayer
checkplayer = BounceService.checkForPlayer(name);
checkplayer.then(function successCallback(response) {
    console.log(response.data);
    localStorage.setItem('user', name);
    $state.go('play');
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
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

app.controller('playCtrl', function($scope, $http, BounceService, $state) {

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

$scope.loading = false;
 $scope.getLocation = function() {
  $scope.loading = true;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        $scope.loc = "Geolocation is not supported by this browser.";
        $scope.$apply();
        $scope.loading = false;
    }
}
function showPosition(position) {
    $scope.loc = {"lat": position.coords.latitude,"lon": position.coords.longitude};
    $scope.loading = false;
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
            $scope.$apply();
            break;
        case error.POSITION_UNAVAILABLE:
            $scope.loc = "Location information is unavailable."
            $scope.$apply();
            break;
        case error.TIMEOUT:
            $scope.loc = "The request to get user location timed out."
            $scope.$apply();
            break;
        case error.UNKNOWN_ERROR:
            $scope.loc = "An unknown error occurred."
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

});

app.run(function($rootScope, $urlRouter, $state) {
    $rootScope.$on('$locationChangeSuccess', function(evt) {
      var checkuser = localStorage.getItem('user');
      if(checkuser){
        $rootScope.$emit('logged', checkuser);
      }
      if(!checkuser) {
        $state.go('index');
      }
      else {
       $state.go('play'); 
      }
    });
  });
