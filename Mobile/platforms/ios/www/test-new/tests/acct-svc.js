App.acctSvc = new AcctSvc();

function AcctSvc() {
    
    var api = App.api;
    
    this.enroll = function (accountModel, callbacks) {
        
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