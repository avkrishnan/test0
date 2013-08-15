(function () {
	QUnit.config.testTimeout = 10000;

	var okAsync = QUnit.okAsync,
		stringformat = QUnit.stringformat;

	 
 
	var testAccount,
		testAccessToken;

	module('Web API Account Tests', {
		setup: function () {
			//testUrl = stringformat('{0}/enroll', baseUrl);
		}
	});

	var timoutms = 15000;

	test('TEST ENROLLMENT', function () {
        
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
        var api = new EvernymAPI();
		api.enroll(null, api.HANDLER.expectSuccessNoContent);
	});

	test('TEST DUPLICATE ENROLLMENT', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
        var api = new EvernymAPI();
		var account = api.generateAccount();

		api.enroll(
			account,
			api.HANDLER.expectSuccessNoContent,
			function () {
				api.enroll(account, api.HANDLER.expectBadRequest)
			}
		);

	});

	test('LOGIN', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
        var api = new EvernymAPI();
		var account = api.generateAccount();

		api.enroll(account, api.HANDLER.expectSuccessNoContent, step2);

		function step2() {
			api.login(api.generateLogin(account), api.HANDLER.expectSuccess, step3);
		}

		function step3(data) {
			ok(data, 'no data returned');
			ok(data.accessToken, 'no access token found');
			equal(data.accessToken.length, 32, 'access token should be 32 characters');
			start();
		}

	});
 
 
    test('GET COMMUNICATION SETTINGS', function () {
      stop(timoutms); //tell qunit to wait 5 seconds before timing out
      var api = new EvernymAPI();
      var account = api.generateAccount();
      var accessToken;
      
      api.enroll(account, api.HANDLER.expectSuccessNoContent, step2);
      
      function step2() {
          api.login(api.generateLogin(account), api.HANDLER.expectSuccess, step3);
      }
      function step3(data) {
         
         
         ok(data, 'check for data from login');
         ok(data.accessToken, 'check for access token: ' + data.accessToken);
         equal(data.accessToken.length, 32, 'access token should be 32 characters: ' + data.accessToken.length);
         
         
         accessToken = data.accessToken;
         api.getCommunicationMethods(accessToken, api.HANDLER.expectSuccess, step4 );
         
         
       }
       function step4(data){
         
         ok(!is_empty(data), 'check for communication settings: ' + JSON.stringify(data));
         
         start();
         
       }
         
         
         
         
      });
 
 
 

	test('INVALID LOGIN', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
        var api = new EvernymAPI();
		api.login(api.generateLogin(api.generateAccount()), api.HANDLER.expectUnauthorized);

	});

	test('LOGOUT', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
        var api = new EvernymAPI();
		var account = api.generateAccount();
		var accessToken;

		api.enroll(account, api.HANDLER.expectSuccessNoContent, step2);

		function step2() {
			api.login(api.generateLogin(account), api.HANDLER.expectSuccess, step3);
		}

		function step3(data) {
			accessToken = data.accessToken;
			api.logout(accessToken, api.HANDLER.expectSuccessNoContent);
		}

	});
 
	 test('FORGOT PASSWORD', function () {
	  stop(timoutms); //tell qunit to wait 5 seconds before timing out
	  var api = new EvernymAPI();
	  var account = api.generateAccount();
	  var accessToken;
          
      var times = 0;
         
	  
	  api.enroll(account, api.HANDLER.expectSuccessNoContent, step2);
	  
	  function step2() {
          
		  api.login(api.generateLogin(account), api.HANDLER.expectSuccess, step3);
	  }
                    
      function step3(){
         
          api.checkEmailAndVerify(account.emailaddress, step4);
      }

          
        function step4(data){
        
                  
          api.forgot({accountName: account.accountName, emailAddress: account.emailaddress}, api.HANDLER.expectSuccessNoContent, function(){console.log('done')});
              start();
          }
     
	  
	  });

	test('NAME TOO LONG', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
        var api = new EvernymAPI();
		var account = api.generateAccount();
         

		account.accountName =
			'01234567890123456789012345678901234567890123456789' +
			'01234567890123456789012345678901234567890123456789' +
			'01234567890123456789012345678901234567890123456789' +
			'01234567890123456789012345678901234567890123456789' +
			'01234567890123456789012345678901234567890123456789' +
			'01234567890123456789012345678901234567890123456789' +
			'01234567890123456789012345678901234567890123456789' +
			'01234567890123456789012345678901234567890123456789' +
			'01234567890123456789012345678901234567890123456789' +
			'01234567890123456789012345678901234567890123456789';

		api.enroll(account, api.HANDLER.expectBadRequest);
	});

	test('TEST BAD ENROLLMENT - NAME TOO SHORT', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
        var api = new EvernymAPI();
		var account = api.generateAccount();
		account.accountName = 'hi';
		api.enroll(account, api.HANDLER.expectBadRequest);
	});
 
 

 

	
})();
