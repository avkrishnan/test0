/*globals $, TweetViewModel */

function EvernymService() {
  
    var baseUrl = 'http://qupler.no-ip.org:8080/api/rest';
    
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
                      if (jqXHR.status == '401'){
                      //router.navigateTo('#/login');
                      }
                      callbacks.error(errorThrown ? errorThrown : textStatus, jqXHR.status, (jqXHR.status!=500)?JSON.parse(jqXHR.responseText):jqXHR.responseText);
                      });
		
		return ajaxCall;
        
    };


  
}