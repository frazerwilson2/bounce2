app.controller('grabCtrl', function($scope, $rootScope, $http, BounceService, $state, $timeout, $stateParams) {

// get params for grab ball func (user id, name and loc)
var grabdata = $stateParams.grabdata;

player = localStorage.getItem('user');

// get Ball func
$scope.getBall = function() {
	ballfunc = BounceService.ballData();
	ballfunc.then(function successCallback(response) {
	    ballOwner = response.data.owner;
		if(player == ballOwner) {
			$state.go('play', {'check':true, 'valid':true});
		}
		else {
		  gitit = BounceService.getBall(grabdata[0], grabdata[1], grabdata[2], grabdata[3]);
		  gitit.then(function successCallback(response) {
		    $state.go('play', {'check':false, 'valid':true});
		  }, function errorCallback(response) {
		  });
		}
	}, function errorCallback(response) {
	    console.log(response);
  });
}

 //Adding initial value for counter 
$scope.counter = 5;
var stopped;

//timeout function
countdown();
function countdown() {
	if($scope.counter == 0) {
		$timeout.cancel(stopped);  
		$state.go('play', {'check':'false'});
	}
	else {
	    stopped = $timeout(function() {
	     $scope.counter--;   
	     countdown();   
	    }, 1000);
  	}
  };

});