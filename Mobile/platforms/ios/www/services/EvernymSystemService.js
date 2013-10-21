

function EvernymSystemService() {
    
    var api = new EvernymService();
    
    this.sendFeedback = function (feedbackObject, callbacks) {
        
        return api.callAPI('POST', '/system/feedback', feedbackObject, callbacks, true);
        
    };
    
    this.getUrgencySettings = function(callbacks){
        return api.callAPI('GET', '/system/urgency', undefined, callbacks, true);
    };
    
    
}