/*globals ko*/

function DevSettingsViewModel() {
	/// <summary>
	/// A view model that displays the communication means and urgency that user wants to recieve communications
	/// </summary>
	
	// --- properties
	
    this.template = "devSettingsView";
    this.viewid = "V-00";
    this.viewname = "DevSettings";
    this.hasfooter = false;
    this.baseUrl = ko.observable();
    
    
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
		return true;
            
	};
    

    

	
    
    this.changeBaseUrl = function(){
        
        showMessage('stored base url: ' + that.baseUrl());
        localStorage.setItem("baseUrl", that.baseUrl())
        
    };
	

    

    
    
   
    
    
  
	
	
	
	
	
	
	
}
