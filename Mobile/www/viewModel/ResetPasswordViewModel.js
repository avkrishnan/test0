/*globals ko*/

function ResetPasswordViewModel() {
    /// <summary>
    /// A view model that represents a single tweet
    /// </summary>
    
    // --- properties
    
    var that = this;
    this.template = "resetPasswordView";
    this.viewid = "V-??";
    this.viewname = "ResetPassword2";
    
    this.key = '';
    this.notification = ko.observable();
    
    this.password = ko.observable();
    
    this.confirmPassword = ko.observable();
    
    var  dataService = new EvernymLoginService();
    
    this.applyBindings = function(){
        $("#" + that.template).live("pagebeforeshow", function(e, data){
                                    
                                    
                                    that.clearForm();
                                    if ($.mobile.pageData && $.mobile.pageData.key){
                                    that.key = $.mobile.pageData.key;
                                    
                                    that.activate();
                                    }
                                    
                                    else {
                                    
                                    }
                                    
                                    
                                    
                                    
                                    });
    };
    
    

    
    this.activate = function(){
        
    };
    
    this.clearForm = function(){
        that.password('');
        that.confirmPassword('');
        that.key = '';
        that.notification('');
        $('#resetPasswordContent').show();
        $('#rp_login_button').hide();
    };
    
    function gotResetPassword(data, status, details){
        $('#resetPasswordContent').hide(200);
        that.notification('Successfully Changed Password.');
        $('#rp_login_button').show(200);
        
    }
    
    
    this.resetPasswordCommand = function () {
        
        var callbacks = {
        success: resetPasswordSuccess,
        error: resetPasswordError
        };
       
        
        var resetPasswordModel = {};
        $.mobile.showPageLoadingMsg("a", "Resetting Password");
        resetPasswordModel.password = that.password();
        resetPasswordModel.confirmPassword = that.confirmPassword();
        resetPasswordModel.forgotPasswordRequestKey = that.key;
        
        
        return dataService.resetPassword(resetPasswordModel, callbacks).then(gotResetPassword);
    };
   
    
        
    function resetPasswordSuccess(args) {
                
        $.mobile.hidePageLoadingMsg();
        
                
        //logger.log('You successfully logged in!', null, 'login', true);
    }
    
    function resetPasswordError(data, status, details) {
        $.mobile.hidePageLoadingMsg();
        //showMessage("FAILED: " + details.message);
        that.notification("error: " + details.message);
        localStorage.removeItem('accessToken');
        //logger.logError('Your login failed, please try again!', null, 'login', true);
    }
    
 
    

    

    
    
}
