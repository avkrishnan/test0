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

  var msgText = 'Hello everybody, this is a test broadcast! ';

  asyncTest('A broadcasts a message', hlpr.broadcast(SCEN_A, 'chnl1', msgText, 'N'));
  asyncTest('A checks message', hlpr.fetchMsgsAsOwner(SCEN_A, SCEN_A, 'chnl1'));

  // asyncTest('B receives email with message', hlpr.findEmail(SCEN_B,
  // msgText));

  // Here's were we do the tests for message read, dismiss, ack, and snooze

  asyncTest('B gets msg notifications and the msg is there', hlpr.checkNotif(SCEN_B, SCEN_A, 1));
  
  asyncTest('B reads message', hlpr.read(SCEN_B, SCEN_A));

  asyncTest('Wait 1 second. (Because read is asynchronous on the back-end, we have a race condition; waiting lets the back-end "win".)', function() { 
    setTimeout( function(){ expect(0); start(); }, 1000);
  });

  asyncTest('B gets msg notifications and the msg is no longer there', hlpr.checkNotif(SCEN_B, SCEN_A, 0));

  asyncTest('B gets channel messages', hlpr.checkChnlMsgsForFlwr(SCEN_B, SCEN_A, 'chnl1'));

  asyncTest('A creates another channel', hlpr.createChannelF(SCEN_A, 'chnl2'));
  asyncTest("B follows A's other channel", hlpr.followChannel(SCEN_B, SCEN_A, 'chnl2'));

  
  asyncTest('A broadcasts a message, requesting an iGi', hlpr.broadcast(SCEN_A, 'chnl2', msgText, 'N', undefined, 'RAC'));

  asyncTest('A checks message', hlpr.fetchMsgsAsOwner(SCEN_A, SCEN_A, 'chnl2'));

  asyncTest('B gets msg notifications and the msg is there', hlpr.checkNotif(SCEN_B, SCEN_A, 1));
  
  asyncTest('B acknowledges message', hlpr.acknowledge(SCEN_B, SCEN_A));
  
  asyncTest('Wait 1 second. (Because read is asynchronous on the back-end, we have a race condition; waiting lets the back-end "win".)', function() { 
    setTimeout( function(){ expect(0); start(); }, 1000);
  });

  asyncTest('B gets msg notifications and the msg is no longer there', hlpr.checkNotif(SCEN_B, SCEN_A, 0));
  
  asyncTest('B gets channel messages', hlpr.checkChnlMsgsForFlwr(SCEN_B, SCEN_A, 'chnl2'));

  //TODO confirm the last message is acknowledged
  
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
