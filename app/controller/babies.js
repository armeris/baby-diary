var Baby = require('../model/baby');
var moment = require('moment');

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
			amount = req.body.eventAmount ? req.body.eventAmount : 0;
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
				console.log(err);
			}
		});
		
		res.redirect(302, '/babies');
	});
}