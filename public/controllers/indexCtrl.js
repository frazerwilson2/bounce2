app.controller('indexCtrl', function($scope, $rootScope, $http, BounceService, $state) {

$scope.joinFunc = function(name) {
  newName = name.toLowerCase();
  var refinedName = newName.replace(/[^\w\s]/gi, '')
checkplayer = BounceService.checkForPlayer(refinedName);
checkplayer.then(function successCallback(response) {
    //console.log(response);
    if(response.data.name){
        localStorage.setItem('user', refinedName);
        $state.go('play', {'check':true, 'match':true});
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
$scope.loading = false;
$scope.newJoinFunc = function(name) {
  if($scope.loading) {
    return;
  }
  $scope.loading = true;
  newName = name.toLowerCase();
  var refinedName = newName.replace(/[^\w\s]/gi, '')
newplayer = BounceService.newPlayer(refinedName);
newplayer.then(function successCallback(response) {
    console.log(response.data);
        localStorage.setItem('user', refinedName);
        $scope.loading = false;
        $state.go('play');
  }, function errorCallback(response) {
    console.log(response);
    $scope.loading = false;
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

});