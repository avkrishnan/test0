
var NotificationOverlay  = function(){
    var notifications = [];
    var that = this;


    this.close = function(){
        $("#notification-overlay").fadeOut( 400, function(){
                              $(this).remove();
                              });
    }

    this.addNotification = function(notification){
        that.notifications.push(notification);
    }

    this.removeNotifications = function(){
        that.notifications = [];

    };

    this.displayNotifications = function(){
        console.log("trying to get shit" + JSON.stringify(that.notifications));
        for (var n = 0; n < that.notifications.length; n++){
            
            $("#notification-overlay").prepend("<div>" + that.notifications[n].message +"</div>"); 
        }

    };

    this.setPosition = function(){
        $("#notification-overlay").css({
		 width: $.mobile.activePage.width() - 30,
                 height: $(window).height() - 30,
		 left: $.mobile.activePage.offset().left + 10,
		 top: 10 });
    
    };

    this.show = function(){
   
	var existingdiv = $("#notification-overlay").get(0);

	if (!existingdiv){
	    $("<div id='notification-overlay' class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3>"+
	      "<br/><button onclick='OVERLAY.close();' style='font-size:16pt;'>ok</button></h3></div>")
	    .css({ display: "block",
		 opacity: 0.90,
		 position: "fixed",
		 padding: "7px",
		 "text-align": "center",
		 width: $.mobile.activePage.width() - 30,
                 height: $(window).height() - 30,
		 left: $.mobile.activePage.offset().left + 10,
		 top: 10 })
	    .appendTo( $.mobile.pageContainer ).delay( 1500 )
	    ;
	}

        that.displayNotifications();

    };

};

var OVERLAY = new NotificationOverlay();


$( window ).resize(function() {
  OVERLAY.setPosition();
});

