(function () {
	QUnit.config.testTimeout = 10000;

	var okAsync = QUnit.okAsync,
	stringformat = QUnit.stringformat;

    //var baseUrl = 'http://qupler.no-ip.org:8080/api12/rest', // Test environment
	//var baseUrl = 'http://localhost:8080/api/rest', //local environment
	//var baseUrl = 'http://192.168.1.202:8080/api12/rest', //production environment through local network

 
	var testAccount,
	testAccessToken;

	module('Web API Account Tests', {
		setup: function () {
			//testUrl = stringformat('{0}/account/enroll', baseUrl);
		}
	});

	var timoutms = 15000;


	test('CREATE CHANNEL', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var account = generateAccount();
		var channel = generateChannel();
		var accessToken;
		enroll(account, expectSuccessNoContent, step1);
        function step1(){
            checkEmailAndVerify(account.emailaddress, step2);
        }
		function step2() {
			login(generateLogin(account), expectSuccess, step3);
		}
		function step3(data) {
			accessToken = data.accessToken;
			createChannel(accessToken, channel, expectCreated);
		}
	});


	test('DELETE CHANNEL', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var account = generateAccount();
		var channel1 = generateChannel();
		var channel2 = generateChannel();
		var channelid1 = '';
		var channelid2 = '';
		var accessToken;
		enroll(account, expectSuccessNoContent, step1);
         
        function step1(){
            console.log('check email and verify');
            checkEmailAndVerify(account.emailaddress, step2);
        }
         
		function step2() {
            console.log('login');
			login(generateLogin(account), expectSuccess, step3a);
		}
         
		function step3a(data) {
			accessToken = data.accessToken;
            console.log('create channel');
			createChannel(accessToken, channel1, expectCreated, step3b);
		}
		function step3b(data) {
			channelid1 = data.id;
            console.log('create second channel');
			createChannel(accessToken, channel2, expectCreated, step4);
		}
		function step4(data) {
			channelid2 = data.id;
			// delete the second channel
            console.log('delete second channel');
			deleteChannel(accessToken, channelid2, expectSuccessNoContent, step5);
		}
		function step5(data) {
            console.log('list owner channels');
			listOwnerChannels(accessToken, expectSuccess, step6);
		}
		function step6(data) {
			equal(data.channel.length, 1, "only one channel remains");
			
			equal(channelid1, data.channel[0].id, "the correct channel is remaining");
			start();
		}
		
	});

	test('DELETE WITH MESSAGES', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var account = generateAccount();
		var channel1 = generateChannel();
		var channel2 = generateChannel();
		var channelid1 = '';
		var channelid2 = '';
		var accessToken;
		enroll(account, expectSuccessNoContent, step1);
        function step1(){
            console.log('check email and verify');
            checkEmailAndVerify(account.emailaddress, step2);
        }
		function step2() {
			login(generateLogin(account), expectSuccess, step3a);
		}
		function step3a(data) {
			accessToken = data.accessToken;
			// create channel 1
			createChannel(accessToken, channel1, expectCreated, step3b);
		}
		function step3b(data) {
			channelid1 = data.id;
			// create channel 2
			createChannel(accessToken, channel2, expectCreated, step4);
		}
		function step4(data) {
			channelid2 = data.id;
			// send a message on channel 2
			sendMessage(accessToken, channelid2, { text: 'HERE IS A TEST MESSAGE ON CHANNEL 2', type: 'FYI' }, expectCreated, step5);
		}
		function step5(data) {
			// delete Channel 2 which contains a message
			deleteChannel(accessToken, channelid2, expectSuccessNoContent, step6);
		}
		function step6(data) {
			listOwnerChannels(accessToken, expectSuccess, step8);
		}
		function step8(data) {
			equal(data.channel.length, 1, "only one channel remains");

			equal(channelid1, data.channel[0].id, "the correct channel is remaining");
			start();
		}
	});

	test('NO AUTH WITH CREATE CHANNEL', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var channel = generateChannel();
		var accessToken = 'asdfasdf';
		createChannel(accessToken, channel, expectBadRequest);
	});

	test('CREATE DUPLICATE CHANNEL FAIL', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var account = generateAccount();
		var channel = generateChannel();
		var accessToken;
		enroll(account, expectSuccessNoContent, step2);
		function step2() {
			login(generateLogin(account), expectSuccess, step3);
		}
		function step3(data) {
			accessToken = data.accessToken;
			createChannel(accessToken, channel, expectCreated, step4);
		}
		function step4(data) {
			createChannel(accessToken, channel, expectBadRequest );
            start();
		}
	});

 
	test('GET A CHANNEL I OWN', function () {
	  stop(timoutms); //tell qunit to wait 5 seconds before timing out
	  var account = generateAccount();
	  var accessToken;
      var channel = generateChannel();
      
	  enroll(account, expectSuccessNoContent, step1);
      function step1(){
          checkEmailAndVerify(account.emailaddress, step2);
      }
	  
	  function step2() {
	  login(generateLogin(account), expectSuccess, step3);
	  }
	  function step3(data) {
	  accessToken = data.accessToken;
	  createChannel(accessToken, channel, expectCreated, step4);
	  }
	  function step4(data) {
		 
		 getChannel(accessToken, data.id, expectSuccess, step5);
	  }
	  function step5(data){
		 ok(true, JSON.stringify(data));
		 start();
		 
	  }
	});
 
	test('LIST CHANNELS', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var account = generateAccount();
		var accessToken;
		enroll(account, expectSuccessNoContent, step2);
		var channel = generateChannel();
		function step2() {
			login(generateLogin(account), expectSuccess, step3);
		}
		function step3(data) {
			accessToken = data.accessToken;
			createChannel(accessToken, channel, expectCreated, step4);
		}
		function step4(data) {
			listOwnerChannels(accessToken, expectSuccess);
            start();
		}
	});
 
 
 test('LIST CHANNELS BUT ZERO CHANNELS', function () {
	  stop(timoutms); //tell qunit to wait 5 seconds before timing out
	  var account = generateAccount();
	  var accessToken;
	  enroll(account, expectSuccessNoContent, step2);
	  var channel = generateChannel();
	  function step2() {
	  login(generateLogin(account), expectSuccess, step3);
	  }
	  function step3(data) {
	      accessToken = data.accessToken;
	  
	      listOwnerChannels(accessToken, expectSuccess);
          start();
	  }
	  });

	test('SEND MESSAGE ON CHANNEL', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var account = generateAccount();
		var accessToken;
		enroll(account, expectSuccessNoContent, step1);
        var channel = generateChannel();
        var channelid = '';
         
        function step1(){
            checkEmailAndVerify(account.emailaddress, step2);
        }
         
        
		function step2() {
			login(generateLogin(account), expectSuccess, step3);
		}
		function step3(data) {
			accessToken = data.accessToken;
			createChannel(accessToken, channel, expectCreated, step4);
		}
		function step4(data) {
			listOwnerChannels(accessToken, expectSuccess, step5);
		}
		function step5(data){
			ok(true, JSON.stringify(data));
			channelid = data.channel[0].id;
			sendMessage(accessToken, channelid, {text: 'HERE IS A MESSAGE 01', type: 'FYI'}, expectCreated ); // 'FYI','RAC','ACK'
            start();
		}
	});


	test('GET MESSAGES ON CHANNEL', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		var account = generateAccount();
		var accessToken;
        var channel = generateChannel();
        var channelid = '';
         
		enroll(account, expectSuccessNoContent, step1);
        
        function step1(){
            checkEmailAndVerify(account.emailaddress, step2);
        }
         
		
		function step2() {
			login(generateLogin(account), expectSuccess, step3);
		}
		function step3(data) {
			accessToken = data.accessToken;
			createChannel(accessToken, channel, expectCreated, step4);
		}
		function step4(data) {
			listOwnerChannels(accessToken, expectSuccess, step5);
		}
		function step5(data){
			ok(true, JSON.stringify(data));
			channelid = data.channel[0].id;
			sendMessage(accessToken, channelid, {text: 'HERE IS A MESSAGE 01', type: 'FYI'}, expectCreated, step6 ); // 'FYI','RAC','ACK'
		}
		function step6(data){
			ok(true, JSON.stringify(data));
			getMessages(accessToken, channelid, expectSuccess, step7 ); // 'FYI','RAC','ACK'
		}
		function step7(data){
			ok(true, JSON.stringify(data));
			start();
		}
	});
 
 
	test('NO MESSAGES ON CHANNEL', function () {
	    stop(timoutms); //tell qunit to wait 5 seconds before timing out
	    var account = generateAccount();
	    var accessToken;
	    enroll(account, expectSuccessNoContent, step2);
	    var channel = generateChannel();
	    var channelid = '';
	    function step2() {
	        login(generateLogin(account), expectSuccess, step3);
	    }
	    function step3(data) {
	        accessToken = data.accessToken;
	        createChannel(accessToken, channel, expectCreated, step4);
	    }
	    function step4(data) {
	        listOwnerChannels(accessToken, expectSuccess, step5);
	    }
	    function step5(data) {
	        ok(true, JSON.stringify(data));
	        channelid = data.channel[0].id;

	        getMessages(accessToken, channelid, expectSuccess, step7); // 'FYI','RAC','ACK'
	    }
	    function step7(data) {
	        ok(true, JSON.stringify(data));
	        start();
	    }
	});




 
 


})();
