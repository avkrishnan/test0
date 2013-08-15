

function EvernymSystemService() {
    
    var api = new EvernymService();
    
    this.sendFeedback = function (feedbackObject, callbacks) {
        
        return api.callAPI('POST', '/system/feedback', feedbackObject, callbacks, true);
        
    };
    
    
}