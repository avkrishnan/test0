(function() {
  QUnit.config.testTimeout = 90000;
  QUnit.config.reorder = false;
 
  var hlpr = new ApiTestHelper();

  var SCEN_A = hlpr.TestScenario(); //Inviter
  
  var SCEN_B = hlpr.TestScenario(); //Invitee
  invAcct = hlpr.generateAccount();
  
  asyncTest('A enrolls', hlpr.enroll(SCEN_A));

  asyncTest('A logs in', hlpr.login(SCEN_A));

  asyncTest('A creates a channel', hlpr.createChannelF(SCEN_A, 'channel'));
  
  var invitation = {
      firstname: invAcct.firstname, 
      lastname: invAcct.lastname,
      emailaddress: invAcct.emailaddress
  };
  
  asyncTest('A invites B to follow channel', hlpr.inviteFollower(SCEN_A, 'channel', invitation));
  
  var invStore = {};

  asyncTest('Invite email sent', hlpr.checkVerifEmail(invStore, SCEN_A.ES.evernymService, invAcct.emailaddress, 'accept'));
  
  asyncTest("A's follower count is zero", hlpr.checkFollowCount(SCEN_A, 0));

  asyncTest('Invite accepted', hlpr.clickVerifyLink(invStore, 'invitation accepted'));

  asyncTest("A's follower count increases to one", hlpr.checkFollowCount(SCEN_A, 1));
  
  asyncTest('B enrolls', hlpr.enroll(SCEN_B, invAcct));

  asyncTest('B receives verification email', hlpr.checkVerifEmail(SCEN_B));
  
  asyncTest('B clicks verification link', hlpr.clickVerifyLink(SCEN_B));

  
  
  
  
  /*
  
  
  asyncTest('Verification email sent', hlpr.checkVerifEmail(SCEN_A));
  
  asyncTest('Verification link clicked', hlpr.clickVerifyLink(SCEN_A));

*/

})();
