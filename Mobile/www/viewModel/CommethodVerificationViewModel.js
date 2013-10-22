/*globals ko*/

function CommethodVerificationViewModel() {
    
    
    var that = this;
    
    
    this.template = "commethodVerificationView";
    this.viewid = "V-??";
    this.viewname = "ComMethodVerification";
    this.displayname = "ComMethod Verification";
    
    this.hasfooter = false;
    this.message = ko.observable();
    

    this.verification_key = ko.observable();
    
    
    this.applyBindings = function(){
        $("#" + that.template).on("pagebeforeshow", null, function(e, data){
                                    
                                    
                                    if ($.mobile.pageData && $.mobile.pageData.key){
                                        localStorage.removeItem('currentChannel');
                                        channelListViewModel.clearForm();
                                    that.activate($.mobile.pageData.key);
                                    }
                                    
                                    });
    };
    
    
    // Methods
    this.activate = function (key) {
        
        that.verification_key(key);
        that.verificationCommand().then(gotVerification);
        
        return true;
    };
    
    function gotVerification(data){
        $.mobile.hidePageLoadingMsg();
        that.message("Successfully verified");
        
    }
    
    function verificationSuccess(data){
        $.mobile.hidePageLoadingMsg();
        
    }
    
    function verificationError(data, status, details){
        $.mobile.hidePageLoadingMsg();
        
        that.message("Error in Verification: " + ((status==500)?"Internal Server Error":details.message));
        //showMessage("Error in Verification: " + ((status==500)?"Internal Server Error":details.message));
    }
    
    this.verificationCommand = function () {
        
        $.mobile.showPageLoadingMsg("a", "Verifying");
        var callbacks = {
        success: verificationSuccess,
        error: verificationError
        };
        
        
        return ES.commethodService.verification(that.verification_key(), callbacks);
    }
    

    
}
