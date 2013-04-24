define(['services/logger', 'services/config', 'services/authentication', 'services/dataservice.api'],
	function (logger, config, authentication, api) {
	    var
            baseUrl = config.baseUrl,
	   
	    createChannelMessage = function (channelid, message, callbacks) {
                
		logger.log('createChannelMesage' , null, 'dataservice.channelMessage', true);
                return api.callAPI('POST', '/channel/' + channelid + '/message', message, callbacks);

            },
	    getChannelMessages = function (channelid, callbacks) {
                
		logger.log('getChannelMessages' , null, 'dataservice.channelMessage', true);
                return api.callAPI('GET', '/channel/' + channelid + '/message', undefined, callbacks);

            },
	    getChannelMessage = function (channelid, messageid, callbacks) {
                
		logger.log('getChannelMessage' , null, 'dataservice.channelMessage', true);
                return api.callAPI('GET', '/channel/' + channelid + '/message/' + messageid, undefined, callbacks);

            }
	    
	    
	    ;

            
            
	    return {
	        createChannelMessage: createChannelMessage,
	        getChannelMessages: getChannelMessages,
	        getChannelMessage: getChannelMessage
	    }
	});








