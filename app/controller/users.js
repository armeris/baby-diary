var User = require('../model/user');
var Baby = require('../model/baby');

exports.profile = function(req,res){
	Baby.fetchByUser(req.user.id, function(data){
		res.render('user/profile', {user: req.user, babies: data});
	});
}

exports.unlinkGoogle = function(req, res){
	var user = req.user;
	user.google.token = undefined;
	user.save(function(err){
		res.redirect('/profile');
	});
}

exports.unlinkLocal = function(req, res){
	var user = req.user;
		
	user.local.email = undefined;
	user.local.password = undefined;
	user.save(function(err){
		res.redirect('/profile');
	});
}

exports.unlinkFacebook = function(req, res){
	var user            = req.user;
	
	user.facebook.token = undefined;
	user.save(function(err) {
		res.redirect('/profile');
	});
}