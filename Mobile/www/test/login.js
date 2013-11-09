(function() {
  QUnit.config.testTimeout = 90000;
  QUnit.config.reorder = false;

  var hlpr = new ApiTestHelper();

  var SCEN1 = hlpr.TestScenario();

  asyncTest('ENROLL', hlpr.enroll(SCEN1));

  asyncTest('LOGIN', hlpr.login(SCEN1));

  asyncTest('LOGOUT', hlpr.logout(SCEN1));

  asyncTest('LOGIN AGAIN', hlpr.login(SCEN1));

  asyncTest('LOGIN INVALID PASSWORD', function() {
    var account = hlpr.clone(SCEN1.account);
    account.password = '~INVALID~PASSWORD~';
    var invalidLogin = hlpr.generateLogin(account);
    $.when(SCEN1.ES.loginService.accountLogin(invalidLogin))
    .then(hlpr.CHECK.shouldFail, hlpr.CHECK.unauthorized)
    .then(start,start);
  }); 

  asyncTest('LOGIN INVALID USERNAME AND PASSWORD', function() {
    var invalidLogin = hlpr.generateLogin(hlpr.generateAccount());
    $.when(SCEN1.ES.loginService.accountLogin(invalidLogin))
    .then(hlpr.CHECK.shouldFail, hlpr.CHECK.unauthorized)
    .then(start,start);
  }); 

})();
