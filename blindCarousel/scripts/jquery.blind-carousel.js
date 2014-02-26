(function($) {

    // private variables 
    var carousel_views = [], 
        left_elem = 0,
        right_elem = 2,
        howfar = 1,
        that;

    $.fn.blindCarousel = function( options ) {
        that = this;

        // default settings
        var defaults = {
            animation_length: 750,
            complete: null, 
            slidingClass: "exp1",
            auto_scroll: false,
            auto_scrollTime: 5000,
            easing: "linear",
            complete: null
        }

        var settings = $.extend({}, defaults, options);


        // add listeners to navigation buttons
        $(".nav_right").on("click", navigateRight);
        $(".nav_left").on("click", navigateLeft);



        // a function to finish animations; clean up for next round
        function end_animation() {
            $(that).finish();
            $(settings.slidingClass).finish();
        };

        function speed_Lanimation(obj, new_right) {
            obj.stop().animate({
                width: "0px",
            }, {
                    duration: 100,
                    easing: settings.easing,
                    step: function(now, fx){
                        howfar = fx.pos;  
                    },
                    complete: function() {
                        $(this).remove();
                        $("."+settings.slidingClass+":last-child").after(carousel_views[new_right]);
                        navigateRight();
                    }
                }
            
            );
        };

        function speed_Ranimation(obj, new_left) {
            obj.stop().animate(
                { 
                    width: '0px' 
                }, {
                    duration: 100,
                    easing: settings.easing,
                    step: function(now, fx){
                        howfar = fx.pos;  
                    },
                    complete: function() {
                        $(this).remove();
                        $("."+settings.slidingClass+":first-child").before(carousel_views[new_left]);
                        $(that).css({"text-align":"left"});
                        navigateLeft();
                    }
                }
            );

        };

        function navigateRight() {
            end_animation();
            var timeRemaining = settings.animation_length - (howfar * settings.animation_length);
            var new_right = (right_elem + 1) % carousel_views.length;

            /*
            if (timeRemaining > 0) {
                speed_Ranimation($("."+settings.slidingClass+":first-child").html(""), new_right);
            }*/

            $(that).animate({ height: $("."+settings.slidingClass+":last-child").height() }, settings.animation_length, function() {});

            right_elem = (right_elem + 1) % carousel_views.length;
            left_elem = (left_elem + 1) % carousel_views.length;

            $("."+settings.slidingClass+":first-child").html("").animate(
                { 
                    width: '0px' 
                }, {
                    duration: settings.animation_length,
                    easing: settings.easing,
                    step: function(now, fx){
                        howfar = fx.pos;  // between 0 and 1, tells how far along %
                    },
                    complete: function() {
                        $(this).remove();
                        $("."+settings.slidingClass+":last-child").after(carousel_views[new_right]);
                    }
                }
            );
        };

        function navigateLeft() {
            end_animation();
            var timeRemaining = settings.animation_length - (howfar * settings.animation_length); 
            var new_left = (left_elem == 0 ? carousel_views.length : left_elem);
            var new_left = (new_left - 1) % carousel_views.length;
           
           /* if (timeRemaining > 0) {
                speed_Lanimation($("."+settings.slidingClass+":last-child").html(""), new_left);
            }*/

            $(that).css({"text-align":"right"});
            $(that).animate({ height: $("."+settings.slidingClass+":first-child").height() }, settings.animation_length, function() {});

            left_elem = new_left;
            right_elem = (new_left + 2) % carousel_views.length;

            $("."+settings.slidingClass+":last-child").html("").animate(
                { 
                    width: '0px' 
                }, {
                    duration: settings.animation_length,
                    easing: settings.easing,
                    step: function(now, fx){
                        howfar = fx.pos;  // between 0 and 1, tells how far along %
                    },
                    complete: function() {
                        $(this).remove();
                        $("."+settings.slidingClass+":first-child").before(carousel_views[new_left]);
                        $(that).css({"text-align":"left"});
                    }
                }
            );
        };

        return this.each( function() {
            $(this).children("."+settings.slidingClass).each(function() {
                carousel_views.push($(this)[0].outerHTML);
            })

            $(this).html(carousel_views[0]);
            $("."+settings.slidingClass+":first-child").after(carousel_views[1])
            $("."+settings.slidingClass+":nth-child(2)").after(carousel_views[2])

            if ( $.isFunction( settings.complete ) ) {
                settings.complete.call( this );
            }
        });

    }

}(jQuery));
