/*globals $, TweetViewModel */

function EvernymService() {
  
    
	//var baseUrl = 'http://qupler.no-ip.org:8079/api/rest';
	var baseUrl = 'http://qupler.no-ip.org:8080/api16/rest';
    
    this.getBaseUrl = function(){return baseUrl;};
    
	this.callAPI = function(method, resource, object, callbacks, useAccessToken) {
		
        
        
        var currentBaseUrl = localStorage.getItem("baseUrl");
        
        if (currentBaseUrl){
            baseUrl = currentBaseUrl;
        }
        
        
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
                      $.mobile.hidePageLoadingMsg();
					  callbacks.success(data, textStatus, jqXHR.status, jqXHR.responseText);
					  });
		
		ajaxCall.fail(function (jqXHR, textStatus, errorThrown) {
                      $.mobile.hidePageLoadingMsg();
					  //logger.log('error: ' + jqXHR.status, undefined, 'dataservice.api', true);
					  
					  var details = (jqXHR.status!=500)?JSON.parse(jqXHR.responseText):jqXHR.responseText;
                      
                      var hash = $.mobile.urlHistory.getActive().hash;
					  
					  if (isBadLogin(details.code) && hash.indexOf("loginView") == -1){
					  
					      localStorage.setItem("login_nav", JSON.stringify({'hash': hash, 'params': ajaxParams}));
					  
					  }
					  
					  callbacks.error(errorThrown ? errorThrown : textStatus, jqXHR.status, details);
					  });
		
		return ajaxCall;
		
	};


  
}