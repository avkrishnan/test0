(function() {
  QUnit.config.testTimeout = 90000;
  QUnit.config.reorder = false;

  var hlpr = new ApiTestHelper();

  var SCEN1 = hlpr.TestScenario();

  asyncTest('ENROLL', hlpr.enroll(SCEN1));

  asyncTest('LOGIN', hlpr.login(SCEN1));

  function fetchAcctAndCheck(checkFunc) {
    return $.when(SCEN1.ES.loginService.getAccount())
    .then(hlpr.CHECK.success, hlpr.CHECK.shouldNotFail)
    .then(checkFunc, hlpr.CHECK.shouldNotFail);
  }

  asyncTest('FETCH ACCOUNT INFO', function() {
    $.when( fetchAcctAndCheck(hlpr.checkEqualC(SCEN1.account, [ 'accountname', 'firstname', 'lastname', 'nickname' ])))
     .then(start, start);
  });

  asyncTest('CHANGE ACCOUNT NAME', function() {
    newAccount = {
      accountname: hlpr.randomAccountname()
    };
    $.when(SCEN1.ES.loginService.accountModify(newAccount))
    .then(hlpr.CHECK.shouldNotFail, hlpr.CHECK.notImplemented)
    .then(start, start);
  });

  function modifyAcctAndCheck(newAccount, checkFunc) {
    return $.when(SCEN1.ES.loginService.accountModify(newAccount))
    .then(hlpr.CHECK.successNoContent, hlpr.CHECK.shouldNotFail)
    .then(function() {
        return fetchAcctAndCheck(checkFunc);
      }, hlpr.CHECK.shouldNotFail
    );
  }

  asyncTest('CHANGE ACCOUNT NAME WITH SAME NORMALIZED NAME', function() {
    newAccount = {
      accountname: SCEN1.account.accountname.toUpperCase()
    };
    modifyAcctAndCheck(newAccount, hlpr.checkEqualC(newAccount))
    .then(start, start);
  });

  asyncTest('CHANGE FIRST AND LAST NAME', function() {
    newAccount = {
      firstname: hlpr.randomStr(8),
      lastname: hlpr.randomStr(8)
    };
    modifyAcctAndCheck(newAccount, hlpr.checkEqualC(newAccount))
    .then(start, start);
  });

})();
