/*globals ko*/

function UserSettingsViewModel() {
	/// <summary>
	/// A view model that displays the communication means and urgency that user wants to recieve communications
	/// </summary>
	
	// --- properties
	
    this.template = "userSettingsView";
	
  
	this.channels = ko.observableArray([]);
	var that = this;
	this.shown = false;
	
	
	$("#" + this.template).live("pagebeforeshow", function (e, data) {

	    if (!that.shown) {
	        that.activate();
	    }
	});
	
	
	var  dataService = new EvernymChannelService();
	
    // 
	this.activate = function() {
		
		console.log("trying to settings");
		
	

		$.mobile.showPageLoadingMsg("a", "Loading Settings");
		return true;
	};
    
    
	this.logoutCommand = function(){
		loginViewModel.logoutCommand();
		$.mobile.changePage("#" + loginViewModel.template)
		
	}
	
	
	
	function successfulCreate(data){
		
		//logger.log('success listing channels ' , null, 'dataservice', true);	
	};
	
	
	function errorListChannels(data, status, details){
		$.mobile.hidePageLoadingMsg();
		showMessage("Error listing channels: " + details.message);
		loginPageIfBadLogin(details.code);
		//logger.logError('error listing channels', null, 'dataservice', true);
	};
	
	
	
	
	
	
	
}
