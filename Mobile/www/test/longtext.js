(function() {
  QUnit.config.testTimeout = 90000;
  QUnit.config.reorder = false;

  var hlpr = new ApiTestHelper();

  var SCEN_A = hlpr.TestScenario();
  var SCEN_B = hlpr.TestScenario();

  SCEN_A.account = hlpr.testjason21;

  SCEN_B.account = hlpr.testjason22;

  // debugger;
  // acctA.phonenumber = '801376334 8 ';
  // asyncTest('A enrolls', hlpr.enroll(SCEN_A, acctA));

  asyncTest('A logs in', hlpr.login(SCEN_A));

  // asyncTest('B enrolls', hlpr.enroll(SCEN_B));
  asyncTest('B logs in', hlpr.login(SCEN_B));

  asyncTest('A creates channel', hlpr.createChannelF(SCEN_A, 'chnl1'));
  asyncTest("B follows A's channel", hlpr.followChannel(SCEN_B, SCEN_A, 'chnl1'));

  var text1 = 'This is short message.';
  var text2 = 'This is very long message... not super long, but still longer than 160 characters. I wonder how it will look on my phone. Will it be too long? Gee wiz, I hope not. Well looks like this is it.';
  var text3 = 'This is very long message... not super long, but still longer than 160 characters. I wonder how it will look on my phone. Will it be too long? Gee wiz, I hope not. That would be very very bad. More and more and more is required to get to three text messages... this is a lot of typing. My fingers are just getting so sore right about now. Well looks like this is it.';

  asyncTest('A broadcasts a FAST message', hlpr.broadcast(SCEN_A, 'chnl1', text3, 'F'));
  
})();
