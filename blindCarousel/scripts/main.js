$(document).ready( function() {

    var students_views = [],
    	left_elem = 0,
    	right_elem = 2,
        animation_length = 750;

    $.getJSON("./data/testimonials.json", function(data) {
        var students = data["students"];

        var compiled = _.template(
            $("#slide_item").html()
        );

        // load the compiled templates into arrays
        _.each(students, function(student, index) {
            var view = compiled({student: student});    
            students_views.push(view);
        });

        $(".carousel").html(students_views[0]);
        $(".exp1:first-child").after(students_views[1])
        $(".exp1:nth-child(2)").after(students_views[2])

        $(".carousel").blindCarousel({
            animation_length: 1000,
            complete: function() { alert( 'Done!' ) }
        });
    });

    var end_animation = function() {
        $(".carousel").finish();
        $(".exp1").finish();
    };

    $(".nav_left").click(function(){  
        end_animation();  

    	$(".carousel").addClass("float_right");
        $(".carousel").animate({ height: $(".exp1:first-child").height() }, animation_length, function() {});

        var new_left = (left_elem == 0 ? students_views.length : left_elem);
        var new_left = (new_left - 1) % students_views.length;    
        left_elem = new_left;
        right_elem = (new_left + 2) % students_views.length;

        $(".exp1:last-child").html("").animate({ width: '0px' }, animation_length, function() {
            $(this).remove();
            $(".exp1:first-child").before(students_views[new_left]);
            $(".carousel").removeClass("float_right");
        });
    });

    $(".nav_right").click(function(){
        end_animation();

    	$(".carousel").animate({ height: $(".exp1:last-child").height() }, animation_length, function() {});

        var new_right = (right_elem + 1) % students_views.length;
        right_elem = (right_elem + 1) % students_views.length;
        left_elem = (left_elem + 1) % students_views.length;

    	$(".exp1:first-child").html("").animate({ width: '0px' }, animation_length, function() {
            $(this).remove();
            $(".exp1:last-child").after(students_views[new_right]);
        });
    });

    $(window).on("resize", function() {
        $(".carousel").animate({ height: $(".exp1:nth-child(2)").height() }, 10, function() {});
    });

});
