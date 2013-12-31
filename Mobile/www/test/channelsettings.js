(function() {
  QUnit.config.testTimeout = 90000;
  QUnit.config.reorder = false;

  var hlpr = new ApiTestHelper();

  var SCEN_A = hlpr.TestScenario();
  
  asyncTest('A enrolls', hlpr.enroll(SCEN_A));

  asyncTest('A logs in', hlpr.login(SCEN_A));

  asyncTest('A creates channel', hlpr.createChannelF(SCEN_A, 'channel'));

  function fetchAndCheckSettings(scenario, expected) {
    return function() {
      $.when(scenario.ES.channelService.getChnlSettings(scenario.channel.id))
      .then(hlpr.CHECK.success, hlpr.CHECK.shouldNotFail)
      .then(function(data) {
          ok(_.isEqual(expected,data), 'objects are equal');
        }, hlpr.CHECK.shouldNotFail)
      .then(start, start);
    };
  }
  
  function putSettings(scenario, settings, ovrdSuccess, ovrdFail) {
    return function() {
      $.when(scenario.ES.channelService.putChnlSettings(scenario.channel.id, settings))
      .then(ovrdSuccess === undefined ? hlpr.CHECK.successNoContent : ovrdSuccess, ovrdFail === undefined ? hlpr.CHECK.shouldNotFail : ovrdFail)
      .then(start, start);
    };
  }
  
  function removeSetting(scenario, setting, ovrdSuccess, ovrdFail) {
    return function() {
      $.when(scenario.ES.channelService.removeChnlSetting(scenario.channel.id, setting))
      .then(ovrdSuccess === undefined ? hlpr.CHECK.successNoContent : ovrdSuccess, ovrdFail === undefined ? hlpr.CHECK.shouldNotFail : ovrdFail)
      .then(start, start);
    };
  }

  asyncTest('A checks channel settings to make sure there are none', fetchAndCheckSettings(SCEN_A, {}));

  asyncTest('A adds invalid setting', putSettings(SCEN_A, {XXX:'N'}, hlpr.CHECK.shouldNotSucceed, hlpr.CHECK.badRequest));

  asyncTest('A checks channel settings to make sure there are none', fetchAndCheckSettings(SCEN_A, {}));

  asyncTest('A adds setting NEW_FLWR_NOTIF with invalid value', putSettings(SCEN_A, {NEW_FLWR_NOTIF:'XXX'}, hlpr.CHECK.shouldNotSucceed, hlpr.CHECK.badRequest));
  
  asyncTest('A checks channel settings to make sure there are none', fetchAndCheckSettings(SCEN_A, {}));

  asyncTest('A adds setting NEW_FLWR_NOTIF with valid value', putSettings(SCEN_A, {NEW_FLWR_NOTIF:'N'}));

  asyncTest('A checks channel settings to make sure the new setting is there', fetchAndCheckSettings(SCEN_A, {NEW_FLWR_NOTIF:'N'}));

  asyncTest('A changes setting NEW_FLWR_NOTIF to invalid', putSettings(SCEN_A, {NEW_FLWR_NOTIF:'ABC'}, hlpr.CHECK.shouldNotSucceed, hlpr.CHECK.badRequest));

  asyncTest('A checks channel settings to make sure the setting is still there', fetchAndCheckSettings(SCEN_A, {NEW_FLWR_NOTIF:'N'}));

  asyncTest('A changes setting NEW_FLWR_NOTIF to another valid setting', putSettings(SCEN_A, {NEW_FLWR_NOTIF:'H'}));

  asyncTest('A checks channel settings to make sure the setting is right', fetchAndCheckSettings(SCEN_A, {NEW_FLWR_NOTIF:'H'}));

  asyncTest('A removes an invalid channel setting', removeSetting(SCEN_A, 'XXX', hlpr.CHECK.shouldNotSucceed, hlpr.CHECK.badRequest));
  
  asyncTest('A checks channel settings to make sure the setting is right', fetchAndCheckSettings(SCEN_A, {NEW_FLWR_NOTIF:'H'}));

  asyncTest('A removes a valid channel setting', removeSetting(SCEN_A, 'NEW_FLWR_NOTIF'));
  
  asyncTest('A checks channel settings to make sure there are none', fetchAndCheckSettings(SCEN_A, {}));

})();
