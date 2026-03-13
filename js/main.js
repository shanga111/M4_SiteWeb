jQuery(document).ready(function($) {

	'use strict';

        // on click event on all anchors with a class of scrollTo
        $('a.scrollTo').on('click', function(){

          // data-scrollTo = section scrolling to name
          var scrollTo = $(this).attr('data-scrollTo');
          var $target = $('#' + scrollTo);

          // Set a flag in sessionStorage to indicate the user clicked a scroll link.
          // This ensures that the auto-scroll on index.html ONLY happens after a manual click.
          sessionStorage.setItem('shouldScrollTo', scrollTo);

          // If the target exists on the page, animate scroll. Otherwise, let default link behavior happen.
          if ($target.length > 0) {
            // toggle active class on and off. added 1/24/17
            $( "a.scrollTo" ).each(function() {
              if(scrollTo == $(this).attr('data-scrollTo')){
                $(this).addClass('active');
              }else{
                $(this).removeClass('active');
              }
            });


            // animate and scroll to the sectin
            $('body, html').animate({

              // the magic - scroll to section
              "scrollTop": $target.offset().top
            }, 1000, function() {
              // Clear flag after internal scroll
              sessionStorage.removeItem('shouldScrollTo');
            });
            return false;
          }
        })


        $(".menu-icon").click(function() {
          $(this).toggleClass("active");
          $(".overlay-menu").toggleClass("open");
        });

});
