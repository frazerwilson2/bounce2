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
    //console.log(response.data[latest - 1]);
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
  });
}

  $rootScope.$emit('loading', false);
 $scope.getLocation = function() {
  $rootScope.$emit('loading', true);
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
        console.log($scope.loc);
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

// bounceBall
$scope.bounceBall = function() {
  $scope.getLocation();
  bounceit = BounceService.bounceBall($scope.ballOwner._id, $scope.loc.lat, $scope.loc.lon);
  bounceit.then(function successCallback(response) {
    getDetail();
    getBallData();
  }, function errorCallback(response) {
    console.log(response);
  });
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
$scope.streak = [];
$scope.streak.push(Math.floor(seconds / 31536000));
$scope.streak.push(Math.floor((seconds % 31536000) / 86400)); 
$scope.streak.push(Math.floor(((seconds % 31536000) % 86400) / 3600));
$scope.streak.push(Math.floor((((seconds % 31536000) % 86400) % 3600) / 60));
$scope.streak.push((((seconds % 31536000) % 86400) % 3600) % 60);
//return numyears + " years " +  numdays + " days " + numhours + " hours " + numminutes + " minutes " + numseconds + " seconds";
//console.log($scope.streak);
}
//console.log(fromTime);
//console.log(toTime);
//console.log(secondsToString(seconds));
$scope.timeStreak = secondsToString(seconds);
}

});