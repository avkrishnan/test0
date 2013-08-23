/*globals ko*/

function UserSettingsViewModel() {
	/// <summary>
	/// A view model that displays the communication means and urgency that user wants to recieve communications
	/// </summary>
	
	// --- properties
	
    this.template = "userSettingsView";
    this.viewid = "V-08";
    this.viewname = "UserSettings";
    
    var  dataService = new EvernymCommethodService();
	
  
	this.channels = ko.observableArray([]);
    this.commethods = ko.observableArray([]);
    this.baseUrl = ko.observable();
    this.accountName = ko.observable();
    this.name = ko.observable();
    
    
	var that = this;
    
  
	this.applyBindings = function(){
        $("#" + that.template).live("pagebeforeshow", function (e, data) {
                                    
                                    var currentBaseUrl = localStorage.getItem("baseUrl");
                                    
                                    if (currentBaseUrl){
                                    that.baseUrl(currentBaseUrl);
                                    }
                                    else {
                                    var es = new EvernymService();
                                    that.baseUrl(es.getBaseUrl());
                                    }
                                    
                                    
                                    that.activate();
                                    
                                    
                                    });
    };
    
    
	
    
    
    this.activate = function() {
        
        
        var _accountName = localStorage.getItem("accountName");
        var _name = localStorage.getItem("UserFullName");
        
        that.accountName(_accountName);
		that.name(_name);
        
        
		that.getCommethods().then(gotCommethods);

		$.mobile.showPageLoadingMsg("a", "Loading Settings");
		return true;
            
	};
    
    function gotCommethods(data){
        //alert(JSON.stringify(data));
        that.commethods(data.commethod);
        $(window).resize();
    }
    
	this.logoutCommand = function(){
		loginViewModel.logoutCommand();
		$.mobile.changePage("#" + loginViewModel.template)
		
	}
	
    
    this.changeBaseUrl = function(){
        
        showMessage('stored base url: ' + that.baseUrl());
        localStorage.setItem("baseUrl", that.baseUrl())
        
    };
	
    function commethodError(data, status, details){
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		
		showError("Error Getting Communication Methods: " + details.message);
		//logger.logError('error listing channels', null, 'channel', true);

        
    }
    
    function requestVerificationError(data, status, details){
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		
		showError("Error Requesting Verification: " + details.message);
		
        
        
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
        
    };
    
    
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
		showError("Error listing channels: " + details.message);
		loginPageIfBadLogin(details.code);
		//logger.logError('error listing channels', null, 'dataservice', true);
	};
	
	
	
	
	
	
	
}
