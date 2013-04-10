define(['services/logger', 'services/config'],
	function (logger, config) {
	    var
            baseUrl = config.baseUrl,

            createChannelMessage = function (authkey, channelId, message, callbacks) {
                var data = JSON.stringify(message);

                amplify.request.define('createChannelMessage', 'ajax', {
                    url: baseUrl + '/channel/{channelId}/message/',
                    type: 'POST',
                    contentType: 'application/json',
                    beforeSend: function (xhr) {
                        logger.logError('Setting the authorization headers', null, 'dataservice', true);
                        xhr.setRequestHeader('Authorization', authKey);
                        return true;
                    },
                    data: { channelId: channelId },
                    success: callbacks.success,
                    error: callbacks.error
                });
            },
            getChannelMessages = function (authkey, channelId, callbacks) {
                amplify.request.define('getChannelMessages', 'ajax', {
                    url: baseUrl + '/channel/{channelId}/message/',
                    type: 'GET',
                    contentType: 'application/json',
                    beforeSend: function (xhr) {
                        logger.logError('Setting the authorization headers', null, 'dataservice', true);
                        xhr.setRequestHeader('Authorization', authKey);
                        return true;
                    },
                    data: { channelId: channelId },
                    success: callbacks.success,
                    error: callbacks.error
                });
            },
            getChannelMessage = function (authkey, channelId, id, callbacks) {
                amplify.request.define('getChannelMessages', 'ajax', {
                    url: baseUrl + '/channel/{channelId}/message/{id}',
                    type: 'GET',
                    contentType: 'application/json',
                    beforeSend: function (xhr) {
                        logger.logError('Setting the authorization headers', null, 'dataservice', true);
                        xhr.setRequestHeader('Authorization', authKey);
                        return true;
                    },
                    data: { channelId: channelId, id: id },
                    success: callbacks.success,
                    error: callbacks.error
                });
            };

	    return {
	        createChannelMessage: createChannelMessage,
	        getChannelMessages: getChannelMessages,
	        getChannelMessage: getChannelMessage
	    }
	});