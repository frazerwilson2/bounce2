
var mongoose  = require('mongoose');
var Schema  = mongoose.Schema;

var BallSchema   = new Schema({
    owner: String,
 	loc:  {lat:Number, lon:Number},
 	taketime: Date,
 	bouncetime: Date,
 	pass: Number
});

module.exports = mongoose.model('Ball', BallSchema);