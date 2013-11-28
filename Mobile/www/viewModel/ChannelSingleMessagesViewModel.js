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
			else if(localStorage.getItem('counter') == 2) {		
				localStorage.setItem('counter', 3);
			}	
			else {
				localStorage.setItem('counter', 1);
			}
			if(localStorage.getItem("currentChannel")) {			
				var channel = JSON.parse(localStorage.getItem("currentChannel"));
				var channelMessage = JSON.parse(localStorage.getItem("currentChannelMessage"));
				that.title(channel.name);
				that.channelid(channel.id);
				that.description(channel.description);
				that.messageCreated(dateFormat2(channelMessage.messageCreatedOriginal));
				that.messageClass(channelMessage.messageClass);
				that.messageText(channelMessage.messageText);
				that.readMessageUpdateBadge(channel.id);
			}
			else {
				var channel = JSON.parse(localStorage.getItem("overlayCurrentChannel"));
				that.title(channel.displayFrom);
				that.channelid(channel.channelId);
				that.description(channel.text);
				that.messageCreated(channel.created);
				that.messageClass(channel.type);
				that.messageText(channel.text);
				that.readMessageUpdateBadge(channel.msgId);
			}
		}
	};
	
<<<<<<< HEAD
	this.readMessage = function(messageID) {
		ES.messageService.readMsg(messageID, {
			success: function(responseData) {
				//alert(JSON.stringify(responseData));
			},
=======
	this.backCommand = function () {
		popBackNav();
  };
	
	this.readMessageUpdateBadge = function(messageID) {
		$('.active-overlay').html(''); 
		var callbacks = {
			success: function(data) {},
>>>>>>> 1b972d305b004ac2deccf8f23c873bf5ea61d4ac
			error: function(data, status, details) {
				alert(details.message);
			}
		};		
		return ES.messageService.readMsg(messageID, callbacks).then(that.updateMessages);
	}
	
	this.updateMessages = function(data) {
		ES.systemService.getMsgNotifs({
			success: function(responseData) {
				localStorage.removeItem('enymNotifications');
				localStorage.setItem('enymNotifications', JSON.stringify(responseData));
				if(JSON.parse(localStorage.getItem('enymNotifications')).length > 0) {
					headerViewModel.showNewMessagesCount(localStorage.getItem('enymNotifications'));
					overlayViewModel.showNewMessagesOverlay();				
				}
				else {
					headerViewModel.newMessageCount('');
					headerViewModel.newMessageClass('');			
				}
			},
			error: function(data, status, details) {
				alert(details.message);
			}
		});
	}
	
}
