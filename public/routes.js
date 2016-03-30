app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/index");
  //
  // Now set up the states
  $stateProvider
    .state('index', {
        url: "/index",
        templateUrl: "views/home.html"
    })
    .state('login', {
        url: "/login",
        templateUrl: "views/login.html"
    })
    .state('join', {
        url: "/join",
        templateUrl: "views/join.html"
    })
    .state('players', {
        url: "/players",
        templateUrl: "views/players.html"
    })
    .state('play', {
      url: "/play",
      templateUrl: "views/play.html",
      controller: 'playCtrl',
    })
    // .state('state1.list', {
    //   url: "/list",
    //   templateUrl: "partials/state1.list.html",
    //   controller: function($scope) {
    //     $scope.items = ["A", "List", "Of", "Items"];
    //   }
    // })
    // .state('state2', {
    //   url: "/state2",
    //   templateUrl: "partials/state2.html"
    // })
    // .state('state2.list', {
    //   url: "/list",
    //   templateUrl: "partials/state2.list.html",
    //   controller: function($scope) {
    //     $scope.things = ["A", "Set", "Of", "Things"];
    //   }
    // });
});
