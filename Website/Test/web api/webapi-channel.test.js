(function () {
	QUnit.config.testTimeout = 10000;

	var okAsync = QUnit.okAsync,
	stringformat = QUnit.stringformat;

	var baseUrl = 'http://qupler.no-ip.org:8080/api/rest', //production environment
	//var baseUrl = 'http://localhost:8080/api/rest', //local environment
	//var baseUrl = 'http://192.168.1.202:8080/api/rest', //production environment through local network

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
			testUrl = stringformat('{0}/account/enroll', baseUrl);
		}
	});

	var timoutms = 15000;


	test('CREATE CHANNEL', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var account = generateAccount();
		var channel = generateChannel();
		var accessToken;
		enroll(account, expectSuccessNoContent, step2);
		function step2() {
			login(generateLogin(account), expectSuccess, step3);
		}
		function step3(data) {
			accessToken = data.accessToken;
			createChannel(accessToken, channel, expectCreated);
		}
	});


	test('CREATE CHANNEL NO AUTH', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var channel = generateChannel();
		var accessToken = 'asdfasdf';
		createChannel(accessToken, channel, expectBadRequest);
	});

	test('CREATE DUPLICATE CHANNEL FAIL', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var account = generateAccount();
		var channel = generateChannel();
		var accessToken;
		enroll(account, expectSuccessNoContent, step2);
		function step2() {
			login(generateLogin(account), expectSuccess, step3);
		}
		function step3(data) {
			accessToken = data.accessToken;
			createChannel(accessToken, channel, expectCreated, step4);
		}
		function step4(data) {
			createChannel(accessToken, channel, expectBadRequest );
		}
	});

	test('LIST CHANNELS', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var account = generateAccount();
		var accessToken;
		enroll(account, expectSuccessNoContent, step2);
		var channel = generateChannel();
		function step2() {
			login(generateLogin(account), expectSuccess, step3);
		}
		function step3(data) {
			accessToken = data.accessToken;
			createChannel(accessToken, channel, expectCreated, step4);
		}
		function step4(data) {
			listChannels(accessToken, undefined, expectSuccess);
		}
	});

	test('SEND MESSAGE ON CHANNEL', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var account = generateAccount();
		var accessToken;
		enroll(account, expectSuccessNoContent, step2);
		var channel = generateChannel();
        var channelid = '';
		function step2() {
			login(generateLogin(account), expectSuccess, step3);
		}
		function step3(data) {
			accessToken = data.accessToken;
			createChannel(accessToken, channel, expectCreated, step4);
		}
		function step4(data) {
			listChannels(accessToken, undefined, expectSuccess, step5);

		}
		function step5(data){
			ok(true, JSON.stringify(data));
            channelid = data.channel.id;
			sendMessage(accessToken, data.channel.id, {text: 'HERE IS A MESSAGE 01', type: 'FYI'}, expectCreated ); // 'FYI','RAC','ACK'
		}
	});


	test('GET MESSAGES ON CHANNEL', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var account = generateAccount();
		var accessToken;
		enroll(account, expectSuccessNoContent, step2);
		var channel = generateChannel();
        var channelid = '';
		function step2() {
			login(generateLogin(account), expectSuccess, step3);
		}
		function step3(data) {
			accessToken = data.accessToken;
			createChannel(accessToken, channel, expectCreated, step4);
		}
		function step4(data) {
			listChannels(accessToken, undefined, expectSuccess, step5);

		}
		function step5(data){
			ok(true, JSON.stringify(data));
            channelid = data.channel.id;
			sendMessage(accessToken, data.channel.id, {text: 'HERE IS A MESSAGE 01', type: 'FYI'}, expectCreated, step6 ); // 'FYI','RAC','ACK'
		}
		function step6(data){
			ok(true, JSON.stringify(data));
			getMessages(accessToken, channelid, expectSuccess, step7 ); // 'FYI','RAC','ACK'
		}
		function step7(data){
			ok(true, JSON.stringify(data));
			start();
		}
	});

	function createChannel(accessToken, channel, handler, postHandlerCallback) {
		callAPI('POST', '/channel', accessToken, channel, handler, postHandlerCallback);
	}

	function sendMessage(accessToken, channelid, message, handler, postHandlerCallback) {
		callAPI('POST', '/channel/' + channelid + '/message', accessToken, message, handler, postHandlerCallback);
	}

	function getMessages(accessToken, channelid, handler, postHandlerCallback) {
		callAPI('GET', '/channel/' + channelid + '/message', accessToken, undefined, handler, postHandlerCallback);
	}

	function listChannels(accessToken, channel, handler, postHandlerCallback) {

		callAPI('GET', '/channel', accessToken, channel, handler, postHandlerCallback);
	}

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

	function expectCreated(textStatus, status, additionalDetails) {
		equal(textStatus, 'success', additionalDetails);
		equal(status, 201);
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

	function generateChannel() {
		return {
			name: 'testchannel-' + randomString(5)
		};
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
