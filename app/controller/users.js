var User = require('../model/user');

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