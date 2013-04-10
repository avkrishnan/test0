define(['services/logger', 'durandal/plugins/router', 'services/authentication'],
	function (logger, router, authentication) {
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
				router.navigateTo('#/login?r=channelnew');
			},

			createChannelCommand = function () {
				router.navigateTo('#/login?r=channelnew');
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