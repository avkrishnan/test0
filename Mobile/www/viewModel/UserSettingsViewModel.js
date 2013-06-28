/*globals ko*/

function UserSettingsViewModel() {
	/// <summary>
	/// A view model that displays the communication means and urgency that user wants to recieve communications
	/// </summary>
	
	// --- properties
	
    this.template = "userSettingsView";
    
    var  dataService = new EvernymCommethodService();
	
  
	this.channels = ko.observableArray([]);
    this.commethods = ko.observableArray([]);
    
	var that = this;
	
	
	$("#" + this.template).live("pagebeforeshow", function (e, data) {

	    
	        that.activate();
                                
	    
	});
    
    
		this.activate = function() {
		
		that.getCommethods().then(gotCommethods);

		$.mobile.showPageLoadingMsg("a", "Loading Settings");
		return true;
            
	};
    
    function gotCommethods(data){
        that.commethods(data);
    }
    
	this.logoutCommand = function(){
		loginViewModel.logoutCommand();
		$.mobile.changePage("#" + loginViewModel.template)
		
	}
	
	
    function commethodError(data, status, details){
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		
		showMessage("Error Getting Communication Methods: " + details.message);
		//logger.logError('error listing channels', null, 'channel', true);

        
    }
    
    function requestVerificationError(data, status, details){
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		
		showMessage("Error Requesting Verification: " + details.message);
		
        
        
    }
    
    
    function requestVerificationSuccess(data){
		
        $("#chicken").html("Verification Email Sent");
        
        
    }

    
    this.verifyCommand = function(commethod){
        
        //showMessage(JSON.stringify(commethod));
        
        $.mobile.showPageLoadingMsg("a", "Requesting Verification");
        
        var callbacks = {
        //success: requestVerificationSuccess,
        
        success: function (){
            $("#commethod-" + commethod.id).html("Verification Email Sent");
        },
        error: requestVerificationError
        };
        
        return dataService.requestVerification( commethod.id, callbacks);
        
    }
    
    
    this.getCommethods = function(){
    
        $.mobile.showPageLoadingMsg("a", "Getting Communication Methods");
        
        var callbacks = {
        success: function(){;},
        error: commethodError
        };
        
        
        return dataService.getCommethods( callbacks);

        
    };
	
	
	function errorListChannels(data, status, details){
		$.mobile.hidePageLoadingMsg();
		showMessage("Error listing channels: " + details.message);
		loginPageIfBadLogin(details.code);
		//logger.logError('error listing channels', null, 'dataservice', true);
	};
	
	
	
	
	
	
	
}
