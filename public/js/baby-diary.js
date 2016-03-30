var bottleSlider;
var boobSlider;
var feverSlider;
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
		if(location.href.indexOf('/detail/') === -1){
			$('div.jumbotron.startEventCreation div.baby-box').toggle();
		}else{
			$('div.jumbotron.startEventCreation div.after-baby').children().toggle();
		}
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
            if($(this).parent().hasClass('line3') && $(this).attr('data-type') === 'bottle'){
                $("input[name=eventAmount]").val($('div.line4.bottle:visible').find('input').val());
            }
			if($(this).parent().hasClass('line2') ||
					$(this).parent().hasClass('line1')){
						$('div.comments').children().addClass('hidden').hide();
					}
		}
	});
	
	boobSlider = $("input[name=boob-amount]").slider({
		tooltip: 'always'
	});
	$("input[name=boob-amount]").on("slide", function(slideEvt) {
		$("#boob-amount-label-number").text(slideEvt.value);
		$("input[name=eventAmount]").val($(this).val());
	});
	
	feverSlider = $("input[name=fever-amount]").slider({
		tooltip: 'always'
	});
	$("input[name=fever-amount]").on("slide", function(slideEvt) {
		$("#fever-amount-label-number").text(slideEvt.value);
		$("input[name=eventAmount]").val($(this).val());
	});
	
	$("input[name=boob-amount]").on("change", function(slideEvt) {
		$("#boob-amount-label-number").text(slideEvt.value.newValue);
		$("input[name=eventAmount]").val($(this).val());
	});
	
	bottleSlider = $("input[name=bottle-amount]").slider({
		tooltip: 'always'
	});
	$("input[name=bottle-amount]").on("slide", function(slideEvt) {
		$("#bottle-amount-label-number").text(slideEvt.value);
		$("input[name=eventAmount]").val($(this).val());
	});
	
	$("input[name=bottle-amount]").on("change", function(slideEvt) {
		$("#bottle-amount-label-number").text(slideEvt.value.newValue);
		$("input[name=eventAmount]").val($(this).val());
	});
	
	$('#datetimePicker').datetimepicker({format: 'HH:mm DD/MM/YYYY', defaultDate: new Date(), useCurrent: true, sideBySide: true, locale: 'es', focusOnShow: false, widgetPositioning: {horizontal: 'right', vertical: 'auto'}});
	$('#datetimePicker').on('dp.change', function(evt){
		$('input[name=eventDate]').val(evt.date._d);
	});
	
	$('ul.nav-tabs a[aria-controls=todo]').tab('show');
	
	$("div.group-selector.bottle div.plus-button").click(function(){
		bottleSlider.slider('setValue',bottleSlider.slider('getValue')+bottleSlider.slider('getAttribute','step'));
		$("#bottle-amount-label-number").text(bottleSlider.slider('getValue'));
	});
	
	$("div.group-selector.bottle div.minus-button").click(function(){
		bottleSlider.slider('setValue',bottleSlider.slider('getValue')-bottleSlider.slider('getAttribute','step'));
		$("#bottle-amount-label-number").text(bottleSlider.slider('getValue'));
	});
	
	$("div.group-selector.boob div.plus-button").click(function(){
		boobSlider.slider('setValue',boobSlider.slider('getValue')+boobSlider.slider('getAttribute','step'));
		$("#boob-amount-label-number").text(boobSlider.slider('getValue'));
	});
	
	$("div.group-selector.boob div.minus-button").click(function(){
		boobSlider.slider('setValue',boobSlider.slider('getValue')-boobSlider.slider('getAttribute','step'));
		$("#boob-amount-label-number").text(boobSlider.slider('getValue'));
	});
	
	$("div.group-selector.fever div.plus-button").click(function(){
		feverSlider.slider('setValue',Number(feverSlider.slider('getValue'))+Number(feverSlider.slider('getAttribute','step')));
		$("#fever-amount-label-number").text(feverSlider.slider('getValue'));
	});
	
	$("div.group-selector.fever div.minus-button").click(function(){
		feverSlider.slider('setValue',Number(feverSlider.slider('getValue'))-Number(feverSlider.slider('getAttribute','step')));
		$("#fever-amount-label-number").text(feverSlider.slider('getValue'));
	});
});