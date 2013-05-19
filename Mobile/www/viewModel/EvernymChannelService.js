/*globals $, TweetViewModel */

function EvernymChannelService() {
    
    var api = new EvernymService();
    
    var channels = new Array();
    
    this.createChannel = function (channel, callbacks) {
        
        //var data = JSON.stringify(channel);
        
		//logger.log('starting to add channel ' + channel.name , null, 'dataservice.channel', true);
        
        return api.callAPI('POST', '/channel', channel, callbacks, true);
        
    };
    
    this.listChannels = function (callbacks) {
        
		//logger.log('starting to list channels ' , null, 'dataservice.channel', true);
        return api.callAPI('GET', '/channel', undefined, callbacks, true);
        
    };
    
    this.getChannel = function (channelid, callbacks) {
        
		//logger.log('starting to list channels ' , null, 'dataservice.channel', true);
        return api.callAPI('GET', '/channel/' + channelid, undefined, callbacks, true);
        
    };
    
    this.followChannel = function (channelid, callbacks) {
        
        return api.callAPI('POST', '/channel/' + channelid + '/follower', undefined, callbacks, true);
        
    };
    
    
    this.getFollowers = function (channelid, callbacks) {
        
		
        return api.callAPI('GET', '/channel/' + channelid + '/follower', undefined, callbacks, true);
        
    };
    

    this.getFollower = function (followerid, callbacks) {

        debugger;
        // Todo call the api call to get a single follower.
        //return api.callAPI('GET', '/channel/' + channelid + '/follower', undefined, callbacks, true);
        return null;
    };

    
    this.unFollowChannel = function (channelid, callbacks) {
        
		//logger.log('starting to follow channel' , null, 'dataservice.channel', true);
        return api.callAPI('DELETE', '/channel/' + channelid + '/follow', undefined, callbacks, true);
        
    };
    
    this.deleteChannel = function (channelid, callbacks) {

        return api.callAPI('DELETE', '/channel/' + channelid, undefined, callbacks, true);

    };
    
    this.modifyChannel = function (channel, callbacks) {
        
        
		//logger.log('starting to modify channel ' + channel.name , null, 'dataservice.channel', true);
        
        return api.callAPI('PUT', '/channel/' + channel.id, channel, callbacks, true);
        
    };
    
    
}