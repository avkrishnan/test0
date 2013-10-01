(function() {
	QUnit.config.testTimeout = 90000;
	QUnit.config.reorder = false;

	var api = new EvernymAPI();
	var hlpr = new ApiTestHelper(api);

	//module("group a");

	var SCEN_A = {};
	var SCEN_B = {};

	SCEN_A.account = {
	        accountname: "chicken02",
			emailaddress: "degraffenried+chicken02@gmail.com",
			firstname: "Jared",
			lastname: "DeGraffenried",
			password: "password"
		};
		
	SCEN_B.account = {
	        accountname: "chicken08",
			emailaddress: "degraffenried+chicken08@gmail.com",
			firstname: "Jared",
			lastname: "DeGraffenried",
			password: "password"
		};
		
	
	//debugger;
	//acctA.phonenumber = '801376334   8 ';
	//asyncTest('A enrolls', hlpr.enroll(SCEN_A, acctA));

	asyncTest('A logs in', hlpr.login(SCEN_A));

	//asyncTest('B enrolls', hlpr.enroll(SCEN_B));
	asyncTest('B logs in', hlpr.login(SCEN_B));

	asyncTest('CREATE PUSH COM METHOD', hlpr.createPushComMethod(SCEN_B, "GCM:XPA91bH-aHSjBDpinkLbb0L9c9Q8JYXpxOT_2a53UVoHE6t4NQpnB9X79WaXgWhdaee4cSv4GOkpigQrpb5mO3WkBtVY4qSPoBzIpRGs2XefZ-ftwqk30TLRfXAhmlyxHo1VPhCAflJgqY9eB_8TCaT9zfkCsn5rkg", "-1"));

	asyncTest('A creates channel', hlpr.createChannelF(SCEN_A, 'chnl1'));
	asyncTest("B follows A's channel", hlpr.followChannel(SCEN_B, SCEN_A, 'chnl1'));
			
	//asyncTest('A verifies email address', hlpr.verify(SCEN_A));
	//asyncTest('B verifies email address', hlpr.verify(SCEN_B));

	var msgText = 'Hello everybody, this is a test broadcast!';
	
	asyncTest('A broadcasts a message', hlpr.broadcast(SCEN_A, 'chnl1', msgText, 'TS'));
	asyncTest('B checks message', hlpr.fetchMsgs(SCEN_B, SCEN_A, 'chnl1'));

	//asyncTest('B receives email with message', hlpr.findEmail(SCEN_B, msgText));

})();
