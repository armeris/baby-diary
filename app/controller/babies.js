var Baby = require('../model/baby');
var moment = require('moment-timezone');
var async = require('async');

exports.getAggregatedData = function(req, res){
	Baby.fetchByUser(req.user.id, function(babies){
		var asyncTasks = [];
		babies.forEach(function(baby){
			asyncTasks.push(function(callback){
				var from = moment(req.query.from, 'YYYYMMDD').toDate();
				Baby.aggregatedData(baby.id, from, req.query.tz, function(err, results){
					if(results[0]){
						var processedData = {};
						var key = '';
						if(results[0]._id.event === 'bottle'){
							key += 'Biberón de ';
						}else if(results[0]._id.event === 'boob'){
							key += 'Teta de ';
						}else if(results[0]._id.event === 'pee'){
							key += 'Pis de ';
						}else if(results[0]._id.event === 'poo'){
							key += 'Caca de ';	
						}
						processedData.key = key + results[0]._id.name;
						processedData.values = [];
						results.forEach(function(item){
							if(item._id.event === 'bottle'){
								processedData.values.push({label:moment(item._id.date).tz('Europe/Madrid').format('DD/MM/YYYY'),value:item.value});
							} 
						});
						
						processedData.values.sort(function(a,b){
							return (moment(a.label,"DD/MM/YYYY") > moment(b.label,"DD/MM/YYYY"));
						});
						
						callback(null, processedData);
					}else{
						callback(null, null);
					}
				});	
			});
		});
		
		async.parallel(asyncTasks, function(err, result){
			res.json(result);
		});
	});
}

exports.listBabies = function(req, res){
	Baby.fetchByUser(req.user.id, function(data){
		var lastFoodData = [];
		for(var i=0;i < data.length; i++){
			data[i].events.sort(function(a,b){
				a.date - b.date
			});
			var lastEvent = data[i].events[data[i].events.length-1];
			var msg = "";
			lastFoodData[i] = {name: data[i].name, date: moment(lastEvent.date).format('DD/MM/YYYY HH:mm')};
		}
		res.render('baby/babyList',{user:req.user, babies: data, moment: moment, lastFoodData: lastFoodData});
	});
}

exports.addBaby = function(req, res){
	Baby.fetchByUser(req.user.id, function(data){
		res.render('baby/addBaby',{user:req.user, babies: data});
	});
}

exports.add = function(req, res){
	var newBaby = new Baby({name: req.body.name, birthDate: req.body.birthDate, owners:[req.user.id]});
	newBaby.save(function(err){
		if(err){
			console.log(err);
		}
	});
	
	res.redirect(302, '/babies');
}

exports.addEvent = function(req, res){
	var babyPromise = Baby.fetchById(req.body.babyId);
	
	babyPromise.then(function(baby){
		var amount = 0;
		if(req.body.eventType === 'diaper'){
			if(req.body.eventAmount === 'little'){
				amount = 0;
			}else if(req.body.eventAmount === 'normal'){
				amount = 1;
			}else if(req.body.eventAmount === 'much'){
				amount = 2;
			}
		}else{
			amount = req.body.eventAmount;
		}
		
		var date = new Date()
		if(req.body.eventDate !== ''){
			date = req.body.eventDate;
		}
		
		baby.events.push({date: date, 
											eventType: req.body.eventType, 
											eventClass: req.body.eventClass, 
											eventAmount: amount, 
											comment: req.body.comments
		});
		baby.save(function(err){
			if(err){
				req.flash('error', '¡Error añadiendo evento!');
			}
		});
		
		req.flash('info','¡Evento añadido correctamente!');
		
		if(req.headers.referer.match('/detail/')) {
			res.redirect(302, '/babies/detail/' + req.body.babyId);
		} else {
			res.redirect(302, '/babies');
		}
	});
}

exports.deleteEvent = function(req, res){
	Baby.deleteEvent(req.body.babyId, req.body.eventId);
		
	res.redirect(301, '/babies/detail/' + req.body.babyId);
}

exports.details = function(req, res){
	Baby.findById(req.params.id, function(err, baby){
		if(err){
			console.log(err);
		}
		
		Baby.fetchByUser(req.user.id, function(babyList){
			res.render('baby/details',{baby:baby, user: req.user, moment: moment, babies: babyList});
		});
	});
}