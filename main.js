$(document).ready(function() {
    //get current location
    var hash = window.location.hash;
    console.log(hash);
    if (hash) {
    	var activeLink = $('a[href='+hash+']');
    	$("#navbarCollapse > ul > li").removeClass("active");
    	$(activeLink).parent().addClass("active");
    	console.log(activeLink);
    }

    function goToByScroll(id){
    	id = id.replace("link", "");
      	// Scroll
	    $('html, body').animate({scrollTop: $(id).offset().top - 50},'slow');
	}

	$("#navbarCollapse > ul > li > a").click(function(e) { 
    	e.preventDefault(); 
    	$("#navbarCollapse > ul > li").removeClass("active");
    	$(this).parent().addClass("active");

    	var id = $(this).attr('href');
    	
    	goToByScroll(id);   
    	history.pushState({}, '', $(this).attr("href"));   

    	if ($(window).width() < 767) {
            $("#navbar-collapse-button").trigger("click");
        }
	});

});