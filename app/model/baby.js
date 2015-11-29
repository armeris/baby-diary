var mongoose = require('mongoose');

var babySchema = mongoose.Schema({
	owners: [String],
	name: String,
	birthDate: String,
	events: [{date: Date, eventType: String, comment: String}]
});

module.exports = mongoose.model('Baby', babySchema);