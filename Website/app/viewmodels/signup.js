define(['services/logger', 'services/authentication', 'services/dataservice'],
	function (logger, authentication, dataService, loginModel) {
		var
			// Properties
			title = 'Get Your Evernym Now!',
			accountName = ko.observable(),
			password = ko.observable(),
			emailaddress = ko.observable(),
			firstname = ko.observable(),
			lastname = ko.observable(),

			// Methods
			activate = function () {
				return true;
			},
			
			generateAccount = function() {
			    return {
				accountName: accountName(), // Create Random AccountName Generator
				emailaddress: emailaddress(),
				password: password(),
				firstname: firstname(),
				lastname: lastname()
			    };
		        }

			signUpCommand = function () {
				var callbacks = {
					success: signUpSuccess,
					error: signUpError
				};

                                
				var account = generateAccount();

				dataService.account.accountEnroll(account, callbacks);
			},

			signUpSuccess = function (args) {
				
				logger.log('You successfully signed up!', null, 'signup', true);
			},

			signUpError = function () {
				logger.logError('signup failed!', null, 'signup', true);
			};
;

		return {
			title: title,
			emailaddress: emailaddress,
			accountName: accountName,
			password: password,
			firstname: firstname,
			lastname: lastname,
			signUpCommand: signUpCommand
			
		};
	});