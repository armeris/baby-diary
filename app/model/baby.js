var mongoose = require('mongoose');
var moment = require('moment-timezone');

var babySchema = mongoose.Schema({
	owners: [String],
	name: String,
	birthDate: String,
	events: [{date: Date, eventType: String, eventClass: String, eventAmount: Number, comment: String}]
});

babySchema.statics.fetchByUser = function (userId, callback){
	this.find().exec(function(err, babies){
		if(err){
			console.log(err);
		}
		var myBabies = [];
		babies.forEach(function(baby){
			if(baby.owners.indexOf(userId) != -1){
				myBabies[myBabies.length] = baby;
			}
		});
		return callback(myBabies);
	});
}

babySchema.statics.fetchById = function (babyId){
	return this.findOne({_id:babyId}).exec(function(err, baby){
		if(err){
			console.log(err);
		}
	});
}

babySchema.statics.aggregatedData = function(babyId, from, tz, callback){
	var functions = {};
	functions.map = function(){
		const TIMEZONE_OFFSET = new Date().getTimezoneOffset();
		const TIMEZONE_OFFSET_HOURS = TIMEZONE_OFFSET / 60;
    for(var i=0; i<this.events.length; i++){
			var eventTime = this.events[i].date;
			if((((eventTime.getHours()+TIMEZONE_OFFSET_HOURS)) % 24)*60 < TIMEZONE_OFFSET){
				eventTime.setHours(0,0,0,0);
				eventTime.setMinutes(eventTime.getMinutes() - TIMEZONE_OFFSET + (24*60));
			}else{
				eventTime.setHours(0,0,0,0);
				eventTime.setMinutes(eventTime.getMinutes() - TIMEZONE_OFFSET);
			}
			var key = {id:this._id.toString(),name: this.name, event:this.events[i].eventClass, date: eventTime};
			var value = this.events[i].eventAmount;
			emit(key,value);
    }
	};
	functions.reduce = function(eventType, eventAmounts){
			var total = 0;
			for (var i=0; i< eventAmounts.length; i++){
				total = total + Number(eventAmounts[i]);
			}
			
			return total;
	};
	functions.query = {
			_id: babyId
	}
	functions.scope = {
		timeZone: tz
	}
	this.mapReduce(functions, function(err, results){
		return callback(err,results.filter(function(evt){
			return (moment(evt._id.date).isAfter(from));
		}));
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