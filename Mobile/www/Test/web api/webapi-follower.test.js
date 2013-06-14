(function () {
	QUnit.config.testTimeout = 10000;

	var okAsync = QUnit.okAsync,
	stringformat = QUnit.stringformat;

	var baseUrl = 'http://qupler.no-ip.org:8080/api12/rest', //production environment
	//var baseUrl = 'http://localhost:8080/api/rest', //local environment
	//var baseUrl = 'http://192.168.1.202:8080/api12/rest', //production environment through local network


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

	module('Web API Follower Tests', {
		setup: function () {
			testUrl = stringformat('{0}/account/enroll', baseUrl);
		}
	});

	var timoutms = 15000;

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
		function step3(data) {
			accessToken = data.accessToken;
			createChannel(accessToken, channel, expectCreated, step4);
		}
		function step4(data) {
			channelId = data.id;
			listChannelsUserOwnes(accessToken, expectSuccess, step5);
		}
		function step5(data) {
			equal(data.channel.length, 1, "Exactly one Channel, the single channel the user owns");

			listFollowingChannels(accessToken, expectSuccess, step6);
		}
		function step6(data) {
			equal(data.channel.length, 0, "The User is not following any channels");

			listFollowers(accessToken, channelId, expectSuccess, step7);
		}
		function step7(data) {
			ok(true, JSON.stringify(data));
			equal(data.followers.length, 1, "Exactly 1 Follower, Only the Channel Owner");
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
		function step2a(data) {
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
		function step2d(data) {
			accessToken2 = data.accessToken;
			followChannel(accessToken2, channelid, expectSuccessNoContent, step4);
		}
		function step4(data) {
			listFollowers(accessToken, channelid, expectSuccess, step5);
		}
		function step5(data) {
			ok(true, JSON.stringify(data));
			equal(data.followers.length, 2, "Exactly 2 Follower, The Owner and the follower");
			start();
		}
	});

	test('SHOW CHANNELS OWNED', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var account = generateAccount();
		// Create a second user to follow the channel. 
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
		function step2a(data) {
			accessToken = data.accessToken;
			createChannel(accessToken, channel, expectCreated, step2b);
		}
		function step2b(data) {
			channelid = data.id;
			enroll(account2, expectSuccessNoContent, step2c);
		}
		function step2c() {
			// Log in USER #2
			login(generateLogin(account2), expectSuccess, step2d);
		}
		function step2d(data) {
			accessToken2 = data.accessToken;
			// Add a second follower to the channel
			followChannel(accessToken2, channelid, expectSuccessNoContent, step4);
		}
		function step4(data) {
			// List only the channels that the user owns. The second user shouldn't be in the results.
			listChannelsUserOwnes(accessToken, channelid, expectSuccess, step5);
		}
		function step5(data) {
			ok(true, JSON.stringify(data));
			equal(data.channel.length, 1, "Exactly one Channel, the single channel that account user owns");
			start();
		}
	});

	test('GET CHANNEL I\'M FOLLOWING', function () {
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
		function step2a(data) {
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
		function step2d(data) {
			accessToken2 = data.accessToken;
			followChannel(accessToken2, channelid, expectSuccessNoContent, step4);
		}
		function step4(data) {
			getChannel(accessToken, channelid, expectSuccess, step5);
		}
		function step5(data) {
			ok(true, JSON.stringify(data));
			start();

		}
	});

	test('OWNER, REMOVE A FOLLOWER FROM A CHANNEL', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var account = generateAccount();
		var account2 = generateAccount();
		var accessToken;
		var accessToken2;
		var channelid;
		// Step 1 Create a New Account - ENROLL Account #1
		enroll(account, expectSuccessNoContent, step2);
		var channel = generateChannel();
		var channelid = '';
		var followerid = '';

		function step2() {
			// Log into Account #1
			login(generateLogin(account), expectSuccess, step3);
		}
		function step3(data) {
			accessToken = data.accessToken;
			// Create a Channel for User of Account #1
			createChannel(accessToken, channel, expectCreated, step4);
		}
		function step4(data) {
			channelid = data.id;
			// Create a New Account - ENROLL Account #2
			enroll(account2, expectSuccessNoContent, step5);
		}
		function step5() {
			// Log into Account #2
			login(generateLogin(account2), expectSuccess, step6);
		}
		function step6(data) {
			accessToken2 = data.accessToken;
			// User Of Account #2 Is Following Account #1's Channel
			followChannel(accessToken2, channelid, expectSuccessNoContent, step7);
		}
		function step7(data) {
			listFollowers(accessToken, channelid, expectSuccess, step8);
		}
		function step8(data) {
			// Todo - Verify that User of Account #2 is in the list of Followers
			ok(true, JSON.stringify(data));
			followerid = data.followers[0].id;
			removeFollowerFromChannel(accessToken, channelid, followerid, expectSuccessNoContent, step9);
		}
		function step9(data) {
			listFollowers(accessToken, channelid, expectSuccess, step10);
		}
		function step10(data) {
			// Verify that we got follower information (The Owner Should be the only follower)
			ok(true, JSON.stringify(data));
			equal(data.followers.length, 1, "Exactly one follower remains, the channel owner");
			start();
		}
	});

	test('SHOW CHANNELS OWNED', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var account = generateAccount();
		// Create a second user to follow the channel. 
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
		function step2a(data) {
			accessToken = data.accessToken;
			createChannel(accessToken, channel, expectCreated, step2b);
		}
		function step2b(data) {
			channelid = data.id;
			enroll(account2, expectSuccessNoContent, step2c);
		}
		function step2c() {
			// Log in USER #2
			login(generateLogin(account2), expectSuccess, step2d);
		}
		function step2d(data) {
			accessToken2 = data.accessToken;
			// Add a second follower to the channel
			followChannel(accessToken2, channelid, expectSuccessNoContent, step4);
		}
		function step4(data) {
			// List only the channels that the user owns. The second user shouldn't be in the results.
			listChannelsUserOwnes(accessToken, channelid, expectSuccess, step5);
		}
		function step5(data) {
			ok(true, JSON.stringify(data));
			equal(data.channel.length, 1, "Exactly one Channel, the single channel that account user owns");
			start();
		}
	});

	test('GET FOLLOWER', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var account = generateAccount();
		var account2 = generateAccount();
		var accessToken;
		var accessToken2;
		var channelid;
		// Step 1 Create a New Account - ENROLL Account #1
		enroll(account, expectSuccessNoContent, step2);
		var channel = generateChannel();
		var channelid = '';
		var followerid = '';
		var accountname = '';

		function step2() {
			// Log into Account #1
			login(generateLogin(account), expectSuccess, step3);
		}
		function step3(data) {
			accessToken = data.accessToken;
			// Create a Channel for User of Account #1
			createChannel(accessToken, channel, expectCreated, step4);
		}
		function step4(data) {
			channelid = data.id;
			// Create a New Account - ENROLL Account #2
			enroll(account2, expectSuccessNoContent, step5);
		}
		function step5() {
			// Log into Account #2
			login(generateLogin(account2), expectSuccess, step6);
		}
		function step6(data) {
			accessToken2 = data.accessToken;
			// User Of Account #2 Is Following Account #1's Channel
			followChannel(accessToken2, channelid, expectSuccessNoContent, step7);
		}
		function step7(data) {
			listFollowers(accessToken, channelid, expectSuccess, step8);
		}
		function step8(data) {
			// Todo - Verify that User of Account #2 is in the list of Followers
			ok(true, JSON.stringify(data));
			followerid = data.followers[0].id;
			accountname = data.followers[0].accountname;
			getFollower(accessToken, channelid, followerid, expectSuccess, step9);
		}
		function step9(data) {
			ok(true, JSON.stringify(data));
			equal(accountname, data.accountname, "Verify that the follower is the expected follower");
			start();
		}

	});

	function createChannel(accessToken, channel, handler, postHandlerCallback) {
		callAPI('POST', '/channel', accessToken, channel, handler, postHandlerCallback);
	}

	function followChannel(accessToken, channelid, handler, postHandlerCallback) {
		callAPI('POST', '/channel/' + channelid + '/follower', accessToken, undefined, handler, postHandlerCallback);
	}

	function getChannel(accessToken, channelid, handler, postHandlerCallback) {
		callAPI('GET', '/channel/' + channelid, accessToken, undefined, handler, postHandlerCallback);
	}

	function listFollowers(accessToken, channelid, handler, postHandlerCallback) {
		callAPI('GET', '/channel/' + channelid + '/follower', accessToken, undefined, handler, postHandlerCallback);
	}

	function removeFollowerFromChannel(accessToken, channelid, followerid, handler, postHandlerCallback) {
		callAPI('DELETE', '/channel/' + channelid + '/follower/' + followerid, accessToken, undefined, handler, postHandlerCallback);
	}

	function getFollower(accessToken, channelid, followerid, handler, postHandlerCallback) {
		callAPI('GET', '/channel/' + channelid + '/follower/' + followerid, accessToken, undefined, handler, postHandlerCallback);
	}

	function listFollowingChannels(accessToken, handler, postHandlerCallback) {
		callAPI('GET', '/channel?relationship=F', accessToken, undefined, handler, postHandlerCallback);
	}

	function listChannelsUserOwnes(accessToken, handler, postHandlerCallback) {
		callAPI('GET', '/channel?relationship=O', accessToken, undefined, handler, postHandlerCallback);
	}

	function enroll(account, handler, postHandlerCallback) {
	    callAPI('POST', '/account/enroll', null, account ? account : generateAccount(), handler, postHandlerCallback);
	}

	function login(loginRequest, handler, postHandlerCallback) {
		callAPI('POST', '/account/login', null, loginRequest, handler, postHandlerCallback);
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
