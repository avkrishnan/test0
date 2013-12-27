function ChannelsFollowingListViewModel() {
	var self = this;
	
	self.template = "channelsFollowingListView";
	self.viewid = "V-30";
	self.viewname = "Channels";
	self.displayname = "Channels I Follow";
	self.hasfooter = true;
	
	self.channels = ko.observableArray([]);
	self.shown = false;
	self.noFollow = ko.observable();
	
	self.activate = function() {
		self.noFollow(false);
		if (!self.shown) {
			appCtx.removeItem("currentChannel");
			appCtx.removeItem("overlayCurrentChannel");
		}
		
		if(authenticate()) {
			addExternalMarkup(self.template); // this is for header/overlay message
			appCtx.setItem('counter', 1);
			self.channels.removeAll();
			if(self.channels() && self.channels().length){
				self.channels.removeAll();
			}
			$.mobile.showPageLoadingMsg("a", "Loading Channels");
			//return self.listFollowingChannelsCommand().then(gotChannels);
			return ES.channelService.listFollowingChannels().then(gotChannels, errorListChannels);
		}
	};

	function gotChannels(data) {
		$.mobile.hidePageLoadingMsg();
		if (data.channel && data.channel.constructor == Object) {
			data.channel = [data.channel];
		}
		if (!data.channel) {
			return;
		}
		if(data.channel.length) {
			$.each(data.channel, function(indexChannel, valueChannel) {
				if(typeof valueChannel.description == 'undefined') {
					valueChannel.description = '';
				}
			});
			self.channels(data.channel);
		}	else{
			self.noFollow(true);
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
		appCtx.setItem("currentChannel", channel);
		viewNavigate('Channels', 'channelsFollowingListView', 'channelViewUnfollow');
	};
	
	/* action to see channels messages*/
	self.actionFollowChannelCommand = function(data) {
		appCtx.setItem("currentChannel", JSON.stringify(data));
		viewNavigate('Channels', 'channelsFollowingListView', 'channelMessagesView');
	};
}

ChannelsFollowingListViewModel.prototype = new ENYM.ViewModel();
ChannelsFollowingListViewModel.prototype.constructor = ChannelsFollowingListViewModel;