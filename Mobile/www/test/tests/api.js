App.api = new Api();

function Api() {

	//var baseUrl = 'http://qupler.no-ip.org:8079/api/rest';
	var baseUrl = 'https://api.evernym.com/api22/rest';

	this.getBaseUrl = function() {
		return baseUrl;
	};

	this.callAPI = function(method, resource, object, callbacks, useAccessToken) {

		var currentBaseUrl = localStorage.getItem("baseUrl");

		if (currentBaseUrl) {
			baseUrl = currentBaseUrl;
		}

		var ajaxParams = {
			url : baseUrl + resource,
			type : method,
			data : JSON.stringify(object),
			dataType : "json",
			contentType : "application/json"
		};

		if (useAccessToken) {

			ajaxParams.beforeSend = function(xhr) {
				//logger.log('Setting the authorization headers', null, 'dataservice', true);

				var accessToken = localStorage.getItem("accessToken");
				xhr.setRequestHeader("Authorization", accessToken);
			}
		}

		var ajaxCall = $.ajax(ajaxParams);

		ajaxCall.done(function(data, textStatus, jqXHR) {
			//following line commented out by Jason; this code doesn't belong here, at least not this way          
			//$.mobile.hidePageLoadingMsg();
			callbacks.success({
				data : data,
				textStatus : textStatus,
				status : jqXHR.status,
				details : jqXHR.responseText
			});
		});

		ajaxCall.fail(function(jqXHR, textStatus, errorThrown) {
			//following line commented out by Jason; this code doesn't belong here, at least not this way          
			//$.mobile.hidePageLoadingMsg();

			//logger.log('error: ' + jqXHR.status, undefined, 'dataservice.api', true);


			/* the following commented lines don't belong here... need to solve it another way
			var hash = $.mobile.urlHistory.getActive().hash;

			if (isBadLogin(details.code) && hash.indexOf("loginView") == -1) {

				localStorage.setItem("login_nav", JSON.stringify({
					'hash' : hash,
					'params' : ajaxParams
				}));

			}
			*/

			var data = undefined;
			var details = "";
			try {
				data = JSON.parse(jqXHR.responseText);
				//data = JSON.parse('blah blah');
			} catch(err) {
				details = jqXHR.responseText;
			}

			callbacks.error({
				data : data,
				textStatus : errorThrown ? errorThrown : textStatus,
				status : jqXHR.status,
				details : details
			});

		});

		return ajaxCall;

	};

}