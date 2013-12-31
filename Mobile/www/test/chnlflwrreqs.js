(function() {
  QUnit.config.testTimeout = 90000;
  QUnit.config.reorder = false;

  var hlpr = new ApiTestHelper();

  var SCEN_A = hlpr.TestScenario();

  asyncTest('A enrolls', hlpr.enroll(SCEN_A));

  asyncTest('A logs in', hlpr.login(SCEN_A));

  asyncTest('A creates channel', hlpr.createChannelF(SCEN_A, 'channel'));

  function fetchAndCheckFlwrReqs(scenario, expected) {
    return function() {
      $.when(scenario.ES.channelService.getFollowerReq(scenario.channel.id))
      .then(hlpr.CHECK.success, hlpr.CHECK.shouldNotFail)
      .then(function(data) {
          ok(Array.isArray(data), 'follower requests should be an array');
          ok(expected.length == data.length, 'arrays are the same length');
          expected.forEach(function(eentry) {
            var found = false;
            data.forEach(function(dentry) {
              if (eentry == dentry.request) {
                found = true;
              }
            });
            ok(found, 'should find ' + eentry + ' in results');
          });
        }, hlpr.CHECK.shouldNotFail)
      .then(start, start);
    };
  }
  
  function addFlwrReqs(scenario, request, ovrdSuccess, ovrdFail) {
    return function() {
      $.when(scenario.ES.channelService.addFollowerReq(scenario.channel.id, request))
      .then(ovrdSuccess === undefined ? hlpr.CHECK.success : ovrdSuccess, ovrdFail === undefined ? hlpr.CHECK.shouldNotFail : ovrdFail)
      .then(start, start);
    };
  }
  
  function removeFlwrReqs(scenario, request, ovrdSuccess, ovrdFail) {
    return function() {
      $.when(scenario.ES.channelService.removeFollowerReq(scenario.channel.id, request))
      .then(ovrdSuccess === undefined ? hlpr.CHECK.successNoContent : ovrdSuccess, ovrdFail === undefined ? hlpr.CHECK.shouldNotFail : ovrdFail)
      .then(start, start);
    };
  }
  
  asyncTest('Fetch Channel Follower Request and make sure there are none', fetchAndCheckFlwrReqs(SCEN_A, []));

  asyncTest('Add Channel Follower Request SHARE_NAME', addFlwrReqs(SCEN_A, 'SHARE_NAME'));
  
  asyncTest('Fetch Channel Follower Request and make sure there is one', fetchAndCheckFlwrReqs(SCEN_A, ['SHARE_NAME']));

  asyncTest('Remove Channel Follower Request SHARE_NAME', removeFlwrReqs(SCEN_A, 'SHARE_NAME'));

  asyncTest('Remove Channel Follower Request that doesn\'t exist', removeFlwrReqs(SCEN_A, 'SHARE_NAME', hlpr.CHECK.shouldNotSucceed, hlpr.CHECK.notFound));
  
  asyncTest('Fetch Channel Follower Request and make sure there are none', fetchAndCheckFlwrReqs(SCEN_A, []));

  asyncTest('Add invalid Channel Follower Request', addFlwrReqs(SCEN_A, 'INVALID', hlpr.CHECK.shouldNotSucceed, hlpr.CHECK.badRequest));

  var SCEN_B = hlpr.TestScenario();
  var acct_2 = hlpr.generateAccount();
  delete acct_2.firstname;
  delete acct_2.lastname;
  
  asyncTest('B enrolls with missing firstname and lastname ', hlpr.enroll(SCEN_B, acct_2));
  
  asyncTest('B logs in', hlpr.login(SCEN_B));

  asyncTest("B follow A'S channel without issue", hlpr.followChannel(SCEN_B, SCEN_A, 'channel'));
  
  asyncTest('A adds Channel Follower Request SHARE_NAME again', addFlwrReqs(SCEN_A, 'SHARE_NAME'));

  var SCEN_C = hlpr.TestScenario();
  var acct_2 = hlpr.generateAccount();
  delete acct_2.firstname;
  delete acct_2.lastname;
  
  asyncTest('C enrolls with missing firstname and lastname ', hlpr.enroll(SCEN_C, acct_2));
  
  asyncTest('C logs in', hlpr.login(SCEN_C));

  asyncTest("C attempts to follow A'S channel but is appropriately rejected", hlpr.followChannel(SCEN_C, SCEN_A, 'channel', hlpr.CHECK.shouldNotSucceed, hlpr.CHECK.badRequest));

  var SCEN_D = hlpr.TestScenario();

  asyncTest('D ENROLLS with a first and last name', hlpr.enroll(SCEN_D));

  asyncTest('D logs in', hlpr.login(SCEN_D));

  asyncTest("D follow A'S without issue", hlpr.followChannel(SCEN_D, SCEN_A, 'channel'));

})();
