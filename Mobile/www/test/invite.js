(function() {
  QUnit.config.testTimeout = 90000;
  QUnit.config.reorder = false;

  var hlpr = new ApiTestHelper();

  var SCEN_A = hlpr.TestScenario();

  asyncTest('A enrolls', hlpr.enroll(SCEN_A));

  asyncTest('A logs in', hlpr.login(SCEN_A));

  asyncTest('A creates channel', hlpr.createChannelF(SCEN_A, 'channel'));

  asyncTest('A checks the channel follower count is zero', hlpr.checkFollowCount(SCEN_A, 0));

  var invitation = {
      //accountname:  
      firstname: 'TEST|Joe', 
      lastname: 'Bobson',
      emailaddress: hlpr.generateEmail('joebobson'),
      phonenumber: '8013763348'
  };

  asyncTest("A's channel follower count is zero", hlpr.checkFollowCount(SCEN_A, 0));

  asyncTest('A invites a provisional follower', hlpr.inviteFollower(SCEN_A, 'channel', invitation));
  
  asyncTest("A's channel follower count is still zero", hlpr.checkFollowCount(SCEN_A, 0));

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
  
  
  hlpr.getFollowers = function(scenario, chnlKey, check) {
    return function() {
      $.when(scenario.ES.channelService.getFollowers(scenario[chnlKey].id))
      .then(hlpr.CHECK.success, hlpr.CHECK.shouldNotFail)
      .then(check, hlpr.CHECK.shouldNotFail)
      .then(start,start);
    };
  };

  asyncTest('A checks followers and verifies the invitee is a provisional', hlpr.getFollowers(SCEN_A, 'channel', function(data) {
    ok(data.followers.findIndex(function(item) { return item.accountname === SCEN_A.lastInvite.accountname; }) >= 0, 'last invited is found in list of followers');
  }));
  
  
  //TODO verify this resulted in a provisional; can do this by looking at the evernyms of followers

  //TODO A invites an existing evernym (non-following) with a verified email, and it results in an evernym invite, non-provisional
  
})();
