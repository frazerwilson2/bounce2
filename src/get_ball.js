  app.on({page: 'getball', preventClose: true, content: 'getball.html', readyDelay: 1}, function(activity) {

      var action = null;

      activity.onCreate(function() {
        $('#ballName').classList.remove('err');

        $('#ballName').addEventListener('click', function(){
          $('#ballName').classList.remove('err');
        });

        var passBlocks = document.querySelectorAll('#passBlock div');
        passBlocks.forEach(function(block) {
          block.addEventListener('click', function(){
            var currentVal = parseInt(this.dataset.val);
            var currentIndex = parseInt(this.dataset.num);
            switch(currentVal){
              case 0:
                this.dataset.val = 1;
                this.classList.add('one');
                break;
              case 1:
                this.dataset.val = 2;
                this.classList.add('two');
                break;
              case 2:
                this.dataset.val = 3;
                this.classList.add('three');
                break;
              case 3:
                this.dataset.val = 0;
                this.className = '';
                this.classList.add('zero');
                break;
            };
            var ballCode = $('#ballCode').value;
            var newCode = Array.from(ballCode);
            newCode[currentIndex + 3] = (currentVal + 1);
            var resultCode = newCode.join("");
            $('#ballCode').value = resultCode;
          });
        });

        $('#grabBall').addEventListener('click', function(){
          var ballName = $('#ballName').value;
          var ballCode = $('#ballCode').value;

          if(!ballName){
            $('#ballName').classList.add('err');
            return;
          }

          var request = new Request(getBall + '/' + ownerId + '/' + ballName + '/' + ballpos.lat + '/' + ballpos.lng + '/' + ballCode, {
            method: 'POST',
          });

          // Now use it!
          fetch(request).then(function(res) { 
            socket.emit('ball change', ballName);
            window.location = '#!home';
            localStorage.setItem('ballOwner', ballCode);     
          });
   
        });

    });

    activity.onClose(function(self) {
        self.close();
    });

  }); // get ball page