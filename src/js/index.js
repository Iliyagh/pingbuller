$(function() {
	$('.sl').slick({ 
	slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    dots:true,
	responsive: [
      {
        breakpoint: 768,
        settings: {
		slidesToShow: 1,
		slidesToScroll: 1,
        }
      }
    ]
  });
});	
$(function() {
	$('.sl_reviews').slick({ 
	slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots:true,
	responsive: [
      {
        breakpoint: 768,
        settings: {
		slidesToShow: 1,
        slidesToScroll: 1,
        }
      }
    ]
  });
});	

$(document).ready(() => {
	if (window.innerWidth < 610) {
		$('.active_item').on('click', () => {
		$('li+li.drop_items').slideToggle();
		$('.active_item').toggleClass('style_item');

		});
	}
});
