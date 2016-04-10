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
        url: '/api/players/' + name
      });
   }

   this.newPlayer = function(name) {
     return $http({
        method: 'POST',
        url: '/api/players/' + name
      });
   }

   // /putPass/:player_id/:player_pass
   this.makePass = function(id, pass) {
     return $http({
        method: 'POST',
        url: '/api/putPass/' + id + '/' + pass
      });
   }

   this.matchPass = function(id, pass) {
     return $http({
        method: 'GET',
        url: '/api/putPass/' + id + '/' + pass
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

   this.bounceBall = function(id, lat, lon) {
 // /bounce/:ball_id/:player_lat/:player_lon
    return $http({
        method: 'POST',
        url: '/api/bounce/' + id + '/' + lat + '/' + lon
      });
   }

});