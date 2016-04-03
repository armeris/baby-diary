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
			if((((eventTime.getHours()+TIMEZONE_OFFSET_HOURS-(timeZone/60))) % 24)*60 < TIMEZONE_OFFSET){
				eventTime.setMinutes(eventTime.getMinutes() - Number(timeZone));
				eventTime.setHours(0,0,0,0);
				eventTime.setMinutes(eventTime.getMinutes() - TIMEZONE_OFFSET + (24*60));
			}else{
				eventTime.setMinutes(eventTime.getMinutes() - Number(timeZone));
				eventTime.setHours(0,0,0,0);
				eventTime.setMinutes(eventTime.getMinutes()- TIMEZONE_OFFSET);
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

babySchema.methods.getLastFood = function() {
	var events = this.events;
 	var lastFoodData = null;
	
	if(events){
			events = events.filter(function(event){
					return event.eventType === 'food';
			});
	}
	if(events && events.length > 0){
		events.sort(function(a,b){
			return a.date.getTime() - b.date.getTime() 
		});
		var lastEvent = events[events.length-1];
		lastFoodData = {name: this.name, date: moment(lastEvent.date).tz('Europe/Madrid').format('DD/MM/YYYY HH:mm')};
	}
	
	return lastFoodData;
}

module.exports = mongoose.model('Baby', babySchema);