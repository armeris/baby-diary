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

babySchema.statics.deleteEvent = function (babyId, eventId){
	this.findOne({_id: babyId}, function(err, baby){
		if(err){
			console.log(err);
		}
		
		baby.events.filter(function(item){
			return(item.id === eventId);
		}).forEach(function(event){
			baby.events.remove(event);
		});
		
		baby.save(function(err){
			if(err){
				console.log(err);
			}
		});
	});	
};

module.exports = mongoose.model('Baby', babySchema);