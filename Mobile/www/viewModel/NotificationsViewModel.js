/*globals ko*/

function NotificationsViewModel() {
    
    // --- properties
    
    var that = this;
	
    this.template = "notificationsView";
    this.viewid = "V-07";
    this.viewname = "NotificationOverlay";
    
    this.messages = [];
       
    this.notifications = ko.observableArray([]);
    
 
    
    $("#" + this.template).live("pagebeforeshow", function (e, data) {

            that.activate();
            
    });
    
    this.addNotification = function(message){
        
        
        that.messages.push({'message':message});
        that.notifications(that.messages);
        
    }
    
    this.removeNotifications = function(){
        that.messages = [];
        that.notifications([]);
        
    
    };
	
    this.activate = function () {
        
        that.notifications(that.messages);
        
        
    };
    
   	this.logoutCommand = function(){
		loginViewModel.logoutCommand();
		$.mobile.changePage("#" + loginViewModel.template)
		
	};

   
    
}
