var mongoose  = require('mongoose');
var Schema  = mongoose.Schema;

var PlayerSchema   = new Schema({
    name: String,
 	hasBall: Boolean,
 	pass: Number
});

module.exports = mongoose.model('Player', PlayerSchema);