

var EvernymAPI = function(){
    
    var okAsync = QUnit.okAsync,
    stringformat = QUnit.stringformat;
    
    //var baseUrl = 'http://qupler.no-ip.org:8080/api20/rest', // Test environment
    var baseUrl = 'https://api.evernym.com/api20/rest', // Test environment

    //var baseUrl = 'http://qupler.no-ip.org:8079/api/rest', // Test environment
    
    
    
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
    
    
    var that = this;
    
    
    this.HANDLER = {
    expectSuccess: function(textStatus, status, additionalDetails) {
        
        equal(textStatus, 'success', additionalDetails);
        equal(status, 200);
    },
    expectCreated: function(textStatus, status, additionalDetails) {
        equal(textStatus, 'success', additionalDetails);
        equal(status, 201);
    },
    expectSuccessNoContent: function(textStatus, status, additionalDetails) {
        equal(textStatus, 'nocontent', additionalDetails);
        equal(status, 204);
    },
    expectBadRequest: function(textStatus, status, additionalDetails) {
        equal(textStatus, 'Bad Request', additionalDetails);
        equal(status, 400);
    },
    expectUnauthorized: function(textStatus, status, additionalDetails) {
        equal(textStatus, 'Unauthorized', additionalDetails);
        equal(status, 401);
    }
        
        
    };
    
    
    
    
    
    function findKeyForVerification(html){
        var regex = /<a *href=".*\?key=(.*)"/ig;
        var results = regex.exec(html);
        
        return results[1];
    }
    
    
    function verifyEmail(verification_key, handler, postHandlerCallback){
        callAPI('PUT', '/commethod/verification/' + verification_key, undefined, handler, postHandlerCallback);
    }
    
    this.enroll = function(account, handler, postHandlerCallback) {
        callAPI('POST', '/account/enroll', undefined, account ? account : that.generateAccount(), handler, postHandlerCallback);
    }
    
    this.forgot = function(account, handler, postHandlerCallback) {
        callAPI('POST', '/account/forgot', undefined, account, handler, postHandlerCallback);
    }
    
    this.login = function(loginRequest, handler, postHandlerCallback) {
        callAPI('POST', '/account/login', undefined, loginRequest, handler, postHandlerCallback);
    }
    
    this.logout = function(accessToken, handler, postHandlerCallback) {
        callAPI('POST', '/account/logout', accessToken, undefined, handler, postHandlerCallback);
    }
    
    
    
    
    
    function checkEmail(emailAddress, postHandlerCallback){
        
        
        var times = 0;
        function waitForIt(){
            return timeoutPromise(1000).done(getEmail);
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
            
            return callAPI('GET', '/test/msg/' + emailAddress, undefined, undefined, that.HANDLER.expectSuccess, checkForContent, "html");
        }
        
        getEmail();
        
    }
    
    
    this.checkEmailAndVerify = function(emailAddress, postHandlerCallback){
        
        console.log('checking email');
        
        
        checkEmail(emailAddress, verify);
        
        function verify(data) {
            
            console.log('email: ' + data);
            
            var key = findKeyForVerification(data);
            console.log('verification key: ' + key);
            
            verifyEmail(key, that.HANDLER.expectSuccessNoContent, postHandlerCallback);
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
    
    
    this.createChannel = function(accessToken, channel, handler, postHandlerCallback) {
        callAPI('POST', '/channel', accessToken, channel, handler, postHandlerCallback);
    }
    
    this.deleteChannel = function(accessToken, channelid, handler, postHandlerCallback) {
        callAPI('DELETE', '/channel/' + channelid, accessToken, undefined, handler, postHandlerCallback);
    }
    
    this.sendMessage = function(accessToken, channelid, message, handler, postHandlerCallback) {
        callAPI('POST', '/channel/' + channelid + '/message', accessToken, message, handler, postHandlerCallback);
    }
    
    this.getChannel = function(accessToken, channelid, handler, postHandlerCallback) {
        callAPI('GET', '/channel/' + channelid , accessToken, undefined, handler, postHandlerCallback);
    }
    
    this.getMessages = function(accessToken, channelid, handler, postHandlerCallback) {
        callAPI('GET', '/channel/' + channelid + '/message', accessToken, undefined, handler, postHandlerCallback);
    }
    
    this.listOwnerChannels = function(accessToken, handler, postHandlerCallback) {
        
        callAPI('GET', '/channel?relationship=O', accessToken, undefined, handler, postHandlerCallback);
    }
    
    this.getCommunicationMethods = function(accessToken, handler, postHandlerCallback) {
        
        callAPI('GET', '/commethod', accessToken, undefined, handler, postHandlerCallback);
    }
    
    
    
    
    this.generateAccount = function() {
        
        var strAccountName = 'test-' + randomString(8);
        
        return {
        accountName: strAccountName, // Create Random AccountName Generator
        emailaddress: strAccountName + '@rs7292.mailgun.org',
        password: 'secretPasswordThing',
        firstname: 'testFirst',
        lastname: 'testLast'
        };
    }
    
    this.generateLogin = function(account) {
        return {
        accountName: account.accountName,
        password: account.password,
        appToken: 'sNQO8tXmVkfQpyd3WoNA6_3y2Og='
        };
    }
    
    
    this.generateChannel = function() {
        return {
        name: 'testchannel-' + randomString(5)
        };
    }
    
    this.generateCommunicationMethodUrgentSMS = function(channelId) {
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
    
    
    
    
    
    
    
}



// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;

function is_empty(obj) {
    
    // null and undefined are empty
    if (obj == null) return true;
    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length && obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key))    return false;
    }
    
    // Doesn't handle toString and toValue enumeration bugs in IE < 9
    
    return true;
}

