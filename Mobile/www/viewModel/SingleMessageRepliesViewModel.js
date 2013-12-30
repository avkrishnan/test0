/* To do - Pradeep Kumar */
function SingleMessageRepliesViewModel() {
  var self = this;
	self.template = 'singleMessageRepliesView';
	self.viewid = 'V-56';
	self.viewname = 'Replies';
	self.displayname = 'Broadcast Replies';	
	
	self.inputObs = [ 'channelId', 'channelName', 'messageId'];
	self.defineObservables();		
	self.replies = ko.observableArray([]);  
	
	self.activate = function() {
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));		
		var messageObject = JSON.parse(ENYM.ctx.getItem('currentMessageData'));			
		if(!channelObject || !messageObject) {
			goToView('channelsIOwnView');			
		} else {
			addExternalMarkup(self.template); // this is for header/overlay message
			self.replies.removeAll();										
			var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));			
			var messageObject = JSON.parse(ENYM.ctx.getItem('currentMessageData'));
			ENYM.ctx.removeItem('currentReplyData');													
			self.channelId(channelObject.channelId);
			self.channelName(channelObject.channelName);												
			self.messageId(messageObject.messageId);
			$.mobile.showPageLoadingMsg("a", "Loading Message replies");			
			return ES.messageService.getChannelMessages(self.channelId(), {replyto: self.messageId()}, {success: successfulReliesGET, error: errorAPI});			
		}
	}	
	
	function successfulReliesGET(data){
    $.mobile.hidePageLoadingMsg();			
		for(len = 0; len<data.message.length; len++) {
			if(data.message[len].replies < 1) {
				var reply = '<em>'+data.message[len].senderFirstname+' '+data.message[len].senderLastname+': </em>'+data.message[len].text;
				if(data.message[len].text.length > truncatedTextScreen()) {
				  var replyLess = $.trim(data.message[len].text).substring(0, truncatedTextScreen()*2).split(' ').slice(0, -1).join(' ') + '...';
				}
				else {
					var replyLess = data.message[len].text;					
				}				
				self.replies.push({
					replyId: data.message[len].id,
					senderSubscriberId: data.message[len].senderSubscriberId,
					responseToMsgId: data.message[len].responseToMsgId,		
					created: data.message[len].created,				
					replyTime: formatDate(data.message[len].created, 'short', 'main'),
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
	
	self.replyDetail = function(data){	
		ENYM.ctx.setItem('currentReplyData', JSON.stringify(data));									
		viewNavigate('Replies', 'singleMessageRepliesView', 'replyDetailView');
	};	
				
}

SingleMessageRepliesViewModel.prototype = new ENYM.ViewModel();
SingleMessageRepliesViewModel.prototype.constructor = SingleMessageRepliesViewModel;
