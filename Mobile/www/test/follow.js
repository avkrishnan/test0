(function() {
  QUnit.config.testTimeout = 90000;
  QUnit.config.reorder = false;

  var hlpr = new ApiTestHelper();

  var SCEN_A = hlpr.TestScenario();
  var SCEN_B = hlpr.TestScenario();
  var SCEN_C = hlpr.TestScenario();

  asyncTest('A ENROLLS', hlpr.enroll(SCEN_A));

  asyncTest('A LOGS IN', hlpr.login(SCEN_A));

  asyncTest('A CREATES A CHANNEL', hlpr.createChannelF(SCEN_A, 'channel'));

  asyncTest('A ATTEMPTS TO UNFOLLOW THE CHANNEL A OWNS', hlpr.unfollowChannel(SCEN_A, SCEN_A, 'channel', true));

  asyncTest('B ENROLLS', hlpr.enroll(SCEN_B));

  asyncTest('B LOGS IN', hlpr.login(SCEN_B));

  asyncTest("A'S CHANNEL FOLLOWER COUNT IS ZERO", hlpr.checkFollowCount(SCEN_A, 0));

  asyncTest("B FOLLOWS A'S CHANNEL", hlpr.followChannel(SCEN_B, SCEN_A, 'channel'));

  asyncTest("A'S CHANNEL FOLLOWER COUNT INCREASES TO ONE", hlpr.checkFollowCount(SCEN_A, 1));

  asyncTest("B UNFOLLOWS A'S CHANNEL", hlpr.unfollowChannel(SCEN_B, SCEN_A, 'channel'));

  asyncTest("B ATTEMPTS TO UNFOLLOW A'S CHANNEL AGAIN", hlpr.unfollowChannel(SCEN_B, SCEN_A, 'channel', true));

  asyncTest("A'S CHANNEL FOLLOWER COUNT DROPS TO ZERO", hlpr.checkFollowCount(SCEN_A, 0));

  asyncTest("B RE-FOLLOWS A'S CHANNEL", hlpr.followChannel(SCEN_B, SCEN_A, 'channel'));

  asyncTest("A'S CHANNEL FOLLOWER COUNT INCREASES TO ONE", hlpr.checkFollowCount(SCEN_A, 1));
  
  asyncTest('C ENROLLS', hlpr.enroll(SCEN_C));

  asyncTest('C LOGS IN', hlpr.login(SCEN_C));

  asyncTest("A ADDS C AS FOLLOWER", hlpr.addFollower(SCEN_A, SCEN_C, 'channel'));

  asyncTest("A ATTEMPTS TO ADD C AS FOLLOWER AGAIN", hlpr.addFollower(SCEN_A, SCEN_C, 'channel', true));

  asyncTest("A'S CHANNEL FOLLOWER COUNT INCREASES TO TWO", hlpr.checkFollowCount(SCEN_A, 2));
  
  asyncTest("A EVICTS B FROM CHANNEL", hlpr.removeFollower(SCEN_A, SCEN_B, 'channel'));
  
  asyncTest("A ATTEMPTS TO EVICT NON FOLLOWER B FROM CHANNEL", hlpr.removeFollower(SCEN_A, SCEN_B, 'channel', true));

  asyncTest("A'S CHANNEL FOLLOWER COUNT DROPS TO ONE", hlpr.checkFollowCount(SCEN_A, 1));
  
})();
