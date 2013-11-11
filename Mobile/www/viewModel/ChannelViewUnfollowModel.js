/* To Do - Devender - Remove later*/
function ChannelViewUnfollowModel() {
	var that = this;
	this.template = "channelViewUnfollow";
	this.viewid = "V-16";
	this.viewname = "ChannelDetails";
	this.displayname = "Channel Unfollow";
	
	this.accountName = ko.observable();
	
	this.hasfooter = ko.observable(true);
	this.channelid = ko.observable();
	
	this.title = ko.observable('');
	this.description = ko.observable('');

	this.applyBindings = function() {
		$("#" + that.template).on("pagebeforeshow", null, function(e, data) {
			//alert(localStorage.getItem("currentChannel"));
			var channelObject = JSON.parse(localStorage.getItem("currentChannel"));
			that.channelid(channelObject.id);
			that.title(channelObject.name);
			that.description(channelObject.description);
		});
	};
    
	this.activate = function (channel) {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			that.hasfooter(false);
		}
		that.channelid(channel.id);
		that.accountName(localStorage.getItem("accountName"));	
		that.channelAction(true);
		$.mobile.showPageLoadingMsg("a", "Loading The Channel");
		alert(that.channelid());
		return that.getChannelCommand(that.channelid()).then(gotChannel);
	};
	
	this.unfollowChannelCommand = function() {
		$.mobile.showPageLoadingMsg("a", "Requesting to Unfollow Channel");
		var callbacks = {
			success: function(){
				//alert('success');	
			},
			error: function() {
				alert('error');	
			}
		};
		return ES.channelService.unfollowChannel(that.channelid(),callbacks).then(successfulUnfollowChannel);
	};
	
	function successfulUnfollowChannel(data){
		localStorage.removeItem("currentChannel");
		goToView('channelsFollowingListView');
	}
}
