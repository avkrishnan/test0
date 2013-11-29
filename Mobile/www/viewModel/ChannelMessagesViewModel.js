/* Devender - To Do Remove it later before go live*/
function ChannelMessagesViewModel() {
	var that = this;
	this.template = "channelMessagesView";
	this.viewid = "V-55";
	this.viewname = "Broadcast Msg";
	this.displayname = "Channel Messages";
	this.hasfooter = true;	
	
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
		} 
		else if(!channel) {
			goToView('channelsFollowingListView');
		} 
		else {
			addExternalMarkup(that.template); // this is for header/overlay message
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');												
			}		
			that.accountName(localStorage.getItem("accountName"));			
			if(localStorage.getItem('counter') == 1) {
				localStorage.setItem('counter', 2);
			} 
			else {		
				localStorage.setItem('counter', 1);
			}				
			that.channelid(channel.id);
			localStorage.removeItem("currentChannelMessage");
			$.mobile.showPageLoadingMsg("a", "Loading Channel Messages");
			that.channelMessages.removeAll();
			//return that.getChannelCommand(that.channelid()).then(that.gotChannel);
			this.gotChannel(channel);
		}
	};	
	
	/*this.gotoChannel = function() {
		goToView('channelView');
	}*/
	
	/* action to chennels unfollow page settings page*/
	this.actionFollowChannelCommand = function(data) {
		viewNavigate('Broadcast Msg', 'channelMessagesView', 'channelViewUnfollow');
	}	
	
	/*action to single message page*/
	this.showSingleMessage = function(data) {
		localStorage.setItem("currentChannelMessage",JSON.stringify(data));
		viewNavigate('Broadcast Msg', 'channelMessagesView', 'channelSingleMessagesView');
	}
	
	/*this.getChannelCommand = function(channelid) {
		var callbacks = {
			success: function(){
				//alert('success');	
			},
			error: function(data, status, details) {
				that.toastText(details.message);		
				localStorage.setItem('toastData', that.toastText());				
			}
		};
		$.mobile.showPageLoadingMsg("a", "Loading Channel");
		return ES.channelService.getChannel(channelid, callbacks);
	};*/
		
	this.gotChannel = function(data) {
		$.mobile.hidePageLoadingMsg();
		that.title(data.name );
		that.description(data.description);
		var callbacks = {
			success: function(data){
				$.each(data.message, function(indexMessage, valueMessage) {
					var tempCreated = msToTime(valueMessage.created);
					var tempClass = valueMessage.escLevelId.toLowerCase().trim();
					tempClass = 'icon-' + tempClass;
					that.channelMessages.push( // without push not working
						{messageCreated: tempCreated, messageText: valueMessage.text, messageClass: tempClass, messageID:valueMessage.id, messageSender:valueMessage.senderSubscriberId, messageCreatedOriginal:valueMessage.created}
					);
				});
			},
			error: function(data, status, details) {
				that.toastText(details.message);		
				localStorage.setItem('toastData', that.toastText());
			}
		};
		return ES.messageService.getChannelMessages(that.channelid(), undefined, callbacks);
	}	
}
