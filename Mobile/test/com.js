﻿(function() {
  QUnit.config.testTimeout = 90000;
  QUnit.config.reorder = false;

  var hlpr = new ApiTestHelper();

  var SCEN_A = hlpr.TestScenario();
  var SCEN_B = hlpr.TestScenario();

  SCEN_A.account = hlpr.testjason20;

  SCEN_B.account = hlpr.testjason22;

  SCEN_A.phonenumber = '8013763348';
  //asyncTest('A enrolls', hlpr.enroll(SCEN_A, acctA));

  module("broadcast");

  asyncTest('A logs in', hlpr.login(SCEN_A));

  //asyncTest('A adds phone number as com method', hlpr.createTextComMethod(SCEN_A, SCEN_A.phonenumber, 'phone'));

  //asyncTest('B enrolls', hlpr.enroll(SCEN_B, SCEN_B.account));
  asyncTest('B logs in', hlpr.login(SCEN_B));

  // asyncTest('CREATE PUSH COM METHOD', hlpr.createPushComMethod(SCEN_B,
  // "GCM:APA91bEfh9fWKaslF2ajSNDRt_zV7NwaPBxaEr5p4oo_1p50AR82W8HoAy9-jQ4aK9kjrt1gQv9SoJByPPmgNTmxf49x1TKY6yh1_kXRgTAyBkCbLhAxLTDK4bgmJygYrw78-HzonMw_ssk2J0fKuPdVcryAqakaeQ",
  // "-1"));

  asyncTest('A creates channel', hlpr.createChannelF(SCEN_A, 'chnl1'));
  asyncTest("B follows A's channel", hlpr.followChannel(SCEN_B, SCEN_A, 'chnl1'));

  asyncTest('A gets msg notification summary, establishes current unread count and last-created', hlpr.checkNotifSmry(SCEN_A));

  asyncTest('B gets msg notification summary, establishes current unread count and last-created', hlpr.checkNotifSmry(SCEN_B));

  // asyncTest('A verifies email address', hlpr.verify(SCEN_A));
  // asyncTest('B verifies email address', hlpr.verify(SCEN_B));

  var CRLF = String.fromCharCode(13) + String.fromCharCode(10);
  var msgText = 'Hello everybody, this is a test broadcast! ' + CRLF + CRLF + " and this is another line.";

  asyncTest('A broadcasts a message', hlpr.broadcast(SCEN_A, 'chnl1', msgText, 'N'));

  asyncTest('A checks message', hlpr.fetchMsgsAsOwner(SCEN_A, SCEN_A, 'chnl1'));
  
  asyncTest('A confirms B as a message recipient that has NOT acknowledged', hlpr.fetchMsgRecips(SCEN_A, 'chnl1', SCEN_B, 'N'));
  
  // asyncTest('B receives email with message', hlpr.findEmail(SCEN_B,
  // msgText));

  // Here's were we do the tests for message read, dismiss, ack, and snooze

  asyncTest('B gets msg notification summary, expects an increase of one', hlpr.checkNotifSmry(SCEN_B, 1));
  
  asyncTest('B gets msg notifications and the msg is there', hlpr.checkNotif(SCEN_B, SCEN_A, 1));
  
  asyncTest('B reads message', hlpr.read(SCEN_B, SCEN_A));

  asyncTest('Wait 1 second. (Because read is asynchronous on the back-end, we have a race condition; waiting lets the back-end "win".)', function() { 
    setTimeout( function(){ expect(0); start(); }, 1000);
  });

  asyncTest('B gets msg notification summary, expects a decrease of one', hlpr.checkNotifSmry(SCEN_B, -1));

  asyncTest('B gets msg notifications and the msg is no longer there', hlpr.checkNotif(SCEN_B, SCEN_A, 0));

  asyncTest('B gets channel messages', hlpr.checkChnlMsgsForFlwr(SCEN_B, SCEN_A, 'chnl1'));

  asyncTest('B replies to broadcast', hlpr.reply(SCEN_B, SCEN_A, 'chnl1', 'this is my reply', SCEN_A));

  asyncTest('A gets msg notification summary, expects an increase of one', hlpr.checkNotifSmry(SCEN_A, 1));
  
  //TODO A sees that reply count is one
  asyncTest('A checks channel messages to see that Reply count has changed', hlpr.fetchMsgsAsOwner(SCEN_A, SCEN_A, 'chnl1', function() {
    ok(SCEN_A.msg.replies === 1, 'replies count is one');
  }));


  
  module("reply means read");
  
  asyncTest('A broadcasts another message', hlpr.broadcast(SCEN_A, 'chnl1', msgText, 'N'));

  asyncTest('B gets msg notification summary, expects an increase of one', hlpr.checkNotifSmry(SCEN_B, 1));
  
  asyncTest('B replies to broadcast', hlpr.reply(SCEN_B, SCEN_A, 'chnl1', 'this is my reply', SCEN_A));

  asyncTest('Wait 1 second. (Because read is asynchronous on the back-end, we have a race condition; waiting lets the back-end "win".)', function() { 
    setTimeout( function(){ expect(0); start(); }, 1000);
  });

  asyncTest('B gets msg notification summary, expects a decrease of one', hlpr.checkNotifSmry(SCEN_B, -1));
  

  
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
