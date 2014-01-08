function EvernymCommethodService(api) {
	console.log('loading EvernymCommethodService');
	
	this.verification = function (verification_key, callbacks, authentication) {
		return api.callAPI('PUT', '/commethod/verification/' + verification_key, undefined, callbacks, authentication);
	};
	
	// for self
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

	// for provisional
  this.getCommethodsForProvis = function (id) {
	  return api.callAPI('GET', '/account/' + id + '/commethod', undefined, undefined, true);
	};
	  
	this.addCommethodForProvis = function (id, commethod) {
	  return api.callAPI('POST', '/account/' + id + '/commethod', commethod, undefined, true);
	};
	  
	this.deleteCommethodForProvis = function (id, commethod_id) {
	  return api.callAPI('DELETE', '/account/' + id + '/commethod/' + commethod_id, undefined, undefined, true);
	};
	  
	this.requestVerificationForProvis = function (id, commethod_id) {
	  return api.callAPI('POST', '/account/' + id + '/commethod/' + commethod_id + '/verification', undefined, undefined, true);
	};

}