/*globals ko*/

function NotificationsViewModel() {
    
    // --- properties
    
    var that = this;
	
    this.template = "notificationsView";
    
    this.messages = [];
    
    this.notifications = ko.observableArray([]);
    
    $("#" + this.template).live("pagebeforeshow", function (e, data) {

            that.activate();
            
    });
    
    this.addNotification = function(message){
        
        that.messages.push({'message':message});
        
        
    }
	
    this.activate = function () {
        
        that.notifications(that.messages);
        return true;
	    
    };
    
   	this.logoutCommand = function(){
		loginViewModel.logoutCommand();
		$.mobile.changePage("#" + loginViewModel.template)
		
	};

   
    
}
