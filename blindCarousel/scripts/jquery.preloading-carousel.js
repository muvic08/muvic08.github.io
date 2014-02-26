(function($) {

    /*** detect device *** ref: http://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-handheld-device-in-jquery ***/
    var isMobile = (/iPhone|iPod|iPad|Android|BlackBerry/).test(navigator.userAgent);

    if (isMobile) {

        $.getScript("./scripts/vendor/jquery.touchSwipe.min.js")
            .done(function(script, textStatus) {
                console.log( textStatus );
            })
            .fail(function( jqxhr, settings, exception ) {
                console.log("Triggered ajaxError handler.");
            });
    };


    var carousel_views = [], 
        left_elem = 0,
        right_elem = 2,
        howfar = 1,
        index2insert,
        animatingElem,
        animateDir,
        runningInterval,
        container;


    $.fn.blindCarousel = function( options ) {

        container = this;
        
        var defaults = { 								
            animation_length: 750,
            navRight: ".nav_right",
            navLeft: ".nav_left",
            navPlay: ".nav_play",
            slidingClass: "exp1",
            autoScroll: false,
            autoScrollTime: 5000,
            easing: "linear",
            complete: null
        }

        var settings = $.extend({}, defaults, options);
        												
        $(settings.navRight).on("click", function(){ 
            clearInterval(runningInterval);
            settings.autoScroll = false;
            navigate("Right"); 
        }); 

        $(settings.navLeft).on("click", function(){
            clearInterval(runningInterval); 
            settings.autoScroll = false;
            navigate("Left"); 
        });

        $(settings.navPlay).on("click", function(){
            settings.autoScroll = settings.autoScroll == false ? true : false;
            autoPlay(false);
        });

        if(isMobile) {

            $(container).swipe( {
                swipeLeft: function(event, direction, distance, duration, fingerCount) {
                    $(settings.navRight).trigger("click");
                },

                swipeRight: function(event, direction, distance, duration, fingerCount) {
                    $(settings.navLeft).trigger("click");
                },

                threshold:0
            });

        };

        $(window).keydown(function(e) {
            var key = e.which;
            if(key == 39) $(settings.navRight).trigger("click");
            if(key == 37) $(settings.navLeft).trigger("click");
        });


        function navigate(nav) {            
			var timeLeft = settings.animation_length - (howfar * settings.animation_length);    
			
			if (timeLeft > 0) {
				$(container).stop();
				$(animatingElem).stop();
				runAnimation($(animatingElem), index2insert, 100, animateDir, normalNav);
            } else {
            	normalNav();
            };
	        
	        function normalNav() {
		        switch (nav) {
	    			case "Right":
	    				navigateRight(settings.animation_length);
	    				break;
	    			case "Left":
	    				navigateLeft(settings.animation_length);
	                    break;
	    		};
	    	};

        };


        function navigateRight(time) {
        	var new_right = (right_elem + 1) % carousel_views.length;
        	right_elem = (right_elem + 1) % carousel_views.length;
            left_elem = (left_elem + 1) % carousel_views.length;

            var slide2animate = $("."+settings.slidingClass+":first-child");
            index2insert = new_right;

            runAnimation(slide2animate, index2insert, time, "right", "None");
        };


        function navigateLeft(time) {
        	$(container).css({"text-align":"right"});

        	var new_left = (left_elem == 0 ? carousel_views.length : left_elem);
            var new_left = (new_left - 1) % carousel_views.length;
            left_elem = new_left;
            right_elem = (new_left + 2) % carousel_views.length;

            var slide2animate =  $("."+settings.slidingClass+":last-child");
            index2insert = new_left;

            runAnimation(slide2animate, index2insert, time, "left", "None");
        };


        function runAnimation(slide, index, time, nav, callback){
        	if(nav == "left")
        		$(container).animate({ height: $("."+settings.slidingClass+":first-child").height() }, time, function() {});
        	else
        		$(container).animate({ height: $("."+settings.slidingClass+":last-child").height() }, time, function() {});


        	var animationEnded = function(elem) {
        		$(elem).remove();

        		switch (nav) {
        			case "right":
        				$("."+settings.slidingClass+":last-child").after(carousel_views[index]);
        				break;
        			case "left":
        				$("."+settings.slidingClass+":first-child").before(carousel_views[index]);
                        $(container).css({"text-align":"left"});
                        break;
        		}
        	};

        	$(slide).html("").animate(
	        	{	
	        		width: "0px"
	        	}, {
	        		duration: time,
	        		easing: settings.easing,
	        		step: function(now, fx) {
	        			howfar = fx.pos;
	        			animatingElem = fx.elem;
	        			animateDir = nav;
	        		},
	        		complete: function() {
	        			animationEnded($(this));
	        			if (callback != "None") {
	        				callback();
	        			}
	        		}
	        	}
        	);
        };


        function autoPlay(delay) {
            if (!delay && settings.autoScroll) 
                navigate("Right");

            if (settings.autoScroll) {
                runningInterval = setInterval(function(){
                    navigate("Right");
                }, settings.autoScrollTime);
            } else {
                clearInterval(runningInterval);
            }
        };


        return this.each(function() {
        	$(this).children("."+settings.slidingClass).each(function() {
                carousel_views.push($(this)[0].outerHTML);
            })

        	left_elem = carousel_views.length - 1;
        	right_elem = (left_elem + 2) % carousel_views.length;
        	center_elem = (left_elem + 1) % carousel_views.length;

            $(this).html(carousel_views[left_elem]);
            $("."+settings.slidingClass+":first-child").after(carousel_views[center_elem])
            $("."+settings.slidingClass+":nth-child(2)").after(carousel_views[right_elem])

            if ( $.isFunction( settings.complete ) ) {
                settings.complete.call( this );
                autoPlay(true);
            }
        });

    };

}(jQuery));