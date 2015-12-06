var Baby = require('../model/baby');

exports.listBabies = function(req, res){
	Baby.fetchByUser(req.user.id, function(data){
		res.render('baby/babyList',{user:req.user, babies: data});
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
		baby.events.push({date: new Date(), 
											eventType: req.body.eventType, 
											eventClass: req.body.eventClass, 
											eventAmount: req.body.eventAmount, 
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