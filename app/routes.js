var users = require('./controller/users.js');
var babies = require('./controller/babies.js');

var SUCCESSFUL_LOGIN = '/babies';

module.exports = function(app, passport){
	app.get('/', function(req, res){
		if(req.user){
			res.redirect('/babies');
		}else{
			res.render('index.ejs');	
		}
	});
	
	app.get('/login', function(req, res){
		res.render('login.ejs', {message: req.flash('loginMessage')});
	});
	
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: SUCCESSFUL_LOGIN,
		failureRedirect: '/login',
		failureFlash: true
	}));
	
	app.get('/signup', function(req, res){
		res.render('signup.ejs', {message: req.flash('signupMessage')});
	});
	
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: SUCCESSFUL_LOGIN,
		failureRedirect: '/signup',
		failureFlash: true
	}));
	
	app.get('/profile', isLoggedIn, users.profile);
	
	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	});
	
	app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
	
	app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : SUCCESSFUL_LOGIN,
            failureRedirect : '/'
        }));
	
	app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}))
	
	app.get('/auth/google/callback', passport.authenticate('google', {
		successRedirect: SUCCESSFUL_LOGIN,
		failureRedirect: '/'
	}));
	
	app.get('/connect/local', function(req, res){
		res.render('connect-local.ejs', {message: req.flash('loginMessage')});
	});
	
	app.post('/connect/local', passport.authenticate('local-signup', {
		successRedirect: SUCCESSFUL_LOGIN,
		failureRedirect: '/connect/local',
		failureFlash: true
	}));
	
	app.get('/connect/facebook', passport.authorize('facebook', {scope: 'email'}));
	
	app.get('/connect/facebook/callback', passport.authorize('facebook', {
		successRedirect: SUCCESSFUL_LOGIN,
		failureRedirect: '/'
	}));
	
	app.get('/connect/google', passport.authorize('google', {scope: ['profile', 'email']}));
	
	app.get('/connect/google/callback', passport.authorize('google', {
		successRedirect: SUCCESSFUL_LOGIN,
		failureRedirect: '/'
	}));
	
	app.get('/unlink/local', users.unlinkLocal);
	
	app.get('/unlink/facebook', users.unlinkFacebook);
	
	app.get('/unlink/google', users.unlinkGoogle);
	
	app.get('/babies', isLoggedIn, babies.listBabies);
	
	app.get('/babies/add', isLoggedIn, babies.addBaby);
	
	app.post('/babies/add', isLoggedIn, babies.add);
	
	app.post('/babies/addEvent', isLoggedIn, babies.addEvent);
	
	app.post('/babies/deleteEvent', isLoggedIn, babies.deleteEvent);
	
	app.get('/babies/detail/:id', isLoggerInAndIsOwner, babies.details);
	
	app.get('/babies/getAggregatedData', isLoggedIn, babies.getAggregatedData);
	
	function isLoggedIn(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}else{
			res.redirect('/');
		}
	}
	
	function isLoggerInAndIsOwner(req, res, next){
		if(req.isAuthenticated()){
			var promise = req.user.isOwner(req.params.id);
			promise.then(function(baby){
				if(baby && (baby.owners.indexOf(req.user.id) !== -1)){
					return next();
				}else{
					res.redirect('/');
				}
			},function(){
				res.redirect('/');
			});
		}else{
			res.redirect('/');
		}
	}
}