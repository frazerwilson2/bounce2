app.controller('playersCtrl', function($scope, $rootScope, $http, BounceService, $state) {

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