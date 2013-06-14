

function EvernymChannelService() {
	
	var api = new EvernymService();
	
	var channels = new Array();
	
	this.createChannel = function (channel, callbacks) {
		
		//var data = JSON.stringify(channel);
		
		//logger.log('starting to add channel ' + channel.name , null, 'dataservice.channel', true);
		
		return api.callAPI('POST', '/channel', channel, callbacks, true);
		
	};
	
	// call to get channels that the user owns
	this.listMyChannels = function (callbacks) {
		
		///GET /channel?relationship=O for owner and GET /channel?relationship=F
		return api.callAPI('GET', '/channel?relationship=O', undefined, callbacks, true);
		
	};

	// call to get the channels that the user is following
	this.listFollowingChannels = function (callbacks) {

	    ///GET /channel?relationship=O for owner and GET /channel?relationship=F
		return api.callAPI('GET', '/channel?relationship=F', undefined, callbacks, true);

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
	

    // Returns a single follower
	this.getFollower = function (followerid, callbacks) {
		debugger;
		return api.callAPI('GET', '/follower/' + followerid, undefined, callbacks, true);
	};

	
	this.unFollowChannel = function (channelid, followerid, callbacks) {
	    debugger;
	    return api.callAPI('DELETE', '/channel/' + channelid + '/follower/' + followerid, undefined, callbacks, true);
	};
	
	this.deleteChannel = function (channelid, callbacks) {
		return api.callAPI('DELETE', '/channel/' + channelid, undefined, callbacks, true);
	};
	
	this.modifyChannel = function (channel, callbacks) {
		
		
		//logger.log('starting to modify channel ' + channel.name , null, 'dataservice.channel', true);
		
		return api.callAPI('PUT', '/channel/' + channel.id, channel, callbacks, true);
		
	};

	this.provisionalEnroll = function (provisional, callbacks) {
		return api.callAPI('POST', '/account/provisional/enroll', provisional, callbacks, true);
	};
	
	
}