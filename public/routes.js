app.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/index");
  //
  // Now set up the states
  $stateProvider
  .state('index', {
            url: "/index",
            views: {
                "viewA": {
                    templateUrl: "views/menu.html"
                },
                "viewB": {
                    templateUrl: "views/home.html"
                }
            }
        })
    // .state('players', {
    //   url: "/players",
    //   //controller: 'indexCtrl',
    //   views: {
    //             "viewA": {
    //                 templateUrl: "views/menu.html"
    //             },
    //             "viewB": {
    //                 templateUrl: "views/players.html",
    //                 controller: 'playersCtrl',
    //             }
    //         },
    // })
    .state('play', {
      url: "/play",
      views: {
                "viewA": {
                    templateUrl: "views/menu.html"
                },
                "viewB": {
                    templateUrl: "views/play.html",
                    controller: 'playCtrl',
                }
            },
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