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
		var channel = JSON.parse(localStorage.getItem("currentChannel"));		
		if(token == '' || token == null) {
			goToView('loginView');
		} else if(!channel) {
			goToView('channelsFollowingListView');			
		} else {
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');												
			}		
			that.accountName(localStorage.getItem("accountName"));
			if(typeof backNavText[0] == 'undefined') {
				that.backText('<em></em>Home');
			} else {		
				that.backText('<em></em>'+backNavText[backNavText.length-1]);			
			}			
			if(localStorage.getItem('counter') == 1) {
				localStorage.setItem('counter', 2);
			} else {		
				localStorage.setItem('counter', 1)
			}				
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
		if(typeof backNavText[0] == 'undefined') {
			goToView('channelListView');
		} else {		
			popBackNav();		
		}
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
					var tempCreated = msToTime(valueMessage.created);
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
	
	this.userSettings = function () {
		pushBackNav('Broadcast Msg', 'channelMessagesView', 'escalationPlansView');		
  };	
	
	this.composeCommand = function () {
		pushBackNav('Broadcast Msg', 'channelMessagesView', 'sendMessageView');		
  };	
	
}
