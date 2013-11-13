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
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  
	
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			that.accountName(localStorage.getItem('accountName'));
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));			
			var messageObject = JSON.parse(localStorage.getItem('currentMessageData'));
			localStorage.removeItem('currentReplyData');													
			that.channelId(channelObject.channelId);
			that.channelName(channelObject.channelname);												
			that.messageId(messageObject.messageId);
			$.mobile.showPageLoadingMsg("a", "Loading Message replies");			
			return ES.messageService.getChannelMessages(that.channelId(), {replyto: that.messageId()}, {success: successfulReliesGET, error: errorAPI})			
		}
	}
	
	function msToTime(ms){
		var ms = new Date().getTime() - ms;	
		var secs = Math.floor(ms / 1000);
		var msleft = ms % 1000;
		var totalHours = Math.floor(secs / (60 * 60));
		var days = Math.floor(totalHours / 24);
		var hours = totalHours % 24;
		var divisor_for_minutes = secs % (60 * 60);
		var minutes = Math.floor(divisor_for_minutes / 60);
		var divisor_for_seconds = divisor_for_minutes % 60;
		var seconds = Math.ceil(divisor_for_seconds);
		if(days > 0) {
			return days+' days ago';
		} else if(hours > 0) {
			return hours+' hrs ago';
		} else if(minutes > 0) {
			return minutes+' mins ago';
		} else if(seconds > 0) {
			return  seconds+' secs ago';
		} else {
			return  'just now';
		}
	}
	
	/*function replyAuthor() {
		return ES.loginService.getAccount('bb5156c5-1e95-414b-b76a-299edabd15f7', {success: successfulGetAccountInfo, error: errorAPI});
	}
	
	function successfulGetAccountInfo(data){
		alert(data);
	}*/
	
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
	
	function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    showError(response.message);
    goToView('singleMessageView');
  };
	
	this.replyDetail = function(data){	
		localStorage.setItem('currentReplyData', JSON.stringify(data));									
		goToView('replyDetailView');
	};
				
}
