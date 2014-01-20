function ChannelsFollowingListViewModel() {
	var self = this;
	self.template = "channelsFollowingListView";
	self.viewid = "V-30";
	self.viewname = "Channels";
	self.displayname = "Channels I Follow";
	
	self.channels = ko.observableArray([]);
	self.shown = false
	self.noFollow = ko.observable(false);
	
	self.activate = function() {
		self.noFollow(false);	
		if (!self.shown) {
			ENYM.ctx.removeItem("currentChannel");
			ENYM.ctx.removeItem("overlayCurrentChannel");
		}
		addExternalMarkup(self.template); // this is for header/overlay message
		self.channels.removeAll();
		if(self.channels() && self.channels().length){
			self.channels.removeAll();
		}
		$.mobile.showPageLoadingMsg("a", "Loading Channels");
		return ES.channelService.listFollowingChannels().then(gotChannels, errorListChannels);
	};

	function gotChannels(data) {
		$.mobile.hidePageLoadingMsg();
		if(data.channel) {
			$.each(data.channel, function(indexChannel, valueChannel) {
				if(typeof valueChannel.description == 'undefined') {
					valueChannel.description = '';
				}
			});
			self.channels(data.channel);
			self.noFollow(true);			
		}	else{
			goToView('followChannelView');			
		}
	};
	
	function errorListChannels(data, status, details){
		$.mobile.hidePageLoadingMsg();
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);
	};	
	
	/* action to channel page to unfollow*/
	self.channelViewUnfollow = function(data) {
		var channel = JSON.stringify(data);
		ENYM.ctx.setItem("currentChannel", channel);
		viewNavigate('Channels', 'channelsFollowingListView', 'channelViewUnfollow');
	};
	
	/* action to see channels messages*/
	self.actionFollowChannelCommand = function(data) {
		ENYM.ctx.setItem("currentChannel", JSON.stringify(data));
		viewNavigate('Channels', 'channelsFollowingListView', 'channelMessagesView');
	};
}

ChannelsFollowingListViewModel.prototype = new ENYM.ViewModel();
ChannelsFollowingListViewModel.prototype.constructor = ChannelsFollowingListViewModel;