/* Devender - To Do Remove it later before go live*/
function ChannelSingleMessagesViewModel() {
	var that = this;
	this.template = "channelSingleMessagesView";
	this.viewid = "V-55";
	this.viewname = "Message details";
	this.displayname = "Channel Single Message";
	this.hasfooter = true;		
	
	this.accountName = ko.observable();	
	this.channelIcon = ko.observable();
	this.title = ko.observable();	
	this.description = ko.observable('');
	this.channelid = ko.observable();
	this.messageId = ko.observable();
	this.ack = ko.observable();	
	this.messageCreated = ko.observable();
	this.messageClass = ko.observable();
	this.messageText = ko.observable();
	this.moreText = ko.observable();	
	this.less = ko.observable(true);		
	this.more = ko.observable(false);	
	this.moreButton = ko.observable(false);
	this.lessButton = ko.observable(false);		
	this.activeClass = ko.observable();	
	this.iGiButton = ko.observable(false);
	this.dismissClass = ko.observable();		
	this.dismissButton = ko.observable(true);	
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
		} 
		else {
			addExternalMarkup(that.template); // this is for header/overlay message
			that.accountName(localStorage.getItem("accountName"));
			that.less(true);				
			that.more(false);		
			that.moreButton(false);
			that.lessButton(false);				
			that.iGiButton(false);
			that.dismissButton(true);			
			that.activeClass('igimsgdetail');
			that.dismissClass('');										
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');
			}
			if(localStorage.getItem('counter') == 1) {
				localStorage.setItem('counter', 2);
			} 
			else if(localStorage.getItem('counter') == 2) {		
				localStorage.setItem('counter', 3);
			}	
			else {
				localStorage.setItem('counter', 1);
			}
			//alert(localStorage.getItem("currentChannel"));
			//alert(localStorage.getItem("overlayCurrentChannel"));
			if(localStorage.getItem("overlayCurrentChannel")) {
				var callbacks = {
					success: function(data) {
						that.channelIcon('sky-blue');						
						that.title(data.name);
						that.description(data.description);
					},
					error: function(data, status, details) {
						if(status == '404') {
							that.channelIcon('evernymicon');							
							that.title('Evernym, Inc.');
							that.description('System Notifications');
						}
					}
				};					
				var channel = JSON.parse(localStorage.getItem("overlayCurrentChannel"));
				that.channelid(channel.channelId);
				that.messageId(channel.msgId);
				that.ack(channel.ack);
				//alert(channel.createdLong);					
				that.messageCreated(channel.createdLong);
				that.messageClass(channel.escLevelId);
				that.moreText(channel.fullText);				
				if(channel.fullText.length > truncatedTextScreen()*6) {
				  var fullText = $.trim(channel.fullText).substring(0, truncatedTextScreen()*6).split(' ').slice(0, -1).join(' ') + '...';
					that.messageText(fullText);	
					that.less(true);				
					that.moreButton(true);										
				}
				else {
					that.messageText(channel.fullText);										
				}					
				if(channel.iGiClass != '') {
					if(channel.acknowledged == 'N') {
						that.iGiButton(true);												
						that.activeClass('igimsgdetail');																		
					}
					else {
						that.iGiButton(true);
					  that.dismissButton(false);																				
						that.activeClass('igisentimg');													
					}
				}
				if(that.messageClass() == '' || that.messageClass() == 'iconchannels icon-d') {
					that.dismissButton(false);																													
				}
				else if(channel.dismissed == 'Y') {
					that.iGiButton(false);						
					that.dismissClass('active');												
				}			
				if(channel.read == 'N' && channel.acknowledged == 'N') {
					return ES.channelService.getChannel(channel.channelId, callbacks).then(that.readMessageUpdateBadge(channel.msgId, channel.read, channel.ackRequested));
				}
				else {
					return ES.channelService.getChannel(channel.channelId, callbacks);
				}
			}
			else {
				var channel = JSON.parse(localStorage.getItem("currentChannel"));
				var channelMessage = JSON.parse(localStorage.getItem("currentChannelMessage"));
				that.channelIcon('sky-blue');				
				that.title(channel.name);
				that.channelid(channel.channelId);	
				that.description(channel.description);
				if(channelMessage) {
					that.messageId(channelMessage.messageId);
					that.ack(channelMessage.ack);																
					//that.messageCreated(dateFormat2(channelMessage.messageCreatedOriginal));
					that.messageCreated(formatDate(channelMessage.messageCreatedOriginal, 'long'));
					that.messageClass(channelMessage.messageClass);
					that.moreText(channelMessage.messageText);					
					if(channelMessage.messageText.length > truncatedTextScreen()*6) {
						var fullText = $.trim(channelMessage.messageText).substring(0, truncatedTextScreen()*6).split(' ').slice(0, -1).join(' ') + '...';
						that.messageText(fullText);	
						that.less(true);				
						that.moreButton(true);										
					}
					else {
						that.messageText(channelMessage.messageText);										
					}					
					that.readMessageUpdateBadge(channelMessage.messageId, channelMessage.read, channelMessage.ackRequested);
					if(channelMessage.iGiClass != '') {
						if(channelMessage.ack == 'N') {
							that.iGiButton(true);													
							that.activeClass('igimsgdetail');
						}
						else {
							that.iGiButton(true);
					    that.dismissButton(false);																					
							that.activeClass('igisentimg');							
						}
					}
					if(that.messageClass() == '' || that.messageClass() == 'iconchannels icon-d') {
						that.dismissButton(false);																													
					}
					else if(channelMessage.dismissed == 'Y') {
						that.iGiButton(false);						
						that.dismissClass('active');												
					}				
				}
			}
		}
	};
	
	this.readMessageUpdateBadge = function(messageID, read, igiAcknowledge) {
		//alert(messageID + read + igiAcknowledge);
		$('.active-overlay').html('');
		var callbacks = {
			success: function(data) {
				//alert('success');
			},
			error: function(data, status, details) {
				that.toastText(details.message);
				localStorage.setItem('toastData', that.toastText());
			}
		};
		if(read == 'N' && igiAcknowledge == "N") {
			if(!$.isEmptyObject(ES.systemService.MnsCacheData)) {
				ES.systemService.adjMnsCount(-1);
			}
			var tempEnymNotifications = [];
			tempEnymNotifications = JSON.parse(localStorage.getItem('enymNotifications'));
			if(tempEnymNotifications.length > 0) {
				$.each(tempEnymNotifications, function(indexNotification, valueNotification) {
					if(typeof valueNotification != 'undefined' && valueNotification.msgId == messageID) {
						tempEnymNotifications.splice(indexNotification,1)
					}
				});
				localStorage.removeItem('enymNotifications');
				localStorage.setItem('enymNotifications', JSON.stringify(tempEnymNotifications));
			}
		}
		/*var tempEnymNotifications = [];
		tempEnymNotifications = JSON.parse(localStorage.getItem('enymNotifications'));
		if(tempEnymNotifications.length > 0) {
			$.each(tempEnymNotifications, function(indexNotification, valueNotification) {
				if(valueNotification.msgId == messageID) {
					tempEnymNotifications.pop();
				}
			});
			localStorage.setItem('enymNotifications', JSON.stringify(tempEnymNotifications));
		}
		else {
			ES.systemService.MnsCacheData = {};
			if(localStorage.getItem('enymNotifications')) {
				localStorage.removeItem('enymNotifications');
			}
		}*/
		/*
		if(tempEnymNotifications.length > 0) {
			localStorage.setItem('enymNotifications', JSON.stringify(tempEnymNotifications));
		}
		else {
			ES.systemService.MnsCacheData = {};
			if(localStorage.getItem('enymNotifications')) {
				localStorage.removeItem('enymNotifications');	
			}
		}
		*/
		return ES.messageService.readMsg(messageID, callbacks).then(that.updateMessages);
	}
	
	this.updateMessages = function(responseData) {
		if(responseData && responseData.unreadCount > 0) {
			headerViewModel.newMessageCount(responseData.unreadCount);
		}
		else {
			headerViewModel.newMessageCount();
			headerViewModel.newMessageClass('');
		}
	}
	
	this.showMore = function(){
		that.less(false);		
		that.more(true);
		that.moreButton(false);
		that.lessButton(true);																
	};
	
	this.showLess = function(){
		that.less(true);		
		that.more(false);
		that.moreButton(true);
		that.lessButton(false);															
	};	
	
	this.iGiAck = function(data) {
		var callbacks = {
			success: function(data) {
				that.iGiButton(true);
				that.dismissButton(false);
				that.activeClass('igisentimg');
				that.toastText('iGi Acknowledgement sent !');
				localStorage.setItem('toastData', that.toastText());				
				popBackNav();
			},
			error: function(data, status, details) {
				that.toastText(details.message);
				showToast();					
			}
		};		
		if(that.ack() == 'Y' || that.activeClass() == 'igisentimg') {
			that.toastText('iGi Acknowledgement already sent !');
			showToast();												
		}
		else {			
			$.mobile.showPageLoadingMsg('a', 'Sending Acknowledgement request !');
//
			if(!$.isEmptyObject(ES.systemService.MnsCacheData)) {
				ES.systemService.adjMnsCount(-1);
			}
			var tempEnymNotifications = [];
			tempEnymNotifications = JSON.parse(localStorage.getItem('enymNotifications'));
			if(tempEnymNotifications.length > 0) {
				$.each(tempEnymNotifications, function(indexNotification, valueNotification) {
					if(typeof valueNotification != 'undefined' && valueNotification.msgId == that.messageId()) {
						tempEnymNotifications.splice(indexNotification,1)
					}					
				});
				setTimeout(function() {
					showNewMessagesCount(ES.systemService.MnsCacheData.data.unreadCount);
					overlayViewModel.showNewMessagesOverlay();
				}, 1000);				
				localStorage.setItem('enymNotifications', JSON.stringify(tempEnymNotifications));
			}	
//			
			return ES.messageService.acknowledgeMsg(that.messageId(), callbacks);
		}
	}
	
	this.dismissEscalation = function(data) {
		var callbacks = {
			success: function(data) {
				that.iGiButton(false);
				that.dismissButton(true);								
				that.dismissClass('active');					
				that.toastText('Escalation is now halted for this message. No further delivery attempts will be made.');								
				showToast();
			},
			error: function(data, status, details) {
				that.toastText(details.message);
				showToast();					
			}
		};		
		if(that.dismissClass() == 'active') {
			that.toastText('Escalation is already halted !');
			showToast();												
		}
		else {			
			$.mobile.showPageLoadingMsg('a', 'Sending Dismiss escalation request !');		
			return ES.messageService.dismissMsg(that.messageId(), callbacks);
		}
	}		
	
	this.replyMessage = function(data) {
		that.toastText('Feature coming soon!');
		showToast();		
	}		
	
}
