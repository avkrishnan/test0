/* To Do - Devender - Remove later*/
function ChannelViewUnfollowModel() {
	var that = this;
	this.template = "channelViewUnfollow";
	this.viewid = "V-16";
	this.viewname = "ChannelDetails";
	this.displayname = "Channel Unfollow";
	
	this.accountName = ko.observable();
	this.backText = ko.observable();	
	
	this.hasfooter = ko.observable(true);
	this.channelid = ko.observable();
	
	this.title = ko.observable('');
	this.description = ko.observable('');
	this.toastText = ko.observable();
	this.counter = ko.observable();			

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
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {		
			addExternalMarkup(that.template); // this is for header/overlay message		
			if(localStorage.getItem('toastData')) {			
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}		
			that.channelid(channel.id);
			that.accountName(localStorage.getItem("accountName"));
			that.backText('<em></em>'+backNavText[backNavText.length-1]);
			that.counter(localStorage.getItem('counter'));					
			$.mobile.showPageLoadingMsg("a", "Loading The Channel");
		}
	};
	
	this.backCommand = function () {
		popBackNav();
  };
	
	this.menuCommand = function () {
		pushBackNav('Channel Unfollow', 'channelViewUnfollow', 'channelMenuView');
  };	
	
	this.unfollowChannelCommand = function() {
		$.mobile.showPageLoadingMsg("a", "Requesting to Unfollow Channel");
		var callbacks = {
			success: function(){
				//alert('success');	
			},
			error: function(data, status, details) {
				that.toastText(details.message);		
				localStorage.setItem('toastData', that.toastText());				
			}
		};
		return ES.channelService.unfollowChannel(that.channelid(),callbacks).then(successfulUnfollowChannel);
	};
	
	function successfulUnfollowChannel(data){
		for(var ctr = 1; ctr <= that.counter(); ctr++) {
			that.backCommand();		
		}		
		that.toastText('No longer following '+that.title());		
		localStorage.setItem('toastData', that.toastText());
		localStorage.removeItem("currentChannel");				
		goToView('channelsFollowingListView');
	}
	
	this.userSettings = function () {
		pushBackNav('Channel Unfollow', 'channelViewUnfollow', 'escalationPlansView');
  };	
	
	this.composeCommand = function () {
		pushBackNav('Channel Unfollow', 'channelViewUnfollow', 'sendMessageView');
  };
		
}
