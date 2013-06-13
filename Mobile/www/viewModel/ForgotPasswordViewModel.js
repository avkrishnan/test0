/*globals ko*/

function ForgotPasswordViewModel() {
    /// <summary>
    /// A view model that represents a single tweet
    /// </summary>
    
    // --- properties
    
    var that = this;
    this.template = "forgotPasswordView";
    
    this.accountName = ko.observable();
    
    this.email = ko.observable();
    
    var  dataService = new EvernymLoginService();
    
    $("#" + this.template).live("pagebeforeshow", function(e, data){ that.clearForm(); that.activate(); });
    
    this.activate = function(){
        
    };
    
    this.clearForm = function(){
        that.email('');
        that.accountName('');
    };
    
    function gotForgotPassword(data, status, details){
        
        alert('asdf');
    }
    
    
    this.forgotPasswordCommand = function () {
        
        var callbacks = {
        success: forgotPasswordSuccess,
        error: forgotPasswordError
        };
       
        
        var forgotPasswordModel = {};
        $.mobile.showPageLoadingMsg("a", "Sending Email for Fogotten Password");
        forgotPasswordModel.accountName = this.accountName();
        forgotPasswordModel.emailAddress = this.email();
        //loginModel.appToken = 'sNQO8tXmVkfQpyd3WoNA6_3y2Og=';
        
        return dataService.forgotPassword(forgotPasswordModel, callbacks).then(gotForgotPassword);
    };
   
    
        
    function forgotPasswordSuccess(args) {
                
        $.mobile.hidePageLoadingMsg();
        
                
        //logger.log('You successfully logged in!', null, 'login', true);
    }
    
    function forgotPasswordError(data, status, details) {
        $.mobile.hidePageLoadingMsg();
        showMessage("FAILED: " + details.message);
        localStorage.removeItem('accessToken');
        //logger.logError('Your login failed, please try again!', null, 'login', true);
    }
    
 
    

    

    
    
}
