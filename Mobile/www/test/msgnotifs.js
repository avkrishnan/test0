(function() {
  QUnit.config.testTimeout = 90000;
  QUnit.config.reorder = false;

  var hlpr = new ApiTestHelper();

  var SCEN_A = hlpr.TestScenario();

  SCEN_A.account = hlpr.testjason20;

  asyncTest('A logs in', hlpr.login(SCEN_A));

  asyncTest('A gets msg notification summary, establishes current unread count and last-created', hlpr.checkNotifSmry(SCEN_A));

  asyncTest('A gets msg notifications and the counts match', hlpr.checkNotif(SCEN_A, undefined, function() {return SCEN_A.smry.unreadCount;}));
  
})();
