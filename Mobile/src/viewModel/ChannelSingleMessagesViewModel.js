function ChannelSingleMessagesViewModel() {
	var self = this;
	self.template = "channelSingleMessagesView";
	self.viewid = "V-55";
	self.viewname = "Message details";
	self.displayname = "Channel Single Message";
	self.hasfooter = true;
	
  self.inputObs = [ 'title', 
	'description', 
	'channelid', 
	'channelIcon', 
	'messageId', 
	'ack', 
	'messageCreated', 
	'messageClass', 
	'messageText', 
	'moreText', 
	'activeClass', 
	'dismissClass' ];
  self.defineObservables();
	
	self.less = ko.observable(true);
	self.more = ko.observable(false);
	self.moreButton = ko.observable(false);
	self.lessButton = ko.observable(false);
	self.iGiButton = ko.observable(false);
	self.dismissButton = ko.observable(true);
	self.setting = ko.observable(false);
    
	self.activate = function() {
		addExternalMarkup(self.template); // this is for header/overlay message
		self.channelIcon('');
		self.setting(false);			
		self.less(true);				
		self.more(false);		
		self.moreButton(false);
		self.lessButton(false);				
		self.iGiButton(false);
		self.dismissButton(true);			
		self.activeClass('igimsgdetail');
		self.dismissClass('');										
		if(ENYM.ctx.getItem("overlayCurrentChannel")) {
			var callbacks = {
				success: function(data) {
					self.channelIcon('channel4 sky-blue');						
					self.title(data.name);
					self.description(data.description);
					self.setting(true);
				},
				error: function(data, status, details) {
					if(status == '404') {
						self.channelIcon('evernymicon');							
						self.title('Evernym, Inc.');
						self.description('System Notifications');
						self.setting(false);
					}
				}
			};					
			var channel = JSON.parse(ENYM.ctx.getItem("overlayCurrentChannel"));
			self.channelid(channel.channelId);
			self.messageId(channel.msgId);
			self.ack(channel.ack);
			//alert(channel.createdLong);					
			self.messageCreated(channel.createdLong);
			self.messageClass(channel.escLevelId);
			self.moreText(channel.fullText);				
			if(channel.fullText.length > truncatedTextScreen()*6) {
				var fullText = $.trim(channel.fullText).substring(0, truncatedTextScreen()*6).split(' ').slice(0, -1).join(' ') + '...';
				self.messageText(fullText);	
				self.less(true);				
				self.moreButton(true);										
			}
			else {
				self.messageText(channel.fullText);										
			}					
			if(channel.iGiClass != '') {
				if(channel.acknowledged == 'N') {
					self.iGiButton(true);												
					self.activeClass('igimsgdetail');																		
				}
				else {
					self.iGiButton(true);
					self.dismissButton(false);																				
					self.activeClass('igisentimg');													
				}
			}
			if(self.messageClass() == '' || self.messageClass() == 'iconchannels icon-d') {
				self.dismissButton(false);																													
			}
			else if(channel.dismissed == 'Y') {
				self.iGiButton(false);						
				self.dismissClass('active');												
			}			
			if(channel.read == 'N' && channel.acknowledged == 'N') {
				return ES.channelService.getChannel(channel.channelId, callbacks).then(self.readMessageUpdateBadge(channel.msgId, channel.read, channel.ackRequested));
			}
			else {
				return ES.channelService.getChannel(channel.channelId, callbacks);
			}
		}
		else {
			var channel = JSON.parse(ENYM.ctx.getItem("currentChannel"));
			var channelMessage = JSON.parse(ENYM.ctx.getItem("currentChannelMessage"));
			self.channelIcon('channel4 sky-blue');				
			self.title(channel.name);
			self.channelid(channel.channelId);	
			self.description(channel.description);
			self.setting(true);
			if(channelMessage) {
				self.messageId(channelMessage.messageId);
				self.ack(channelMessage.ack);																
				//self.messageCreated(dateFormat2(channelMessage.messageCreatedOriginal));
				self.messageCreated(formatDate(channelMessage.messageCreatedOriginal, 'long'));
				self.messageClass(channelMessage.messageClass);
				self.moreText(channelMessage.messageText);					
				if(channelMessage.messageText.length > truncatedTextScreen()*6) {
					var fullText = $.trim(channelMessage.messageText).substring(0, truncatedTextScreen()*6).split(' ').slice(0, -1).join(' ') + '...';
					self.messageText(fullText);	
					self.less(true);				
					self.moreButton(true);										
				}
				else {
					self.messageText(channelMessage.messageText);										
				}					
				self.readMessageUpdateBadge(channelMessage.messageId, channelMessage.read, channelMessage.ackRequested);
				if(channelMessage.iGiClass != '') {
					if(channelMessage.ack == 'N') {
						self.iGiButton(true);													
						self.activeClass('igimsgdetail');
					}
					else {
						self.iGiButton(true);
						self.dismissButton(false);																					
						self.activeClass('igisentimg');							
					}
				}
				if(self.messageClass() == '' || self.messageClass() == 'iconchannels icon-d') {
					self.dismissButton(false);																													
				}
				else if(channelMessage.dismissed == 'Y') {
					self.iGiButton(false);						
					self.dismissClass('active');												
				}				
			}
		}
	};
	
	self.readMessageUpdateBadge = function(messageID, read, igiAcknowledge) {
		$('.active-overlay').html('');
		var callbacks = {
			success: function(data) {
				//alert(success);
			},
			error: function(data, status, details) {
				var toastobj = {type: 'toast-error', text: details.message};
				showToast(toastobj);
			}
		};
		if(read == 'N' && igiAcknowledge == "N") {
			if(!$.isEmptyObject(ES.systemService.MnsCacheData)) {
				ES.systemService.adjMnsCount(-1);
			}
			var tempEnymNotifications = [];
			tempEnymNotifications = JSON.parse(ENYM.ctx.getItem('enymNotifications'));
			if(tempEnymNotifications.length > 0) {
				$.each(tempEnymNotifications, function(indexNotification, valueNotification) {
					if(typeof valueNotification != 'undefined' && valueNotification.msgId == messageID) {
						tempEnymNotifications.splice(indexNotification,1);
					}
				});
				ENYM.ctx.removeItem('enymNotifications');
				ENYM.ctx.setItem('enymNotifications', JSON.stringify(tempEnymNotifications));
			}
		} else if (read == 'N') {
			var tempEnymNotifications = [];
			tempEnymNotifications = JSON.parse(ENYM.ctx.getItem('enymNotifications'));
			if(tempEnymNotifications.length > 0) {
				$.each(tempEnymNotifications, function(indexNotification, valueNotification) {
					if(typeof valueNotification != 'undefined' && valueNotification.msgId == messageID) {
						valueNotification.read = 'Y';
					}
				});
				ENYM.ctx.removeItem('enymNotifications');
				ENYM.ctx.setItem('enymNotifications', JSON.stringify(tempEnymNotifications));
			}			
		}
		return ES.messageService.readMsg(messageID, callbacks).then(self.updateMessages);
	};
	
	self.updateMessages = function(responseData) {
		if(responseData && responseData.unreadCount > 0) {
			headerViewModel.newMessageCount(responseData.unreadCount);
		}
		else {
			headerViewModel.newMessageCount();
			headerViewModel.newMessageClass('');
		}
	};
	
	self.showMore = function(){
		self.less(false);		
		self.more(true);
		self.moreButton(false);
		self.lessButton(true);																
	};
	
	self.showLess = function(){
		self.less(true);		
		self.more(false);
		self.moreButton(true);
		self.lessButton(false);															
	};	
	
	self.iGiAck = function(data) {
		var callbacks = {
			success: function(data) {
				self.iGiButton(true);
				self.dismissButton(false);
				self.activeClass('igisentimg');
				backNavText.pop();
				var redirectView = backNavView.pop();				
				var toastobj = {redirect: redirectView, type: '', text: 'iGi sent!'};
				showToast(toastobj);				
				goToView(redirectView);
			},
			error: function(data, status, details) {
				var toastobj = {type: 'toast-error', text: details.message};
				showToast(toastobj);					
			}
		};		
		if(self.ack() == 'Y' || self.activeClass() == 'igisentimg') {
			var toastobj = {type: 'toast-info', text: 'iGi has already been sent!'};
			showToast(toastobj);												
		}
		else {			
			$.mobile.showPageLoadingMsg('a', 'Sending iGi request!');
			// To Do Common function for Overlay messages and badge count
			if(!$.isEmptyObject(ES.systemService.MnsCacheData)) {
				ES.systemService.adjMnsCount(-1);
			}
			var tempEnymNotifications = [];
			tempEnymNotifications = JSON.parse(ENYM.ctx.getItem('enymNotifications'));
			if(tempEnymNotifications.length > 0) {
				$.each(tempEnymNotifications, function(indexNotification, valueNotification) {
					if(typeof valueNotification != 'undefined' && valueNotification.msgId == self.messageId()) {
						tempEnymNotifications.splice(indexNotification,1)
					}					
				});
				setTimeout(function() {
					showNewMessagesCount(ES.systemService.MnsCacheData.data.unreadCount);
					overlayViewModel.showNewMessagesOverlay();
				}, 1000);				
				ENYM.ctx.setItem('enymNotifications', JSON.stringify(tempEnymNotifications));
			}	
			//			
			return ES.messageService.acknowledgeMsg(self.messageId(), callbacks);
		}
	};
	
	self.dismissEscalation = function(data) {
		var callbacks = {
			success: function(data) {
				self.iGiButton(false);
				self.dismissButton(true);								
				self.dismissClass('active');
				var toastobj = {type: '', text: 'Escalation is now halted for this message. No further delivery attempts will be made.'};
				showToast(toastobj);									
			},
			error: function(data, status, details) {
				var toastobj = {type: 'toast-error', text: details.message};
				showToast(toastobj);					
			}
		};		
		if(self.dismissClass() == 'active') {
			var toastobj = {type: 'toast-info', text: 'Escalation is already halted !'};
			showToast(toastobj);															
		}
		else {			
			$.mobile.showPageLoadingMsg('a', 'Sending Dismiss escalation request !');		
			return ES.messageService.dismissMsg(self.messageId(), callbacks);
		}
	};	
	
	self.comingSoon = function(data) {
		headerViewModel.comingSoon();		
	};
}

ChannelSingleMessagesViewModel.prototype = new ENYM.ViewModel();
ChannelSingleMessagesViewModel.prototype.constructor = ChannelSingleMessagesViewModel;