(function() {
  QUnit.config.testTimeout = 90000;
  QUnit.config.reorder = false;

  var hlpr = new ApiTestHelper();

  var SCEN_A = hlpr.TestScenario();

  SCEN_A.account = hlpr.testjason20;

  asyncTest('A logs in', hlpr.login(SCEN_A));

  asyncTest('A gets msg notification summary, establishes current unread count and last-created', hlpr.checkNotifSmry(SCEN_A, undefined, true));

  test('A manually adjusts count', function() {
    SCEN_A.ES.systemService.adjMnsCount(-1);
    expect(0);
  });
  
  asyncTest('A gets msg notification summary, expects decrease of one', hlpr.checkNotifSmry(SCEN_A, -1, true));

  asyncTest('Wait 31 seconds', hlpr.waitToStart(31000));
  
  asyncTest('B gets msg notification summary, expects no change', hlpr.checkNotifSmry(SCEN_A, 0, true));

  asyncTest('Wait 31 seconds', hlpr.waitToStart(31000));

  asyncTest('B gets msg notification summary, expects increase of one', hlpr.checkNotifSmry(SCEN_A, +1, true));

  
})();
