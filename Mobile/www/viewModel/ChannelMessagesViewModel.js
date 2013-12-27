function ChannelMessagesViewModel() {
	var self = this;
	self.template = "channelMessagesView";
	self.viewid = "V-55";
	self.viewname = "Broadcast Msg";
	self.displayname = "Channel Messages";
	self.hasfooter = true;

  self.inputObs = [ 'title', 'description', 'channelid' ];
  self.defineObservables();
		
	self.channelMessages = ko.observableArray([]);
    
	self.activate = function() {
		localStorage.removeItem("overlayCurrentChannel");
		var channel = JSON.parse(localStorage.getItem("currentChannel"));
		if(!channel) {
			goToView('channelsFollowingListView');
		} 
		else {
			addExternalMarkup(self.template); // this is for header/overlay message		
			if(localStorage.getItem('counter') == 1) {
				localStorage.setItem('counter', 2);
			} 
			else {		
				localStorage.setItem('counter', 1);
			}
			self.channelid(channel.id);
			localStorage.removeItem("currentChannelMessage");
			$.mobile.showPageLoadingMsg("a", "Loading Channel Messages");
			self.channelMessages.removeAll();
			self.gotChannel(channel);
		}
	};
	
	/* action to chennels unfollow page settings page*/
	self.actionFollowChannelCommand = function(data) {
		viewNavigate('Broadcast Msg', 'channelMessagesView', 'channelViewUnfollow');
	};	
	
	/*action to single message page*/
	self.iGiAckMessage = function(data) {
		var callbacks = {
			success: function(data) {					
				var toastobj = {type: '', text: 'iGi Acknowledgement sent !'};
				showToast(toastobj);				
				goToView($.mobile.activePage.attr('id'));								
			},
			error: function(data, status, details) {
				var toastobj = {type: 'toast-error', text: details.message};
				showToast(toastobj);			
			}
		};					
		$.mobile.showPageLoadingMsg('a', 'Sending Acknowledgement request !');
		// TODO make a common function for all Overlay message and Badge Count
		if(!$.isEmptyObject(ES.systemService.MnsCacheData)) {
			ES.systemService.adjMnsCount(-1);
		}
		var tempEnymNotifications = [];
		tempEnymNotifications = JSON.parse(localStorage.getItem('enymNotifications'));
		if(tempEnymNotifications.length > 0) {
			$.each(tempEnymNotifications, function(indexNotification, valueNotification) {
				if(typeof valueNotification != 'undefined' && valueNotification.msgId == data.messageId) {
					tempEnymNotifications.splice(indexNotification,1)
				}					
			});
			setTimeout(function() {
				showNewMessagesCount(ES.systemService.MnsCacheData.data.unreadCount);
				overlayViewModel.showNewMessagesOverlay();
			}, 1000);				
			localStorage.setItem('enymNotifications', JSON.stringify(tempEnymNotifications));
		}
		return ES.messageService.acknowledgeMsg(data.messageId, callbacks);
	};
		
	self.showSingleMessage = function(data) {
		localStorage.setItem("currentChannelMessage",JSON.stringify(data));
		viewNavigate('Broadcast Msg', 'channelMessagesView', 'channelSingleMessagesView');
	};
		
	self.gotChannel = function(data) {
		$.mobile.hidePageLoadingMsg();
		self.title(data.name);
		self.description(data.description);
		var callbacks = {
			success: function(data) {
				var screenSizeText = truncatedTextScreen();
				$.each(data.messagealert, function(indexMessage, valueMessage) {
					var tempCreated = time2TimeAgo(valueMessage.created);
					var tempCreated = formatDate(valueMessage.created, 'short', 'follow');
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
					var readClass = 'read-' + valueMessage.read.toLowerCase(); 
					self.channelMessages.push( // without push not working
						{
							readClass:readClass, read:valueMessage.read, ackRequested:valueMessage.ackRequested, dismissed: valueMessage.dismissed, iGiClass: iGiClass, 
							messageId: valueMessage.msgId, ack: valueMessage.acknowledged, messageCreated: tempCreated, messageShortText: tempText, messageText: valueMessage.text, 
							messageClass: tempClass, messageID:valueMessage.channelId, messageSender:valueMessage.subscriberId, messageCreatedOriginal:valueMessage.created
						}
					);
				});
				
			},
			error: function(data, status, details) {
				var toastobj = {type: 'toast-error', text: details.message};
				showToast(toastobj);
			}
		};
		//return ES.messageService.getChannelMessagesForFollower(self.channelid(), undefined, callbacks);
		return ES.messageService.getChannelMessagesForFollower(self.channelid(), {limit: 10000}, callbacks);
	}	
}

ChannelMessagesViewModel.prototype = new AppCtx.ViewModel();
ChannelMessagesViewModel.prototype.constructor = ChannelMessagesViewModel;