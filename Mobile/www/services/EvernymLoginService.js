/*globals $, TweetViewModel */

function EvernymLoginService() {
    
    var api = new EvernymService();
    
    this.accountEnroll = function (accountModel, callbacks) {
        
        /*
        var appToken = 'sNQO8tXmVkfQpyd3WoNA6_3y2Og=';
        var account = {
        accountName: accountModel.accountName,
        emailaddress: accountModel.emailaddress,
        password: accountModel.password,
        firstname: accountModel.firstname,
        lastname: accountModel.lastname,
        appToken: appToken
        };
         */
        
        
        return api.callAPI('POST', '/account/enroll', accountModel, callbacks);
        
        
    };
    
    
    this.forgotPassword = function (forgotPasswordModel, callbacks) {
        
        return api.callAPI('POST', '/account/forgot', forgotPasswordModel, callbacks);
        
        
    };
    
    this.resetPassword = function (resetPasswordModel, callbacks) {
        
        return api.callAPI('PUT', '/account/forgot', resetPasswordModel, callbacks);
        
        
    };
    
    this.accountLogin = function (loginModel, callbacks) {
        return api.callAPI('POST', '/account/login', loginModel, callbacks);
    };
    
    
    
    this.getAccount = function (loginModel, callbacks) {
        return api.callAPI('GET', '/account', undefined, callbacks, true);
    };
    
    
    
    this.accountLogout = function (authKey, callbacks) {
        
        return api.callAPI('POST', '/account/logout', undefined, callbacks, true);
        
        
    };
    
    
}