$(function(){
	$('nav.navbar button[name=signin]').click(function(){
		location.href = '/login'
	});
	
	$('nav.navbar button[name=signup]').click(function(){
		location.href = '/signup'
	});
	
	$('nav.navbar button[name=googleAuth]').click(function(){
		location.href = '/auth/google'
	});
	
	$('nav.navbar button[name=facebookAuth]').click(function(){
		location.href = '/auth/facebook'
	});
	
	$('a#addEvent').click(function(){
		$("div.jumbotron.startEventCreation h1").toggle();
		$("div.jumbotron.startEventCreation div.food-box").css('display','block');
		$("div.jumbotron.startEventCreation div.diaper-box").css('display','block');
		return false;
	});
});