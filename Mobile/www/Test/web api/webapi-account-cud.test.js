(function () {
	QUnit.config.testTimeout = 10000;

	var okAsync = QUnit.okAsync,
		stringformat = QUnit.stringformat;

	 
 
	var testAccount,
		testAccessToken;

	module('Web API Account Tests', {
		setup: function () {
			testUrl = stringformat('{0}/enroll', baseUrl);
		}
	});

	var timoutms = 15000;

	test('TEST ENROLLMENT', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out
		enroll(null, expectSuccessNoContent);
	});

	test('TEST DUPLICATE ENROLLMENT', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out

		var account = generateAccount();

		enroll(
			account,
			expectSuccessNoContent,
			function () {
				enroll(account, expectBadRequest)
			}
		);

	});

	test('LOGIN', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out

		var account = generateAccount();

		enroll(account, expectSuccessNoContent, step2);

		function step2() {
			login(generateLogin(account), expectSuccess, step3);
		}

		function step3(data) {
			ok(data, 'no data returned');
			ok(data.accessToken, 'no access token found');
			equal(data.accessToken.length, 32, 'access token should be 32 characters');
			start();
		}

	});

	test('INVALID LOGIN', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out

		login(generateLogin(generateAccount()), expectUnauthorized);

	});

	test('LOGOUT', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out

		var account = generateAccount();
		var accessToken;

		enroll(account, expectSuccessNoContent, step2);

		function step2() {
			login(generateLogin(account), expectSuccess, step3);
		}

		function step3(data) {
			accessToken = data.accessToken;
			logout(accessToken, expectSuccessNoContent);
		}

	});
 
	 test('FORGOT PASSWORD', function () {
	  stop(timoutms); //tell qunit to wait 5 seconds before timing out
	  
	  var account = generateAccount();
	  var accessToken;
          
      var times = 0;
         
	  
	  enroll(account, expectSuccessNoContent, step2);
	  
	  function step2() {
          
		  login(generateLogin(account), expectSuccess, step3);
	  }
                    
      function step3(){
         
          checkEmailAndVerify(account.emailaddress, step4);
      }

          
        function step4(data){
        
                  
          forgot({accountName: account.accountName, emailAddress: account.emailaddress}, expectSuccessNoContent, function(){console.log('done')});
              start();
          }
     
	  
	  });

	test('TEST BAD ENROLLMENT - NAME TOO LONG', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out

		var account = generateAccount();
         

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

		enroll(account, expectBadRequest);
	});

	test('TEST BAD ENROLLMENT - NAME TOO SHORT', function () {
		stop(timoutms); //tell qunit to wait 5 seconds before timing out

		var account = generateAccount();
		account.accountName = 'hi';
		enroll(account, expectBadRequest);
	});
 
 

 

	
})();
