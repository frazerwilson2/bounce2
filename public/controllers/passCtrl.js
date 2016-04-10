app.controller('passCtrl', function($scope, $rootScope, $http, BounceService, $state, $stateParams) {

if(!$stateParams.id) {
	$state.go('play', {'check':false});
}

$scope.setPass = $stateParams.set;
$scope.loginPass = $stateParams.match;

// password func
$scope.passBlock = [5,0,0,0,0,0,0,0,0,0,5];
$scope.switchThis = function(x) {
if($scope.passBlock[x]){
  $scope.passBlock[x] = 0;
}
else {
  $scope.passBlock[x] = 1;
}
};

$rootScope.$emit('loading', false);

$scope.errormin = false;
// makePass
$scope.addPass = function() {
$scope.errormin = false;  
var  x = $scope.passBlock.join("");
  //console.log(x);
  if(x == 50000000005) {
	$scope.errormin = true;
  }
  else {
  passfunc = BounceService.makePass($stateParams.id, x);
  passfunc.then(function successCallback(response) {
    $state.go('play', {'check':true, 'valid':true});
   }, function errorCallback(response) {
    console.log(response);
  });
  }
};

$scope.errorpass = false;
// matchPass
$scope.matchPass = function() {  
$scope.errorpass = false;
$rootScope.$emit('loading', true);
var  x = $scope.passBlock.join("");
  passfunc = BounceService.matchPass($stateParams.id, x);
  passfunc.then(function successCallback(response) {
    result = response.data;
    if(result){
		$state.go('play', {'check':true, 'valid':true});
		$rootScope.$emit('loading', false);
    }
    else {
		$scope.passBlock = [5,0,0,0,0,0,0,0,0,0,5];
		$scope.errorpass = true;
		$rootScope.$emit('loading', false);
    }
   }, function errorCallback(response) {
    console.log(response);
    $rootScope.$emit('loading', false);
  });
};

});