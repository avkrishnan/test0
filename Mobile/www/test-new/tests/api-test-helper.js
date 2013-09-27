//App.hlpr = new ApiTestHelper();

function ApiTestHelper(api) {

	var t = this;
	
	t.enroll = function(scenario,account) {
		return function() {
			scenario.account = account ? account : api.generateAccount();
			scenario.account.accountname = scenario.account.accountname.toLowerCase();
			$.when(api.sEnroll(scenario.account))
			.then(api.CHECK.successNoContent)
			.then(start);
		};
	};

	t.checkLogin = function(scenario) {
		return function(data) {
			ok(data, 'data returned');
			ok(data.accessToken, 'should have access token');
			ok(data.account, 'should have account');
			equal(scenario.account.accountname, data.account.accountname, 'accountnames match');
			equal(data.accessToken.length, 32, 'access token should be 32 characters');
			scenario.accessToken = data.accessToken;
		};
	};

	t.login = function(scenario) {
		return function() {
			scenario.login = api.generateLogin(scenario.account);
			$.when(api.sLogin(scenario.login))
			.then(api.CHECK.success)
			.then(t.checkLogin(scenario))
			.then(start);
		};
	};

	t.checkEqualC = function(exp,attribs) { //C = Constrained by the attributes supplied, or by the attributes of exp 
		return function(act) {
			console.log("checking equality: " + JSON.stringify(exp) + " and " + JSON.stringify(act));
			var keys = attribs ? attribs : Object.keys(exp);
		    keys.forEach(function (attr) {
		    	console.log(attr);
		        if (exp.hasOwnProperty(attr)) equal(act[attr], exp[attr], attr + " matches");
		    });
		};	
	};
	
	t.recordChannelF = function(scenario,chnlKey) {
		return function (chnl) {
			scenario[chnlKey] = chnl;
			return chnl;
		};		
	};
	
	t.fetchChannelAndCheckF = function(scenario, chnlKey, comp) {
		return function (data) {
			return $.when(api.sFetchChannel(scenario.accessToken, scenario[chnlKey].id))
				.then(api.CHECK.success)
				.then(t.checkEqualC(comp ? comp : scenario[chnlKey]));
		};
	};

	t.createChannelF = function(scenario,chnlKey) {
		return function() {
			channel = api.generateChannel();
			$.when(api.sCreateChannel(scenario.accessToken, channel))
			.then(api.CHECK.created)
			.then(t.recordChannelF(scenario,chnlKey))
			.then(t.fetchChannelAndCheckF(scenario,chnlKey))
			.then(start);
		};
	};

	t.followChannel = function(scenario, ownerScenario, chnlKey) {
		return function() {
			$.when(api.followChannel(scenario.accessToken, ownerScenario[chnlKey].id))
			.then(api.CHECK.success)
			.then(start);
		};
	};
	
	t.broadcast = function(scenario, chnlKey, msgText, urgencyId) {
		return function() {
			scenario.msg = {
					text : msgText + ' ' + api.randomStr(8),
					type : 'FYI',
					urgencyId : urgencyId == undefined ? 'N' : urgencyId
			};
			$.when(api.sSendMessage(scenario.accessToken, scenario[chnlKey].id, scenario.msg))
			.then(api.CHECK.created)
			.then(start);		
		};
	};
	
	t.fetchMsgs = function(scenario, ownerScenario, chnlKey) {
		return function() {
			$.when(api.sFetchMessages(scenario.accessToken, ownerScenario[chnlKey].id))
			.then(api.CHECK.success)
			.then(checkOneMsgFunc(ownerScenario.msg))
			.then(start);
		};
	};
	
	function checkOneMsgFunc(msg) {
		return function checkOneMsg(data) {
			equal(data.message.length, 1, "we get one message back");
			equal(data.message[0].text, msg.text, "and the text matches");
			equal(data.more, false, "there should be no more messages");
			ok(true, JSON.stringify(data));
		};
	}

	

	
	t.verify = function(scenario, localNameSuffix) {
		return function() {
			var emailaddress = scenario.account.emailaddress;
			if (localNameSuffix != undefined) {
				emailaddress = scenario["email" + localNameSuffix].address;
			}
			$.when(api.checkEmailAndVerify(scenario.accessToken, emailaddress))
			.then(start);
		};
	};
	
	t.regexFinder = function(regex) {
		return function(data) {
			var re = ((typeof regex) == "string") ? new RegExp(regex) : regex;
			var r = re.exec(data);
			ok(r != null, "message text found in message");
			return r;
		};
	};
	
	t.findEmail = function(scenario, msgText) {
		return function() {
			$.when(api.checkEmail(scenario.account.emailaddress))
			.then(t.regexFinder(msgText))
			.then(start);
		};
	};

	t.createComMethod = function(scenario, localNameSuffix) {
		return function() {
			var emailAddress = api.generateEmail(scenario.account.accountname + localNameSuffix);
			var cmName = "email" + localNameSuffix;
			var comMethod = {
				name : cmName,
				type : "EMAIL",
				address : emailAddress
			};
			$.when(api.sCreateComMethod(scenario.accessToken, comMethod))
			.then(api.CHECK.created)
			.then(function(data) {scenario[cmName] = data;})
			.then(start);
		};
	};
	
	t.deleteComMethod = function(scenario, localNameSuffix) {
		return function() {
			var cmName = "email" + localNameSuffix;
			var email = scenario[cmName];
			$.when(api.sDeleteComMethod(scenario.accessToken, email.id))
			.then(api.CHECK.successNoContent)
			.then(start);
		};
	};
	

	t.forgotPassword = function(scenario, ovrdEmailAddress, ovrdCHECK) {
		return function() {
			var fpRequest = {
				accountname : scenario.account.accountname,
				emailAddress : ovrdEmailAddress ? ovrdEmailAddress : scenario.account.emailaddress
			};
			$.when(api.sForgot(fpRequest))
			.then(ovrdCHECK ? ovrdCHECK : api.CHECK.successNoContent)
			.then(start);
		};
	};

}
