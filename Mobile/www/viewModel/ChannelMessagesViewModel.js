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
    var channel;
	self.activate = function() {
		ENYM.ctx.removeItem("overlayCurrentChannel");
		channel = JSON.parse(ENYM.ctx.getItem("currentChannel"));
		if(!channel) {
			goToView('channelsFollowingListView');
		} 
		else {
			addExternalMarkup(self.template); // this is for header/overlay message		
			self.channelid(channel.id);
			ENYM.ctx.removeItem("currentChannelMessage");
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
		if(data.iGiClass == 'igibutton igisent') {
			var toastobj = {type: 'toast-info', text: 'iGi has already been sent!'};
			showToast(toastobj);
		} else{
			var callbacks = {
			success: function(data) {					
				var toastobj = {type: '', text: 'iGi sent!'};
				showToast(toastobj);
				self.gotChannel(channel);				
				//goToView($.mobile.activePage.attr('id'));								
			},
			error: function(data, status, details) {
				var toastobj = {type: 'toast-error', text: details.message};
				showToast(toastobj);			
			}
		};					
		$.mobile.showPageLoadingMsg('a', 'Sending iGi request!');
		}
		// TODO make a common function for all Overlay message and Badge Count
		if(!$.isEmptyObject(ES.systemService.MnsCacheData)) {
			ES.systemService.adjMnsCount(-1);
		}
		var tempEnymNotifications = [];
		tempEnymNotifications = JSON.parse(ENYM.ctx.getItem('enymNotifications'));
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
			ENYM.ctx.setItem('enymNotifications', JSON.stringify(tempEnymNotifications));
		}
		return ES.messageService.acknowledgeMsg(data.messageId, callbacks);
	};
		
	self.showSingleMessage = function(data) {
		ENYM.ctx.setItem("currentChannelMessage",JSON.stringify(data));
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
					var tempCreated = formatDate(valueMessage.created, 'short', 'follow');
					if(valueMessage.escLevelId && valueMessage.escLevelId != 'N' && valueMessage.escLevelId != 'F') {
						var tempClass = valueMessage.escLevelId.toLowerCase().trim();
						tempClass = 'iconchannels icon-' + tempClass;
						var messageType = 'msg-icon';
					}
					else if(valueMessage.escLevelId == 'N' || valueMessage.escLevelId == 'F') {
						tempClass = '';
						var messageType = 'onlymsg';						
					}
					else {
						tempClass = 'iconchannels icon-d'
					}
					var tempText = valueMessage.text;
					if(valueMessage.ackRequested == 'Y' && valueMessage.acknowledged == 'N' && valueMessage.dismissed == 'N') {
						var iGiClass = 'igibutton';
						var messageType = 'igi-msg';
					}
					else if(valueMessage.acknowledged == 'Y' && valueMessage.dismissed == 'N') {
						var iGiClass = 'igibutton igisent';
						var messageType = 'igi-msg';						
					}
					else {
						var iGiClass = '';
					}
					if(iGiClass != '' && tempClass != '') {
						var messageType = '';
					}					
					var readClass = 'read-' + valueMessage.read.toLowerCase(); 
					self.channelMessages.push( // without push not working
						{
							readClass:readClass, read:valueMessage.read, ackRequested:valueMessage.ackRequested, dismissed: valueMessage.dismissed, iGiClass: iGiClass, messageType: messageType,
							messageId: valueMessage.msgId, ack: valueMessage.acknowledged, messageCreated: tempCreated, messageShortText: tempText, messageText: valueMessage.text, 
							messageClass: tempClass, messageID:valueMessage.channelId, messageSender:valueMessage.subscriberId, messageCreatedOriginal:valueMessage.created
						}
					);
				});
				alert(JSON.stringify(self.channelMessages()));
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

ChannelMessagesViewModel.prototype = new ENYM.ViewModel();
ChannelMessagesViewModel.prototype.constructor = ChannelMessagesViewModel;