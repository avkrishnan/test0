/*globals ko*/

function ForgotPasswordViewModel() {
    /// <summary>
    /// A view model that represents a single tweet
    /// </summary>
    
    // --- properties
    
    var that = this;
    this.template = "forgotPasswordView";
    this.viewid = "V-03";
    this.viewname = "ForgotPassword";
    this.hasfooter = false;
    this.accountName = ko.observable();
    
    this.email = ko.observable();
    
    this.notification = ko.observable();
    
    var  dataService = new EvernymLoginService();
    
    this.applyBindings = function(){
        $("#" + that.template).live("pagebeforeshow", function(e, data){ that.clearForm(); that.activate(); });
        
    };
    
    
    
    this.activate = function(){
       $('#forgotPasswordNotification').hide();
    };
    
    this.clearForm = function(){
        that.email('');
        that.accountName('');
        that.notification('');
        $('#forgotPasswordNotification').hide();
        
        
    };
    
    function gotForgotPassword(data, status, details){
        
        $('#forgotPasswordNotification').show(200);
        that.notification('An email was sent to your inbox with further instructions to complete your password change.');
        
    }
    
    
    this.forgotPasswordCommand = function () {
        
        var callbacks = {
        success: forgotPasswordSuccess,
        error: forgotPasswordError
        };
       
        
        var forgotPasswordModel = {};
        $.mobile.showPageLoadingMsg("a", "Sending Email for Fogotten Password");
        forgotPasswordModel.accountName = that.accountName();
        forgotPasswordModel.emailAddress = that.email();
        
        
        return dataService.forgotPassword(forgotPasswordModel, callbacks).then(gotForgotPassword);
    };
   
    
        
    function forgotPasswordSuccess(args) {
                
        $.mobile.hidePageLoadingMsg();
        
                
        //logger.log('You successfully logged in!', null, 'login', true);
    }
    
    function forgotPasswordError(data, status, details) {
        $.mobile.hidePageLoadingMsg();
        //showMessage("FAILED: " + details.message);
        
        that.notification(details.message);
        
        localStorage.removeItem('accessToken');
        //logger.logError('Your login failed, please try again!', null, 'login', true);
    }
    
 
    

    

    
    
}
