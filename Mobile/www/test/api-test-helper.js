//App.hlpr = new ApiTestHelper();

function ApiTestHelper() {

  var t = this;
  var hlpr = this;
  
  t.is_empty = function(obj) {

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
  };
  
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
  var apiver = (q.api == undefined || q.api == "") ? (env.indexOf("dev") > 0 ? "api" : "api24") : q.api;
  var baseUrl = 
    (env === "ldev") ? 'http://localhost:8079/' + apiver + '/rest' :
    (env === "nldev") ? 'https://opty-dev:8079/' + apiver + '/rest' :
    (env === "qdev") ? 'http://qupler.no-ip.org:8079/' + apiver + '/rest' :
    (env === "qprod") ? 'http://qupler.no-ip.org:8080/' + apiver + '/rest' : 
    (env === "lprod") ? 'http://app01:8080/' + apiver + '/rest' :
    (env === "prod") ? 'https://api.evernym.com/' + apiver + '/rest' :
    'https://api.evernym.com/' + apiver + '/rest';

  t.TestScenario = function() {
    return {
      ES : ServiceContext(t.genMockLocalStorage(), baseUrl)
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
    ls.removeItem = function(key) {
      delete this[key];
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
    badRequest : checkFunc("400"),// : Bad Request"),
    unauthorized : checkFunc("401"),// : Unauthorized"),
    forbidden : checkFunc("403"),// : Forbidden"),
    notFound : checkFunc("404"),//: Not Found"),
    notImplemented : checkFunc("501"),//: Not Implemented"),
    shouldNotSucceed : function(a,b,c,d) { 
      ok(false, 'this call should not have succeeded: ' + a + b + c + d); 
    },
    shouldNotFail : function(a,b,c,d) { 
      ok(false, 'this call should not have failed: ' + a + b + c + d); 
    }
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

  t.clone = function(obj) {
    if (null == obj || "object" != typeof obj)
      return obj;
    var copy = obj.constructor();
    for ( var attr in obj) {
      if (obj.hasOwnProperty(attr))
        copy[attr] = obj[attr];
    }
    return copy;
  };
  
  t.randomStr = randomString;

  t.enroll = function(scenario, account) {
    return function() {
      scenario.account = account ? account : t.generateAccount();
      scenario.account.accountname = scenario.account.accountname.toLowerCase();
      $.when(scenario.ES.loginService.accountEnroll(scenario.account))
      .then(t.CHECK.success, t.CHECK.shouldNotFail)
      .then(start,start);
    };
  };

  t.checkLogin = function(scenario, expectPrivs) {
    return function(data) {
      ok(data, 'data returned');
      ok(data.accessToken, 'should have access token');
      ok(data.account, 'should have account');
      if (expectPrivs !== undefined) {
        if (expectPrivs == true) {
          ok(data.privs, 'should have privs attribute');
        }
        if (expectPrivs == false) {
          ok(data.privs == undefined, 'should not have privs attribute');
        }
      }
      equal(scenario.account.accountname, data.account.accountname, 'accountnames match');
      equal(data.accessToken.length, 32, 'access token should be 32 characters');
      // scenario.accessToken = data.accessToken;
      scenario.ES.evernymService.setAccessToken(data.accessToken);
    };
  };

  t.login = function(scenario, expectPrivs) {
    return function() {
      scenario.login = t.generateLogin(scenario.account);
      $.when(scenario.ES.loginService.accountLogin(scenario.login))
      .then(t.CHECK.success,t.CHECK.shouldNotFail)
      .then(t.checkLogin(scenario, expectPrivs),t.CHECK.shouldNotFail)
      .then(start,start);
    };
  };

  t.logout = function(scenario) {
    return function() {
      $.when(scenario.ES.loginService.accountLogout())
      .then(t.CHECK.successNoContent,t.CHECK.shouldNotFail)
      .then(start,start);
    };
  };

  t.changePassword = function(scenario, newPassword) {
    return function() {
      var newPword = 'newpword-' + randomString(5);
      var pcr = {
        currentPassword: scenario.account.password,
        newPassword: newPword
      };
      $.when(scenario.ES.loginService.changePassword(pcr))
      .then(t.CHECK.successNoContent,t.CHECK.shouldNotFail)
      .then(function() { scenario.account.password = newPword; },t.CHECK.shouldNotFail)
      .then(start,start);
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
      return $.when(scenario.ES.channelService.getChannel(scenario[chnlKey].id))
        .then(t.CHECK.success)
        .then(t.checkEqualC(comp ? comp : scenario[chnlKey]));
    };
  };

  t.createChannelF = function(scenario, chnlKey) {
    return function() {
      channel = t.generateChannel();
      $.when(scenario.ES.channelService.createChannel(channel))
      .then(t.CHECK.created)
      .then(t.recordChannelF(scenario, chnlKey))
      .then(t.fetchChannelAndCheckF(scenario, chnlKey))
      .then(start);
    };
  };

  t.followChannel = function(scenario, ownerScenario, chnlKey, ovrdSuccess, ovrdFail) {
    return function() {
      $.when(scenario.ES.channelService.followChannel(ownerScenario[chnlKey].id))
      .then(ovrdSuccess === undefined ? t.CHECK.successNoContent : ovrdSuccess, ovrdFail === undefined ? t.CHECK.shouldNotFail : ovrdFail)
      .then(start,start);
    };
  };

  t.inviteFollower = function(scenario, chnlKey, invitation, ovrdSuccess, ovrdFail) {
    return function() {
      var inv = typeof invitation === "function" ? invitation() : invitation;
      $.when(scenario.ES.channelService.invite(scenario[chnlKey].id, inv))
      .then(ovrdSuccess === undefined ? t.CHECK.success : ovrdSuccess, ovrdFail === undefined ? t.CHECK.shouldNotFail : ovrdFail)
      .then(function(data) { scenario.lastInvite = data; })
      .then(start,start);
    };
  };

  function build(func, shouldFail) {
    var success = shouldFail == true ? t.CHECK.shouldFail : t.CHECK.successNoContent;
    var fail =  shouldFail == true ? t.CHECK.badRequest : t.CHECK.shouldNotFail;
    return function() {
      $.when(func())
      .then(success,fail)
      .then(start,start);
    };
  }

  t.unfollowChannel = function(scenario, ownerScenario, chnlKey, shouldFail) {
    return build(function() {return scenario.ES.channelService.unfollowChannel(ownerScenario[chnlKey].id);}, shouldFail);
  };

//  t.unfollowChannel = function(scenario, ownerScenario, chnlKey, shouldFail) {
//    var success = shouldFail == true ? t.CHECK.shouldFail : t.CHECK.successNoContent;
//    var fail =  shouldFail == true ? t.CHECK.badRequest : t.CHECK.shouldNotFail;
//    return function() {
//      $.when(scenario.ES.channelService.unfollowChannel(ownerScenario[chnlKey].id))
//      .then(t.CHECK.successNoContent, t.CHECK.shouldNotFail)
//      .then(success,fail)
//      .then(start,start);
//    };
//  };

  t.addFollower = function(scenario, followerScenario, chnlKey, shouldFail) {
    return build(function() { return scenario.ES.channelService.addFollower(scenario[chnlKey].id, followerScenario.account.accountname);}, shouldFail);
  };
  
  t.removeFollower = function(scenario, followerScenario, chnlKey, shouldFail) {
    return build(function() { return scenario.ES.channelService.removeFollower(scenario[chnlKey].id, followerScenario.account.accountname);}, shouldFail);
  };
  
  t.sendMsg = function(senderScen, chnlHolder, chnlKey, msgText, replyToMsgHolder, escLevelId, escUntil, ovrdType, ovrdSuccess, ovrdFail) {
    return function() {
      senderScen.msg = {
        text: msgText + ' ' + t.randomStr(8),
        type: ovrdType == undefined ? 'FYI' : ovrdType,
        escLevelId: escLevelId == undefined ? 'N' : escLevelId,
        escUntil: escUntil,
        responseToMsgId: replyToMsgHolder == undefined ? undefined : replyToMsgHolder.msg.id
      };
      console.log('sending message: ' + senderScen.msg.text);
      $.when(senderScen.ES.messageService.createChannelMessage(chnlHolder[chnlKey].id, senderScen.msg))
      .then(ovrdSuccess != undefined ? ovrdSuccess : t.CHECK.created, ovrdFail != undefined ? ovrdFail : t.CHECK.shouldNotFail)
      .then(ovrdSuccess != undefined ? null : function(data) {senderScen.msg = data;}, ovrdFail != undefined ? null : t.CHECK.shouldNotFail)
      .then(start, start);
    };
  };

  t.reply = function(senderScen, chnlHolder, chnlKey, msgText, replyToMsgHolder) {
    return t.sendMsg(senderScen, chnlHolder, chnlKey, msgText, replyToMsgHolder);
  };
  
  t.broadcast = function(scenario, chnlKey, msgText, escLevelId, escUntil, ovrdType, success, fail) {
    return t.sendMsg(scenario, scenario, chnlKey, msgText, null, escLevelId, escUntil, ovrdType, success, fail);
  };

  t.fetchMsgsAsOwner = function(scenario, ownerScenario, chnlKey, extraCheck, checkAck) {
    return function() {
      $.when(scenario.ES.messageService.getChannelMessages(ownerScenario[chnlKey].id))
      .then(t.CHECK.success, t.CHECK.shouldNotFail)
      .then(checkOneMsgFunc(scenario, ownerScenario.msg, checkAck), t.CHECK.shouldNotFail)
      .then(extraCheck == undefined ? null : extraCheck, t.CHECK.shouldNotFail)
      .then(start, start);
    };
  };

  function checkOneMsgFunc(scenario, msg, checkAck) {
    return function checkOneMsg(data) {
      equal(data.message.length, 1, "we get one message back");
      equal(data.message[0].text, msg.text, "and the text matches");
      equal(data.more, false, "there should be no more messages");
      scenario.msg = data.message[0];
      if (checkAck !== undefined) {
        equal(scenario.msg.acks, checkAck.acks, "ack count is correct");
        equal(scenario.msg.noacks, checkAck.noacks, "noack count is correct");
      }
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
      $.when(api.checkEmail(scenario.account.emailaddress))
      .then(t.regexFinder(msgText))
      .then(start);
    };
  };

  t.createEmail = function(scenario, name) {
    return function() {
      var emailAddress = t.generateEmail(scenario.account.accountname);
      name = name == undefined ? "email" : name;
      var comMethod = {
        name : name,
        type : "EMAIL",
        address : emailAddress
      };
      $.when(scenario.ES.commethodService.addCommethod(comMethod))
      .then(t.CHECK.created,t.CHECK.shouldNotFail)
      .then( function(data) {
          scenario[name] = data;
        },t.CHECK.shouldNotFail)
      .then(start,start);
    };
  };

  t.createPushComMethod = function(scenario, address, name) {
    return function() {
      var comMethod = {
        name : name,
        type : "PUSH",
        address : address
      };
      $.when(scenario.ES.commethodService.addCommethod(comMethod))
      .then(t.CHECK.created, t.CHECK.shouldNotFail)
      .then( function(data) {
          scenario[name] = data;
        }, t.CHECK.shouldNotFail)
      .then(start, start);
    };
  };

  t.createTextComMethod = function(scenario, address, name) {
    return function() {
      var comMethod = {
        name : name,
        type : "TEXT",
        address : address
      };
      $.when(scenario.ES.commethodService.addCommethod(comMethod))
      .then(t.CHECK.created, t.CHECK.shouldNotFail)
      .then( function(data) {
          scenario[name] = data;
        }, t.CHECK.shouldNotFail)
      .then(start, start);
    };
  };

  t.deleteCommethod = function(scenario, name) {
    return function() {
      var cm = scenario.cm[name];
      $.when(scenario.ES.commethodService.deleteCommethod(cm.id))
      .then(t.CHECK.successNoContent, t.CHECK.shouldNotFail)
      .then(start, start);
    };
  };

  t.getCommethods = function(scenario) {
    return function() {
      $.when(scenario.ES.commethodService.getCommethods())
      .then(t.CHECK.success, t.CHECK.shouldNotFail)
      .then( function(data) {
          scenario.cm = {};
          data.commethod.forEach(function(item) {scenario.cm[item.name] = item;});
        }, t.CHECK.shouldNotFail)
      .then(start, start);
    };
  };

  t.forgotPassword = function(scenario, ovrdEmailAddress, ovrdCHECK) {
    return function() {
      var fpRequest = {
        accountname : scenario.account.accountname,
        emailAddress : ovrdEmailAddress ? ovrdEmailAddress : scenario.account.emailaddress
      };
      $.when(api.sForgot(fpRequest))
      .then(ovrdCHECK ? ovrdCHECK : t.CHECK.successNoContent, t.CHECK.shouldNotFail)
      .then(start, start);
    };
  };

  t.checkFollowCount = function(scenario, count, channelIdentifier) {
    return function() {
      var chnlId = channelIdentifier == undefined ? 'channel' : channelIdentifier;
      $.when(scenario.ES.channelService.getChannel(scenario[chnlId].id))
      .then(t.CHECK.success, t.CHECK.shouldNotFail)
      .then(function(data) {
          equal(data.followers,count);
        }, t.CHECK.shouldNotFail)
      .then(start, start);
    };
  };
  
  function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
   }

  /*
   * followScen: Scenario of follower; makes the call to get message notifications
   * msgHolder: Usually msg sender scenario; object with a 'msg' attribute; msg.text used to match with notif
   * expectedNotifCount: Expected notification count
   */
  t.checkNotif = function(followScen, msgHolder, expectedNotifCount) {
    return function() {
      $.when(followScen.ES.systemService.getMsgNotifs())
      .then(t.CHECK.success, t.CHECK.shouldNotFail)
      .then(function(data) {
          var find;
          if (msgHolder == undefined) {
            find = data.messagealert;
          } else {
            console.log("searching for msg in notifs: " + msgHolder.msg.text);
            find = data.messagealert.filter(function(item) { return (item.text == msgHolder.msg.text); });
          }
          console.log("found: " + find.length);
          
          var exp = expectedNotifCount;
          if (isFunction(expectedNotifCount)) {
            exp = expectedNotifCount();
          }
          equal(find.length, exp, "we expect to find " + exp + " entry");
        }, t.CHECK.shouldNotFail)
      .then(start, start);
    };
  };

  /*
   * 
  t.checkNotifSmry = function(rcvrScen, expectedNotifChange, useCache) {
    return function() {
      val func = useCache ? rcvrScen.ES.systemService.getMsgNotifsSmry_C : rcvrScen.ES.systemService.getMsgNotifsSmry;
      $.when(func())

   * 
   */
  
  
  t.checkNotifSmry = function(rcvrScen, expectedNotifChange, useCache) {
    return function() {
      var func = (useCache==true) ? rcvrScen.ES.systemService.getMsgNotifsSmry_C : rcvrScen.ES.systemService.getMsgNotifsSmry;
      $.when(func())
      .then(t.CHECK.success, t.CHECK.shouldNotFail)
      .then(function(data) {
          if (expectedNotifChange != undefined) {
            equal(data.unreadCount - rcvrScen.smry.unreadCount, 
                expectedNotifChange, 
                "we expect to find a change of " + expectedNotifChange + 
                "; old count: " + rcvrScen.smry.unreadCount + 
                ", new count: " + data.unreadCount);
//            ok(data.unreadLastCreated !== rcvrScen.smry.unreadLastCreated, 
//                "we expect the unreadLastCreated date to change");
          }
          rcvrScen.smry = {
            unreadCount: data.unreadCount,
            unreadLastCreated: data.unreadLastCreated
          };
        }, t.CHECK.shouldNotFail)
      .then(start, start);
    };
  };

  t.read = function(followScen, msgHolder) {
    return function() {
      $.when(followScen.ES.messageService.readMsg(msgHolder.msg.id))
      .then(t.CHECK.successNoContent, t.CHECK.shouldNotFail)
      .then(start, start);
    };
  };  

  t.acknowledge = function(followScen, msgHolder) {
    return function() {
      $.when(followScen.ES.messageService.acknowledgeMsg(msgHolder.msg.id))
      .then(t.CHECK.successNoContent, t.CHECK.shouldNotFail)
      .then(start, start);
    };
  };  

  t.fetchMsgRecips = function(scenario, chnlAttribName, recipScenario, igiFilter) {
    return function() {
      $.when(scenario.ES.messageService.getMessageRecipients(scenario[chnlAttribName].id, scenario.msg.id, igiFilter))
      .then(t.CHECK.success, t.CHECK.shouldNotFail)
      .then(function(data) {
        ok(data.recipients != undefined);
        var find = data.recipients.filter(function(item) { return (item.rcvrAccountname == recipScenario.account.accountname); });
          console.log("found: " + find.length);
          equal(find.length, 1, "we expect to find the recipient");
        }, t.CHECK.shouldNotFail)
      .then(start, start);
    };
  };

  t.checkChnlMsgsForFlwr = function(scenario, chnlHolder, chnlAttribName, extraCheck) {
    return function() {
      $.when(scenario.ES.messageService.getChannelMessagesForFollower(chnlHolder[chnlAttribName].id))
      .then(t.CHECK.success, t.CHECK.shouldNotFail)
      .then(function(data) {
        equal(data.messagealert.length, 1, "we should find one entry");
        }, t.CHECK.shouldNotFail)
      .then(extraCheck == undefined ? null : extraCheck, t.CHECK.shouldNotFail)
      .then(start, start);
    };
  };
  

  t.testjason20 = {
    accountname : "TEST|jason20",
    emailaddress : "jason+20@lawcasa.com",
    firstname : "Jason",
    lastname : "Law",
    password : "testtest"
  };

  t.testjason21 = {
      accountname : "TEST|jason21",
      emailaddress : "jason+21@lawcasa.com",
      firstname : "Jason",
      lastname : "Law",
      password : "testtest"
    };

  t.testjason22 = {
      accountname : "TEST|jason22",
      emailaddress : "jason+22@lawcasa.com",
      firstname : "Jason",
      lastname : "Law",
      password : "testtest"
    };

  t.testtimothy = {
      accountname : "TEST|timothy.ruff",
      password : "password"
    };

  t.waitToStart = function(millis) { 
    return function() { setTimeout( function(){ expect(0); start(); }, millis == undefined ? 1000 : millis); };
  };
  
  t.checkEmail = function(eSvc, emailAddress) {

    var dfd = $.Deferred();
    var waitTime = 2000; //in milliseconds
    var times = 0;
    var m = 50;

    var fail = function() {
      times++;
      console.log('no email yet; tried ' + times + ' times');
      if (times < m) {
        //this recurses
        setTimeout(getEmail,waitTime);
      } else {
        //this stops the recursion
        console.log('max times reached.');
        dfd.reject();
      }
    };
    
    var getEmail = function() {
      $.when(eSvc.callAPI('GET', '/test/msg/' + emailAddress))
        .then(dfd.resolve, fail); //fail is recursive with getEmail
    };

    getEmail();

    return dfd.promise();
  };

  //var uuidPattern = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

  //"stripped-html" : "<div style=\"font-family:Arial, Helvetica, sans-serif; background:#f1f2f2; overflow:hidden; border-radius:10px; padding:20px 0 20px 20px;\">\r\n\r\n\t<img src=\"https://www.evernym.com/images/Email-chan-1.png\" alt=\"Evernym icon\" title=\"Channel icon\" style=\"color:#8DC63F; line-height:42px; padding:0 10px 0 2px; float:left;\">\r\n\t<div style=\"background:#2D2D2D; border-radius:20px 0 0 20px; line-height:40px; color:#8DC63F; margin:0 0 0 3px; font-size:20px;\"> \r\n\t\t<strong style=\"color:#8DC63F; font-size:20px; line-height:42px; font-weight:normal;\">testchannel-mZ7sR</strong>\r\n\t</div>\r\n\t\r\n\t<div style=\"background:#fff; padding:15px 10px 15px 10px; margin:20px 20px 20px 0; border-radius:4px;\">\r\n\t\t<div style=\"font-size:16px; color:#000;\">\r\n\t\t\t<span>testFirst testLast has invited you to follow <em style=\"color:#8DC63F; font-style:normal;\">testchannel-mZ7sR</em>.</span>\r\n\t\t\t<span style=\"display:block; margin-top:10px;\">Please Accept or Decline this invitation.</span>\r\n\t\t</div>\r\n\t</div>\r\n\t\r\n\t<div style=\"font-size:16px; margin:0 20px 10px 0; float:right;\">\t\t\r\n\t\t<a href=\"https://api.evernym.com/api24/rest/invite/accept?id=06aa3c5a-a641-4648-9ebb-18a9166f84d7e1f978f6-ba00-4865-b2a0-cd584f8d35bd\" style=\"text-decoration:none; color:#fff; background:#8DC63F; padding:4px 12px; border-radius:4px;\">Accept</a>\r\n\t\t<a href=\"https://api.evernym.com/api24/rest/invite/decline?id=06aa3c5a-a641-4648-9ebb-18a9166f84d7\" style=\"text-decoration:none; color:#fff; background:#d43232; padding:4px 12px; border-radius:4px; margin-left:10px;\">Decline</a>\r\n\t</div>\r\n\t\r\n\t<div style=\"font-size:16px; margin:0 20px 0 0; clear:both; text-align:center; color:#414141;\">BETA</div>\r\n</div>\r\n\r\n<div style=\"overflow:hidden; margin:30px 20px 0 20px;\">\r\n\t<img src=\"https://www.evernym.com/images/logo.png\" alt=\"Evernym Logo\" alt=\"Evernym Logo\" title=\"Evernym Logo\" style=\"float:left; padding:0 25px 15px 10px;\" >\r\n\t\r\n\t<div style=\"font-size:13px; font-family:Arial, Helvetica, sans-serif;\">\r\n\t\t<span style=\"color:#414141;\">Know they know&trade; with<em style=\"font-style:normal; color:#8DC63F;\"> Evernym Channels</em>, the fast, free way to be sure everyone gets your message.</span>\r\n\t\t<span style=\"display:block; color:#414141;\">Change how I receive messages from<em style=\"font-style:normal; color:#8DC63F;\"> testchannel-mZ7sR </em><a href=\"https://app.evernym.com/dev/index.html#privacyPolicyView\" style=\" text-decoration:none; color:#8DC63F;\">Privacy Policy</a></span>\r\n\t</div>\r\n\t\r\n</div>",

  hlpr.checkVerifCode = function(scenario, ovrdUrlTail) {
    return function(data) {
      var text = data.dtlsMap['stripped-html'];
      urlTail = ovrdUrlTail == undefined ? 'verify' : ovrdUrlTail;
      var re = new RegExp('"(http.*' + urlTail + '\\?id=.*?)"', 'ig');
      var urls = re.exec(text);
      ok(Array.isArray(urls));
      equal(urls.length,2);
      var url = urls[1];

      scenario.verif = {};

      /*
      var grps = (/code: (\d{6})/ig).exec(text);
      ok(Array.isArray(grps));
      equal(grps.length,2);
      var code = grps[1];
      scenario.verif.code = code;
      */
      scenario.verif.url = url;
    };
  };
  
  hlpr.checkVerifEmail = function(scenario, ovrdESvc, ovrdEmail, ovrdUrlTail) {
    return function () {
      $.when(hlpr.checkEmail(ovrdESvc == undefined ? scenario.ES.evernymService : ovrdESvc, ovrdEmail == undefined ? scenario.account.emailaddress : ovrdEmail))
      .then(hlpr.checkVerifCode(scenario, ovrdUrlTail), hlpr.CHECK.shouldNotFail)
      .then(start,start);
    };
  };


  hlpr.clickVerifyLink = function(scenario, ovrdSearchStr) {
    return function() {
      $.get(scenario.verif.url)
      .then(hlpr.CHECK.success, hlpr.CHECK.shouldNotFail)
      .then(function(data) {
        var re = new RegExp(ovrdSearchStr  == undefined ? 'Verified successfully' : ovrdSearchStr, 'ig');
        var arr = re.exec(data);
        ok(Array.isArray(arr) && arr.length > 0, 'verified string is found in response');
      }, hlpr.CHECK.shouldNotFail)
      .then(start, start);
    };
  };
  
};
