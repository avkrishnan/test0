function ChannelsFollowingListViewModel() {
	this.template = "channelsFollowingListView";
	this.viewid = "V-30";
	this.viewname = "Channels";
	this.displayname = "Channels I Follow";
	this.hasfooter = true;
	this.accountName = ko.observable();
	this.channels = ko.observableArray([]);		
	var that = this;
	this.shown = false;
	this.noFollow = ko.observable();
	
	this.applyBindings = function() {	
		//$("#" + that.template).on("pagebeforeshow", null, function (e, data) {
			that.noFollow(false);
			if (!that.shown) {
				localStorage.removeItem("currentChannel");
				localStorage.removeItem("overlayCurrentChannel");
				that.activate();
			}
		//});
	};
	
	this.activate = function() {
		if(authenticate()) {
			//addExternalMarkup(that.template); // this is for header/overlay message
			window["headerViewModel"].activate();
			that.accountName(localStorage.getItem("accountName"));
			localStorage.setItem('counter', 1);					
			//console.log("trying to get channels");
			that.channels.removeAll();
			if(that.channels() && that.channels().length){
				that.channels.removeAll();
			}
			//$.mobile.showPageLoadingMsg("a", "Loading Channels");
			return this.listFollowingChannelsCommand().then(gotChannels);
		}
	};	
	
	function successfulCreate(data){
		//logger.log('success listing channels ' , null, 'channelService', true);
	};

	function gotChannels(data) {
		//$.mobile.hidePageLoadingMsg();
		//that.shown = true;
		//that.channels.removeAll();
		if (data.channel && data.channel.constructor == Object) {
			data.channel = [data.channel];
		}
		if (!data.channel) {
			return;
		}
		//$("#no_channels_notification").hide();
		if(data.channel.length) {
			$.each(data.channel, function(indexChannel, valueChannel) {
				if(typeof valueChannel.description == 'undefined') {
					valueChannel.description = '';
				}
			});
			that.channels(data.channel);
		}
		else {
			that.noFollow(true);
		}
		//alert(JSON.stringify(data));
	};
	
	function errorListChannels(data, status, details){
		//$.mobile.hidePageLoadingMsg();
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);
	};
	
	this.listFollowingChannelsCommand = function () {
		return ES.channelService.listFollowingChannels({ success: successfulCreate, error: errorListChannels });
	};
		
	/*this.showChannel = function (channel) {
		localStorage.setItem("currentChannel", JSON.stringify(channel));
		$.mobile.changePage("#" + channelBroadcastsViewModel.template)
	};
	
	this.newChannelCommand = function () {
		channelNewViewModel.activate();
		$.mobile.changePage("#" + channelNewViewModel.template)
	};*/
	
	/* action to channel page to unfollow*/
	this.channelViewUnfollow = function(data) {
		var channel = JSON.stringify(data);
		localStorage.setItem("currentChannel", channel);
		viewNavigate('Channels', 'channelsFollowingListView', 'channelViewUnfollow');		
	}
	
	/* action to see channels messages*/
	this.actionFollowChannelCommand = function(data) {
		//alert(JSON.stringify(data));
		localStorage.setItem("currentChannel", JSON.stringify(data));
		viewNavigate('Channels', 'channelsFollowingListView', 'channelMessagesView');
	}
}