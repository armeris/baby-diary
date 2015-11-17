var mongoose = require('mongoose');

var babySchema = mongoose.Schema({
	owners: [{ownerId: Number}],
	name: String,
	birthDate: String,
	events: [{date: Date, eventType: String, comment: String}]
});

module.exports = mongoose.model('Baby', babySchema);