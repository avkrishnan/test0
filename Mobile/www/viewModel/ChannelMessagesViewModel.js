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
		/*if(localStorage.getItem("overlayCurrentChannel") && localStorage.getItem("overlayCurrentChannel") != 'null') {
			localStorage.setItem("currentChannel", localStorage.getItem("overlayCurrentChannel"));
			localStorage.removeItem("overlayCurrentChannel");
		}*/
		localStorage.removeItem("overlayCurrentChannel");		
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
			//that.channelid(channel.channelId);
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
	this.iGiAckMessage = function(data) {
		var callbacks = {
			success: function(data) {					
				that.toastText('iGi Acknowledgement sent !');
				localStorage.setItem('toastData', that.toastText());
				goToView($.mobile.activePage.attr('id'));								
			},
			error: function(data, status, details) {
				that.toastText(details.message);
				showToast();				
			}
		};					
		$.mobile.showPageLoadingMsg('a', 'Sending Acknowledgement request !');		
		return ES.messageService.acknowledgeMsg(data.messageId, callbacks);
	}
		
	this.showSingleMessage = function(data) {
		localStorage.setItem("currentChannelMessage",JSON.stringify(data));
		viewNavigate('Broadcast Msg', 'channelMessagesView', 'channelSingleMessagesView');
	}
	
	
	/*this.getChannelCommand = function(channelid) {
		var callbacks = {
			success: function() {
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
		that.title(data.name);
		that.description(data.description);
		var callbacks = {
			success: function(data) {
				var screenSizeText = truncatedTextScreen();
				$.each(data.messagealert, function(indexMessage, valueMessage) {
					//alert(JSON.stringify(valueMessage));
					var tempCreated = msToTime(valueMessage.created);
					if(valueMessage.escLevelId && valueMessage.escLevelId != 'N' && valueMessage.escLevelId != 'F') {
						var tempClass = valueMessage.escLevelId.toLowerCase().trim();
						tempClass = 'iconchannels icon-' + tempClass;
					}
					else if(valueMessage.escLevelId == 'N' || valueMessage.escLevelId == 'F') {
						tempClass = '';						
					}
					else {
						tempClass = 'iconchannels icon-d'
					}
					if(valueMessage.text.length > screenSizeText) {
						var tempText = jQuery.trim(valueMessage.text).substring(0, screenSizeText).split(" ").slice(0, -1).join(" ") + "...";
					}
					else {
						var tempText = jQuery.trim(valueMessage.text);
					}
					if(valueMessage.ackRequested == 'Y' && valueMessage.acknowledged == 'N' && valueMessage.dismissed == 'N') {
						var iGiClass = 'igibutton';
					}
					else if(valueMessage.acknowledged == 'Y' && valueMessage.dismissed == 'N') {
						var iGiClass = 'igibutton igisent';						
					}
					else {
						var iGiClass = '';						
					}
					that.channelMessages.push( // without push not working
						{read:valueMessage.read, ackRequested:valueMessage.ackRequested, dismissed: valueMessage.dismissed, iGiClass: iGiClass, messageId: valueMessage.msgId, ack: valueMessage.acknowledged, messageCreated: tempCreated, messageShortText: tempText, messageText: valueMessage.text, messageClass: tempClass, messageID:valueMessage.channelId, messageSender:valueMessage.subscriberId, messageCreatedOriginal:valueMessage.created}
					);
				});
				
			},
			error: function(data, status, details) {
				that.toastText(details.message);
				showToast();
			}
		};
		//return ES.messageService.getChannelMessages(that.channelid(), undefined, callbacks);
		return ES.messageService.getChannelMessagesForFollower(that.channelid(), undefined, callbacks);
	}	
}
