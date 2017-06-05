window.fetch = undefined;
require('whatwg-fetch')
require('jasmine-ajax')

function helloWorld() {
  return 'Hello world!';
}


beforeEach(function () {
    //console.log('works');
	
	// Start listening to xhr requests
    jasmine.Ajax.install();
  });

describe('Hello world', function () {
io = function(){
	return null;
}
// fetch = function(){
// 	return function(){[{"test":true}]};
// }
var ballApp = require('../public/build/ball');
  it('says hello', function () {
    expect(helloWorld()).toEqual('Hello world!');
  });
});