var User = require('../model/user');

exports.unlinkGoogle = function(req, res){
	var user = req.user;
	user.google.token = undefined;
	user.save(function(err){
		res.redirect('/profile');
	});
}