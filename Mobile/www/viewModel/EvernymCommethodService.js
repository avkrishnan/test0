/*globals $, TweetViewModel */

function EvernymCommethodService() {
    
    var api = new EvernymService();
    
    this.verification = function (verification_key, callbacks) {
        
        
        
        return api.callAPI('PUT', '/commethod/verification/' + verification_key, undefined, callbacks);
        
        
    };
        
}