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

  // module("group a");

  var androidPushPrefix = 'GCM';
  var applePushPrefix = 'APN';
  var jasonsAndroidRegId = 'APA91bEfh9fWKaslF2ajSNDRt_zV7NwaPBxaEr5p4oo_1p50AR82W8HoAy9-jQ4aK9kjrt1gQv9SoJByPPmgNTmxf49x1TKY6yh1_kXRgTAyBkCbLhAxLTDK4bgmJygYrw78-HzonMw_ssk2J0fKuPdVcryAqakaeQ'; 
  var comMethodName = 'my Android Phone';
  
  //the following makes sure the com methods are attached to the scenario so the delete by name below can work.
  asyncTest('B fetches com methods', hlpr.getCommethods(SCEN_B));
  
  asyncTest('B deletes push com method', hlpr.deleteCommethod(SCEN_B, comMethodName));

  asyncTest('B creates push com method', hlpr.createPushComMethod(SCEN_B,
      androidPushPrefix + ':' + jasonsAndroidRegId,
      comMethodName
    ));

  asyncTest('A creates channel', hlpr.createChannelF(SCEN_A, 'chnl1'));
  asyncTest("B follows A's channel", hlpr.followChannel(SCEN_B, SCEN_A, 'chnl1'));

  // asyncTest('A verifies email address', hlpr.verify(SCEN_A));
  // asyncTest('B verifies email address', hlpr.verify(SCEN_B));

  var msgText = 'Hello everybody, this is a test broadcast!';

  asyncTest('A broadcasts a FAST message', hlpr.broadcast(SCEN_A, 'chnl1', msgText, 'F'));
  
  asyncTest('B deletes push com method', hlpr.deleteCommethod(SCEN_B, comMethodName));
  
})();
