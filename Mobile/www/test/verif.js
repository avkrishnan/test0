(function() {
  QUnit.config.testTimeout = 90000;
  QUnit.config.reorder = false;

  var hlpr = new ApiTestHelper();

  var SCEN_A = hlpr.TestScenario();
  var aAcct = hlpr.generateAccount();
  
  asyncTest('Enroll', hlpr.enroll(SCEN_A, aAcct));
  
  asyncTest('Verification email sent', hlpr.checkVerifEmail(SCEN_A));
  
  asyncTest('Verification link clicked', hlpr.clickVerifyLink(SCEN_A));
  
  var SCEN_B = hlpr.TestScenario();
  
  asyncTest('Another tries to enroll with same email address', function() {
    var bAcct = hlpr.generateAccount();
    bAcct.emailaddress = aAcct.emailaddress;
    $.when(SCEN_B.ES.loginService.accountEnroll(bAcct))
    .then(hlpr.CHECK.shouldNotSucceed, hlpr.CHECK.badRequest)
    .then(start,start);
  });
  
  
})();
