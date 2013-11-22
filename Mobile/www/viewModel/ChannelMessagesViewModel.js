/* Devender - To Do Remove it later before go live*/
function ChannelMessagesViewModel() {
	var that = this;
	this.template = "channelMessagesView";
	this.viewid = "V-55";
	this.viewname = "ChannelMessagesDetails";
	this.displayname = "Channel Messages";
	this.hasfooter = true;
	this.backText = ko.observable();		
	
	this.accountName = ko.observable();	
	this.title = ko.observable();
	this.description = ko.observable('');
	this.channelid = ko.observable();
	this.channelMessages = ko.observableArray([]);
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
			that.backText('<em></em>'+backNavText[backNavText.length-1]);			
			if(localStorage.getItem('counter') == 1) {
				localStorage.setItem('counter', 2);
			} else {		
				localStorage.setItem('counter', 1)
			}				
			var channel = JSON.parse(localStorage.getItem("currentChannel"));
			//alert(localStorage.getItem("currentChannel"));
			that.channelid(channel.id);
			localStorage.removeItem("currentChannelMessage");
			//alert(that.channelid());	
			$.mobile.showPageLoadingMsg("a", "Loading Channel Messages");
			that.channelMessages.removeAll();
			return that.getChannelCommand(that.channelid()).then(that.gotChannel);
		}
	};
	
	this.backCommand = function () {
		popBackNav();
  };	
	
	this.menuCommand = function () {
		pushBackNav('Broadcast Msg', 'channelMessagesView', 'channelMenuView');		
  };	
	
	this.gotoChannel = function() {
		goToView('channelView');
	}
	
	this.actionFollowChannelCommand = function(data) {
		pushBackNav('Broadcast Msg', 'channelMessagesView', 'channelViewUnfollow');		
	}	
	
	this.showSingleMessage = function(data) {
		//alert(JSON.stringify(data));
		localStorage.setItem("currentChannelMessage",JSON.stringify(data));
		pushBackNav('Broadcast Msg', 'channelMessagesView', 'channelSingleMessagesView');		
	}
	
	this.getChannelCommand = function(channelid) {
		//alert(channelid);
		var callbacks = {
			success: function(){
				//alert('success');	
			},
			error: function() {
				alert('error');
			}
		};
		$.mobile.showPageLoadingMsg("a", "Loading Channel");
		return ES.channelService.getChannel(channelid, callbacks);
	};
		
	this.gotChannel = function(data) {
		$.mobile.hidePageLoadingMsg();
		that.title(data.name );
		that.description(data.description);
		var callbacks = {
			success: function(data){
				$.each(data.message, function(indexMessage, valueMessage) {
					//alert(JSON.stringify(valueMessage));
					var tempCreated = time2TimeAgo(valueMessage.created/1000);
					var tempClass = valueMessage.escLevelId.toLowerCase().trim();
					if(tempClass == 'n') {
						tempClass = 'announcementicon';
					}
					else {
						tempClass = 'unknown';
					}
					that.channelMessages.push( // without push not working
						{messageCreated: tempCreated, messageText: valueMessage.text, messageClass: tempClass, messageID:valueMessage.id, messageSender:valueMessage.senderSubscriberId, messageCreatedOriginal:valueMessage.created}
					);
				});
			},
			error: function() {
				alert('error');	
			}
		};		
		return ES.messageService.getChannelMessages(that.channelid(), undefined, callbacks);
	}
	
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
	
	this.userSettings = function () {
		pushBackNav('Broadcast Msg', 'channelMessagesView', 'escalationPlansView');		
  };	
	
	this.composeCommand = function () {
		pushBackNav('Broadcast Msg', 'channelMessagesView', 'sendMessageView');		
  };	
	
}
