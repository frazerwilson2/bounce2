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
      $rootScope.$emit('user', name);
    }
  }, function errorCallback(response) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
    console.log(response);
  });
}

$rootScope.$on('user', function(event, data) {
$scope.playername = data;
  });

// newPlayer
$scope.newJoinFunc = function(name) {
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
    //console.log(response);
  });
}

  });