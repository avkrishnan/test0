(function() {
  QUnit.config.testTimeout = 90000;
  QUnit.config.reorder = false;

  var hlpr = new ApiTestHelper();

  module("group a");

  var SCEN1 = hlpr.TestScenario();
  var acct = hlpr.generateAccount();

  asyncTest('CHECK EVERNYM AVAILABILITY for nonexistent name', function() {
    $.when(SCEN1.ES.loginService.checkName(acct.accountname))
    .then(hlpr.CHECK.successNoContent, hlpr.CHECK.shouldNotFail)
    .then(start,start);
  });

  asyncTest('ENROLL', hlpr.enroll(SCEN1,acct));

  /*
   * asyncTest('ENROLL WITH PHONE NUMBER', hlpr.enroll(SCEN2, (function() { var
   * acct = api.generateAccount(); acct.phonenumber = '8013763348'; return acct;
   * }())));
   */

  asyncTest('CHECK EVERNYM AVAILABILITY for existing name', function() {
    $.when(SCEN1.ES.loginService.checkName(SCEN1.account.accountname))
    .then(hlpr.CHECK.success, hlpr.CHECK.shouldNotFail)
    .then(function(data) {
        ok((data !== undefined & data.refType === "A"), "data should be defined and have a refType of 'A'");
      }, hlpr.CHECK.shouldNotFail)
    .then(start,start);
  });

  asyncTest('DUPLICATE ENROLLMENT', function() {
    $.when(SCEN1.ES.loginService.accountEnroll(SCEN1.account))
    .then(hlpr.CHECK.shouldNotSucceed, hlpr.CHECK.badRequest)
    .then(start,start);
  });

  asyncTest('TEST BAD ENROLLMENT - NAME TOO LONG', function() {
    var account = hlpr.generateAccount();

    account.accountname = '01234567890123456789012345678901234567890123456789'
        + '01234567890123456789012345678901234567890123456789'
        + '01234567890123456789012345678901234567890123456789'
        + '01234567890123456789012345678901234567890123456789'
        + '01234567890123456789012345678901234567890123456789'
        + '01234567890123456789012345678901234567890123456789'
        + '01234567890123456789012345678901234567890123456789'
        + '01234567890123456789012345678901234567890123456789'
        + '01234567890123456789012345678901234567890123456789'
        + '01234567890123456789012345678901234567890123456789';

    $.when(SCEN1.ES.loginService.accountEnroll(account))
    .then(hlpr.CHECK.shouldNotSucceed, hlpr.CHECK.badRequest)
    .then(start,start);
  });

  asyncTest('TEST BAD ENROLLMENT - NAME TOO SHORT', function() {
    var account = hlpr.generateAccount();
    account.accountname = 'hi';
    $.when(SCEN1.ES.loginService.accountEnroll(account))
    .then(hlpr.CHECK.shouldNotSucceed, hlpr.CHECK.badRequest)
    .then(start,start);
  });

})();
