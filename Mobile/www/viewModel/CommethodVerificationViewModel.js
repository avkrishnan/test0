/*globals ko*/

function CommethodVerificationViewModel() {
    
    
    var that = this;
    
    var  dataService = new EvernymCommethodService();
    
    this.template = "commethodVerificationView";
    

    this.verification_key = ko.observable();
    
    
    $("#" + this.template).live("pagebeforeshow", function(e, data){
								
								
								if ($.mobile.pageData && $.mobile.pageData.key){
								
                                    that.activate($.mobile.pageData.key);
								}
    
                                });
	
    
    // Methods
    this.activate = function (key) {
        
        that.verification_key(key);
        that.verificationCommand().then(gotVerification);
        
        return true;
    };
    
    function gotVerification(data){
        $.mobile.hidePageLoadingMsg();
        alert('got verification');
        
    }
    
    function verificationSuccess(data){
        $.mobile.hidePageLoadingMsg();
        alert('got verification success');
    }
    
    function verificationError(data, status, details){
        $.mobile.hidePageLoadingMsg();
        
        showMessage("Error in Verification: " + ((status==500)?"Internal Server Error":details.message));
    }
    
    this.verificationCommand = function () {
        
        $.mobile.showPageLoadingMsg("a", "Verifying");
        var callbacks = {
        success: verificationSuccess,
        error: verificationError
        };
        
        
        return dataService.verification(that.verification_key(), callbacks);
    }
    

    
}
