// phonon initiate
phonon.options({
    navigator: {
        defaultPage: 'home',
        animatePages: true,
        enableBrowserBackButton: true,
        templateRootDirectory: './tpl'
    },
    i18n: null // for this example, we do not use internationalization
});

var app = phonon.navigator();

// global event works
document.on('pagecreated', function(evt) {
  socket.on('ball change', function(msg){
    var alert = phonon.alert('New ball owner is ' + msg + '!', 'The ball has changed hands', true, 'ok');
    alert.on('confirm', function() {
      updateBallOwnerText(msg);
      checkOwner();
    });
    alert.close();
  });

});
/**
 * The activity scope is not mandatory.
 * For the home page, we do not need to perform actions during
 * page events such as onCreate, onReady, etc
*/
app.on({page: 'home', preventClose: false, content: null}, function(activity) {

    activity.onReady(function() {
      checkOwner();
    });

});

function checkOwner(){
    const ownerToken = localStorage.getItem('ballOwner');

    if(ownerToken){
        fetch('/api/checkowner', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({pass: ownerToken})
        })
        .then(blob => blob.json())
        .then(function(data){
            console.log('pass match: ' + data);
            if(data){
                document.body.classList.add('ball-owner');
                isBallOwner = true;  
            }
            else {
                document.body.classList.remove('ball-owner');
                localStorage.removeItem('ballOwner');
                isBallOwner = false;
            }
        });
    }
};

function updateBallOwnerText(name){
    $('#ballInfo .owner').innerHTML = name + ' has the ball';
}