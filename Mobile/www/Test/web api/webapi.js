



var baseUrl = 'http://qupler.no-ip.org:8080/api15/rest', // Test environment
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


function findKeyForVerification(html){
    var regex = /<a *href=".*\?key=(.*)"/ig;
    var results = regex.exec(html);
    
    return results[1];
}


function verifyEmail(verification_key, handler, postHandlerCallback){
    callAPI('PUT', '/commethod/verification/' + verification_key, undefined, handler, postHandlerCallback);
}

function enroll(account, handler, postHandlerCallback) {
    callAPI('POST', '/account/enroll', undefined, account ? account : generateAccount(), handler, postHandlerCallback);
}

function forgot(account, handler, postHandlerCallback) {
    callAPI('POST', '/account/forgot', undefined, account, handler, postHandlerCallback);
}

function login(loginRequest, handler, postHandlerCallback) {
    callAPI('POST', '/account/login', undefined, loginRequest, handler, postHandlerCallback);
}

function logout(accessToken, handler, postHandlerCallback) {
    callAPI('POST', '/account/logout', accessToken, undefined, handler, postHandlerCallback);
}

function checkEmail(emailAddress, handler, postHandlerCallback){
    
    var times = 0;
    function waitForIt(){
        
        var promise = timeoutPromise(1000);
        promise.done(function() {
                     getEmail();
                     });
        
    }
    
    function timeoutPromise(millis) {
        var deferred = $.Deferred();
        setTimeout(function() {
                   deferred.resolve();
                   }, millis);
        return deferred.promise();
    }
    
    
    function checkForContent(data){
        if (data.length == 0){
            
            waitForIt();
            times ++;
            console.log('no email. times tried: ' + times);
            return;
        }
        
        postHandlerCallback(data);
        
    }
    
    function getEmail(){
        callAPI('GET', '/test/msg/' + emailAddress, null, null, handler, checkForContent, "html");
    }
    
    getEmail();
    
}


function checkEmailAndVerify(emailAddress, postHandlerCallback){
    
    console.log('checking email');
    checkEmail(emailAddress,expectSuccess, verify);
    
    function verify(data) {
        
        console.log('email: ' + data);
        
        var key = findKeyForVerification(data);
        console.log('verification key: ' + key);
        
        verifyEmail(key, expectSuccessNoContent, postHandlerCallback);
    }
    
}


// generic helper method to handle ajax calls to API
function callAPI(method, resource, accessToken, object, handler, postHandlerCallback, datatype) {
	
    if (!datatype){
        datatype = "json";
    }
    
    var ajaxParams = {
    url: baseUrl + resource,
    type: method,
    data: JSON.stringify(object),
    dataType: datatype,
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
    
    return ajaxCall;
    
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

function getChannel(accessToken, channelid, handler, postHandlerCallback) {
    callAPI('GET', '/channel/' + channelid , accessToken, undefined, handler, postHandlerCallback);
}

function getMessages(accessToken, channelid, handler, postHandlerCallback) {
    callAPI('GET', '/channel/' + channelid + '/message', accessToken, undefined, handler, postHandlerCallback);
}

function listOwnerChannels(accessToken, handler, postHandlerCallback) {
    
    callAPI('GET', '/channel?relationship=O', accessToken, undefined, handler, postHandlerCallback);
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


function generateAccount() {
    
    var strAccountName = 'test-' + randomString(8);
    
    return {
    accountName: strAccountName, // Create Random AccountName Generator
    emailaddress: strAccountName + '@rs7292.mailgun.org',
    password: 'secretPasswordThing',
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


function generateChannel() {
    return {
    name: 'testchannel-' + randomString(5)
    };
}

function generateCommunicationMethodUrgentSMS(channelId) {
    return {
    smsPhone: '123-123-1234',
    urgency: true,
    channelId: channelId
    };
}

function randomString(length) {
    var text = "";
    var possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    for (var i = 0; i < length; i++)
        text += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    
    return text;
}


