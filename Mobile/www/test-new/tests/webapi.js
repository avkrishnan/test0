var EvernymAPI = function() {

	var okAsync = QUnit.okAsync, stringformat = QUnit.stringformat;

	function getJsonFromUrl() {
		var query = location.search.substr(1);
		var data = query.split("&");
		var result = {};
		for ( var i = 0; i < data.length; i++) {
			var item = data[i].split("=");
			result[item[0]] = item[1];
		}
		return result;
	}
	
	var q = getJsonFromUrl();
	
	var env = q.env == undefined ? "" : q.env;
	var apiver = (q.api == undefined || q.api == "") ? (env.indexOf("dev") > 0 ? "" : "24") : q.api;
	var baseUrl = 
		(env === "ldev") ? 'http://localhost:8079/api' + apiver + '/rest' : 
		(env === "qdev") ? 'http://qupler.no-ip.org:8079/api' + apiver + '/rest' : 
		(env === "qprod") ? 'http://qupler.no-ip.org:8080/api' + apiver + '/rest' : 
		(env === "lprod") ? 'http://app01:8080/api' + apiver + '/rest' : 
		'https://api.evernym.com/api' + apiver + '/rest';

	//'http://localhost:8079/api/rest',
	//'http://qupler.no-ip.org:8079/api/rest',
	//'https://api.evernym.com/api22/rest',

	var getMsgPrefix = function(id, rqstUrl) {
		return stringformat(' of account with id=\'{0}\' to \'{1}\'', id,
				rqstUrl);
	}, onCallSuccess = function(msgPrefix) {
		ok(true, msgPrefix + " succeeded.");
	}, onError = function(result, msgPrefix) {
		okAsync(false, msgPrefix
				+ stringformat(' failed with status=\'{1}\': {2}.',
						result.status, result.responseText));
	};

	var that = this;

	function checkFunc(expectedStatus) {
		return function(data, status) {
			equal(status, expectedStatus, "data: " + JSON.stringify(data));
			return data;
		};
	}

	that.CHECK = {
		success : checkFunc("200: OK"),
		created : checkFunc("201: Created"),
		successNoContent : checkFunc("204: No Content"),
		badRequest : checkFunc("400: Bad Request"),
		unauthorized : checkFunc("401: Unauthorized"),
		notFound : checkFunc("404: Not Found"),
		notImplemented : checkFunc("501: Not Implemented")
	};

	/*
		that.HANDLER = {
			expectSuccess : function(textStatus, status, additionalDetails) {

				equal(textStatus, 'success', additionalDetails);
				equal(status, 200);
			},
			expectCreated : function(textStatus, status, additionalDetails) {
				equal(textStatus, 'success', additionalDetails);
				equal(status, 201);
			},
			expectSuccessNoContent : function(textStatus, status, additionalDetails) {
				equal(textStatus, 'nocontent', additionalDetails);
				equal(status, 204);
			},
			expectBadRequest : function(textStatus, status, additionalDetails) {
				equal(textStatus, 'Bad Request', additionalDetails);
				equal(status, 400);
			},
			expectUnauthorized : function(textStatus, status, additionalDetails) {
				equal(textStatus, 'Unauthorized', additionalDetails);
				equal(status, 401);
			},
			expectNotImplemented : function(textStatus, status, additionalDetails) {
				equal(textStatus, 'Not Implemented', additionalDetails);
				equal(status, 501);
			}

		};
	 */

	function findCodeForVerification(html) {
		var regex = /<b>(\d{6})<\/b>/ig;
		var results = regex.exec(html);

		return results[1];
	}

	function findKeyForVerification(html) {
		var regex = /<a *href=".*\?key=(.*)"/ig;
		var results = regex.exec(html);

		return results[1];
	}

	this.sEnroll = function(account) {
		return sCallAPI('POST', '/account/enroll', undefined, account ? account
				: that.generateAccount());
	};

	this.sLogin = function(loginRequest) {
		return sCallAPI('POST', '/account/login', undefined, loginRequest);
	};

	this.sLogout = function(accessToken) {
		return sCallAPI('POST', '/account/logout', accessToken);
	};

	this.sFetchAccount = function(accessToken) {
		return sCallAPI('GET', '/account', accessToken);
	};

	this.sModifyAccount = function(accessToken, account) {
		return sCallAPI('PUT', '/account', accessToken, account);
	};

	this.sFetchComMethods = function(accessToken) {
		return sCallAPI('GET', '/commethod', accessToken);
	};

	function sVerifyEmailCode(accessToken, verification_key) {
		return sCallAPI('PUT', '/commethod/verification/' + verification_key,
				accessToken);
	}

	this.sForgot = function(account) {
		return sCallAPI('POST', '/account/forgot', undefined, account);
	};

	this.sFetchOwnerChannels = function(accessToken) {
		return sCallAPI('GET', '/channel?relationship=O', accessToken);
	};

	this.sCreateChannel = function(accessToken, channel) {
		return sCallAPI('POST', '/channel', accessToken, channel);
	};

	this.sModifyChannel = function(accessToken, channelid, channel) {
		return sCallAPI('PUT', '/channel/' + channelid, accessToken, channel);
	};

	this.sDeleteChannel = function(accessToken, channelid) {
		return sCallAPI('DELETE', '/channel/' + channelid, accessToken);
	};

	this.sSendMessage = function(accessToken, channelid, message) {
		return sCallAPI('POST', '/channel/' + channelid + '/message',
				accessToken, message);
	};

	this.sFetchChannel = function(accessToken, channelid) {
		return sCallAPI('GET', '/channel/' + channelid, accessToken);
	};

	this.sFetchMessages = function(accessToken, channelid) {
		return sCallAPI('GET', '/channel/' + channelid + '/message',
				accessToken);
	};

	this.sCreateComMethod = function(accessToken, comMethod) {
		return sCallAPI('POST', '/commethod', accessToken, comMethod);
	};

	this.sDeleteComMethod = function(accessToken, cmId) {
		return sCallAPI('DELETE', '/commethod/' + cmId, accessToken);
	};
	
	this.followChannel = function(accessToken, channelid) {
		return sCallAPI('POST', '/channel/' + channelid + '/follower',
				accessToken);
	};

	this.fetchEscPlan = function(accessToken) {
		return sCallAPI('GET', '/escplan', accessToken);
	};

	this.cloneEscPlan = function(accessToken, epId) {
		return sCallAPI('PUT', '/escplan/' + epId, accessToken);
	};

	this.createEscStep = function(accessToken, epId, escStep) {
		return sCallAPI('POST', '/escplan/' + epId + '/step', accessToken, escStep);
	};

	this.updateEscStep = function(accessToken, epId, stepId, escStep) {
		return sCallAPI('PUT', '/escplan/' + epId + '/step/' + stepId, accessToken, escStep);
	};

	this.deleteEscStep = function(accessToken, epId, stepId) {
		return sCallAPI('DELETE', '/escplan/' + epId + '/step/' + stepId, accessToken);
	};

	this.createEscRetry = function(accessToken, epId, stepId, escRetry) {
		return sCallAPI('POST', '/escplan/' + epId + '/step/' + stepId + '/retry', accessToken, escRetry);
	};

	this.updateEscRetry = function(accessToken, epId, stepId, retrySeq, escRetry) {
		return sCallAPI('PUT', '/escplan/' + epId + '/step/' + stepId + '/retry/' + retrySeq, accessToken, escRetry);
	};

	this.deleteEscRetry = function(accessToken, epId, stepId, retrySeq) {
		return sCallAPI('DELETE', '/escplan/' + epId + '/step/' + stepId + '/retry/' + retrySeq, accessToken);
	};

	this.readMsg = function(accessToken, msgId) {
		return sCallAPI('POST', '/message/' + msgId + '/read', accessToken);
	};
	
	this.dismissMsg = function(accessToken, msgId) {
		return sCallAPI('POST', '/message/' + msgId + '/dismiss', accessToken);
	};
	
	this.acknowledgeMsg = function(accessToken, msgId) {
		return sCallAPI('POST', '/message/' + msgId + '/igi', accessToken);
	};
	
	/*	

		
		
		function verifyEmail(verification_key, handler, postHandlerCallback) {
			callAPI('PUT', '/commethod/verification/' + verification_key,
					undefined, undefined, handler, postHandlerCallback);
		}

		function verifyEmailCode(accessToken, verification_key, handler,
				postHandlerCallback) {
			callAPI('PUT', '/commethod/verification/' + verification_key,
					accessToken, undefined, handler, postHandlerCallback);
		}

		this.enroll = function(account, handler, postHandlerCallback) {
			callAPI('POST', '/account/enroll', undefined, account ? account : that
					.generateAccount(), handler, postHandlerCallback);
		};

		this.forgot = function(account, handler, postHandlerCallback) {
			callAPI('POST', '/account/forgot', undefined, account, handler,
					postHandlerCallback);
		};

		this.login = function(loginRequest, handler, postHandlerCallback) {
			callAPI('POST', '/account/login', undefined, loginRequest, handler,
					postHandlerCallback);
		};

		this.logout = function(accessToken, handler, postHandlerCallback) {
			callAPI('POST', '/account/logout', accessToken, undefined, handler,
					postHandlerCallback);
		};

		this.getAccount = function(accessToken, handler, postHandlerCallback) {
			callAPI('GET', '/account', accessToken, undefined, handler,
					postHandlerCallback);
		};

		this.modifyAccount = function(accessToken, account, handler,
				postHandlerCallback) {
			callAPI('PUT', '/account', accessToken, account, handler,
					postHandlerCallback);
		};
	*/

	function wait(millis) {
		return $.Deferred(function(dfd) {
			setTimeout(dfd.resolve, millis);
		});
	}

	this.checkEmail = function(emailAddress) {

		var dfd = $.Deferred();
		var waitTime = 3000; //in milliseconds
		var times = 0;
		var maxTimes = 50;

		function checkForContent(data) {
			if (data.length == 0) {

				times++;
				console.log('no email. times tried: ' + times);
				if (times < maxTimes) {
					//this recurses
					wait(waitTime).done(getEmail);
				} else {
					//this stops the recursion
					console.log('max times reached.');
					dfd.reject();
				}
				return;
			}
			dfd.resolve(data);
		}

		function getEmail() {
			return $.when(
					sCallAPI('GET', '/test/msg/' + emailAddress, undefined,
							undefined, "html")).then(that.CHECK.success).then(
					checkForContent); //checkForContent is recursive with getEmail
		}

		getEmail();

		return dfd.promise();
	};

	this.checkEmailAndVerify = function(accessToken, emailAddress) {

		console.log('checking email');
		return $.when(this.checkEmail(emailAddress)).then(
				setupAndVerifyFunc(accessToken), function() {
					ok(false, 'verify failed');
				});
	};

	function setupAndVerifyFunc(accessToken) {
		return function(data) {
			console.log('email: ' + data);

			var key = findCodeForVerification(data);
			console.log('verification key: ' + key);
			return $
					.when(sVerifyEmailCode(accessToken, key))
					.then(that.CHECK.success)
					.then(
							function(data) {
								equal(data.id.length, 36,
										'verification result returns an ID 36 characters long');
								equal(data.verified, "Y", "and it's verified");
							});
		};
	}
	/*
		function setupAndVerifyFunc(postHandlerCallback) {
			return function(data) {
				console.log('email: ' + data);

				var key = findCodeForVerification(data);
				console.log('verification key: ' + key);
				verifyEmail(key, that.HANDLER.expectSuccessNoContent,
						postHandlerCallback);
			};
		}
	*/

	function sCallAPI(method, resource, accessToken, object, datatype) {

		if (!datatype) {
			datatype = "json";
		}

		var ajaxParams = {
			url : baseUrl + resource,
			type : method,
			async : false,
			data : JSON.stringify(object),
			dataType : datatype,
			contentType : "application/json"
		};

		if (accessToken) {
			ajaxParams.beforeSend = function(xhr) {
				xhr.setRequestHeader("Authorization", accessToken);
			};
		}

		var ajaxCall = $.ajax(ajaxParams);

		var deferred = new $.Deferred();

		ajaxCall.done(function(data, textStatus, jqXHR) {
			deferred.resolve(data, jqXHR.status + ": " + jqXHR.statusText);
		});

		ajaxCall.fail(function(jqXHR, textStatus, errorThrown) {
			deferred.resolve(jqXHR.responseText, jqXHR.status + ": "
					+ jqXHR.statusText);
		});

		return deferred.promise();

	}

	/*
		// generic helper method to handle ajax calls to API
		function callAPI(method, resource, accessToken, object, handler,
				postHandlerCallback, datatype) {

			if (!datatype) {
				datatype = "json";
			}

			var ajaxParams = {
				url : baseUrl + resource,
				type : method,
				async : false,
				data : JSON.stringify(object),
				dataType : datatype,
				contentType : "application/json"
			}
			if (accessToken) {
				ajaxParams.beforeSend = function(xhr) {
					xhr.setRequestHeader("Authorization", accessToken);
				}
			}

			var ajaxCall = $.ajax(ajaxParams);

			ajaxCall.done(function(data, textStatus, jqXHR) {

				handler(textStatus, jqXHR.status, method + ": " + resource);
				callback(data);

			});

			ajaxCall.fail(function(jqXHR, textStatus, errorThrown) {
				handler(errorThrown ? errorThrown : textStatus, jqXHR.status,
						jqXHR.responseText);
				callback();
			});

			function callback(data) {
				if (postHandlerCallback) {
					postHandlerCallback(data);clones 
				} else {
					start();
				}
			}

			return ajaxCall;

		}

		this.createChannel = function(accessToken, channel, handler,
				postHandlerCallback) {
			callAPI('POST', '/channel', accessToken, channel, handler,
					postHandlerCallback);
		};

		this.modifyChannel = function(accessToken, channelid, channel, handler,
				postHandlerCallback) {
			callAPI('PUT', '/channel/' + channelid, accessToken, channel, handler,
					postHandlerCallback);
		};

		this.deleteChannel = function(accessToken, channelid, handler,
				postHandlerCallback) {
			callAPI('DELETE', '/channel/' + channelid, accessToken, undefined,
					handler, postHandlerCallback);
		};

		this.sendMessage = function(accessToken, channelid, message, handler,
				postHandlerCallback) {
			callAPI('POST', '/channel/' + channelid + '/message', accessToken,
					message, handler, postHandlerCallback);
		};

		this.getChannel = function(accessToken, channelid, handler,
				postHandlerCallback) {
			callAPI('GET', '/channel/' + channelid, accessToken, undefined,
					handler, postHandlerCallback);
		};

		this.getMessages = function(accessToken, channelid, handler,
				postHandlerCallback) {
			callAPI('GET', '/channel/' + channelid + '/message', accessToken,
					undefined, handler, postHandlerCallback);
		};

		this.listOwnerChannels = function(accessToken, handler, postHandlerCallback) {
			callAPI('GET', '/channel?relationship=O', accessToken, undefined,
					handler, postHandlerCallback);
		};

		this.getCommunicationMethods = function(accessToken, handler,
				postHandlerCallback) {
			callAPI('GET', '/commethod', accessToken, undefined, handler,
					postHandlerCallback);
		};
	*/

	that.generateEmail = function(localName) {
		return localName + '@rs7292.mailgun.org';
	};

	that.generateAccount = function() {

		var strAccountname = this.randomAccountname();

		return {
			accountname : strAccountname, // Create Random AccountName Generator
			emailaddress : that.generateEmail(strAccountname),
			password : 'secretPasswordThing',
			firstname : 'testFirst',
			lastname : 'testLast'
		};
	};

	this.randomAccountname = function() {
		return 'test-' + randomString(8);
	};

	this.generateLogin = function(account) {
		return {
			accountname : account.accountname,
			password : account.password,
			appToken : 'sNQO8tXmVkfQpyd3WoNA6_3y2Og='
		};
	};

	this.generateChannel = function() {
		var nm = 'testchannel-' + randomString(5);
		return {
			name : nm,
			description : 'Channel description for ' + nm,
			longDescription : 'Long channel description for ' + nm
		};
	};

	this.generateCommunicationMethodUrgentSMS = function(channelId) {
		return {
			smsPhone : '123-123-1234',
			urgency : true,
			channelId : channelId
		};
	};

	function randomString(length) {
		var text = "";
		var possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for ( var i = 0; i < length; i++)
			text += possibleChars.charAt(Math.floor(Math.random()
					* possibleChars.length));

		return text;
	}

	this.randomStr = randomString;

};

// Speed up calls to hasOwnProperty
var hasOwnProperty = Object.prototype.hasOwnProperty;

function is_empty(obj) {

	// null and undefined are empty
	if (obj == null)
		return true;
	// Assume if it has a length property with a non-zero value
	// that that property is correct.
	if (obj.length && obj.length > 0)
		return false;
	if (obj.length === 0)
		return true;

	for ( var key in obj) {
		if (hasOwnProperty.call(obj, key))
			return false;
	}

	// Doesn't handle toString and toValue enumeration bugs in IE < 9

	return true;
}
