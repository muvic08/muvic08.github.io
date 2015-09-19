$(document).ready(function() {

    function goToByScroll(id){
        id = id.replace("link", "");
        $('html, body').animate({scrollTop: $(id).offset().top - 50},'slow');
    }

    //get current page section
    var hash = window.location.hash;

    if (hash) {
    	var activeLink = $('a[href='+hash+']');
    	$("#navbarCollapse > ul > li").removeClass("active");
    	$(activeLink).parent().addClass("active");

        goToByScroll(hash); 
    }

    window.IsAutoScrolling = false;

	$("#navbarCollapse > ul > li > a").click(function(e) { 
    	e.preventDefault(); 
        window.IsAutoScrolling = true;

    	$("#navbarCollapse > ul > li").removeClass("active");
    	$(this).parent().addClass("active");

    	var id = $(this).attr('href');
    	goToByScroll(id);   

        // update route
    	history.pushState({}, '', $(this).attr("href"));   

    	if ($(window).width() < 767) {
            $("#navbar-collapse-button").trigger("click");
        }

        setTimeout(function() { window.IsAutoScrolling = false; }, 750);
	});


    // Cache selectors
    var topMenu = $("#navbarCollapse ul"),
        topMenuHeight = topMenu.outerHeight()+15,
        // All list items
        menuItems = topMenu.find("a"),
        // Anchors corresponding to menu items
        scrollItems = menuItems.map(function(){
          var item = $($(this).attr("href"));
          if (item.length) { return item; }
        });

    
    var updateHistory = function(hash) {
        if (window.location.hash != hash) {
            history.pushState({}, '', hash); 
        }
    }
    // update on scroll
    $(window).scroll(function(){
        // Get container scroll position
        var fromTop = $(this).scrollTop()+topMenuHeight;

        // Get id of current scroll item
        var cur = scrollItems.map(function(){
            if ($(this).offset().top < fromTop)
                return this;
        });
        // Get the id of the current element
        cur = cur[cur.length-1];
        var id = cur && cur.length ? cur[0].id : "";

        console.log(window.IsAutoScrolling);
        if(!window.IsAutoScrolling){ 
            var id_hash = "#" + id;
            setTimeout(updateHistory(id_hash), 300);
        }
        // Set/remove active class
        menuItems
            .parent().removeClass("active")
            .end().filter("[href=#"+id+"]").parent().addClass("active");

    });

});