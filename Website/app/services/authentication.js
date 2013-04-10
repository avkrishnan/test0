define(['durandal/app', 'durandal/plugins/router', 'services/logger'],
  function (app, router, logger) {
    var
			// Private Properties
			cookieName = 'Evernym',

			// Methods
			createCookie = function (value) {
				$.cookie(cookieName, value, { expires: 7, path: '/' });
			},

			deleteCookie = function () {
				$.removeCookie(cookieName);
			},

			getCookie = function () {
				var cookie = $.cookie(cookieName);
				return cookie;
			},

			validateCookie = function () {
				var cookie = $.cookie(cookieName);
				if (!cookie) {
					return false;
				}
				return true;
			};

    return {
    	createCookie: createCookie,
    	deleteCookie: deleteCookie,
    	getCookie: getCookie,
    	validateCookie: validateCookie
    };
  });