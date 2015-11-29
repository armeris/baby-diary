var Baby = require('../model/baby');

exports.listBabies = function(req, res){
	Baby.find().exec(function(err, babies){
		var myBabies = [];
		babies.forEach(function(baby){
			if(baby.owners.indexOf(req.user.id) != -1){
				myBabies[myBabies.length] =baby;
			}
		});
		res.render('baby/babyList',{user:req.user, babies: myBabies});
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