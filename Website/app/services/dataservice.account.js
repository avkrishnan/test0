define(['services/logger', 'services/config'],
	function (logger, config) {
   	var
			appToken = config.appToken,
			baseUrl = config.baseUrl,

			init = function () {
				amplify.request.define('enroll', 'ajax', {
					url: baseUrl + '/account/enroll',
					dataType: 'json',
					type: 'POST',
					contentType: 'application/json'
				}),

				amplify.request.define('login', 'ajax', {
					url: baseUrl + '/account/login',
					dataType: 'json',
					type: 'POST',
					contentType: 'application/json'
				})
			},

			accountEnroll = function (accountModel, callbacks) {
				logger.log('Trying dataservice.account.accountEnroll', null, 'dataservice.account', true);
				var account = {
					accountName: accountModel.accountName,
					emailaddress: accountModel.emailaddress,
					password: accountModel.password,
					firstname: accountModel.firstname,
					lastname: accountModel.lastname,
					appToken: appToken
				};

				var data = JSON.stringify(account);

				return amplify.request({
					resourceId: 'enroll',
					data: data,
					success: callbacks.success,
					error: callbacks.error
				});
			},

			accountLogin = function (loginModel, callbacks) {
				var data = JSON.stringify(loginModel);
				return amplify.request({
					resourceId: 'login',
					data: data,
					success: callbacks.success,
					error: callbacks.error
				});
			},

            accountLogin2 = function (loginModel, callbacks) {
                $.ajax({
                    type: "POST",
                    url: baseUrl + '/account/login',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify(loginModel),
                    statusCode: {
                        200: callbacks.success,
                        201: callbacks.success,
                        204: callbacks.success,
                        400: callbacks.error,
                        500: callbacks.error,
                        501: callbacks.error
                    }
                })
            },

            accountLogout = function (authKey, callbacks) {
				amplify.request.define('logout', 'ajax', {
					url: baseUrl + '/account/logout',
					type: 'POST',
					dataType: 'json',
					contentType: 'application/json',
					beforeSend: function (xhr) {
						logger.logError('Setting the authorization headers', null, 'dataservice', true);
						xhr.setRequestHeader('Authorization', authKey);
						return true;
					},
					success: callbacks.success,
					error: callbacks.error
				});
			};

    	init();

    	return {
    		accountEnroll: accountEnroll,
    		accountLogin: accountLogin2,
    		accountLogout: accountLogout
    	}
	});