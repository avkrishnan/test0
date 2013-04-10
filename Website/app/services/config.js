define(['services/logger'],
    function (logger) {
        var
            baseUrl = 'http://qupler.no-ip.org:8080/catalyst-api/rest',

            appToken = 'sNQO8tXmVkfQpyd3WoNA6_3y2Og=';

        return {
            baseUrl: baseUrl,
            appToken: appToken
        }
	});