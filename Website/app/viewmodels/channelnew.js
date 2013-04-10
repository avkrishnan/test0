define(['services/logger', 'durandal/plugins/router', 'services/authentication'],
	function (logger, router, authentication) {
		var
			// Properties
			title = 'Create a New Channel',
			name = ko.observable(),

			// Methods
			activate = function () {
			    return true;
			},

			createChannelCommand = function () {
				router.navigateTo('#/login?r=channelnew');
			};

		return {
			title: title,
			name: name,
			isAuthenticated: isAuthenticated,
			activate: activate,
			createChannelCommand: createChannelCommand
		};
	});