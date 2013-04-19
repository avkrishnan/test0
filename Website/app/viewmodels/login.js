define(['services/logger', 'services/authentication', 'services/dataservice', 'models/login', 'durandal/plugins/router'],
	function (logger, authentication, dataService, loginModel, router) {
	    var
            // Properties
            title = 'Login',
            accountName = ko.observable(),
            password = ko.observable(),

            // Methods
            activate = function () {
		
		accountName("");
                password("");
		
                return true;
            },

            loginCommand = function () {
                var callbacks = {
                    success: loginSuccess,
                    error: loginError
                };

                loginModel.accountName = accountName();
                loginModel.password = password();

                dataService.account.accountLogin(loginModel, callbacks);
            },

            logoutCommand = function () {
                var cookie = authentication.getCookie();
                if (cookie) {
                    var callbacks = {
                        success: logoutSuccess,
                        error: logoutError
                    };
                    dataService.account.accountLogout(cookie, callbacks);
                    logger.log('You successfully logged out!', null, 'login', true);
                }
            },

            loginSuccess = function (args) {
                authentication.deleteCookie();
                if (args.accessToken) {
                    authentication.createCookie(args.accessToken);
                } else {
                    loginError();
                    return;
                }
                router.navigateTo('#/channellist');
                logger.log('You successfully logged in!', null, 'login', true);
            },

            loginError = function () {
                logger.logError('Your login failed, please try again!', null, 'login', true);
            },

            logoutSuccess = function () {
                authentication.deleteCookie();
                logger.logError('You successfully logged out!', null, 'login', true);
            },

            logoutError = function () {
                authentication.deleteCookie();
                logger.logError('Your log out failed, please try again!', null, 'login', true);
            };

	    return {
	        title: title,
	        activate: activate,
	        loginCommand: loginCommand,
	        accountName: accountName,
	        password: password
	    };
	});
