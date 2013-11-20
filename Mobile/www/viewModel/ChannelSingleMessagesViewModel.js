/* Devender - To Do Remove it later before go live*/
function ChannelSingleMessagesViewModel() {
	var that = this;
	this.template = "channelSingleMessagesView";
	this.viewid = "V-55";
	this.viewname = "ChannelSingleMessagesDetails";
	this.displayname = "Channel Single Message";
	this.hasfooter = true;	
	
	this.accountName = ko.observable();	
	this.title = ko.observable();
	this.description = ko.observable('');
	this.channelid = ko.observable();
	this.messageCreated = ko.observable();
	this.messageClass = ko.observable();
	this.messageText = ko.observable();
	this.toastText = ko.observable();	

	this.applyBindings = function() {
		$("#" + that.template).on("pagebeforeshow", null, function(e, data) {
			that.activate();
		});
	};
    
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');												
			}		
			that.accountName(localStorage.getItem("accountName"));		
			var channel = JSON.parse(localStorage.getItem("currentChannel"));
			var channelMessage = JSON.parse(localStorage.getItem("currentChannelMessage"));
			//alert(localStorage.getItem("currentChannel"));
			//alert(localStorage.getItem("currentChannelMessage"));
			that.title(channel.name);
			that.channelid(channel.id);
			that.description(channel.description);
			that.messageCreated(channelMessage.messageCreatedOriginal);
			that.messageClass(channelMessage.messageClass);
			that.messageText(channelMessage.messageText);
			//return that.getChannelCommand(that.channelid()).then(that.gotChannel);
		}
	};

	this.menuCommand = function () {
		pushBackNav('Message details', 'channelSingleMessagesView', 'channelMenuView');
  };	
	
	function time2TimeAgo(ts) {
		// This function computes the delta between the
		// provided timestamp and the current time, then test
		// the delta for predefined ranges.
		
		var d=new Date();  // Gets the current time
		var nowTs = Math.floor(d.getTime()/1000); // getTime() returns milliseconds, and we need seconds, hence the Math.floor and division by 1000
		var seconds = nowTs-ts;
		// more that two days
		if (seconds > 2*24*3600) {
			 return "a few days ago";
		}
		// a day
		else if (seconds > 24*3600) {
			 return "yesterday";
		}
		
		else if (seconds > 3600) {
			 return "a few hours ago";
		}
		else if (seconds > 1800) {
			 return "Half an hour ago";
		}
		else if (seconds > 60) {
			 return Math.floor(seconds/60) + " minutes ago";
		}
		else {
			return  'a few seconds ago';
		}		
	}
	
	this.actionFollowChannelCommand = function(data) {
		pushBackNav('Message details', 'channelSingleMessagesView', 'channelViewUnfollow');		
	}	
	
	this.userSettings = function () {
		pushBackNav('Message details', 'channelSingleMessagesView', 'escalationPlansView');;
  };	
	
	this.composeCommand = function () {
		pushBackNav('Message details', 'channelSingleMessagesView', 'sendMessageView');
  };	
	
}
