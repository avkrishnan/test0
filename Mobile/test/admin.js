(function() {
  QUnit.config.testTimeout = 90000;
  QUnit.config.reorder = false;

  var hlpr = new ApiTestHelper();

  var SCEN1 = hlpr.TestScenario();
  var SCEN2 = hlpr.TestScenario();
  SCEN2.account = hlpr.testjason22;

  asyncTest('Non-privileged user enrolls', hlpr.enroll(SCEN1));

  asyncTest('and logs in', hlpr.login(SCEN1, false));

  asyncTest('and attempts to get feedback but is rejected', function() {
    $.when(SCEN2.ES.systemService.getFeedback())
    .then(hlpr.CHECK.shouldFail, hlpr.CHECK.forbidden)
    .then(start,start);
  });

  asyncTest('Privileged user logs in', hlpr.login(SCEN2, true));

  asyncTest('and gets feedback', function() {
    $.when(SCEN2.ES.systemService.getFeedback())
    .then(hlpr.CHECK.success, hlpr.CHECK.shouldNotFail)
    .then(function(data) {
      var isArray = Array.isArray(data);
      ok(isArray, "should get back an array");
      if (isArray) {
        ok(data.length > 0, "should get back at least one feedback");
      }
      console.log(data);
    }, hlpr.CHECK.shouldNotFail)
    .then(start,start);
  });
  
})();
