(function() {
  QUnit.config.testTimeout = 90000;
  QUnit.config.reorder = false;

  var hlpr = new ApiTestHelper();

  var SCEN_A = hlpr.TestScenario();
  var SCEN_B = hlpr.TestScenario();

  SCEN_A.account = hlpr.testjason20;

  SCEN_B.account = hlpr.testjason22;

  module('simple acknowledgment');

  asyncTest('A logs in', hlpr.login(SCEN_A));

  //asyncTest('B enrolls', hlpr.enroll(SCEN_B, SCEN_B.account));
  asyncTest('B logs in', hlpr.login(SCEN_B));

  asyncTest('A gets msg notification summary, establishes current unread count and last-created', hlpr.checkNotifSmry(SCEN_A));

  asyncTest('B gets msg notification summary, establishes current unread count and last-created', hlpr.checkNotifSmry(SCEN_B));
  
  asyncTest('A creates a channel', hlpr.createChannelF(SCEN_A, 'chnl1'));
  asyncTest("B follows A's channel", hlpr.followChannel(SCEN_B, SCEN_A, 'chnl1'));

  asyncTest('A broadcasts a message, requesting an iGi', hlpr.broadcast(SCEN_A, 'chnl1', "tell me, bro", 'N', undefined, 'RAC'));

  asyncTest('A checks message, confirming that iGi count is 0 and not-yet iGi count is 1', hlpr.fetchMsgsAsOwner(SCEN_A, SCEN_A, 'chnl1', undefined, {acks: 0, noacks: 1}));

  asyncTest('B gets msg notification summary, expects an increase of one', hlpr.checkNotifSmry(SCEN_B, 1));

  asyncTest('B gets msg notifications and the msg is there', hlpr.checkNotif(SCEN_B, SCEN_A, 1));
  
  asyncTest('B acknowledges message', hlpr.acknowledge(SCEN_B, SCEN_A));

  asyncTest('Wait 1 second. (Because read is asynchronous on the back-end, we have a race condition; waiting lets the back-end "win".)', hlpr.waitToStart());

  asyncTest('A confirms B as a message recipient that HAS acknowledged', hlpr.fetchMsgRecips(SCEN_A, 'chnl1', SCEN_B, 'Y'));

  asyncTest('A checks message, confirming that iGi count is 1 and not-yet iGi count is 0', hlpr.fetchMsgsAsOwner(SCEN_A, SCEN_A, 'chnl1', undefined, {acks: 1, noacks: 0}));

  asyncTest('B gets msg notification summary, expects a decrease of one', hlpr.checkNotifSmry(SCEN_B, -1));

  asyncTest('B gets msg notifications and the msg is no longer there', hlpr.checkNotif(SCEN_B, SCEN_A, 0));
  
  asyncTest('B gets channel messages', hlpr.checkChnlMsgsForFlwr(SCEN_B, SCEN_A, 'chnl1'));

  
  
  
  module('reply implies igi');

  asyncTest('A logs in', hlpr.login(SCEN_A));
  asyncTest('B logs in', hlpr.login(SCEN_B));

  asyncTest('A gets msg notification summary, establishes current unread count and last-created', hlpr.checkNotifSmry(SCEN_A));
  asyncTest('B gets msg notification summary, establishes current unread count and last-created', hlpr.checkNotifSmry(SCEN_B));

  asyncTest('A creates a channel', hlpr.createChannelF(SCEN_A, 'chnl2'));
  asyncTest("B follows A's channel", hlpr.followChannel(SCEN_B, SCEN_A, 'chnl2'));

  asyncTest('A broadcasts a message, requesting an iGi', hlpr.broadcast(SCEN_A, 'chnl2', "Reply to me, OK?", 'N', undefined, 'RAC'));
  asyncTest('A checks message, confirming that iGi count is 0 and not-yet iGi count is 1', hlpr.fetchMsgsAsOwner(SCEN_A, SCEN_A, 'chnl2', undefined, {acks: 0, noacks: 1}));
  asyncTest('B gets msg notification summary, expects an increase of one', hlpr.checkNotifSmry(SCEN_B, 1));
  asyncTest('B gets msg notifications and the msg is there', hlpr.checkNotif(SCEN_B, SCEN_A, 1));
  
  asyncTest('B replies to broadcast', hlpr.reply(SCEN_B, SCEN_A, 'chnl1', 'this is my reply', SCEN_A));
  asyncTest('Wait 1 second. (Because read is asynchronous on the back-end, we have a race condition; waiting lets the back-end "win".)', hlpr.waitToStart());
  asyncTest('B gets msg notification summary, expects a decrease of one', hlpr.checkNotifSmry(SCEN_B, -1));

  asyncTest('A confirms B as a message recipient that HAS acknowledged', hlpr.fetchMsgRecips(SCEN_A, 'chnl2', SCEN_B, 'Y'));
  asyncTest('A checks message, confirming that iGi count is 1 and not-yet iGi count is 0', hlpr.fetchMsgsAsOwner(SCEN_A, SCEN_A, 'chnl2', undefined, {acks: 1, noacks: 0}));
  
})();
