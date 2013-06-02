/*globals $, TweetViewModel */

function EvernymService() {
  
	var baseUrl = 'http://qupler.no-ip.org:8080/api5/rest';
	
	this.callAPI = function(method, resource, object, callbacks, useAccessToken) {
		var ajaxParams = {
		url: baseUrl + resource,
		type: method,
		data: JSON.stringify(object),
		dataType: "json",
		contentType: "application/json"
		};
		
		
		
		if (useAccessToken) {
			ajaxParams.beforeSend = function (xhr) {
				//logger.log('Setting the authorization headers', null, 'dataservice', true);
				
				var accessToken = localStorage.getItem("accessToken");
				xhr.setRequestHeader("Authorization", accessToken);
			}
		}
		
		var ajaxCall = $.ajax(ajaxParams);
		
		ajaxCall.done(function (data, textStatus, jqXHR) {
					  callbacks.success(data, textStatus, jqXHR.status, jqXHR.responseText);
					  });
		
		ajaxCall.fail(function (jqXHR, textStatus, errorThrown) {
					  //logger.log('error: ' + jqXHR.status, undefined, 'dataservice.api', true);
					  
					  var details = (jqXHR.status!=500)?JSON.parse(jqXHR.responseText):jqXHR.responseText;
					  
					  if (details.code == 100202 || jqXHR.status == '401'){
					  
					  
						  
					  localStorage.setItem("login_nav", JSON.stringify({hash: $.mobile.urlHistory.getActive().hash, params: ajaxParams}));
					  
					  }
					  
					  callbacks.error(errorThrown ? errorThrown : textStatus, jqXHR.status, details);
					  });
		
		return ajaxCall;
		
	};


  
}