(function () {
    QUnit.config.testTimeout = 10000;

    var okAsync = QUnit.okAsync,
        stringformat = QUnit.stringformat;

    var baseUrl = 'http://qupler.no-ip.org:8080/api5/rest', // Test environment
    //var baseUrl = 'http://localhost:8080/api/rest', //production environment
    //var baseUrl = 'http://192.168.1.202:8080/catalyst-api/rest', //local route to production environment
	getMsgPrefix = function (id, rqstUrl) {
            return stringformat(
                ' of account with id=\'{0}\' to \'{1}\'',
                id, rqstUrl);
        },
        onCallSuccess = function (msgPrefix) {
            ok(true, msgPrefix + " succeeded.");
        },
        onError = function (result, msgPrefix) {
            okAsync(false, msgPrefix +
                stringformat(' failed with status=\'{1}\': {2}.',
                    result.status, result.responseText));
        };

    var testAccount,
        testAccessToken;

    module('Web API Account Tests', {
        setup: function () {
            testUrl = stringformat('{0}/enroll', baseUrl);
        }
    });

    var timoutms = 15000;

    test('TEST ENROLLMENT', function () {
    	stop(timoutms); //tell qunit to wait 5 seconds before timing out
    	enroll(null, expectSuccessNoContent);
    });

    test('TEST DUPLICATE ENROLLMENT', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out

		var account = generateAccount();

		enroll(
			account,
			expectSuccessNoContent,
			function () {
				enroll(account, expectBadRequest)
			}
		);

	});

    test('LOGIN', function () {
    	stop(timoutms); //tell qunit to wait 5 seconds before timing out

    	var account = generateAccount();

    	enroll(account, expectSuccessNoContent, step2);

    	function step2() {
    		login(generateLogin(account), expectSuccess, step3);
    	}

    	function step3(data) {
    		ok(data, 'no data returned');
    		ok(data.accessToken, 'no access token found');
    		equal(data.accessToken.length, 32, 'access token should be 32 characters');
    		start();
    	}

    });

    test('INVALID LOGIN', function () {
    	stop(timoutms); //tell qunit to wait 5 seconds before timing out

    	login(generateLogin(generateAccount()), expectUnauthorized);

    });

    test('LOGOUT', function () {
    	stop(timoutms); //tell qunit to wait 5 seconds before timing out

    	var account = generateAccount();
    	var accessToken;

    	enroll(account, expectSuccessNoContent, step2);

    	function step2() {
    		login(generateLogin(account), expectSuccess, step3);
    	}

    	function step3(data) {
    		accessToken = data.accessToken;
    		logout(accessToken, expectSuccessNoContent);
    	}

    });

    test('TEST BAD ENROLLMENT - NAME TOO LONG', function () {
    	stop(timoutms); //tell qunit to wait 5 seconds before timing out

    	var account = generateAccount();

    	account.accountName =
			'01234567890123456789012345678901234567890123456789' +
			'01234567890123456789012345678901234567890123456789' +
			'01234567890123456789012345678901234567890123456789' +
			'01234567890123456789012345678901234567890123456789' +
			'01234567890123456789012345678901234567890123456789' +
			'01234567890123456789012345678901234567890123456789' +
			'01234567890123456789012345678901234567890123456789' +
			'01234567890123456789012345678901234567890123456789' +
			'01234567890123456789012345678901234567890123456789' +
			'01234567890123456789012345678901234567890123456789';

    	enroll(account, expectBadRequest);
    });

    test('TEST BAD ENROLLMENT - NAME TOO SHORT', function () {
    	stop(timoutms); //tell qunit to wait 5 seconds before timing out

    	var account = generateAccount();

    	account.accountName = 'hi';

    	enroll(account, expectBadRequest);
    });



    function enroll(account, handler, postHandlerCallback) {
        callAPI('POST', '/account/enroll', null, account ? account : generateAccount(), handler, postHandlerCallback);
    }

    function login(loginRequest, handler, postHandlerCallback) {
        callAPI('POST', '/account/login', null, loginRequest, handler, postHandlerCallback);
    }

    function logout(accessToken, handler, postHandlerCallback) {
        callAPI('POST', '/account/logout', accessToken, null, handler, postHandlerCallback);
    }



	// generic helper method to handle ajax calls to API
    function callAPI(method, resource, accessToken, object, handler, postHandlerCallback) {
    	var ajaxParams = {
    		url: baseUrl + resource,
    		type: method,
    		data: JSON.stringify(object),
    		dataType: "json",
    		contentType: "application/json"
    	}
    	if (accessToken) {
    		ajaxParams.beforeSend = function (xhr) {
    			xhr.setRequestHeader("Authorization", accessToken);
    		}
    	}

    	var ajaxCall = $.ajax(ajaxParams);

    	ajaxCall.done(function (data, textStatus, jqXHR) {
    		handler(textStatus, jqXHR.status);
    		callback(data);
    	});

    	ajaxCall.fail(function (jqXHR, textStatus, errorThrown) {
    		handler(errorThrown ? errorThrown : textStatus, jqXHR.status, jqXHR.responseText);
    		callback();
    	});

    	function callback(data) {
    		if (postHandlerCallback) {
    			postHandlerCallback(data);
    		} else {
    			start();
    		}
    	}

    }

	// handlers
    function expectSuccess(textStatus, status, additionalDetails) {
    	equal(textStatus, 'success', additionalDetails);
    	equal(status, 200);
    }

    function expectSuccessNoContent(textStatus, status, additionalDetails) {
    	equal(textStatus, 'nocontent', additionalDetails);
    	equal(status, 204);
    }

    function expectBadRequest(textStatus, status, additionalDetails) {
    	equal(textStatus, 'Bad Request', additionalDetails);
    	equal(status, 400);
    }

    function expectUnauthorized(textStatus, status, additionalDetails) {
    	equal(textStatus, 'Unauthorized', additionalDetails);
    	equal(status, 401);
    }


    function generateAccount() {
    	return {
    		accountName: 'test-' + randomString(5), // Create Random AccountName Generator
    		emailaddress: 'test@test.com',
    		password: 'secret',
    		firstname: 'testFirst',
    		lastname: 'testLast'
    	};
    }

    function generateLogin(account) {
    	return {
    		accountName: account.accountName,
    		password: account.password,
    		appToken: 'sNQO8tXmVkfQpyd3WoNA6_3y2Og='
    	};
    }

    function randomString(length) {
    	var text = "";
    	var possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    	for (var i = 0; i < length; i++)
    		text += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));

    	return text;
    }
    
})();
