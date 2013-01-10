$(document).ready(function() {	

/*
 * CONTENTS
 *
 *   1: Email Spam Protection 
 *   2: Menu on FrontPage
 *
 */
 
 
/* 
 * 0: js-hidden must be hidden
 ****************************************************
 */ 
 $(".js-hidden").hide();

/* 
 * 1.
 * EmailSpamProtection (jQuery Plugin)
 ****************************************************
 * Author: Mike Unckel
 * Description and Demo: http://unckel.de/labs/jquery-plugin-email-spam-protection
 */
$.fn.emailSpamProtection = function(className) {
	return $(this).find("." + className).each(function() {
		var $this = $(this);
		var s = $this.text().replace(" [at] ", "&#64;");
		$this.html("<a href=\"mailto:" + s + "\">" + s + "</a>");
	});
};
$("body").emailSpamProtection("email");

/* 
 * 2.
 * Menu on FrontPage
 ****************************************************
 */
$(".home .main-menu .sub-menu").hide();

$(".home li#menu-item-59>a,.home li#menu-item-61>a").on("click", function(event){
	// $(this).removeClass('status-on').addClass('status-off');
	$(".home .main-menu .sub-menu").show(50);
	return false;
});

/*
 * 3.
 * Agenda - Filtre par année
 *
*/
 
$("#js-agenda-box").on("click", ".status-off", function(event){
	var filterkey = $(this).attr('id'); // e.g. annee-un
	var filterclass = "."+ filterkey;
	$('.js-agenda-filtre').removeClass('status-on').addClass('status-off');
	$(this).removeClass('status-off').addClass('status-on');
	$('.annee-un,.annee-deux,.annee-trois').hide();
	// force next event date visibility ...
	$('.annee-un,.annee-deux,.annee-trois').next().find('.event-date').show();
	$(filterclass).show(50);
	return false;
	
});
   
$("#js-agenda-box").on("click", ".status-on", function(event){
  	$(this).removeClass('status-on').addClass('status-off');
  	$('.annee-un,.annee-deux,.annee-trois').show(50);
  	return false;
});

/*
 * 4.
 * Lazy Load for image galleries
 *********************************
 * http://www.appelsiini.net/projects/lazyload
 *
*/

//$("#img-gallery.closed img:first-child").lazyload({
// });

$("img.lazy-load").lazyload({
     container: $("#gallery-container"),
//     effect : "fadeIn",
     threshold : 200
 });
 
 
 /*
  * 4.0
  * Fix the vimeo player display:
  *
 */
 
$('div.item-soundcloud iframe').attr('src', function() {
   return this.src + '&amp;color=000000&amp;show_artwork=false';
 });
 
 $('div.item-vimeo iframe').attr('src', function() {
    return this.src + '?title=1&byline=0&portrait=0&color=ffffff';
  });
 

/*
 * 4.1
// define CUSTOM width for the gallery preview.
// ******************************************** //
// to be used also when the gallery is closed // 
 *
*/

// Define Basics

var windowWidth = $(window).width(); //retrieve current window width

var old_gallery_width = $("#gallery-container").attr('data-globalwidth');

if ( windowWidth > 1045) {
	if ( windowWidth > 1425 ) {
		var windowWidth = 1425;
	}
	// do stuff...
	var kh_BoxSize = (windowWidth - 1045);
	var kh_BoxSize = Math.round(kh_BoxSize * 0.7236);
	var kh_BoxSize = (kh_BoxSize+250);
	
	// alert('kh_BoxSize: '+kh_BoxSize);
	
	$(".gallery-container,.img-thumbs").css({
			width:kh_BoxSize,
	});
	$(".gallery-container,.img-thumbs").data( 'smallbox', kh_BoxSize );
	
	if ( kh_BoxSize >= old_gallery_width ) {
		$(".gallery-container").css("border-right-width","0px");
	}
	
};

// note=
// we should check if kh_BoxSize is bigger than the global gallery width.
// if not, remove the right border of the box.

//  run on the resize event, like this
$(window).resize(function() {
  //update stuff
});

 
/*
 * 4.2
 * Open the Gallery
 *********************************
 *
*/

// Initial Position:

// NOTE: we can disable this if we remove the left margin of first image.
//$('#img-gallery .gallery-container').scrollLeft(2);


// Launch Gallery

$("#img-gallery").on("click", ".closed", function() {
  // alert("launch gallery");
  
  $("#img-gallery .closed").removeClass('closed').addClass('open');
  
  // some calculation....
  // we want to change the gallery height, adapting to the window height
  var new_window_height = ($(window).height()) - 200;
  // alert(new_window_height); 
	
  
  // must be recalculated on resize...
  // alert(old_gallery_width);
  var new_gallery_width = Math.round(((new_window_height/400) * old_gallery_width)+10);
  // alert(new_gallery_width);
//  $(window).resize(function() {
    //update stuff
//  });
  
  $('#img-gallery').animate({
      // http://api.jquery.com/animate/
      //opacity: 0.25,
      position: 'fixed',
      //left: '5%',
      right: '5%',
      top: '5%', // '52',
      width: '90%',
      // height: 'toggle'
    }, 500, 'swing', function() {
    
      // Animation complete.
      // re-trigger LazyLoad!
//      $("img.lazy-load").lazyload({
//           container: $("#gallery-container")
//       });
       // override stylesheet
      $('#img-gallery.img-gallery').css({'position':'fixed'});
    });
  // redefine some CSS
//  $('#img-gallery .gallery-container').css({'border-right-width':'0px'});
  $('#img-gallery .table-row').css({
  		width:new_gallery_width,
  		'height':'100%'
  	});
  $('.main-content').css("position","static");
  $('.img-thumbs-ul').css({'margin-left':'70px'});
  
  // animate some stuff
  
  $('html, body').animate({scrollTop:0}, '600');
  $('#img-gallery .gallery-container').animate({
  	width: '100%',
  	height: new_window_height,
  }, '600');
  $('#img-gallery .img-thumbs').animate({
  	width: '100%',
  }, '600');
  
  // hide-show
  $('#mask').fadeIn(600);
  $('.close-button').show();
  // $('.page-footer').hide(1000);
//  $("#gallery-container").mCustomScrollbar({
//          horizontalScroll:true,
//        });

	return false;
  
});

// MOVE from One to the Next Image //
// ******************************* //

$("#img-gallery").on("click", ".open .img-large", function() {
  //alert("next image");
  
  // method:
  // check the width of the next element...
  
  var Kh_NextItemWidth = $(this).next().width();
  
  // alert("width:"+Kh_NextItemWidth);
  
  if (Kh_NextItemWidth == null){
  		// Last Img >> go back to zero
  		var Kh_ScrollNext = 2;
  		var Kh_ScrollSpeed = 1200;
  } else {
	  	var Kh_NextItemWidth = (Kh_NextItemWidth+40) ;
	  	var Kh_ScrollNext = '+='+Kh_NextItemWidth ;
	  	var Kh_ScrollSpeed = 600;
  }
  
  // var Kh_NextItemWidth = Math.floor(Kh_NextItemWidth/2);
  // var Kh_CurrentScroll = $('#img-gallery .gallery-container').scrollLeft(); 
  
  //alert("width:"+Kh_NextItemWidth+" and scroll is "+Kh_CurrentScroll);
  
  $('#img-gallery .gallery-container').animate({
		scrollLeft : Kh_ScrollNext,
    }, Kh_ScrollSpeed, 'swing', function() {
    
    });
      // Animation complete.
      
      // Easing:
      // The only easing implementations in the jQuery library are the default, called swing, and one that progresses at a constant pace, called linear. More easing functions are available with the use of plug-ins, most notably the jQuery UI suite.
      // in http://gsgd.co.uk/sandbox/jquery/easing/
      // easeInExpo, easeInQuint, easeInQuad, easeInSine
      // test: http://matthewlein.com/experiments/easing.html

	// return false;
});

// NOTES. how to calculate the width...
// best seems to :

// in PHP
// forget about the table, just use regular images
// calculate width in PHP, calculate global width of gallery.
// including margin

// in JS: re-calculate global width.
// set images to 100% height... it should work :)
// calculate width of each image. 

// CLOSE:
// ******************************** //

$(".close-gallery").click(function() {
	// back to normal
	
	// retrieve SmallBox width:
		var kh_smallbox = $('.gallery-container').data( 'smallbox');
		//alert(kh_smallbox);
		
	$('#img-gallery .gallery-container').animate({
		width: kh_smallbox,
		height: '400',
	});
	$('#img-gallery .img-thumbs').animate({
		width: kh_smallbox,
	}, '600');
	
	
  $('#img-gallery').animate({
	    position: 'absolute',
	    right: '-120',
	    top: '2em',
	    width: '100',
	  }, 600, function() {
	     // override stylesheet
	    $('#img-gallery.img-gallery').css({'position':'absolute'});
	  });
	  
	  $('#img-gallery .gallery-container').scrollLeft(2);
  $("#img-gallery .gallery-container").addClass('closed').removeClass('open');
  $("#img-gallery .img-thumbs-ul").addClass('closed').removeClass('open');
  $('.main-content').css("position","relative");
  $('.img-thumbs-ul').css({'margin-left':'0px'});
//  $('#img-gallery .gallery-container').css({'border-right-width':'2px'});
	
	//alert('OK'); 
  $("#mask").fadeOut(600);
  $('.close-button').hide();
});

// use the ESC key:

$(document).keyup(function(e) {
  if (e.keyCode == 27) { $('.close-gallery').click(); }   // esc
});

/*
 * 4.1
 * Gallery uses mousewheel for horizontal scrool
 * see http://www.eddturtle.co.uk/2012/horizontal-scrolling-with-jquery/
 *
*/

$("#gallery-container").mousewheel(function(event, movement) {
		this.scrollLeft -= (movement * 30);
		event.preventDefault();
}); 

//$('#gallery-container').jScrollPane();  





// TESTING:....... not working yet
// some more fluid movement..
// source: http://tympanus.net/codrops/2010/06/02/smooth-vertical-or-horizontal-page-scrolling-with-jquery/

$('.img-thumbs-ul a').bind('click',function(event){
      var $anchor = $(this);
//      if you want to use one of the easing effects:
//      $('#gallery-container').stop().animate({
      	// ToDO:
      	// look for the target item:
      	// check the width
      	// divide by 2
      	// remove it from the offset.
//          scrollLeft: $($anchor.attr('href')).offset().left
//      }, 1600,'easeInQuart');
//	  event.preventDefault();
 });


/* 
 * that's it !
 ****************************************************
 */
 				
}); // end document ready
		
		
		