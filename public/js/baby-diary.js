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
		$('div.jumbotron.startEventCreation h1').toggle();
		$('div.jumbotron.startEventCreation div.food-box').toggle();
		$('div.jumbotron.startEventCreation div.diaper-box').toggle();
		return false;
	});
	
	$('div.selector').click(function(){
		if($(this).hasClass('selected')){
			$(this).removeClass('selected');
			$('.group-selector.'+$(this).attr('data-type')).children().hide();
		}else{
			$(this).siblings().removeClass('selected');
			var parentIndex = $('.jumbotron.startEventCreation').children('.group-selector').index($(this).parent());
			$(this).parent().siblings().each(function(index, item){
				if(index > parentIndex){
					$(item).children().hide();
					$(item).children().removeClass('selected');
				}
			});
			$(this).addClass('selected');
			$('input[name='+$(this).attr('data-field')+']').val($(this).attr('data-type'));
			$('.group-selector.'+$(this).attr('data-type')).children().show();
		}
	});
});