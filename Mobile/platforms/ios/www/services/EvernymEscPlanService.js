

function EvernymEscPlanService() {
    
    var api = new EvernymService();
    
    this.getEscPlans = function (callbacks) {
        return api.callAPI('GET', '/escplan', undefined, callbacks, true);
    };
    
}