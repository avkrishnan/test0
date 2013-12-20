﻿/*globals ko*/
/* To do - Pradeep Kumar */
function SingleMessageRepliesViewModel() {
  var that = this;
	this.template = 'singleMessageRepliesView';
	this.viewid = 'V-56';
	this.viewname = 'Replies';
	this.displayname = 'Broadcast Replies';	
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
		var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));		
		var messageObject = JSON.parse(localStorage.getItem('currentMessageData'));			
		if(token == '' || token == null) {
			goToView('loginView');
		} else if(!channelObject || !messageObject) {
			goToView('channelsIOwnView');			
		} else {
			addExternalMarkup(that.template); // this is for header/overlay message
			that.replies.removeAll();									
			that.accountName(localStorage.getItem('accountName'));		
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));			
			var messageObject = JSON.parse(localStorage.getItem('currentMessageData'));
			localStorage.removeItem('currentReplyData');													
			that.channelId(channelObject.channelId);
			that.channelName(channelObject.channelName);												
			that.messageId(messageObject.messageId);
			$.mobile.showPageLoadingMsg("a", "Loading Message replies");			
			return ES.messageService.getChannelMessages(that.channelId(), {replyto: that.messageId()}, {success: successfulReliesGET, error: errorAPI});			
		}
	}	
	
	function successfulReliesGET(data){
    $.mobile.hidePageLoadingMsg();			
		var len = 0;
		for(len; len<data.message.length; len++) {
			if(data.message[len].replies < 1) {
				if(data.message[len].text.length > truncatedTextScreen()) {
					var reply = '<em>'+data.message[len].senderFirstname+' '+data.message[len].senderLastname+': </em>'+$.trim(data.message[len].text).substring(0, truncatedTextScreen()).split(' ').slice(0, -1).join(' ') + '...';
				  var replyLess = $.trim(data.message[len].text).substring(0, truncatedTextScreen()*2).split(' ').slice(0, -1).join(' ') + '...';
				}
				else {
					var reply = '<em>'+data.message[len].senderFirstname+' '+data.message[len].senderLastname+': </em>'+data.message[len].text;
					var replyLess = data.message[len].text;					
				}				
				that.replies.push({
					replyId: data.message[len].id,
					senderSubscriberId: data.message[len].senderSubscriberId,
					responseToMsgId: data.message[len].responseToMsgId,		
					created: data.message[len].created,				
					replyTime: msToTime(data.message[len].created),
					reply: reply,
					replyLess: replyLess,					
					replyFull: data.message[len].text,
					senderFirstname: data.message[len].senderFirstname,
					senderLastname: data.message[len].senderLastname,										
					replyToReply: data.message[len].replies
				});
			}
		}
	}; 
	
	function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);
  };
	
	this.replyDetail = function(data){	
		localStorage.setItem('currentReplyData', JSON.stringify(data));									
		viewNavigate('Replies', 'singleMessageRepliesView', 'replyDetailView');
	};	
				
}
