(function () {
    QUnit.config.testTimeout = 10000;

    var okAsync = QUnit.okAsync,
	stringformat = QUnit.stringformat;

    var baseUrl = 'http://qupler.no-ip.org:8080/api12/rest', //production environment
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
            channelid = data.id;
            provisionalAccount = generateProvisionalAccount(channelid);
            // Create a Provisional Account. The account contains the channelId that it was associated with.
            createProvisionalAccount(accessToken, provisionalAccount, expectSuccess, step5);
        }
        function step5(data) {

            if (data) {
                provisionalToken = data.provisionalToken;
            }
            listFollowers(accessToken, channelid, expectSuccess, step6);
        }
        function step6(data) {
            equal(data.followers.length, 2, "Exactly two channels: 1 - Channel Owner, 2 - Provisional Account");

            // TODO - Verify that the list followers returns the follower added with step 4

            ok(true, JSON.stringify(data));
            start();
        }
    });



    function createProvisionalAccount(accessToken, provisionalAccount, handler, postHandlerCallback) {
        callAPI('POST', '/account/provisional/enroll', accessToken, provisionalAccount, handler, postHandlerCallback);
    }

    function createChannel(accessToken, channel, handler, postHandlerCallback) {
        callAPI('POST', '/channel', accessToken, channel, handler, postHandlerCallback);
    }

    function listFollowers(accessToken, channelid, handler, postHandlerCallback) {
        callAPI('GET', '/channel/' + channelid + '/follower', accessToken, undefined, handler, postHandlerCallback);
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
            accountname: 'test-' + randomString(5), // Create Random AccountName Generator
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

    function generateCommunicationMethodUrgentSMS(channelId) {
        return {
            smsPhone: '123-123-1234',
            urgency: true,
            channelId: channelId
        };
    }

    function generateLogin(account) {
        return {
            accountname: account.accountname,
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
