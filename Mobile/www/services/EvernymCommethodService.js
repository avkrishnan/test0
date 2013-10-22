function EvernymCommethodService(api) {
	console.log('loading EvernymCommethodService');
	
	this.verification = function (verification_key, callbacks, authentication) {
		return api.callAPI('PUT', '/commethod/verification/' + verification_key, undefined, callbacks, authentication);
	};
	
	this.getCommethods = function (callbacks) {
		return api.callAPI('GET', '/commethod', undefined, callbacks, true);
	};
	
	this.addCommethod = function (commethod, callbacks) {
		return api.callAPI('POST', '/commethod', commethod, callbacks, true);
	};
	
	this.deleteCommethod = function (commethod_id, callbacks) {
		return api.callAPI('DELETE', '/commethod/' + commethod_id, undefined, callbacks, true);
	};
	
	this.requestVerification = function (commethod_id, callbacks) {
		return api.callAPI('POST', '/commethod/' + commethod_id + '/verification', undefined, callbacks, true);
	};
}