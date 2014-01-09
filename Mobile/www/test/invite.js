(function() {
  QUnit.config.testTimeout = 8000;
  QUnit.config.reorder = false;


  
  var hlpr = new ApiTestHelper();

  
  
  
  hlpr.getFollowers = function(scenario, chnlKey, check) {
    return function() {
      $.when(scenario.ES.channelService.getFollowers(scenario[chnlKey].id))
      .then(hlpr.CHECK.success, hlpr.CHECK.shouldNotFail)
      .then(check, hlpr.CHECK.shouldNotFail)
      .then(start,start);
    };
  };

  hlpr.checkLastInvited = function(scenario, check) {
    return function(data) {
      var found = data.followers.find(function(item) { return item.accountname === scenario.lastInvite.accountname; });
      ok(found != undefined, 'last invited is found in list of followers');
      check(found);
    };
  };
  
  var checkLastInvitedIsProvisional = function(scenario) {
    return hlpr.checkLastInvited(scenario, function(found) {      
      equal(found.managed, 'Y', 'managed is equal to Y');
    });
  };
  

  var SCEN_A = hlpr.TestScenario();

  asyncTest('A enrolls', hlpr.enroll(SCEN_A));

  asyncTest('A logs in', hlpr.login(SCEN_A));

  asyncTest('A creates channel', hlpr.createChannelF(SCEN_A, 'channel'));

  asyncTest('A checks the channel follower count is zero', hlpr.checkFollowCount(SCEN_A, 0));

  var invitation = {
      //accountname:  
      firstname: 'TEST|Joe', 
      lastname: 'Bobson',
      //emailaddress: 'jason@lawcasa.com',
      emailaddress: hlpr.generateEmail('joebobson'),
      phonenumber: '801-376-3348'
  };

  asyncTest("A's channel follower count is zero", hlpr.checkFollowCount(SCEN_A, 0));

  asyncTest('A invites a provisional follower', hlpr.inviteFollower(SCEN_A, 'channel', invitation));
  
  asyncTest("A's channel follower count is still zero", hlpr.checkFollowCount(SCEN_A, 0));

  
  asyncTest('A checks followers and verifies the invitee is a provisional', hlpr.getFollowers(SCEN_A, 'channel', checkLastInvitedIsProvisional(SCEN_A)));
  
  function modifyLastInvite(scenario, newAccount) {
    return function() {
      $.when(scenario.ES.loginService.accountModifyOther(scenario.lastInvite.accountname, newAccount))
      .then(hlpr.CHECK.successNoContent, hlpr.CHECK.shouldNotFail)
      .then(start,start);
    };
  }

  var newFirst = "newfirstname" + hlpr.randomStr(5);
  var newLast = "newlastname" + hlpr.randomStr(5);
  
  asyncTest('A modifies last invitee name', modifyLastInvite(SCEN_A, {firstname: newFirst, lastname: newLast}));
  
  asyncTest('A checks followers and verifies the name change', hlpr.getFollowers(SCEN_A, 'channel', hlpr.checkLastInvited(SCEN_A, function(found) {      
    equal(found.firstname, newFirst, 'firstname matches');
    equal(found.lastname, newLast, 'lastname matches');
  })));
  
  function getComMethodOfLastInvite(scenario, expCount) {
    return function() {
      $.when(scenario.ES.commethodService.getCommethodsForProvis(scenario.lastInvite.accountname))
      .then(hlpr.CHECK.success, hlpr.CHECK.shouldNotFail)
      .then(function(data) {
        scenario.provisComMethods = data.commethod;
        equal(scenario.provisComMethods.length, expCount, 'number of com methods is ' + expCount);
      }, hlpr.CHECK.shouldNotFail)
      .then(start,start);
    };
  }
    
  function findComMethodOfType(scenario,type) {
    var found = scenario.provisComMethods.find(function(item) { return item.type === type; });
    return found;
  }
  
  function deleteComMethodOfLastInvite(scenario,type) {
    return function() {
      var cm = findComMethodOfType(scenario, type);
      $.when(scenario.ES.commethodService.deleteCommethodForProvis(scenario.lastInvite.accountname, cm.id))
      .then(hlpr.CHECK.successNoContent, hlpr.CHECK.shouldNotFail)
      .then(start,start);
    };
  }
    
  function reqVerifComMethodOfLastInvite(scenario,type) {
    return function() {
      var cm = findComMethodOfType(scenario, type);
      $.when(scenario.ES.commethodService.requestVerificationForProvis(scenario.lastInvite.accountname, cm.id))
      .then(hlpr.CHECK.successNoContent, hlpr.CHECK.shouldNotFail)
      .then(start,start);
    };
  }
    
  function addComMethodOfLastInvite(scenario,cm) {
    return function() {
      $.when(scenario.ES.commethodService.addCommethodForProvis(scenario.lastInvite.accountname, cm))
      .then(hlpr.CHECK.success, hlpr.CHECK.shouldNotFail)
      .then(function(data) {
        debugger;
      }, hlpr.CHECK.shouldNotFail)
      .then(start,start);
    };
  }
    

  asyncTest('A views provisional\'s communication methods and checks count', getComMethodOfLastInvite(SCEN_A, 2)); 
  
  asyncTest('A removes provisional\'s EMAIL communication methods', deleteComMethodOfLastInvite(SCEN_A,'EMAIL')); 

  asyncTest('A views provisional\'s communication methods and checks count', getComMethodOfLastInvite(SCEN_A, 1)); 

  asyncTest('A adds EMAIL communication method to provisional', addComMethodOfLastInvite(SCEN_A, {type: 'EMAIL', address: 'jason@lawcasa.com'}));

  asyncTest('A views provisional\'s communication methods and checks count', getComMethodOfLastInvite(SCEN_A, 2)); 

  asyncTest('A requests verification of provisional\'s EMAIL communication methods', reqVerifComMethodOfLastInvite(SCEN_A,'EMAIL')); 
  
  asyncTest('A invites the same provisional follower again', hlpr.inviteFollower(SCEN_A, 'channel', invitation, hlpr.CHECK.shouldNotSucceed, hlpr.CHECK.badRequest));

  var SCEN_B = hlpr.TestScenario();
  
  asyncTest('B enrolls', hlpr.enroll(SCEN_B));

  asyncTest('B logs in', hlpr.login(SCEN_B));

  asyncTest("B follows A's channel", hlpr.followChannel(SCEN_B, SCEN_A, 'channel'));

  asyncTest("A's channel follower count increases to one", hlpr.checkFollowCount(SCEN_A, 1));

  var invite_overlap = function(scenario) { 
    return function() {
      return {
        emailaddress: scenario.account.emailaddress
      };
    };
  };

  asyncTest('A invites an existing follower\'s unverified email', hlpr.inviteFollower(SCEN_A, 'channel', invite_overlap(SCEN_B), hlpr.CHECK.shouldNotSucceed, hlpr.CHECK.badRequest));
  
  var SCEN_C = hlpr.TestScenario();
  
  asyncTest('C enrolls', hlpr.enroll(SCEN_C));

  asyncTest('A invites an existing evernym (non-following) with an unverified email', hlpr.inviteFollower(SCEN_A, 'channel', invite_overlap(SCEN_C)));

  asyncTest('A checks followers and verifies the invitee is a provisional', hlpr.getFollowers(SCEN_A, 'channel', checkLastInvitedIsProvisional(SCEN_A)));
  
  //TODO A invites an existing evernym (non-following) with a verified email, and it results in an evernym invite, non-provisional
  
})();
