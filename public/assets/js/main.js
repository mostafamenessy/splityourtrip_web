/**
    *   
    * tabs
    * box_search
    * btn_filter
    * video
    * counter
    * flatAccordion
    * curvedtext
    * icon_function
    * btnQuantity
    * progresslevel
    * headerFixed
    * retinaLogos
    * dashboard
    * gotop
    * sticky
    * email
    * preloader
    * 
*/

; (function ($) {

  "use strict";

  var tabs = function(){
    $('.widget-tabs').each(function(){
        $(this).find('.widget-content-tab').children().hide();
        $(this).find('.widget-content-tab').children(".active").show();
        $(this).find('.widget-menu-tab').children('.item-title').on('click',function(){
            var liActive = $(this).index();
            var contentActive=$(this).siblings().removeClass('active').parents('.widget-tabs').find('.widget-content-tab').children().eq(liActive);
            contentActive.addClass('active').fadeIn("slow");
            contentActive.siblings().removeClass('active');
            $(this).addClass('active').parents('.widget-tabs').find('.widget-content-tab').children().eq(liActive).siblings().hide();
        });
    });
    $('.widget-tabs-1').each(function(){
      $(this).find('.widget-content-tab-1').children().hide();
      $(this).find('.widget-content-tab-1').children(".active-1").show();
      $(this).find('.widget-menu-tab-1').children('.item-title-1').on('click',function(){
          var liActive = $(this).index();
          var contentActive=$(this).siblings().removeClass('active-1').parents('.widget-tabs-1').find('.widget-content-tab-1').children().eq(liActive);
          contentActive.addClass('active-1').fadeIn("slow");
          contentActive.siblings().removeClass('active-1');
          $(this).addClass('active-1').parents('.widget-tabs-1').find('.widget-content-tab-1').children().eq(liActive).siblings().hide();
      });
  });
  };


  var btn_filter=function(){
        
    $('.btn-filter').on('click',function(){
      var box =  $(this).closest('.wg-filter').find('.open-filter');
      var btn =  $(this).closest('.wg-filter').find('.btn-filter');
      if(!box.hasClass("active")){
        box.addClass('active');
      }
      else box.removeClass('active');
      if(!btn.hasClass("active"))
        btn.addClass('active');
      else
        btn.removeClass('active'); 
    })

    $(document).on(
      "click",
      function (a) {
        if ( $(a.target).closest(".wg-filter").length === 0 ) {
          $('.wg-filter').find('.open-filter').removeClass("active");
          $('.wg-filter').find('.btn-filter').removeClass("active");
        }
      }
    );

  }

  var video = function(){
    if ($('div').hasClass('video-wrap')) {
      $('.popup-youtube').magnificPopup({
        type: 'iframe'
      });
    }
  };

  var counter = function () {
    if ($(document.body).hasClass("counter-scroll")) {
      var a = 0;
      $(window).scroll(function () {
        var oTop = $(".counter").offset().top - window.innerHeight;
        if (a == 0 && $(window).scrollTop() > oTop) {
          if ($().countTo) {
            $(".counter")
              .find(".number")
              .each(function () {
                var to = $(this).data("to"),
                  speed = $(this).data("speed");
                $(this).countTo({
                  to: to,
                  speed: speed,
                });
              });
          }
          a = 1;
        }
      });
    }
  };

  var flatAccordion = function (class1,class2) {
    var args = { duration: 400 };

    $(class2 + ' .toggle-title.active').siblings('.toggle-content').show();
    $(class1 +' .toggle-title').on('click', function () {
        $(class1 + ' ' + class2).removeClass('active');
        $(this).closest(class2).toggleClass('active');

        if( !$(this).is('.active') ) {
            $(this).closest(class1).find('.toggle-title.active').toggleClass('active').next().slideToggle(args);
            $(this).toggleClass('active');
            $(this).next().slideToggle(args);
        } else {
            $(class1 + ' ' + class2).removeClass('active');
            $(this).toggleClass('active');
            $(this).next().slideToggle(args);
        }     
    });
  };

  var curvedtext = function () {
    if ($('div').hasClass('curved-text')) {
      var demo = new CircleType(document.getElementById('curved-text')).radius(0);
    }
  }

  var icon_function = function () {
    $(".delete-btns").on("click", function (e) {
      $(this).parents(".item").remove();
    })
  }

  var btnQuantity = function () {
    $(".minus-btn").on("click", function (e) {
      e.preventDefault();
      var $this = $(this);
      var $input = $this.closest("div").find("input");
      var value = parseInt($input.val());

      if (value > 1) {
        value = value - 1;
      }

      $input.val(value);
    });

    $(".plus-btn").on("click", function (e) {
      e.preventDefault();
      var $this = $(this);
      var $input = $this.closest("div").find("input");
      var value = parseInt($input.val());

      if (value > 0) {
        value = value + 1;
      }

      $input.val(value);
    });
  };

  var progresslevel = function () {
    if ($('div').hasClass('progress-bars')) {
    var bars = document.querySelectorAll('.progress-bars-line > div');
    setInterval(function(){
    bars.forEach(function(bar){
      var t1 = parseFloat(bar.dataset.progress);
      var t2 = parseFloat(bar.dataset.max);
      var getWidth = ( t1 / t2) * 100;
      bar.style.width = getWidth + '%';
    });
    }, 500);
  }}

  var headerFixed = function () {
    if ($("header").hasClass("header-fixed")) {

      window.App = {};
      App.SMcontroller = new ScrollMagic.Controller();
      let scrollPos = 0;
      new ScrollMagic.Scene()
        .on('update', (e) => {
          if (e.scrollPos > scrollPos) {
            document.querySelector('.header').classList.remove('is-small');
          } else {
            document.querySelector('.header').classList.add('is-small');
          }
          scrollPos = e.scrollPos;
        })
      .addTo(App.SMcontroller);

      var nav = $("#header_main"),
          offsetTop = nav.offset().top,
          headerHeight = nav.height();

      const header = document.querySelector('.header');
      new ScrollMagic.Scene({ offset: offsetTop + headerHeight, })
      .setClassToggle(header, 'is-fixed')
      .addTo(App.SMcontroller);
      
      if (nav.length) {
        var injectSpace = $("<div>", {
          height: headerHeight,
        });
        injectSpace.hide();

        if ($("header").hasClass("style-absolute")) {
          injectSpace.hide();
        } else {
          injectSpace.insertAfter(nav);
        }

        if (!$("header").hasClass("style-fixed")) {
          $(window).on("load scroll", function () {
            if ($(window).scrollTop() > offsetTop + headerHeight) {
              injectSpace.show();
            } else {
              nav.removeClass("is-fixed");
              injectSpace.hide();
            }
          });
        }

      }

    }
  };

  var dashboard = function() {
    if ($('body').hasClass('dashboard')) {
        $('.btn-canvas').on('click', function () {
            $(this).toggleClass('active');
            $(this).closest('#page').find('.section-content-right').toggleClass('full');
            $(this).closest('#page').find('.section-menu-left').toggleClass('null');
        });
    }
  }

  var gotop = function() {
    if ($('div').hasClass('progress-wrap')) {
      var progressPath = document.querySelector('.progress-wrap path');
      var pathLength = progressPath.getTotalLength();
      progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
      progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
      progressPath.style.strokeDashoffset = pathLength;
      progressPath.getBoundingClientRect();
      progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
      var updateprogress = function() {
        var scroll = $(window).scrollTop();
        var height = $(document).height() - $(window).height();
        var progress = pathLength - (scroll * pathLength / height);
        progressPath.style.strokeDashoffset = progress;
      }
      updateprogress();
      $(window).scroll(updateprogress);
      var offset = 150;
      var duration = 300;
      jQuery(window).on('scroll', function() {
        if (jQuery(this).scrollTop() > offset) {
          jQuery('.progress-wrap').addClass('active-progress');
        } else {
          jQuery('.progress-wrap').removeClass('active-progress');
        }
      });
      jQuery('.progress-wrap').on('click', function(event) {
        event.preventDefault();
        jQuery('html, body').animate({ scrollTop: 0 }, duration);
        return false;
      })
  }}

  var sticky = function () {
    if ($('div').hasClass('sticky-container')) {
      var sticky = new Sticky('.po-sticky');
    }
  }

  var email = function () {
    if ($('fieldset').hasClass('email')) {
     
      var input =  $('form').find('input[type=email]');
      input.on('input', function() {
        if ($(this).val().trim() !== '') {
          $(this).addClass('has-value');
        } else {
          $(this).removeClass('has-value');
        }
      });

    }
  }

  var preloader = function () {
    // setTimeout(function () {
    //   $(".preload-container").fadeOut("slow", function () {
    //       $(this).remove();
    //   });
    // }, 1500);
  };

  // Dom Ready
  $(function () {
   
    tabs();
    btn_filter();
    video();
    counter();
    flatAccordion('.flat-accordion','.flat-toggle');
    curvedtext();
    icon_function();
    btnQuantity();
    progresslevel();
    headerFixed();
    dashboard();
    gotop();
    sticky();
    email();
    preloader();
    
  });

})(jQuery);
