(function() {
	QUnit.config.testTimeout = 90000;
	QUnit.config.reorder = false;

	var api = new EvernymAPI();
	var hlpr = new ApiTestHelper(api);

	module("group a");

	var SCEN1 = {};
	var SCEN2 = {};


	/*

	function getPromise() {
		var deferred = $.Deferred();

		setTimeout(function() {
			deferred.resolve("hurray");
		}, 500);

		return deferred.promise();
	}

	test('TEST 1', function() {
		ok(true, 'hello');
		$.when('hello')
		.then(function(data) {alert(data);})
		.then(function() {return "hello";})
		.then(function(data) {alert(data);});
		
	});

	test('TEST 2', function() {
		ok(true, 'hello');
		$.when('a')
		.then(function(data) {alert(data); return 'b';})
		.then(function(data) {alert(data); })
		.then(function(data) {alert(data); return 'd';})
		.then(function(data) {alert(data);});
		
	});
	
	test('TEST 3', function() {
		ok(true, 'hello');
		$.when('a')
		.then(function(data) {alert(data);})
		.then(function() {return 'c';})
		.then(function(data) {alert(data);});
		
	});

	asyncTest('TEST TEST', function() {

		var x = getPromise();
		$.when(x)
		.then(function(value) {
			console.log(value);
		})
		.then(start);

	});
*/
	
	

	asyncTest('ENROLL', hlpr.enroll(SCEN1));

	/*
	asyncTest('ENROLL WITH PHONE NUMBER', hlpr.enroll(SCEN2, (function() {
		var acct = api.generateAccount();
		acct.phonenumber = '8013763348';
		return acct; }())));
	 */
	
	asyncTest('DUPLICATE ENROLLMENT', function() {
		$.when(api.sEnroll(SCEN1.account))
		.then(api.CHECK.badRequest)
		.then(start);
	});
	
	asyncTest(
			'TEST BAD ENROLLMENT - NAME TOO LONG',
			function() {
				var account = api.generateAccount();

				account.accountname = '01234567890123456789012345678901234567890123456789'
						+ '01234567890123456789012345678901234567890123456789'
						+ '01234567890123456789012345678901234567890123456789'
						+ '01234567890123456789012345678901234567890123456789'
						+ '01234567890123456789012345678901234567890123456789'
						+ '01234567890123456789012345678901234567890123456789'
						+ '01234567890123456789012345678901234567890123456789'
						+ '01234567890123456789012345678901234567890123456789'
						+ '01234567890123456789012345678901234567890123456789'
						+ '01234567890123456789012345678901234567890123456789';

				$.when(api.sEnroll(account))
				.then(api.CHECK.badRequest)
				.then(start);
			});

	asyncTest('TEST BAD ENROLLMENT - NAME TOO SHORT', function() {
		var account = api.generateAccount();
		account.accountname = 'hi';
		$.when(api.sEnroll(account))
		.then(api.CHECK.badRequest)
		.then(start);
	});

	asyncTest('LOGIN', hlpr.login(SCEN1));

	asyncTest('LOGOUT', function() {
		$.when(api.sLogout(SCEN1.accessToken))
		.then(api.CHECK.successNoContent)
		.then(start);
	});

	asyncTest('LOGIN AGAIN', hlpr.login(SCEN1));
	
	function clone(obj) {
	    if (null == obj || "object" != typeof obj) return obj;
	    var copy = obj.constructor();
	    for (var attr in obj) {
	        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	    }
	    return copy;
	}

	asyncTest('LOGIN INVALID PASSWORD', function() {
		var account = clone(SCEN1.account);
		account.password = '~INVALID~PASSWORD~';
		var invalidLogin = api.generateLogin(account);
		$.when(api.sLogin(invalidLogin))
		.then(api.CHECK.unauthorized)
		.then(start);
	});

	asyncTest('LOGIN INVALID USERNAME AND PASSWORD', function() {
		var invalidLogin = api.generateLogin(api.generateAccount());
		$.when(api.sLogin(invalidLogin))
		.then(api.CHECK.unauthorized)
		.then(start);
	});

	function fetchAcctAndCheck(checkFunc) {
		$.when(api.sFetchAccount(SCEN1.accessToken))
		.then(api.CHECK.success)
		.then(checkFunc);
	}

	asyncTest('FETCH ACCOUNT INFO', function() {
		$.when(fetchAcctAndCheck(hlpr.checkEqualC(SCEN1.account,['accountname','firstname','lastname','nickname'])))
		.then(start);
	});

	asyncTest('CHANGE ACCOUNT NAME', function() {
		newAccount = { accountname : api.randomAccountname() };
		$.when(api.sModifyAccount(SCEN1.accessToken, newAccount))
		.then(api.CHECK.notImplemented)
		.then(start);
	});

	function modifyAcctAndCheck(newAccount, checkFunc) {
		return $.when(api.sModifyAccount(SCEN1.accessToken, newAccount))
		.then(api.CHECK.successNoContent)
		.then(function() { return fetchAcctAndCheck(checkFunc); });
		
	}

	asyncTest('CHANGE ACCOUNT NAME WITH SAME NORMALIZED NAME', function() {
		newAccount = { accountname : SCEN1.account.accountname.toUpperCase() };
		modifyAcctAndCheck(newAccount, hlpr.checkEqualC(newAccount))
		.then(start);
	});

	asyncTest('CHANGE FIRST AND LAST NAME', function() {
		newAccount = {
				firstname : api.randomStr(8),
				lastname : api.randomStr(8)
		};
		modifyAcctAndCheck(newAccount, hlpr.checkEqualC(newAccount))
		.then(start);
	});

	asyncTest('GET COMMUNICATION METHODS', function() {
		$.when(api.sFetchComMethods(SCEN1.accessToken))
		.then(api.CHECK.success)
		.then(function(data) {
			ok(!is_empty(data), 'check for communication settings: ' + JSON.stringify(data));
		})
		.then(start);
	});

	asyncTest('FETCH CHANNELS WHEN THERE ARE NONE', function() {
		$.when(api.sFetchOwnerChannels(SCEN1.accessToken))
		.then(api.CHECK.success)
		.then(start);
	});

	asyncTest('CREATE CHANNEL', hlpr.createChannelF(SCEN1,'channel'));

	asyncTest('FETCH A CHANNEL I OWN', function() {
		$.when(api.sFetchChannel(SCEN1.accessToken, SCEN1.channel.id))
		.then(api.CHECK.success)
		.then(start);
	});

	asyncTest('MODIFY CHANNEL DESCRIPTION', function() {
		var chnlId = SCEN1.channel.id;
		var newChnl = {
			description : SCEN1.channel.description + "<modified>"
		};
		$.when(api.sModifyChannel(SCEN1.accessToken, chnlId, newChnl))
		.then(api.CHECK.successNoContent)
		.then(hlpr.fetchChannelAndCheckF(SCEN1, 'channel', newChnl))
		.then(function() { SCEN1.channel.description = newChnl.description; })
		.then(start);
		
	});

	asyncTest('CREATE A SECOND CHANNEL', hlpr.createChannelF(SCEN1,'channel2'));

	asyncTest('FETCH ALL CHANNELS I OWN', function() {
		$.when(api.sFetchOwnerChannels(SCEN1.accessToken))
		.then(api.CHECK.success)
		.then(checkChannelsMatch)
		.then(start);
	});

	function checkChannelsMatch(data) {
		equal(data.channel.length, 2,
				"make sure we return two channels");
		var chnl1 = data.channel[0];
		var chnl2 = data.channel[1];
		if (data.channel[0].name != SCEN1.channel.name) {
			//swap
			var x = chnl1;
			chnl1 = chnl2;
			chnl2 = x;
		}
		equal(	JSON.stringify({ channel : [ chnl1, chnl2 ] }), 
				JSON.stringify({ channel : [ SCEN1.channel, SCEN1.channel2 ] }), 
				"and that they match what we expect"
				);
	}

	
	asyncTest('DELETE CHANNEL', function() {
		$.when(api.sDeleteChannel(SCEN1.accessToken, SCEN1.channel2.id))
		.then(api.CHECK.successNoContent)
		.then(fetchAndCheckChannels)
		.then(start);

	});

	function fetchAndCheckChannels(data) {
		return $.when(api.sFetchOwnerChannels(SCEN1.accessToken))
		.then(api.CHECK.success)
		.then(checkOneChannel);
	}

	function checkOneChannel(data) {
		equal(data.channel.length, 1, "only one channel remains");
		equal(SCEN1.channel.id, data.channel[0].id, "the correct channel is remaining");
	}

	asyncTest('CREATE ANOTHER SECOND CHANNEL', hlpr.createChannelF(SCEN1, 'channel2'));

	asyncTest('GET MESSAGES ON CHANNEL THAT HAS NO MESSAGES', function() {
		$.when(api.sFetchMessages(SCEN1.accessToken, SCEN1.channel2.id))
		.then(api.CHECK.success)
		.then(checkNoMsgs)
		.then(start);
		
		function checkNoMsgs(data) {
			equal(data.message.length, 0,
					"we shouldn't get anything back");
			equal(data.more, false, "there should be no more messages");
			ok(true, JSON.stringify(data));
		}
	});

	asyncTest('VERIFY EMAIL ADDRESS', hlpr.verify(SCEN1));
		
	asyncTest('FORGOT PASSWORD', hlpr.forgotPassword(SCEN1));
	
	asyncTest('FORGOT PASSWORD UNKNOWN EMAIL', hlpr.forgotPassword(SCEN1, "invalidemail@invalid.edu", api.CHECK.notFound));

	//TODO: RESET PASSWORD

	asyncTest('SEND A MESSAGE', hlpr.broadcast(SCEN1, 'channel2', 'HERE IS A TEST MESSAGE ON CHANNEL 2'));
	
	asyncTest('GET MESSAGES ON CHANNEL', hlpr.fetchMsgs(SCEN1,SCEN1, 'channel2'));

	//TODO fix race condition... msg_alert_com is being created on the back end when msg_alert has already been removed by a channel deletion

	asyncTest('DELETE CHANNEL WITH MESSAGES', function() {
		$.when(api.sDeleteChannel(SCEN1.accessToken, SCEN1.channel2.id))
		.then(api.CHECK.successNoContent)
		.then(fetchAndCheckChannels)
		.then(start);
	});

	function testCreateChannelWithFail(accessToken, checkFuncOvd, chnlOvd) {
		var channel = chnlOvd ? chnlOvd : api.generateChannel();
		$.when(api.sCreateChannel(accessToken, channel))
		.then(checkFuncOvd ? checkFuncOvd : api.CHECK.unauthorized)
		.then(start);
	}
	
	asyncTest('CREATE CHANNEL WITH NO AUTH', function() {
		testCreateChannelWithFail(undefined);
	});
		
	asyncTest('CREATE CHANNEL WITH EMPTY AUTH', function() {
		testCreateChannelWithFail('');
	});

	asyncTest('CREATE CHANNEL WITH BAD AUTH', function() {
		testCreateChannelWithFail('asdfasdf', api.CHECK.badRequest);
	});

	asyncTest('CREATE DUPLICATE CHANNEL', function() {
		testCreateChannelWithFail(SCEN1.accessToken, api.CHECK.badRequest, SCEN1.channel);
	});

	asyncTest('CREATE ANOTHER COM METHOD', hlpr.createComMethod(SCEN1, "-2"));
	
	asyncTest('CREATE A THIRD COM METHOD', hlpr.createComMethod(SCEN1, "-3"));
	
	asyncTest('DELETE THE THIRD COM METHOD', hlpr.deleteComMethod(SCEN1, "-3"));
	
	asyncTest('VERIFY EMAIL ADDRESS', hlpr.verify(SCEN1,"-2"));

	
	//TODO
	/*
	test('MODIFY CHANNEL NAME', function() {
		ok(false, "not yet implemented");
	});
	*/

})();
