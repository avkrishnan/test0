function EvernymEscPlanService(api) {
	this.getEscPlans = function (callbacks) {
			return api.callAPI('GET', '/escplan', undefined, callbacks, true);
	};
}