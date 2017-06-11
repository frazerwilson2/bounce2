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
    console.log(msg);
    var alert = phonon.alert('New ball owner is ' + msg + '!', 'The ball has changed hands', true, 'ok');
    alert.on('confirm', function() {
      updateBallOwnerText(msg);
    });
    alert.open();
  });
});
/**
 * The activity scope is not mandatory.
 * For the home page, we do not need to perform actions during
 * page events such as onCreate, onReady, etc
*/
app.on({page: 'home', preventClose: false, content: null});

function updateBallOwnerText(name){
    $('#ballInfo .owner').innerHTML = name + ' has the ball';
}