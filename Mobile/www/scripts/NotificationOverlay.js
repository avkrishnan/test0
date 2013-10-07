

var CODEMAP = {
    100000: "userSettingsView"
};



var NotificationOverlay  = function(){
    var notifications = [];
    var that = this;


    this.close = function(){
        $("#notification-overlay").remove();
    }

    this.addNotification = function(notification){
        that.notifications.push(notification);
    }

    this.removeNotifications = function(){
        that.notifications = [];

    };

    this.displayNotifications = function(){
        console.log("trying to get notifications" + JSON.stringify(that.notifications));
        if (that.notifications){
            for (var n = 0; n < that.notifications.length; n++){
            
                $("#notification-overlay").prepend("<div style=\"border:1px solid gray; border-radius:5px;margin:0px 0px 5px;background:white;cursor:pointer;\" onclick=\"goToView('"  +  CODEMAP[that.notifications[n].code] + "');OVERLAY.close();\">" + that.notifications[n].message +"</div>"); 
            }
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
    
    // test data
    //that.notifications = [{"code":100000,"message":"pending communication method verification","details":"ec7fe031-c940-445b-9da5-20ce7cb86f2b"},{"code":100000,"message":"pending communication method verification","details":"a9c143b5-d545-4ddb-9a0e-1f1c84343fcb"},{"code":100000,"message":"pending communication method verification","details":"02820f52-5795-4640-a66a-3f6be09b9a9e"}];
   
	var existingdiv = $("#notification-overlay").get(0);

	if (!existingdiv){
	    $("<div id='notification-overlay' class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h3>"+
	      "<br/><button onclick='OVERLAY.close();' style='font-size:16pt;'>ok</button></h3></div>")
	    .css({ display: "block",
		 opacity: 0.95,
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

