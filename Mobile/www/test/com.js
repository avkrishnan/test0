(function() {
  QUnit.config.testTimeout = 90000;
  QUnit.config.reorder = false;

  var hlpr = new ApiTestHelper();

  var SCEN_A = hlpr.TestScenario();
  var SCEN_B = hlpr.TestScenario();

  SCEN_A.account = hlpr.testjason20;

  SCEN_B.account = hlpr.testjason21;

  // debugger;
  // acctA.phonenumber = '801376334 8 ';
  // asyncTest('A enrolls', hlpr.enroll(SCEN_A, acctA));

  asyncTest('A logs in', hlpr.login(SCEN_A));

  // asyncTest('B enrolls', hlpr.enroll(SCEN_B));
  asyncTest('B logs in', hlpr.login(SCEN_B));

  // asyncTest('CREATE PUSH COM METHOD', hlpr.createPushComMethod(SCEN_B,
  // "GCM:APA91bEfh9fWKaslF2ajSNDRt_zV7NwaPBxaEr5p4oo_1p50AR82W8HoAy9-jQ4aK9kjrt1gQv9SoJByPPmgNTmxf49x1TKY6yh1_kXRgTAyBkCbLhAxLTDK4bgmJygYrw78-HzonMw_ssk2J0fKuPdVcryAqakaeQ",
  // "-1"));

  asyncTest('A creates channel', hlpr.createChannelF(SCEN_A, 'chnl1'));
  asyncTest("B follows A's channel", hlpr.followChannel(SCEN_B, SCEN_A, 'chnl1'));

  // asyncTest('A verifies email address', hlpr.verify(SCEN_A));
  // asyncTest('B verifies email address', hlpr.verify(SCEN_B));

  var msgText = 'Hello everybody, this is a test broadcast! ' + hlpr.randomStr(10);

  asyncTest('A broadcasts a message', hlpr.broadcast(SCEN_A, 'chnl1', msgText, 'N'));
  asyncTest('B checks message', hlpr.fetchMsgs(SCEN_B, SCEN_A, 'chnl1'));

  // asyncTest('B receives email with message', hlpr.findEmail(SCEN_B,
  // msgText));

  // Here's were we do the tests for message read, dismiss, ack, and snooze

  asyncTest('B gets msg notifications and the msg is there', function() {
    $.when(SCEN_B.ES.systemService.getMsgNotifs())
    .then(hlpr.CHECK.success, hlpr.CHECK.shouldNotFail)
    .then(function(data) {
        var find = data.filter(function(item) { return (item.text == SCEN_A.msg.text); });
        equal(find.length, 1, "we find one entry");
      }, null)
    .then(start, start);
  });

  asyncTest('B reads message', function() {
    $.when(SCEN_B.ES.messageService.readMsg(SCEN_B.msg.id))
    .then(hlpr.CHECK.successNoContent, hlpr.CHECK.shouldNotFail)
    .then(start, start);
  });

  asyncTest('B gets msg notifications and the msg is not there', function() {
    $.when(SCEN_B.ES.systemService.getMsgNotifs())
    .then(hlpr.CHECK.success, hlpr.CHECK.shouldNotFail)
    .then(function(data) {
        var find = data.filter(function(item) { return (item.text == SCEN_A.msg.text); });
        equal(find.length, 0, "we should not find an entry");
      }, null)
    .then(start, start);
  });

  /*
  asyncTest('B fetches message', function() {
    $.when(SCEN_B.ES.messageService.getChannelMessage(SCEN_A['chnl1'].id, SCEN_B.msg.id))
    .then(hlpr.CHECK.successNoContent, hlpr.CHECK.shouldNotFail)
    .then(function(data) {
        debugger;
        
      }, hlpr.CHECK.shouldNotFail)
    .then(start, start);
  });
  */
  
  /*
  asyncTest('B checks message', hlpr.fetchMsgs(SCEN_B, SCEN_A, 'chnl1', function() {
    debugger;
    SCEN_B.msg
    }));
  */
  
  /*
   * asyncTest('B dismisses message', function() {
   * $.when(api.dismissMsg(SCEN_B.accessToken, SCEN_B.msg.id))
   * .then(api.CHECK.successNoContent) .then(start); });
   * 
   * asyncTest('B acknowledges message', function() {
   * $.when(api.acknowledgeMsg(SCEN_B.accessToken, SCEN_B.msg.id))
   * .then(api.CHECK.successNoContent) .then(start); });
   */

})();
