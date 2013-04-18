define(['services/logger', 'services/config', 'services/authentication', 'durandal/plugins/router'],
	function (logger, config, authentication, router) {
	    var
            baseUrl = config.baseUrl,
            init = function () {
		logger.log('initializing request ', null, 'dataservice', true);
		
	    },

            getCookie = function () {
                var cookie = authentication.getCookie();
                if (cookie) {
                    return cookie;
                }
                    return undefined;
            },
	    
	    callAPI = function(method, resource, object, callbacks) {
		var ajaxParams = {
			url: baseUrl + resource,
			type: method,
			data: JSON.stringify(object),
			dataType: "json",
			contentType: "application/json"
		};
	
		var accessToken = getCookie();
		logger.log('Setting the authorization headers', null, 'dataservice', true);
	
		if (accessToken) {
		    ajaxParams.beforeSend = function (xhr) {
			xhr.setRequestHeader("Authorization", accessToken);
		    }
		}

		var ajaxCall = $.ajax(ajaxParams);

		ajaxCall.done(function (data, textStatus, jqXHR) {
		    callbacks.success(data, textStatus, jqXHR.status, jqXHR.responseText);
		});
	
		ajaxCall.fail(function (jqXHR, textStatus, errorThrown) {
		        logger.log('error: ' + jqXHR.status, undefined, 'dataservice.api', true);
			if (jqXHR.status == '401'){
			    router.navigateTo('#/login');
			}
			callbacks.error(errorThrown ? errorThrown : textStatus, jqXHR.status, jqXHR.responseText);
		});
		
		return ajaxCall;
	
	    };

            
            
	    return {
	    callAPI: callAPI,
	    getCookie: getCookie
	    
    	}
	});
