(function() {
  QUnit.config.testTimeout = 90000;
  QUnit.config.reorder = false;

  var hlpr = new ApiTestHelper();

  var SCEN_A = hlpr.TestScenario();
  
  asyncTest('Enroll', hlpr.enroll(SCEN_A));
  
  asyncTest('Verification email sent', hlpr.checkVerifEmail(SCEN_A));
  
  asyncTest('Verification link clicked', hlpr.clickVerifyLink(SCEN_A));

})();
