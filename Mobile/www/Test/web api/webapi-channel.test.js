(function () {
	QUnit.config.testTimeout = 10000;

	var okAsync = QUnit.okAsync,
	stringformat = QUnit.stringformat;

	var baseUrl = 'http://qupler.no-ip.org:8080/api5/rest', //production environment
	//var baseUrl = 'http://localhost:8080/api/rest', //local environment
	//var baseUrl = 'http://192.168.1.202:8080/api4/rest', //production environment through local network


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


	test('DELETE CHANNEL', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var account = generateAccount();
		var channel1 = generateChannel();
		var channel2 = generateChannel();
		var channelid1 = '';
		var channelid2 = '';
		var accessToken;
		enroll(account, expectSuccessNoContent, step2);	
		function step2() {
			login(generateLogin(account), expectSuccess, step3a);
		}
		function step3a(data) {
			accessToken = data.accessToken;
			createChannel(accessToken, channel1, expectCreated, step3b);
		}
		function step3b(data) {
			channelid1 = data.id;
			createChannel(accessToken, channel2, expectCreated, step4);
		}
		function step4(data) {
			channelid2 = data.id;
			// delete the second channel
			deleteChannel(accessToken, channelid2, expectSuccessNoContent, step5);
		}
		function step5(data) {
			listOwnerChannels(accessToken, expectSuccess, step6);
		}
		function step6(data) {
			equal(1, data.channel.length, "only one channel remains");
			
			equal(channelid1, data.channel[0].id, "the correct channel is remaining");
			start();
		}
		
	});

	test('DELETE CHANNEL WITH MESSAGES', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var account = generateAccount();
		var channel1 = generateChannel();
		var channel2 = generateChannel();
		var channelid1 = '';
		var channelid2 = '';
		var accessToken;
		enroll(account, expectSuccessNoContent, step2);
		function step2() {
			login(generateLogin(account), expectSuccess, step3a);
		}
		function step3a(data) {
			accessToken = data.accessToken;
			// create channel 1
			createChannel(accessToken, channel1, expectCreated, step3b);
		}
		function step3b(data) {
			channelid1 = data.id;
			// create channel 2
			createChannel(accessToken, channel2, expectCreated, step4);
		}
		function step4(data) {
			channelid2 = data.id;
			// send a message on channel 2
			sendMessage(accessToken, channelid2, { text: 'HERE IS A TEST MESSAGE ON CHANNEL 2', type: 'FYI' }, expectCreated, step5);
		}
		function step5(data) {
			// delete Channel 2 which contains a message
			deleteChannel(accessToken, channelid2, expectSuccessNoContent, step6);
		}
		function step6(data) {
			listOwnerChannels(accessToken, expectSuccess, step8);
		}
		function step8(data) {
			equal(1, data.channel.length, "only one channel remains");

			equal(channelid1, data.channel[0].id, "the correct channel is remaining");
			start();
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
			listOwnerChannels(accessToken, expectSuccess);
		}
	});
 
 
 test('LIST CHANNELS BUT ZERO CHANNELS', function () {
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
	  
	  listOwnerChannels(accessToken, expectSuccess);
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
			listOwnerChannels(accessToken, expectSuccess, step5);
		}
		function step5(data){
			ok(true, JSON.stringify(data));
			channelid = data.channel[0].id;
			sendMessage(accessToken, channelid, {text: 'HERE IS A MESSAGE 01', type: 'FYI'}, expectCreated ); // 'FYI','RAC','ACK'
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
			listOwnerChannels(accessToken, expectSuccess, step5);
		}
		function step5(data){
			ok(true, JSON.stringify(data));
			channelid = data.channel[0].id;
			sendMessage(accessToken, channelid, {text: 'HERE IS A MESSAGE 01', type: 'FYI'}, expectCreated, step6 ); // 'FYI','RAC','ACK'
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
 
 
 test('GET MESSAGES ON CHANNEL, BUT NO MESSAGES', function () {
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
	  listOwnerChannels(accessToken, expectSuccess, step5);
	  }
	  function step5(data){
	  ok(true, JSON.stringify(data));
	  channelid = data.channel[0].id;
	  
	  getMessages(accessToken, channelid, expectSuccess, step7 ); // 'FYI','RAC','ACK'
	  }
	  function step7(data){
	  ok(true, JSON.stringify(data));
	  start();
	  }
	  });

	test('CREATE A CHANNEL, LIST FOLLOWERS (SELF)', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var account = generateAccount();
		var accessToken;
		enroll(account, expectSuccessNoContent, step2);
		var channel = generateChannel();
		var channelId;
		function step2() {
			login(generateLogin(account), expectSuccess, step3);
		}
		function step3(data){
			accessToken = data.accessToken;
			createChannel(accessToken, channel, expectCreated, step4);
		}
		function step4(data) {
			channelId = data.id;
			listFollowingChannels(accessToken, expectSuccess, step5);
		}
		function step5(data){
			listFollowers(accessToken, channelId, expectSuccess, step6);
		}
		function step6(data){
			ok(true, JSON.stringify(data));
			start();
		}
	});

	test('FOLLOW A CHANNEL, LIST FOLLOWERS', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var account = generateAccount();
		var account2 = generateAccount();
		var accessToken;
		var accessToken2;
		var channelid;
		enroll(account, expectSuccessNoContent, step2);
		var channel = generateChannel();
		var channelid = '';

		function step2() {
			login(generateLogin(account), expectSuccess, step2a);
		}
		function step2a(data){
			accessToken = data.accessToken;
			createChannel(accessToken, channel, expectCreated, step2b);
		}
		function step2b(data) {
			channelid = data.id;
			enroll(account2, expectSuccessNoContent, step2c);
		}
		function step2c() {
			login(generateLogin(account2), expectSuccess, step2d);
		}
		function step2d(data){
			accessToken2 = data.accessToken;
			followChannel(accessToken2, channelid, expectSuccessNoContent, step4);
		}
		function step4(data){
			listFollowers(accessToken, channelid, expectSuccess, step5);
		}
		function step5(data){
			ok(true, JSON.stringify(data));
			start();
 
		}
	});

	test('CREATE PROVISIONAL ACCOUNT FOLLOWING A CHANNEL', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var account = generateAccount();
		var accessToken;
		// Step 1 Create a new account
		enroll(account, expectSuccessNoContent, step2);
		var channel = generateChannel();
		var channelid = '';
		var provisionalAccount = generateProvisionalAccount();
		var provisionalToken;
		function step2() {
			login(generateLogin(account), expectSuccess, step3);
		}
		function step3(data) {
			accessToken = data.accessToken;
			createChannel(accessToken, channel, expectCreated, step4);
		}
		function step4(data) {
			debugger;
			channelid = data.id;
			provisionalAccount = generateProvisionalAccount(channelid);
			// Create a Provisional Account. The account contains the channelId that it was associated with.
			createProvisionalAccount(accessToken, provisionalAccount, expectSuccess, step5);
		}
		function step5(data) {
			provisionalToken = data.provisionalToken;
			listFollowers(accessToken, channelid, expectSuccess, step6);
		}
		function step6(data){
			// TODO - Verify that the list followers returns the follower added with a 
			ok(true, JSON.stringify(data));
			start();
		}
	});


	function createProvisionalAccount(accessToken, provisionalAccount, handler, postHandlerCallback){
		callAPI('POST', '/account/provisional/enroll', accessToken, provisionalAccount, handler, postHandlerCallback);
	}

	function createChannel(accessToken, channel, handler, postHandlerCallback) {
		callAPI('POST', '/channel', accessToken, channel, handler, postHandlerCallback);
	}

	function deleteChannel(accessToken, channelid, handler, postHandlerCallback) {
		callAPI('DELETE', '/channel/' + channelid, accessToken, undefined, handler, postHandlerCallback);
	}

	function sendMessage(accessToken, channelid, message, handler, postHandlerCallback) {
		callAPI('POST', '/channel/' + channelid + '/message', accessToken, message, handler, postHandlerCallback);
	}

	function followChannel(accessToken, channelid, handler, postHandlerCallback) {
		callAPI('POST', '/channel/' + channelid + '/follower', accessToken, undefined, handler, postHandlerCallback);
	}

	function listFollowers(accessToken, channelid, handler, postHandlerCallback) {
		callAPI('GET', '/channel/' + channelid + '/follower', accessToken, undefined, handler, postHandlerCallback);
	}

	function getMessages(accessToken, channelid, handler, postHandlerCallback) {
		callAPI('GET', '/channel/' + channelid + '/message', accessToken, undefined, handler, postHandlerCallback);
	}

	function listOwnerChannels(accessToken, handler, postHandlerCallback) {

		callAPI('GET', '/channel?relationship=O', accessToken, undefined, handler, postHandlerCallback);
	}

	function listFollowingChannels(accessToken, handler, postHandlerCallback) {

		callAPI('GET', '/channel?relationship=F', accessToken, undefined, handler, postHandlerCallback);
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
			handler(textStatus, jqXHR.status, method + ": " + resource);
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

	function generateProvisionalAccount(channelId) {
		return {
			emailaddress: 'test@test.com',
			smsPhone: '123-123-1234',
			firstname: 'testFirst',
			lastname: 'testLast-' + randomString(5), // Create Random Last Name Generator
			channelId: channelId
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
