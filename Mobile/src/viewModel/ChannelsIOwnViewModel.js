function ChannelsIOwnViewModel() {
  var self = this;
	self.template = 'channelsIOwnView';
	self.viewid = 'V-19';
	self.viewname = 'Channels';
	self.displayname = 'Channels I Own';
	
	self.sectionOne = ko.observable(false);
	self.sectionTwo = ko.observable(false);
	self.addFollower = ko.observable(false);
	self.channels = ko.observableArray([]);
	
  self.activate = function() {
		addExternalMarkup(self.template); // this is for header/overlay message				
		self.sectionOne(false);
		self.sectionTwo(false);
		self.addFollower(false);													
		self.channels.removeAll();			
		$.mobile.showPageLoadingMsg('a', 'Loading Channels');
		return ES.channelService.listMyChannels({ success: successfulList, error: errorAPI });
	};				    	
	
	function successfulList(data){	
    $.mobile.hidePageLoadingMsg();
		if(data.channel) {
			self.sectionTwo(true);				
			for(var channelslength = 0; channelslength<data.channel.length; channelslength++) {
				if(data.channel[channelslength].followers == 1) {
					var followers = data.channel[channelslength].followers +' follower';
					var followerVisible = false;
				} else if(data.channel[channelslength].followers == 0){
					var followers = data.channel[channelslength].followers +' followers';
					var followerVisible = true;
				} else {
					var followers = data.channel[channelslength].followers +' followers';
					var followerVisible = false;
				}						
				self.channels.push({
					channelId: data.channel[channelslength].id, 
					channelName: data.channel[channelslength].name, 
					channelDescription: data.channel[channelslength].description,
					longDescription: data.channel[channelslength].longDescription,
					followers: followers,
					followerCount: data.channel[channelslength].followers,
					addFollower: followerVisible
				});
			}
		} else {
			self.sectionOne(true);	
		}
	};    
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();	
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);
	};
	
	self.channelSettings = function(data){
		ENYM.ctx.removeItem('currentChannelData');				
		ENYM.ctx.setItem('currentChannelData', JSON.stringify(data));
		viewNavigate('Channels', 'channelsIOwnView', 'channelSettingsView');		
	};
	
	self.channelMain = function(data){
		ENYM.ctx.removeItem('currentChannelData');		
		ENYM.ctx.setItem('currentChannelData', JSON.stringify(data));
		viewNavigate('Channels', 'channelsIOwnView', 'channelMainView');					
	};
	
	self.channelFollowers = function(data){
		ENYM.ctx.removeItem('currentChannelData');			
		ENYM.ctx.setItem('currentChannelData', JSON.stringify(data));	
		viewNavigate('Channels', 'channelsIOwnView', 'followersListView');		
	};
	self.addFollowers = function(data){
		ENYM.ctx.removeItem('currentChannelData');			
		ENYM.ctx.setItem('currentChannelData', JSON.stringify(data));	
		viewNavigate('Channels', 'channelsIOwnView', 'addInviteFollowersView');		
	};
}

ChannelsIOwnViewModel.prototype = new ENYM.ViewModel();
ChannelsIOwnViewModel.prototype.constructor = ChannelsIOwnViewModel;