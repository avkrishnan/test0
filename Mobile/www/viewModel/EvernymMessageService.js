/*globals $, TweetViewModel */

function EvernymMessageService() {
    
    var api = new EvernymService();
    
    this.createChannelMessage = function (channelid, message, callbacks) {
		//logger.log('createChannelMesage' , null, 'dataservice.channelMessage', true);
        return api.callAPI('POST', '/channel/' + channelid + '/message', message, callbacks, true);
    };
    
    this.getChannelMessages = function (channelid, callbacks) {
		//logger.log('getChannelMessages' , null, 'dataservice.channelMessage', true);
        return api.callAPI('GET', '/channel/' + channelid + '/message', undefined, callbacks, true);
    };
    
    this.getChannelMessage = function (channelid, messageid, callbacks) {
		//logger.log('getChannelMessage' , null, 'dataservice.channelMessage', true);
        return api.callAPI('GET', '/channel/' + channelid + '/message/' + messageid, undefined, callbacks, true);
    };
    
}