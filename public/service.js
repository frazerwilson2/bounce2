app.service("BounceService", function ($http) {

   // Get control history report
   this.getPlayers = function () {
     return $http({
        method: 'GET',
        url: '/api/players'
      });
   }

   // /players/:player_name
   this.checkForPlayer = function(name) {
     return $http({
        method: 'GET',
        url: '/api/players/' + name + '/' + false
      });
   }

   this.getBall = function(id, name, lat, lon) {
    // /getball/:player_id
    return $http({
        method: 'POST',
        url: '/api/getball/' + id + '/' + name + '/' + lat + '/' + lon
      });
   }

   this.ballData = function() {
    // /getball
    return $http({
        method: 'GET',
        url: '/api/getball'
      });
   }

});