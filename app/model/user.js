var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Baby = require('./baby');

var userSchema = mongoose.Schema({
	local: {
		email: String,
		password: String
	},
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String
	},
	google: {
		id: String,
		token: String,
		email: String,
		name: String
	}
});

userSchema.methods.isOwner = function(babyId){
	var user = this;
	return Baby.fetchById(babyId);
}

userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.local.password);
}

userSchema.methods.name = function(){
	if(this.facebook.name){
		return(this.facebook.name);
	}else if(this.google.name){
		return(this.google.name);
	}else{
		return(this.local.email);
	}
}

module.exports = mongoose.model('User', userSchema);