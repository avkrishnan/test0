define(['services/logger', 'services/config', 'services/authentication', 'services/dataservice.api'],
	function (logger, config, authentication, api) {
	    var
            baseUrl = config.baseUrl,
	    channels = new Array(),
	    createChannel = function (channel, callbacks) {
                
                //var data = JSON.stringify(channel);
          
		logger.log('starting to add channel ' + channel.name , null, 'dataservice.channel', true);

                return api.callAPI('POST', '/channel', channel, callbacks);

            },
	    listChannels = function (callbacks) {
                
		logger.log('starting to list channels ' , null, 'dataservice.channel', true);
                return api.callAPI('GET', '/channel', undefined, callbacks);

            },
	    getChannel = function (channelid, callbacks) {
                
		logger.log('starting to list channels ' , null, 'dataservice.channel', true);
                return api.callAPI('GET', '/channel/' + channelid, undefined, callbacks);

            },
	    followChannel = function (channelid, callbacks) {
                
		logger.log('starting to follow channel' , null, 'dataservice.channel', true);
                return api.callAPI('POST', '/channel/' + channelid + '/follow', undefined, callbacks);

            },
	    unFollowChannel = function (channelid, callbacks) {
                
		logger.log('starting to follow channel' , null, 'dataservice.channel', true);
                return api.callAPI('DELETE', '/channel/' + channelid + '/follow', undefined, callbacks);

            },
	    deleteChannel = function (channelid, callbacks) {
                
		logger.log('starting to list channels ' , null, 'dataservice.channel', true);
                return api.callAPI('DELETE', '/channel/' + channelid, undefined, callbacks);

            },
	    modifyChannel = function (channel, callbacks) {
                
          
		logger.log('starting to modify channel ' + channel.name , null, 'dataservice.channel', true);

                return api.callAPI('PUT', '/channel/' + channel.id, channel, callbacks);

            }
	    ;

            
            
	    return {
	        createChannel: createChannel,
		listChannels: listChannels,
		getChannel: getChannel,
		deleteChannel: deleteChannel,
		modifyChannel: modifyChannel,
		followChannel: followChannel,
		unFollowChannel: unFollowChannel
    	    }
	});




