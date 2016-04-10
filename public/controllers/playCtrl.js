app.controller('playCtrl', function($scope, $rootScope, $http, BounceService, $state, $timeout, $stateParams) {

$scope.player = localStorage.getItem('user');

if(!$scope.player) {
  $state.go('index');
}
else {
  getDetail();
}

if($stateParams.valid) {
$scope.valid = true;
};

function getDetail() {
// get player detail (are they ball owner?)
checkplayer = BounceService.checkForPlayer($scope.player);
checkplayer.then(function successCallback(response) {
  if(response.data.pass) {
    if(!$stateParams.valid && !$scope.valid){
    $state.go('pass', {'id':response.data._id, 'match':true});
    }
  }
    $scope.currentUser = response.data;
      // if($scope.currentUser.hasBall){       
      //   $timeout(function() { 
      //    getDetail();   
      //   }, 10000);
      // }
  }, function errorCallback(response) {
    console.log(response);
  });
}

// Get the location functions
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
    // The distance in meters user must be to grab
    $scope.range = 15;
    // redirect non ball owner if close enough!!
    if($scope.currentUser.name != $scope.ballOwner.owner){
      if($scope.distance < $scope.range) {
      // go to grab page
      var grabData = [$scope.currentUser._id, $scope.currentUser.name, $scope.loc.lat, $scope.loc.lon];
      $state.go('grab', {'grabdata':grabData});
      }
    }
    else {
      // too far
    }
 }


function showError(error) {
  console.log(error.code);
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

// do loc search if param true
if($scope.player) {
    $scope.getLocation();
}

// ballData
getBallData();
function getBallData() {
ballfunc = BounceService.ballData();
ballfunc.then(function successCallback(response) {
    $scope.ballOwner = response.data;
    timeSince();
    $timeout(function() {
     getBallData();   
    }, 10000);
  }, function errorCallback(response) {
    console.log(response);
  });
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
  return d;
}

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

// calculate streak
function timeSince() {
var fromTime = new Date($scope.ballOwner.taketime);
var toTime = new Date();

var differenceTravel = toTime.getTime() - fromTime.getTime();
var seconds = Math.floor((differenceTravel) / (1000));

 function secondsToString(seconds) {
  $scope.streak = [];
  $scope.streak.push(Math.floor(seconds / 31536000));
  $scope.streak.push(Math.floor((seconds % 31536000) / 86400)); 
  $scope.streak.push(Math.floor(((seconds % 31536000) % 86400) / 3600));
  $scope.streak.push(Math.floor((((seconds % 31536000) % 86400) % 3600) / 60));
  $scope.streak.push((((seconds % 31536000) % 86400) % 3600) % 60);
}
  $scope.timeStreak = secondsToString(seconds);
}

});

app.directive('highlighter', ['$timeout', function($timeout) {
  return {
    restrict: 'A',
    scope: {
      model: '=highlighter'
    },
    link: function(scope, element) {
      scope.$watch('model', function (nv, ov) {
        if (nv !== ov) {
          // apply class
          element.addClass('highlight');

          // auto remove after some delay
          $timeout(function () {
            element.removeClass('highlight');
          }, 1000);
        }
      });
    }
  };
}]);