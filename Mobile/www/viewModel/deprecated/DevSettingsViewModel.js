/*globals ko*/

function DevSettingsViewModel() {
	/// <summary>
	/// A view model that displays the communication means and urgency that user wants to recieve communications
	/// </summary>
	
	// --- properties
	
    this.template = "devSettingsView";
    this.viewid = "V-00";
    this.viewname = "DevSettings";
    this.displayname = "Dev Settings";
    
    this.hasfooter = false;
    this.baseUrl = ko.observable();
    
    
	var that = this;
	
    
    this.applyBindings = function(){
        
        
        $("#" + that.template).on("pagebeforeshow", null, function (e, data) {
                                    
                                    var currentBaseUrl = appCtx.getItem("baseUrl");
                                    
                                    if (currentBaseUrl){
                                        that.baseUrl(currentBaseUrl);
                                    }
                                    else {
                                    
                                        that.baseUrl(ES.evernymService.getBaseUrl());
                                    }
                                    
                                    
                                    that.activate();
                                    
                                    
                                    });
        
    };
    
	
	
    
    
    this.activate = function() {
		return true;
            
	};
    

    

	
    
    this.changeBaseUrl = function(){
        
        showMessage('stored base url: ' + that.baseUrl());
        appCtx.setItem("baseUrl", that.baseUrl())
        
    };
	

    

    
    
   
    
    
  
	
	
	
	
	
	
	
}
