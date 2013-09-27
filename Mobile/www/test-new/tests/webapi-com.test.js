﻿(function() {
	QUnit.config.testTimeout = 90000;
	QUnit.config.reorder = false;

	var api = new EvernymAPI();
	var hlpr = new ApiTestHelper(api);

	//module("group a");

	var SCEN_A = {};
	var SCEN_B = {};

	SCEN_A.account = {
	        accountname: "jason20",
			emailaddress: "jason+20@lawcasa.com",
			firstname: "Jason",
			lastname: "Law",
			password: "testtest"
		};
		
	SCEN_B.account = {
	        accountname: "jason21",
			emailaddress: "jason+21@lawcasa.com",
			firstname: "Jason",
			lastname: "Law",
			password: "testtest"
		};
		
	//debugger;
	//acctA.phonenumber = '801376334   8 ';
	//asyncTest('A enrolls', hlpr.enroll(SCEN_A, acctA));

	asyncTest('A logs in', hlpr.login(SCEN_A));

	//asyncTest('B enrolls', hlpr.enroll(SCEN_B));
	asyncTest('B logs in', hlpr.login(SCEN_B));
	
	asyncTest('A creates channel', hlpr.createChannelF(SCEN_A, 'chnl1'));
	asyncTest("B follows A's channel", hlpr.followChannel(SCEN_B, SCEN_A, 'chnl1'));
			
	//asyncTest('A verifies email address', hlpr.verify(SCEN_A));
	//asyncTest('B verifies email address', hlpr.verify(SCEN_B));

	var msgText = 'Hello everybody, this is a test broadcast!';
	
	asyncTest('A broadcasts a message', hlpr.broadcast(SCEN_A, 'chnl1', msgText, 'N'));
	asyncTest('B checks message', hlpr.fetchMsgs(SCEN_B, SCEN_A, 'chnl1'));

	//asyncTest('B receives email with message', hlpr.findEmail(SCEN_B, msgText));

})();