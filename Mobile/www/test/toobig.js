(function() {
  QUnit.config.testTimeout = 90000;
  QUnit.config.reorder = false;

  var hlpr = new ApiTestHelper();

  var SCEN1 = hlpr.TestScenario();
  var SCEN2 = hlpr.TestScenario();

  asyncTest('ENROLL', hlpr.enroll(SCEN1));

  asyncTest('LOGIN', hlpr.login(SCEN1));

  asyncTest('CREATE CHANNEL', hlpr.createChannelF(SCEN1, 'channel'));

  asyncTest('CREATE A SECOND CHANNEL', hlpr.createChannelF(SCEN1, 'channel2'));

  asyncTest('GET MESSAGES ON CHANNEL THAT HAS NO MESSAGES', function() {
    $.when(api.sFetchMessages(SCEN1.accessToken, SCEN1.channel2.id)).then(api.CHECK.success).then(
        checkNoMsgs).then(start);

    function checkNoMsgs(data) {
      equal(data.message.length, 0, "we shouldn't get anything back");
      equal(data.more, false, "there should be no more messages");
      ok(true, JSON.stringify(data));
    }
  });

  asyncTest('VERIFY EMAIL ADDRESS', hlpr.verify(SCEN1));

  asyncTest('FORGOT PASSWORD', hlpr.forgotPassword(SCEN1));

  asyncTest('FORGOT PASSWORD UNKNOWN EMAIL', hlpr.forgotPassword(SCEN1, "invalidemail@invalid.edu",
      hlpr.CHECK.notFound));

  // TODO: RESET PASSWORD

  asyncTest('SEND A MESSAGE', hlpr.broadcast(SCEN1, 'channel2',
      'HERE IS A TEST MESSAGE ON CHANNEL 2'));

  asyncTest('GET MESSAGES ON CHANNEL', hlpr.fetchMsgs(SCEN1, SCEN1, 'channel2'));

  // TODO fix race condition... msg_alert_com is being created on the back end
  // when msg_alert has already been removed by a channel deletion

  asyncTest('DELETE CHANNEL WITH MESSAGES', function() {
    $.when(api.sDeleteChannel(SCEN1.accessToken, SCEN1.channel2.id)).then(
        api.CHECK.successNoContent).then(fetchAndCheckChannels).then(start);
  });

  asyncTest('CREATE ANOTHER COM METHOD', hlpr.createComMethod(SCEN1, "-2"));

  asyncTest('CREATE A THIRD COM METHOD', hlpr.createComMethod(SCEN1, "-3"));

  asyncTest('DELETE THE THIRD COM METHOD', hlpr.deleteComMethod(SCEN1, "-3"));

  asyncTest('VERIFY EMAIL ADDRESS', hlpr.verify(SCEN1, "-2"));


  // TODO
  /*
   * test('MODIFY CHANNEL NAME', function() { ok(false, "not yet implemented");
   * });
   */

})();
