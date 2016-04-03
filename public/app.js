var app = angular.module('bounceApp', ['ui.router', 'ngAnimate']);

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
