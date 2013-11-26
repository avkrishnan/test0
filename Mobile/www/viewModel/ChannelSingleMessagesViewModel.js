/* Devender - To Do Remove it later before go live*/
function ChannelSingleMessagesViewModel() {
	var that = this;
	this.template = "channelSingleMessagesView";
	this.viewid = "V-55";
	this.viewname = "ChannelSingleMessagesDetails";
	this.displayname = "Channel Single Message";
	this.hasfooter = true;
	this.backText = ko.observable();		
	
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
			that.backText('<em></em>'+backNavText[backNavText.length-1]);
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
				//alert(localStorage.getItem("currentChannel"));
				//alert(localStorage.getItem("currentChannelMessage"));
				that.title(channel.name);
				that.channelid(channel.id);
				that.description(channel.description);
				that.messageCreated(dateFormat2(channelMessage.messageCreatedOriginal));
				that.messageClass(channelMessage.messageClass);
				that.messageText(channelMessage.messageText);
			}
			else {
				//alert(localStorage.getItem("overlayCurrentChannel"));
				var channel = JSON.parse(localStorage.getItem("overlayCurrentChannel"));
				that.title(channel.displayFrom);
				that.channelid(channel.channelId);
				that.description(channel.text);
				that.messageCreated(channel.created);
				that.messageClass(channel.type);
				that.messageText(channel.text);				
			}
		}
	};
	
	this.backCommand = function () {
		popBackNav();
  };	

	this.menuCommand = function () {
		pushBackNav('Message details', 'channelSingleMessagesView', 'channelMenuView');
  };
	
	this.actionFollowChannelCommand = function(data) {
		pushBackNav('Message details', 'channelSingleMessagesView', 'channelViewUnfollow');		
	}	
	
	this.userSettings = function () {
		pushBackNav('Message details', 'channelSingleMessagesView', 'escalationPlansView');;
  };	
	
	this.composeCommand = function () {
		pushBackNav('Message details', 'channelSingleMessagesView', 'sendMessageView');
  };	
	
}
