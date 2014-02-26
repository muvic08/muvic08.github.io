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

        $(".carousel").html(students_views);

        $(".carousel").blindCarousel({
            animation_length: 750,
            navLeft: ".nav_left1",
            navRight: ".nav_right1",
            autoScroll: true,
            autoScrollTime: 5000,
            easing: "swing",
            complete: function() { console.log( 'carousel ready & running!' ) }
        });
    });

});