var Baby = require('../model/baby');

exports.listBabies = function(req, res){
	var babies = Baby.find({$in:[req.userID]});
	res.render('baby/babyList',{user:req.user, babies: babies});
}