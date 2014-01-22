(function() {
	QUnit.config.testTimeout = 10000;

	/*
	 * var okAsync = QUnit.okAsync, stringformat = QUnit.stringformat;
	 * 
	 * var testAccount, testAccessToken;
	 */

	module('Web API Account Tests', {
		setup : function() {
			// testUrl = stringformat('{0}/enroll', baseUrl);
		}
	});

	function expectSuccess(result) {
		equal(result.status, 200);
	}

	function expectSuccessNoContent(result) {
		equal(result.status, 204);
	}

	function call(method, resource, accessToken, object) {
		var that = this;
		var baseUrl = 'https://api.evernym.com/api22/rest';

		var params = {
			type : method,
			url : baseUrl + resource,
			dataType : "json",
			async : false
		};
		if (object) {
			params.data = JSON.stringify(object);
			params.contentType = "application/json";
		}
		if (accessToken) {
			ajaxParams.beforeSend = function(xhr) {
				xhr.setRequestHeader("Authorization", accessToken);
			};
		}

		jQuery.ajax(params).
		  done(function(data, textStatus, result) {
			that.result = {
					status: result.status,
					data: data
			};
		}).fail(function(result, textStatus, errorThrown) {
			that.result = {
					status: result.status
			};
		});
		return that.result;
	}

	test("SIMPLEST TEST", function() {
		ok(1 == "1", "Passed!");
	});

	test("FETCH CHANNEL WITHOUT AUTH", function() {
		expectSuccess(call('GET', '/channel/hellochannel'));
	});

	test("ENROLL", function() {
		var api = new EvernymAPI();
		var account = api.generateAccount();
		var enrollResult = call('POST', '/account/enroll', undefined, account);
		expectSuccessNoContent(enrollResult);
		var loginResult = call('POST', '/account/login', undefined, api
				.generateLogin(account));
		expectSuccess(loginResult);
		var accessToken = loginResult.data.accessToken;
		equal(accessToken.length, 32);
		
		
	});

})();
