function ChannelsIOwnViewModel() {
  var self = this;
	self.template = 'channelsIOwnView';
	self.viewid = 'V-19';
	self.viewname = 'Channels';
	self.displayname = 'Channels I Own';
	
	self.sectionOne = ko.observable(false);
	self.sectionTwo = ko.observable(false);
	self.channels = ko.observableArray([]);
	
  self.activate = function() {
		addExternalMarkup(self.template); // this is for header/overlay message				
		self.sectionOne(false);
		self.sectionTwo(false);			
		ENYM.ctx.setItem('counter', 1);												
		self.channels.removeAll();			
		$.mobile.showPageLoadingMsg('a', 'Loading Channels');
		return ES.channelService.listMyChannels({ success: successfulList, error: errorAPI });
	};				    	
	
	function successfulList(data){	
    $.mobile.hidePageLoadingMsg();
		self.channels.removeAll();
		if(data.channel.length == 0) {
			self.sectionOne(true);			
		} else {
			self.sectionTwo(true);				
			for(var channelslength = 0; channelslength<data.channel.length; channelslength++) {
				if(data.channel[channelslength].followers == 1) {
					var followers = data.channel[channelslength].followers +' follower';
				} else {
					var followers = data.channel[channelslength].followers +' followers';
				}			
				self.channels.push({
					channelId: data.channel[channelslength].id, 
					channelName: data.channel[channelslength].name, 
					channelDescription: data.channel[channelslength].description,
					longDescription: data.channel[channelslength].longDescription,
					followerCount: followers
				});
			}			
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
}

ChannelsIOwnViewModel.prototype = new ENYM.ViewModel();
ChannelsIOwnViewModel.prototype.constructor = ChannelsIOwnViewModel;