define(['services/logger', 'services/config'],
	function (logger, config) {
	    var
            baseUrl = config.baseUrl,

            createChannel = function (authkey, channel, callbacks) {
                var data = JSON.stringify(channel);

                amplify.request.define('createChannel', 'ajax', {
                    url: baseUrl + '/channel/',
                    type: 'POST',
                    contentType: 'application/json',
                    beforeSend: function (xhr) {
                        logger.logError('Setting the authorization headers', null, 'dataservice', true);
                        xhr.setRequestHeader('Authorization', authKey);
                        return true;
                    },
                    data: data,
                    success: callbacks.success,
                    error: callbacks.error
                });
            },
	        updateChannel = function (authkey, channel, callbacks) {
	            var data = JSON.stringify(channel);

	            amplify.request.define('updateChannel', 'ajax', {
	                url: baseUrl + '/channel/',
	                type: 'PUT',
	                contentType: 'application/json',
	                beforeSend: function (xhr) {
	                    logger.logError('Setting the authorization headers', null, 'dataservice', true);
	                    xhr.setRequestHeader('Authorization', authKey);
	                    return true;
	                },
	                data: data,
	                success: callbacks.success,
	                error: callbacks.error
	            });
	        },
            getChannels = function (authkey, callbacks) {
                amplify.request.define('getChannels', 'ajax', {
                    url: baseUrl + '/channel/',
                    type: 'GET',
                    contentType: 'application/json',
                    beforeSend: function (xhr) {
                        logger.logError('Setting the authorization headers', null, 'dataservice', true);
                        xhr.setRequestHeader('Authorization', authKey);
                        return true;
                    },
                    success: callbacks.success,
                    error: callbacks.error
                });
            },
	        getChannel = function (authkey, id, callbacks) {
	            amplify.request.define('getChannel', 'ajax', {
	                url: baseUrl + '/channel/{id}',
	                type: 'GET',
	                contentType: 'application/json',
	                beforeSend: function (xhr) {
	                    logger.logError('Setting the authorization headers', null, 'dataservice', true);
	                    xhr.setRequestHeader('Authorization', authKey);
	                    return true;
	                },
	                data: { id: id },
	                success: callbacks.success,
	                error: callbacks.error
	            });
	        },
	        deleteChannel = function (authkey, id, callbacks) {
	            amplify.request.define('deleteChannel', 'ajax', {
	                url: baseUrl + '/channel/{id}',
	                type: 'DELETE',
	                contentType: 'application/json',
	                beforeSend: function (xhr) {
	                    logger.logError('Setting the authorization headers', null, 'dataservice', true);
	                    xhr.setRequestHeader('Authorization', authKey);
	                    return true;
	                },
	                data: { id: id },
	                success: callbacks.success,
	                error: callbacks.error
	            });
	        },
	        followChannel = function (authkey, id, callbacks) {
	            amplify.request.define('followChannel', 'ajax', {
	                url: baseUrl + '/channel/{id}/follow',
	                type: 'POST',
	                contentType: 'application/json',
	                beforeSend: function (xhr) {
	                    logger.logError('Setting the authorization headers', null, 'dataservice', true);
	                    xhr.setRequestHeader('Authorization', authKey);
	                    return true;
	                },
	                data: { id: id },
	                success: callbacks.success,
	                error: callbacks.error
	            });
	        },
	        unFollowChannel = function (authkey, id, callbacks) {
	            amplify.request.define('unFollowChannel', 'ajax', {
	                url: baseUrl + '/channel/{id}/unfollow',
	                type: 'DELETE',
	                contentType: 'application/json',
	                beforeSend: function (xhr) {
	                    logger.logError('Setting the authorization headers', null, 'dataservice', true);
	                    xhr.setRequestHeader('Authorization', authKey);
	                    return true;
	                },
	                data: { id: id },
	                success: callbacks.success,
	                error: callbacks.error
	            });
	        };
            
	    return {
	        createChannel: createChannel,
	        updateChannel: updateChannel,
    	    getChannels: getChannels,
    	    getChannel: getChannel,
    	    deleteChannel: deleteChannel,
    	    followChannel: followChannel,
    	    unFollowChannel: unFollowChannel
    	}
	});