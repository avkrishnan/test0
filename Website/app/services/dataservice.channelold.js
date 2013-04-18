define(['services/logger', 'services/config', 'services/authentication'],
	function (logger, config, authentication) {
	    var
            baseUrl = config.baseUrl,
            init = function () {
		logger.log('initializing request ', null, 'dataservice', true);
		amplify.request.define('addchannel', 'ajax', {
		url: baseUrl + '/channel',
		    dataType: 'json',
		    type: 'POST',
                    beforeSend: function (xhr) {
                        var authKey = getCookie();
			logger.log('Setting the authorization headers', null, 'dataservice', true);
			xhr.setRequestHeader('Authorization', authKey);
			return true;
		    },
		    contentType: 'application/json'
		}),

		amplify.request.define('getchannel', 'ajax', {
		    url: baseUrl + '/channel',
		    dataType: 'json',
		    type: 'GET',
                    beforeSend: function (xhr) {
                        var authKey = getCookie();
			logger.log('Setting the authorization headers', null, 'dataservice', true);
			xhr.setRequestHeader('Authorization', authKey);
			return true;
                    },
		    contentType: 'application/json'
		})

	    },

            getCookie = function () {
                var cookie = authentication.getCookie();
                if (cookie) {
                    return cookie;
                }
                    return undefined;
            },

            createChannel = function (channelname, callbacks) {
                var channel = {name: channelname}; 
                var data = JSON.stringify(channel);
          
		logger.log('starting to add channel ' + channelname , null, 'dataservice', true);

		return amplify.request({
		    resourceId: 'addchannel',
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
	                    logger.log('Setting the authorization headers', null, 'dataservice', true);
	                    xhr.setRequestHeader('Authorization', authKey);
	                    return true;
	                },
	                data: data,
	                success: callbacks.success,
	                error: callbacks.error
	            });
	        },
            getChannels = function (callbacks) {

		logger.log('starting to get  channels ' , null, 'dataservice.channel', true);

		return amplify.request({
		    resourceId: 'getchannel',
		    data: undefined,
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
	                    logger.log('Setting the authorization headers', null, 'dataservice', true);
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
	                    logger.log('Setting the authorization headers', null, 'dataservice', true);
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
	                    logger.log('Setting the authorization headers', null, 'dataservice', true);
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
	                    logger.log('Setting the authorization headers', null, 'dataservice', true);
	                    xhr.setRequestHeader('Authorization', authKey);
	                    return true;
	                },
	                data: { id: id },
	                success: callbacks.success,
	                error: callbacks.error
	            });
	        };

            init();
            
	    return {
	        createChannel: createChannel,
	        updateChannel: updateChannel,
    	    getChannels: getChannels,
    	    getCookie: getCookie,
    	    getChannel: getChannel,
    	    deleteChannel: deleteChannel,
    	    followChannel: followChannel,
    	    unFollowChannel: unFollowChannel
    	}
	});
