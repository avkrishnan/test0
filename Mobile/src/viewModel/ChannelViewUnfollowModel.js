﻿function ChannelViewUnfollowModel() {
	var self = this;
	self.template = "channelViewUnfollow";
	self.viewid = "V-16";
	self.viewname = "Channel Unfollow";
	self.displayname = "Channel Unfollow";
	
  self.inputObs = [ 'title', 'description', 'channelid' ];
  self.defineObservables();
		
	self.hasfooter = ko.observable(true);

	self.activate = function () {
		addExternalMarkup(self.template); // this is for header/overlay message
		var channelObject = JSON.parse(ENYM.ctx.getItem("currentChannel"));
		self.channelid(channelObject.id);
		self.title(channelObject.name);
		self.description(channelObject.description);
		$.mobile.showPageLoadingMsg("a", "Loading The Channel");
	};	
	
	self.unfollowChannelCommand = function() {
		$.mobile.showPageLoadingMsg("a", "Requesting to Unfollow Channel");		
		var callbacks = {
			success: function(){
				//alert('success');	
			},
			error: function(data, status, details) {
				var toastobj = {type: 'toast-error', text: details.message};
				showToast(toastobj);				
			}
		};
		return ES.channelService.unfollowChannel(self.channelid(),callbacks).then(successfulUnfollowChannel);
	};
	
	function successfulUnfollowChannel(data){
		$.mobile.hidePageLoadingMsg();		
		while (backNavView[backNavView.length-1] != 'channelsFollowingListView') {
			backNavText.pop();
			backNavView.pop();
		}
		if (backNavView[backNavView.length-1] == 'channelsFollowingListView') {
			backNavText.pop();
			backNavView.pop();			
		}
		var toastobj = {redirect: 'channelsFollowingListView', type: '', text: 'No longer following '+self.title()};
		showToast(toastobj);						
		ENYM.ctx.removeItem("currentChannel");				
		goToView('channelsFollowingListView');
	}
	
	self.comingSoon = function() {		
		headerViewModel.comingSoon();
	}
}

ChannelViewUnfollowModel.prototype = new ENYM.ViewModel();
ChannelViewUnfollowModel.prototype.constructor = ChannelViewUnfollowModel;