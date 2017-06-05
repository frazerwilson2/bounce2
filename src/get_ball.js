  app.on({page: 'getball', preventClose: true, content: 'getball.html', readyDelay: 1}, function(activity) {

      var action = null;

      activity.onCreate(function() {
        $('#grabBall').addEventListener('click', function(){
          var ballName = $('#ballName').value;
          var ballCode = $('#ballCode').value;

        var request = new Request(getBall + '/' + ownerId + '/' + ballName + '/' + ballpos.lat + '/' + ballpos.lng, {
          method: 'POST',
        });

        // Now use it!
        fetch(request).then(function(res) { 
          socket.emit('ball change', ballName);
          window.location = '#!home';     
        });
        
      });

    });

    activity.onClose(function(self) {
        self.close();
    });

  }); // get ball page