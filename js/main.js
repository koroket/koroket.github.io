jQuery(document).ready(function($){
	var $timeline_block = $('.cd-timeline-block');

	//hide timeline blocks which are outside the viewport
	$timeline_block.each(function(){
		if($(this).offset().top > $(window).scrollTop()+$(window).height()*0.75) {
			$(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
		}
	});

	//on scolling, show/animate timeline blocks when enter the viewport
	$(window).on('scroll', function(){
		$timeline_block.each(function(){
			if( $(this).offset().top <= $(window).scrollTop()+$(window).height()*0.75 && $(this).find('.cd-timeline-img').hasClass('is-hidden') ) {
				$(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
			}
		});
	});




});

$(function(){
		deg = 0;
		//var tid = setInterval(mycode,10);
		left = -1;
		up = -1;
		current = 0;
		Actix = 200;
		Actiy =200;
		Shufflex = 400;
		Shuffley =150;
		Parasiticx = 400;
		Parasiticy = 400;
		Paysplitx = 650;
		Paysplity = 400;
		Delix = 650;
		Deliy = 650;
		clock = -1;
		xoff = 0;
		yoff = 0;

		moveit(0,0,"#image");
		moveit(0.8,0.8,"#image2");
		moveit(1.6,1.6,"#image3");
		moveit(2.4,2.4,"#image4");
		moveit(3.2,3.2,"#image5");
		moveit(4.0,4.0,"#image6");
		moveit(4.8,4.8,"#image7");
		moveit(5.6,5.6,"#image8");
		var t = 0;

		function moveit(startx, starty, theid) {
		    t += 0.005;

		    var r = 310;         // radius
		    var xcenter = (($(window).width())/2)*.9;   // center X position
		    var ycenter = (($(window).height())/2)*.8;   // center Y position

		    var newLeft = Math.floor(xcenter + (2.3*r * Math.cos(t-startx)));
		    var newTop = Math.floor(ycenter + (.9*r * Math.sin(t-starty)));
		    m = theid
		    $(m).animate({
		        top: newTop,
		        left: newLeft,
		    }, 200, function() {
		        moveit(startx,starty, theid);
		    });
		}

		function mycode(){

		actiposx  = Actix+xoff
		actiposy  = Actiy+yoff
		shuffleposx  = Shufflex+xoff
		shuffleposy  = Shuffley+yoff
		parasiticposx  = Parasiticx+xoff
		parasiticposy  = Parasiticy+yoff
		paysplitposx  = Paysplitx+xoff
		paysplitposy  = Paysplity+yoff
		deliposx  = Delix+xoff
		deliposy  = Deliy+yoff
		// $("#image").css("-ms-transform", "rotate("+deg+"deg)");
		// $("#image").css("-webkit-transform", "rotate("+deg+"deg)");
		// $("#image").css("transform", "rotate("+deg+"deg)");
		// $("#image").css("left", ""+actiposx+"px");
		// $("#image").css("top", ""+actiposy+"px");

		$("#image2").css("-ms-transform", "rotate("+deg+"deg)");
		$("#image2").css("-webkit-transform", "rotate("+deg+"deg)");
		$("#image2").css("transform", "rotate("+deg+"deg)");
		$("#image2").css("left", ""+shuffleposx+"px");
		$("#image2").css("top", ""+shuffleposy+"px");

		$("#image3").css("-ms-transform", "rotate("+deg+"deg)");
		$("#image3").css("-webkit-transform", "rotate("+deg+"deg)");
		$("#image3").css("transform", "rotate("+deg+"deg)");
		$("#image3").css("left", ""+parasiticposx+"px");
		$("#image3").css("top", ""+parasiticposy+"px");

		$("#image4").css("-ms-transform", "rotate("+deg+"deg)");
		$("#image4").css("-webkit-transform", "rotate("+deg+"deg)");
		$("#image4").css("transform", "rotate("+deg+"deg)");
		$("#image4").css("left", ""+paysplitposx+"px");
		$("#image4").css("top", ""+paysplitposy+"px");


		$("#image5").css("-ms-transform", "rotate("+deg+"deg)");
		$("#image5").css("-webkit-transform", "rotate("+deg+"deg)");
		$("#image5").css("transform", "rotate("+deg+"deg)");
		$("#image5").css("left", ""+deliposx+"px");
		$("#image5").css("top", ""+deliposy+"px");

		deg += (.1*clock);

		xoff +=(.5*left);
		yoff +=(.5*up);

		current +=1;

		if(current>100)
		{
			current = 0;
			left*=-1;
			up*=-1;
			clock*=-1;
		}




	}



	// function() {
	// 		var image = $("#image");
	// 		image.css("-ms-transform", "rotate(5deg)");
	// 		image.css("-webkit-transform", "rotate(5deg)");
	// 		image.css("transform", "rotate(5deg)");

	// };
});