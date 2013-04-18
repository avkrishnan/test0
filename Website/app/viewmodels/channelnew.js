define(['services/logger', 'durandal/plugins/router', 'services/authentication', 'services/dataservice'],
	function (logger, router, authentication, dataService) {
		var
			// Properties
			title = 'Create a New Channel',
			name = ko.observable(),
			isAuthenticated = ko.observable(true),

			// Methods
			activate = function () {
				var result = authentication.validateCookie();
				if (result === false) {
					return false;
				} else {
					return true;
				}
			},

			routeToLogin = function () {
				router.navigateTo('#/login');
			},

                        successfulCreate = function(data){
                            logger.log('success creating channel', null, 'dataservice', true);
                            router.navigateTo('#/channellist');
                        },

                        errorCreate = function(data){
                            logger.log('error creating channel', null, 'dataservice', true);
                        },

			createChannelCommand = function () {
                            //inputChannelName
                            logger.log('start creating channel ' + this.name() , null, 'dataservice', true);
                            dataService.channel.createChannel({name: this.name()}, {success: successfulCreate, error: errorCreate}); 
			};

		return {
			title: title,
			name: name,
			isAuthenticated: isAuthenticated,
			activate: activate,
			routeToLogin: routeToLogin,
			createChannelCommand: createChannelCommand
		};
	});
