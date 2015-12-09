var mongoose = require('mongoose');

var babySchema = mongoose.Schema({
	owners: [String],
	name: String,
	birthDate: String,
	events: [{date: Date, eventType: String, eventClass: String, eventAmount: Number, comment: String}]
});

babySchema.statics.fetchByUser = function (userId, callback){
	this.find().exec(function(err, babies){
		var myBabies = [];
		babies.forEach(function(baby){
			if(baby.owners.indexOf(userId) != -1){
				myBabies[myBabies.length] =baby;
			}
		});
		callback(myBabies);
	});
}

babySchema.statics.fetchById = function (babyId, callback){
	this.findOne({_id:babyId}).exec(function(err, baby){
		if(!err){
			callback(baby);
		}
	});
}

babySchema.statics.deleteEvent = function (eventId){
	this.update({},{$pull: {events: {_id: eventId}}}).exec(function(err, baby){
		if(err){
			console.log(err);
		}
	});	
};

module.exports = mongoose.model('Baby', babySchema);