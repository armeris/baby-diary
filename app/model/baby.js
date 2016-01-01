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

babySchema.statics.weekAggregatedData = function(babyId, callback){
	var functions = {};
	functions.map = function(){
		var today = new Date();
		today.setHours(0,0,0,0);
		var week = 60*60*24*7*1000;
    for(var i=0; i<this.events.length; i++){
			var eventTime = this.events[i].date.getTime();
			var diff = today.getTime() - eventTime; 
			if(diff <= week){		
				var key = {id:this._id,event:this.events[i].eventClass, date: new Date(eventTime).getDate()+'/'+(new Date(eventTime).getMonth()+1)+'/'+new Date(eventTime).getFullYear()};
				var value = this.events[i].eventAmount;
				emit(key,value);
			}
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
	this.mapReduce(functions, function(err, results){
		return callback(err,results);
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