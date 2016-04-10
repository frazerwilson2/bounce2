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
        templateUrl: "views/players.html",
        controller: 'playersCtrl',
    })
    .state('play', {
      url: "/play",
      params: {
        check: true,
        valid:null
      },
      templateUrl: "views/play.html",
      controller: 'playCtrl',
    })
    .state('grab', {
      url: "/grab",
      params: {
        grabdata:null,
      },
      templateUrl: "views/grab.html",
      controller: 'grabCtrl',
    })
    .state('pass', {
      url: "/pass",
      params: {
        id:null,
        set:null,
        match:null,
      },
      templateUrl: "views/password.html",
      controller: 'passCtrl',
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
