/* To Do - Devender - Remove later*/
function ChannelViewUnfollowModel() {
	var that = this;
	this.template = "channelViewUnfollow";
	this.viewid = "V-16";
	this.viewname = "'Channel Unfollow'";
	this.displayname = "Channel Unfollow";
	
	this.accountName = ko.observable();
	
	this.hasfooter = ko.observable(true);
	this.channelid = ko.observable();
	
	this.title = ko.observable('');
	this.description = ko.observable('');		

	this.applyBindings = function() {
		$("#" + that.template).on("pagebeforeshow", null, function(e, data) {
			var channelObject = JSON.parse(localStorage.getItem("currentChannel"));
			that.channelid(channelObject.id);
			that.title(channelObject.name);
			that.description(channelObject.description);
			that.activate(channelObject);
		});
	};
    
	this.activate = function (channel) {
		if(authenticate()) {		
			addExternalMarkup(that.template); // this is for header/overlay message			
			that.channelid(channel.id);
			that.accountName(localStorage.getItem("accountName"));					
			$.mobile.showPageLoadingMsg("a", "Loading The Channel");
		}
	};	
	
	this.unfollowChannelCommand = function() {
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
		return ES.channelService.unfollowChannel(that.channelid(),callbacks).then(successfulUnfollowChannel);
	};
	
	function successfulUnfollowChannel(data){
		var counter = localStorage.getItem('counter');
		for(var ctr = 0; ctr < counter; ctr++) {
			backNavText.pop();
			backNavView.pop();	
		}
		localStorage.removeItem('counter');
		var toastobj = {redirect: 'channelsFollowingListView', type: '', text: 'No longer following '+that.title()};
		showToast(toastobj);						
		localStorage.removeItem("currentChannel");				
		goToView('channelsFollowingListView');
	}
		
}
