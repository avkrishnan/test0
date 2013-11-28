/*globals ko*/
/* To do - Pradeep Kumar */
function SingleMessageRepliesViewModel() {
  var that = this;
	this.template = 'singleMessageRepliesView';
	this.viewid = 'V-56';
	this.viewname = 'MessageReplies';
	this.displayname = 'Message Replies';	
	this.accountName = ko.observable();	

  /* Single message observable */		
	this.channelId = ko.observable();
	this.channelName = ko.observable();
	this.messageId = ko.observable();	
	this.replies = ko.observableArray([]);
	this.replyTime = ko.observable();	
	this.reply = ko.observable();
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
			addExternalMarkup(that.template); // this is for header/overlay message			
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}			
			that.accountName(localStorage.getItem('accountName'));		
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));			
			var messageObject = JSON.parse(localStorage.getItem('currentMessageData'));
			localStorage.removeItem('currentReplyData');													
			that.channelId(channelObject.channelId);
			that.channelName(channelObject.channelName);												
			that.messageId(messageObject.messageId);
			$.mobile.showPageLoadingMsg("a", "Loading Message replies");			
			return ES.messageService.getChannelMessages(that.channelId(), {replyto: that.messageId()}, {success: successfulReliesGET, error: errorAPI})			
		}
	}	
	
	function successfulReliesGET(data){
    $.mobile.hidePageLoadingMsg();
		that.replies.removeAll();			
		var len = 0;
		for(len; len<data.message.length; len++) {
			if(data.message[len].replies < 1) {
				that.replies.push({
					replyId: data.message[len].id,
					senderSubscriberId: data.message[len].senderSubscriberId,
					responseToMsgId: data.message[len].responseToMsgId,		
					created: data.message[len].created,				
					replyTime: msToTime(data.message[len].created),
					reply: data.message[len].text,							
					replyToReply: data.message[len].replies
				});
			}
		}
	}; 
	
	function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		that.toastText(details.message);		
		localStorage.setItem('toastData', that.toastText());
    goToView('singleMessageView');
  };
	
	this.replyDetail = function(data){	
		localStorage.setItem('currentReplyData', JSON.stringify(data));									
		viewNavigate('Broadcast Replies', 'singleMessageRepliesView', 'replyDetailView');
	};	
				
}
