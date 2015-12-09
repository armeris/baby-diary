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
		$('div.jumbotron.startEventCreation div.baby-box').toggle();
		return false;
	});
	
	$('div.selector').click(function(){
		if($(this).hasClass('selected')){
			$(this).removeClass('selected');
			$('.group-selector.'+$(this).attr('data-type')).children().hide();
		}else{
			$(this).siblings().removeClass('selected');
			var parentLine = $(this).parent().attr('class').split(/\s+/).filter(function(elem){
				return elem.startsWith('line');
			})[0].substring(4);
			$('.group-selector').each(function(){
				var currentLine = $(this).attr('class').split(/\s+/).filter(function(elem){
					return elem.startsWith('line');
				})[0].substring(4);
				if(Number(currentLine) > Number(parentLine) && !$(this).hasClass('comments')){
					$(this).children().removeClass('selected');
					$(this).children().hide();
				}
			});
			$(this).addClass('selected');
			$('input[name='+$(this).attr('data-field')+']').val($(this).attr('data-type'));
			if($(this).attr('data-field') === 'babyId'){
				$('.group-selector.after-baby').children().show();
			}else{
				$('.group-selector.'+$(this).attr('data-type')).children().removeClass('hidden');
				$('.group-selector.'+$(this).attr('data-type')).children().show();
			}
			if($(this).parent().hasClass('line3')){
						$('div.comments').children().removeClass('hidden').show();
					}
			if($(this).parent().hasClass('line2') ||
					$(this).parent().hasClass('line1')){
						$('div.comments').children().addClass('hidden').hide();
					}
		}
	});
	
	$("input[name=boob-amount]").slider({
		tooltip: 'always'
	});
	$("input[name=boob-amount]").on("slide", function(slideEvt) {
		$("#boob-amount-label-number").text(slideEvt.value);
		$("input[name=eventAmount]").val($(this).val());
	});
	
	$("input[name=bottle-amount]").slider({
		tooltip: 'always'
	});
	$("input[name=bottle-amount]").on("slide", function(slideEvt) {
		$("#bottle-amount-label-number").text(slideEvt.value);
		$("input[name=eventAmount]").val($(this).val());
	});
	
	$('#datetimePicker').datetimepicker({format: 'HH:mm DD/MM/YYYY', defaultDate: new Date(), useCurrent: true, sideBySide: true, locale: 'es', focusOnShow: false, widgetPositioning: {horizontal: 'right', vertical: 'auto'}});
	$('#datetimePicker').on('dp.change', function(evt){
		$('input[name=eventDate]').val(evt.date._d);
	});
});