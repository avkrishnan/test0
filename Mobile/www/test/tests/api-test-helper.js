﻿//App.hlpr = new ApiTestHelper();

function ApiTestHelper() {

  var t = this;

  t.TestScenario = function() {
    return {
      ES : ServiceContext(t.genMockLocalStorage())
    };
  };

  t.genMockLocalStorage = function() {
    var ls = {};
    ls.setItem = function(key, val) {
      this[key] = val + '';
    };
    ls.getItem = function(key) {
      return this[key];
    };
    return ls;
  };

  function checkFunc(expectedStatus) {
    return function(data, status) {
      equal(status, expectedStatus, "data: " + JSON.stringify(data));
      return data;
    };
  }

  t.CHECK = {
    success : checkFunc("success"),// "200: OK"),
    created : checkFunc("success"),// "201: Created"),
    successNoContent : checkFunc("nocontent"),// "204: No Content"),
    badRequest : checkFunc("400"),// "400: Bad Request"),
    unauthorized : checkFunc("401: Unauthorized"),
    notFound : checkFunc("404: Not Found"),
    notImplemented : checkFunc("501: Not Implemented"),
    shouldNotSucceed : function() { ok(false, 'this call should not have succeeded'); },
    shouldNotFail : function() { ok(false, 'this call should not have failed'); }
  };

  t.randomAccountname = function() {
    return 'test-' + randomString(8);
  };

  t.generateEmail = function(localName) {
    return localName + '@rs7292.mailgun.org';
  };

  t.generateAccount = function() {
    var strAccountname = t.randomAccountname();
    return {
      accountname : strAccountname,
      emailaddress : t.generateEmail(strAccountname),
      password : 'secretPasswordThing',
      firstname : 'testFirst',
      lastname : 'testLast'
    };
  };

  t.generateLogin = function(account) {
    return {
      accountname : account.accountname,
      password : account.password,
      appToken : 'sNQO8tXmVkfQpyd3WoNA6_3y2Og='
    };
  };

  t.generateChannel = function() {
    var nm = 'testchannel-' + randomString(5);
    return {
      name : nm,
      description : 'Channel description for ' + nm,
      longDescription : 'Long channel description for ' + nm
    };
  };

  t.generateCommunicationMethodUrgentSMS = function(channelId) {
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
      text += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));

    return text;
  }

  t.randomStr = randomString;

  t.enroll = function(scenario, account) {
    return function() {
      scenario.account = account ? account : t.generateAccount();
      scenario.account.accountname = scenario.account.accountname.toLowerCase();
      $.when(scenario.ES.loginService.accountEnroll(scenario.account)).then(
          t.CHECK.successNoContent, t.CHECK.shouldNotFail).then(start);
    };
  };

  t.checkLogin = function(scenario) {
    return function(data) {
      ok(data, 'data returned');
      ok(data.accessToken, 'should have access token');
      ok(data.account, 'should have account');
      equal(scenario.account.accountname, data.account.accountname, 'accountnames match');
      equal(data.accessToken.length, 32, 'access token should be 32 characters');
      // scenario.accessToken = data.accessToken;
      scenario.ES.evernymService.setAccessToken(data.accessToken);
    };
  };

  t.login = function(scenario) {
    return function() {
      scenario.login = t.generateLogin(scenario.account);
      $.when(scenario.ES.loginService.accountLogin(scenario.login)).then(t.CHECK.success).then(
          t.checkLogin(scenario)).then(start);
    };
  };

  t.checkEqualC = function(exp, attribs) { // C = Constrained by the attributes
    // supplied, or by the attributes of
    // exp
    return function(act) {
      console.log("checking equality: " + JSON.stringify(exp) + " and " + JSON.stringify(act));
      var keys = attribs ? attribs : Object.keys(exp);
      keys.forEach(function(attr) {
        console.log(attr);
        if (exp.hasOwnProperty(attr))
          equal(act[attr], exp[attr], attr + " matches");
      });
    };
  };

  t.recordChannelF = function(scenario, chnlKey) {
    return function(chnl) {
      scenario[chnlKey] = chnl;
      return chnl;
    };
  };

  t.fetchChannelAndCheckF = function(scenario, chnlKey, comp) {
    return function(data) {
      return $.when(scenario.ES.channelService.getChannel(scenario[chnlKey].id)).then(
          t.CHECK.success).then(t.checkEqualC(comp ? comp : scenario[chnlKey]));
    };
  };

  t.createChannelF = function(scenario, chnlKey) {
    return function() {
      channel = t.generateChannel();
      $.when(scenario.ES.channelService.createChannel(channel)).then(t.CHECK.created).then(
          t.recordChannelF(scenario, chnlKey)).then(t.fetchChannelAndCheckF(scenario, chnlKey))
          .then(start);
    };
  };

  t.followChannel = function(scenario, ownerScenario, chnlKey) {
    return function() {
      $.when(scenario.ES.channelService.followChannel(ownerScenario[chnlKey].id)).then(
          t.CHECK.success).then(start);
    };
  };

  t.broadcast = function(scenario, chnlKey, msgText, urgencyId) {
    return function() {
      scenario.msg = {
        text : msgText + ' ' + t.randomStr(8),
        type : 'FYI',
        urgencyId : urgencyId == undefined ? 'N' : urgencyId
      };
      $.when(scenario.ES.messageService.createChannelMessage(scenario[chnlKey].id, scenario.msg))
          .then(t.CHECK.created).then(start);
    };
  };

  t.fetchMsgs = function(scenario, ownerScenario, chnlKey) {
    return function() {
      $.when(scenario.ES.messageService.getChannelMessages(ownerScenario[chnlKey].id)).then(
          t.CHECK.success).then(checkOneMsgFunc(scenario, ownerScenario.msg)).then(start);
    };
  };

  function checkOneMsgFunc(scenario, msg) {
    return function checkOneMsg(data) {
      equal(data.message.length, 1, "we get one message back");
      equal(data.message[0].text, msg.text, "and the text matches");
      equal(data.more, false, "there should be no more messages");
      scenario.msg = data.message[0]
      ok(true, JSON.stringify(data));
    };
  }

  t.verify = function(scenario, localNameSuffix) {
    return function() {
      var emailaddress = scenario.account.emailaddress;
      if (localNameSuffix != undefined) {
        emailaddress = scenario["email" + localNameSuffix].address;
      }
      $.when(api.checkEmailAndVerify(scenario.accessToken, emailaddress)).then(start);
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
      $.when(api.checkEmail(scenario.account.emailaddress)).then(t.regexFinder(msgText))
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
      $.when(api.sCreateComMethod(scenario.accessToken, comMethod)).then(t.CHECK.created).then(
          function(data) {
            scenario[cmName] = data;
          }).then(start);
    };
  };

  t.createPushComMethod = function(scenario, address, localNameSuffix) {
    return function() {
      var cmName = "push" + localNameSuffix;
      var comMethod = {
        name : cmName,
        type : "PUSH",
        address : address
      };
      $.when(api.sCreateComMethod(scenario.accessToken, comMethod)).then(t.CHECK.created).then(
          function(data) {
            scenario[cmName] = data;
          }).then(start);
    };
  };

  t.deleteComMethod = function(scenario, localNameSuffix) {
    return function() {
      var cmName = "email" + localNameSuffix;
      var email = scenario[cmName];
      $.when(api.sDeleteComMethod(scenario.accessToken, email.id)).then(t.CHECK.successNoContent)
          .then(start);
    };
  };

  t.forgotPassword = function(scenario, ovrdEmailAddress, ovrdCHECK) {
    return function() {
      var fpRequest = {
        accountname : scenario.account.accountname,
        emailAddress : ovrdEmailAddress ? ovrdEmailAddress : scenario.account.emailaddress
      };
      $.when(api.sForgot(fpRequest)).then(ovrdCHECK ? ovrdCHECK : t.CHECK.successNoContent).then(
          start);
    };
  };

}