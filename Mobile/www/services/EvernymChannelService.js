
function EvernymChannelService(api) {

  console.log('loading EvernymChannelService');

  var t = this;

  var channels = new Array();
  
  t.createChannel = function(channel, callbacks) {
    return api.callAPI('POST', '/channel', channel, callbacks, true);
  };

  // call to get channels that the user owns
  t.listMyChannels = function(callbacks) {
    return api.callAPI('GET', '/channel?relationship=O', undefined, callbacks, true);
  };

  // call to get the channels that the user is following
  t.listFollowingChannels = function(callbacks) {
    return api.callAPI('GET', '/channel?relationship=F', undefined, callbacks, true);
  };

  t.getChannel = function(channelid, callbacks) {
    return api.callAPI('GET', '/channel/' + channelid, undefined, callbacks, true);
  };

  t.followChannel = function(channelid, callbacks) {
    return api.callAPI('POST', '/channel/' + channelid + '/follower', undefined, callbacks, true);
  };

  t.getFollowers = function(channelid, callbacks) {
    return api.callAPI('GET', '/channel/' + channelid + '/follower', undefined, callbacks, true);
  };

  // Returns a single follower
  t.getFollower = function(followerid, callbacks) {
    return api.callAPI('GET', '/follower/' + followerid, undefined, callbacks, true);
  };

  t.unfollowChannel = function(channelid, callbacks) {
    return api.callAPI('DELETE', '/channel/' + channelid + '/follower', undefined, callbacks, true);
  };

  t.addFollower = function(channelid, followerid, callbacks) {
    return api.callAPI('POST', '/channel/' + channelid + '/follower/' + followerid, undefined, callbacks, true);
  };

  t.removeFollower = function(channelid, followerid, callbacks) {
    return api.callAPI('DELETE', '/channel/' + channelid + '/follower/' + followerid, undefined, callbacks, true);
  };

  t.deleteChannel = function(channelid, callbacks) {
    return api.callAPI('DELETE', '/channel/' + channelid, undefined, callbacks, true);
  };

  t.modifyChannel = function(channel, callbacks) {
    return api.callAPI('PUT', '/channel/' + channel.id, channel, callbacks, true);
  };

  /* Channel Follower Requests */
  t.getFollowerReq = function(channelid) {
    return api.callAPI('GET', '/channel/' + channelid + '/followerrequest', undefined, undefined, false);
  };
  
  t.addFollowerReq = function(channelid, request) {
    return api.callAPI('POST', '/channel/' + channelid + '/followerrequest/' + request, undefined, undefined, true);
  };
  
  t.removeFollowerReq = function(channelid, request) {
    return api.callAPI('DELETE', '/channel/' + channelid + '/followerrequest/' + request, undefined, undefined, true);
  };

  /* Channel Settings */
  t.getChnlSettings = function(channelid) {
    return api.callAPI('GET', '/channel/' + channelid + '/setting', undefined, undefined, true);
  };
  
  t.putChnlSettings = function(channelid, settings) {
    return api.callAPI('PUT', '/channel/' + channelid + '/setting', settings, undefined, true);
  };
  
  t.removeChnlSetting = function(channelid, setting) {
    return api.callAPI('DELETE', '/channel/' + channelid + '/setting/' + setting, undefined, undefined, true);
  };

  t.invite = function(channelid, invitation) {
    return api.callAPI('POST', '/channel/' + channelid + '/invite', invitation, undefined, true);
  };

}