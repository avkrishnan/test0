/*globals $, TweetViewModel */

function EvernymCommethodService() {
    
    var api = new EvernymService();
    
    this.verification = function (verification_key, callbacks) {
        return api.callAPI('PUT', '/commethod/verification/' + verification_key, undefined, callbacks);
        
    };
   
    
    this.getCommethods = function (callbacks) {
        return api.callAPI('GET', '/commethod/', undefined, callbacks, true);
        
    };
    
    this.requestVerification = function (commethod_id, callbacks) {
        return api.callAPI('POST', '/commethod/' + commethod_id + '/verification', undefined, callbacks, true);
        
    };
    
    
    
    
    
}