/*globals $, TweetViewModel */

function EvernymMessageService() {
    
    var api = new EvernymService();
    
    this.createChannelMessage = function (channelid, message, callbacks) {
		//logger.log('createChannelMesage' , null, 'dataservice.channelMessage', true);
        return api.callAPI('POST', '/channel/' + channelid + '/message', message, callbacks, true);
    };
    
    this.getChannelMessages = function (channelid, messageid, callbacks) {
		//logger.log('getChannelMessages' , null, 'dataservice.channelMessage', true);
        
        if (messageid){
            return api.callAPI('GET', '/channel/' + channelid + '/message?before=' + messageid , undefined, callbacks, true);
        }
        else {
            return api.callAPI('GET', '/channel/' + channelid + '/message', undefined, callbacks, true);
        }
    };
    
    this.getChannelMessage = function (channelid, messageid, callbacks) {
		//logger.log('getChannelMessage' , null, 'dataservice.channelMessage', true);
        return api.callAPI('GET', '/channel/' + channelid + '/message/' + messageid, undefined, callbacks, true);
    };
    
    this.getResponseMessages = function (channelid, messageid, callbacks) {
		    return api.callAPI('GET', '/channel/' + channelid + '/message?replyto=' + messageid , undefined, callbacks, true);
    };
    
    
}