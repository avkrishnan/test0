/*globals ko*/
/* To do - Pradeep Kumar */
function SingleMessageViewModel() {
  var that = this;
	this.template = 'singleMessageView';
	this.viewid = 'V-23';
	this.viewname = 'Message';
	this.displayname = 'Message';	
	this.accountName = ko.observable();		

  /* Single message observable */		
	this.channelName = ko.observable();		
	this.time = ko.observable();	
	this.singleMessage = ko.observable();	
	this.replies = ko.observable();
	this.toastText = ko.observable();			
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  
	
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));	
		var messageObject = JSON.parse(localStorage.getItem('currentMessageData'));			
		if(token == '' || token == null) {
			goToView('loginView');
		} else if(!channelObject || !messageObject) {
			goToView('channelsIOwnView');			
		} else {
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}			
			that.accountName(localStorage.getItem('accountName'));	
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));			
			var messageObject = JSON.parse(localStorage.getItem('currentMessageData'));										
			that.channelName(channelObject.channelName);					
			that.time('Sent '+ dateFormat1(messageObject.created) +' ('+messageObject.time+'):');	
			that.singleMessage(messageObject.broadcast);	
			that.replies(messageObject.replies);							
		}
	}
	
	this.menuCommand = function () {
		pushBackNav('Broadcast Details', 'singleMessageView', 'channelMenuView');		
  };	
	
	this.messageFullText = function(){
		goToView('singleMessageFullTextView');										
	};
	
	this.messageReplies = function(){
		goToView('singleMessageRepliesView');									
	};
	
	this.userSettings = function () {
		pushBackNav('Broadcast Details', 'singleMessageView', 'escalationPlansView');				
  };	
	
	this.composeCommand = function () {
		pushBackNav('Broadcast Details', 'singleMessageView', 'sendMessageView');				
  };	
				
}
