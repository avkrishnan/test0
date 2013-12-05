/* Devender - To Do Remove it later before go live*/
function ChannelSingleMessagesViewModel() {
	var that = this;
	this.template = "channelSingleMessagesView";
	this.viewid = "V-55";
	this.viewname = "Message details";
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
		} 
		else {
			addExternalMarkup(that.template); // this is for header/overlay message
			that.accountName(localStorage.getItem("accountName"));
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
						that.title(data.name);
						if(data.description) {
							that.description(data.description);
						}
						else {
							that.description('Channel description');
						}
					},
					error: function(data, status, details) {
						if(status == '404') {
							that.title('Evernym, Inc.');
							that.description('System Notifications');
						}
					}
				};					
				var channel = JSON.parse(localStorage.getItem("overlayCurrentChannel"));
				that.channelid(channel.channelId);
				that.messageCreated(channel.created);
				that.messageClass(channel.type);
				that.messageText(channel.text);
				//that.readMessageUpdateBadge(channel.msgId);
				return ES.channelService.getChannel(channel.channelId, callbacks).then(this.readMessageUpdateBadge(channel.msgId));
			}			
			else {
				var channel = JSON.parse(localStorage.getItem("currentChannel"));
				var channelMessage = JSON.parse(localStorage.getItem("currentChannelMessage"));
				that.title(channel.name);
				that.channelid(channel.channelId);
				that.description(channel.description);
				if(channelMessage) {
					that.messageCreated(dateFormat2(channelMessage.messageCreatedOriginal));
					that.messageClass(channelMessage.messageClass);
					that.messageText(channelMessage.messageText);
					that.readMessageUpdateBadge(channelMessage.messageID);
				}
			}
		}
	};
	
	this.readMessageUpdateBadge = function(messageID) {
		$('.active-overlay').html(''); 
		var callbacks = {
			success: function(data) {},
			error: function(data, status, details) {
				that.toastText(details.message);
				localStorage.setItem('toastData', that.toastText());					
			}
		};
		return ES.messageService.readMsg(messageID, callbacks).then(that.updateMessages);
	}
	
	this.updateMessages = function() {
		ES.systemService.getMsgNotifs({
			success: function(responseData) {
				localStorage.removeItem('enymNotifications');
				localStorage.setItem('enymNotifications', JSON.stringify(responseData.messagealert));
				if(JSON.parse(localStorage.getItem('enymNotifications')).length > 0) {
					//alert('1');
					headerViewModel.showNewMessagesCount(localStorage.getItem('enymNotifications'));
					overlayViewModel.showNewMessagesOverlay();
				}
				else {
					//alert('2');
					headerViewModel.newMessageCount('');
					headerViewModel.newMessageClass('');			
				}
			},
			error: function(data, status, details) {
				that.toastText(details.message);
				localStorage.setItem('toastData', that.toastText());				
			}
		});
	}
	
}
