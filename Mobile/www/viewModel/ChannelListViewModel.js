/* To do - Pradeep Kumar */
function ChannelListViewModel() {
  var self = this;
  self.template = 'channelListView';
  self.viewid = 'V-40';
  self.viewname = 'Home';
  self.displayname = 'Home';
	
  self.inputObs = [ 'accountName', 'responseData', 'firstChannelId', 'channel', 'channelOwn', 'channelFollowing', 'toastText', 'toastClass' ];
	self.initObs = [ 'createFirstChannel', 'addInviteFollowers', 'composeBroadcast', 'channelDetails', 'channelsIOwn', 'findChannels', 'createChannel', 'channelMessages', 'channelsIFollow' ];

	self.defineObservables(self.allObs());
	self.initializeObservables(self.initObs, 'false');
	
	/* Methods */
	self.applyBindings();
	/*
	self.applyBindings = function() {
		$('#' + self.template).on('pagebeforeshow', function (e, data) {
      self.activate();
    });	
	};	  
	*/
	self.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} 
		else {
			addExternalMarkup(self.template); // this is for header/overlay message			
			
			self.createFirstChannel(false);
			self.addInviteFollowers(false);
			self.composeBroadcast(false);
			self.channelDetails(false);
			self.channelsIOwn(false);	
			self.findChannels(false);
			self.createChannel(false);
			self.channelMessages(false);
			self.channelsIFollow(false);
			
			self.initObs = [ 'createFirstChannel', 'addInviteFollowers', 'composeBroadcast', 'channelDetails', 'channelsIOwn', 'findChannels', 'createChannel', 'channelMessages', 'channelsIFollow' ];
			self.initializeObservables(self.initObs, 'false');
							
			if(localStorage.getItem('toastData')) {
				self.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');
			}
			self.accountName(localStorage.getItem('accountName'));
			localStorage.setItem('counter', 0);
			$.mobile.showPageLoadingMsg('a', 'Getting user details');
			return ES.channelService.listMyChannels({ success: successfulList, error: errorAPI }).then(ES.channelService.listFollowingChannels({ success: getChannelsIFollow, error: errorAPI }));			
		}
	}
	
	function successfulList(data){
    $.mobile.hidePageLoadingMsg();	
		if(data.channel.length < 1) {
			self.createFirstChannel(true);
			self.addInviteFollowers(false);
			self.composeBroadcast (false);
			self.channelDetails(false);
			self.channelsIOwn(false);									
		} else if(data.channel.length == 1) {
      self.firstChannelId(data.channel[0].id);			
			self.channel(data.channel[0].name);
			self.channelOwn(data.channel[0].name+'<span>Go</span>');					
			if(data.channel[0].followers == 1) {
				var followers = data.channel[0].followers +' follower';
			} else {
				var followers = data.channel[0].followers +' followers';
			}		
			var channel = [];			
			channel.push({
				channelId: data.channel[0].id, 
				channelName: data.channel[0].name, 
				channelDescription: data.channel[0].description,
				followerCount: followers
			});
			channel = channel[0];		
			localStorage.setItem('currentChannelData', JSON.stringify(channel));
			return ES.channelService.getFollowers(data.channel[0].id, { success: getFollowers, error: errorAPI });
		}	else {
			self.createFirstChannel(false);
			self.addInviteFollowers(false);
			self.composeBroadcast (false);
			self.channelDetails(false);
			self.channelsIOwn(true);			
		}
		alert(self.channelsIOwn());
	};
	
	function getFollowers(data){	
		$.mobile.hidePageLoadingMsg();
		if(data.followers.length < 2) {
			self.createFirstChannel(false);
			self.addInviteFollowers(true);
			self.composeBroadcast (false);
			self.channelDetails(false);
			self.channelsIOwn(false);						
		} else {						
			return ES.messageService.getChannelMessages(self.firstChannelId(), undefined, {success: getMessages, error: errorAPI});
		}	
	};
	
	function getMessages(data){
		$.mobile.hidePageLoadingMsg();
		if(typeof data.message == 'undefined') {
			self.createFirstChannel(false);
			self.addInviteFollowers(false);
			self.composeBroadcast (true);
			self.channelDetails(false);
			self.channelsIOwn(false);	
		} else {
			self.createFirstChannel(false);
			self.addInviteFollowers(false);
			self.composeBroadcast (false);
			self.channelDetails(true);
			self.channelsIOwn(false);		
		}
	}
	
	function getChannelsIFollow(responseData){	
		$.mobile.hidePageLoadingMsg();
		if(responseData.channel.length == 1) {
			var channel = [];			
			channel.push({
				id: responseData.channel[0].id, 
				name: responseData.channel[0].name,
				normName: responseData.channel[0].normName, 
				description: responseData.channel[0].description,
				longDescription: responseData.channel[0].longDescription,			
				followers: responseData.channel[0].followers,
				relationship: responseData.channel[0].relationship
			});
			channel = channel[0];		
			localStorage.setItem('currentChannel', JSON.stringify(channel));					
			self.findChannels(false);
			self.createChannel(false);
			self.channelMessages(true);
			self.channelsIFollow(false);
			self.channelFollowing(responseData.channel[0].name+'<span>Go</span>');			
		} else if(responseData.channel.length > 1) {
			self.findChannels(false);
			self.createChannel(false);
			self.channelMessages(false);
			self.channelsIFollow(true);
		} else if (self.createFirstChannel() == false){
			self.findChannels(false);
			self.createChannel(true);
			self.channelMessages(false);
			self.channelsIFollow(false);			
		} else {
			self.findChannels(false);
			self.createChannel(false);
			self.channelMessages(false);
			self.channelsIFollow(true);			
		}
	}
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();	
		self.toastText(details.message);		
		showToast();
	};
}

ChannelListViewModel.prototype = new AppCtx.ViewModel();
ChannelListViewModel.prototype.constructor = ChannelListViewModel;