var Baby = require('../model/baby');
var moment = require('moment-timezone');

exports.getAggregatedData = function(req, res){
	Baby.fetchByUser(req.user.id, function(err, babies){
		if(err){
			console.log(err);
		}
		
		babies.forEach(function(baby){
			Baby.aggregatedData(baby.id, function(err, results){
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
						processedData.values.push({label:item._id.date,value:item.value});
					} 
				});
				
				processedData.values.sort(function(a,b){
					return (moment(a.label,"DD/MM/YYYY") > moment(b.label,"DD/MM/YYYY"));
				});
				
				var result = [];
				result.push(processedData)
				
				res.json(result);
			});
		});
	});
}

exports.listBabies = function(req, res){
	Baby.fetchByUser(req.user.id, function(data){
		res.render('baby/babyList',{user:req.user, babies: data, moment: moment});
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
	Baby.fetchById(req.body.babyId, function(baby){
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
		
	res.redirect(301, '/babies');
}

exports.details = function(req, res){
	var babies = Baby.fetchByUser(req.user.id, function(babyList){
		babies = babyList;
	});
	Baby.findById(req.params.id, function(err, baby){
		if(err){
			console.log(err);
		}
		
		res.render('baby/details',{baby:baby, user: req.user, moment: moment, babies: babies});
	});
}