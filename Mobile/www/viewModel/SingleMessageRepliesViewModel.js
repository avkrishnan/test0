function SingleMessageRepliesViewModel() {
  var self = this;
	self.template = 'singleMessageRepliesView';
	self.viewid = 'V-56';
	self.viewname = 'Replies';
	self.displayname = 'Broadcast Replies';	
		
	self.msgReplies = ko.observableArray([]);
	
  self.inputObs = [
    'channelName',
		'channelId',
		'messageId',
		'time',
    'singleMessage', 
    'broadcastType', 
    'iGi', 
    'percentageText',
    'percentageClass',
		'percentage',
		'noiGi',
		'noacks',
		'acks',
		'escalateUntil',
		'replies'];		
	self.defineObservables();		
	self.noacksVisibility = ko.observable(false);
	self.acksVisibility = ko.observable(false);			
	self.escalateTime = ko.observable(false);	  
	
	self.activate = function() {
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));		
		var messageObject = JSON.parse(ENYM.ctx.getItem('currentMessageData'));			
		if(!channelObject || !messageObject) {
			goToView('channelsIOwnView');			
		} else {
			addExternalMarkup(self.template); // this is for header/overlay message
			self.msgReplies.removeAll();
			self.time('Sent - '+ formatDate(messageObject.created, 'long'));			
			self.singleMessage('<span>'+messageObject.broadcastFull+'</span><em></em>');
			self.broadcastType(messageObject.type);
			self.iGi(messageObject.iGi);
			self.percentageText(messageObject.percentageText);
			self.percentageClass(messageObject.percentageClass);
			self.percentage(messageObject.percentage);			
			self.noiGi(messageObject.noiGi);
			self.noacksVisibility(false);
			self.acksVisibility(false);			
			self.escalateTime(false);			
			if(messageObject.escUntil != '' &&  typeof messageObject.escUntil != 'undefined') {
				self.escalateTime(true);								
				self.escalateUntil('<span class="singlemsgicon '+messageObject.sensitivity+'"></span>"'+messageObject.sensitivityText+'" until '+formatDate(messageObject.escUntil, 'short', 'main'));			
			}
			self.replies(messageObject.replies);						
			if(messageObject.type == 'REQUEST_ACKNOWLEDGEMENT' && typeof messageObject.noacks != 'undefined') {
				if(messageObject.acks+messageObject.noacks == messageObject.acks){
					self.noacksVisibility(false);
					self.acksVisibility(true);					
					self.acks(messageObject.acks+' Got It');										
				}
				else {
					self.noacksVisibility(true);
					self.acksVisibility(true);	
					self.noacks(messageObject.noacks+" Haven't Got It Yet");
					self.acks(messageObject.acks+' Got It');					
				}
			}													
			ENYM.ctx.removeItem('currentReplyData');													
			self.channelId(channelObject.channelId);
			self.channelName(channelObject.channelName);												
			self.messageId(messageObject.messageId);
			$.mobile.showPageLoadingMsg("a", "Loading Message replies");			
			return ES.messageService.getChannelMessages(self.channelId(), {replyto: self.messageId()}, {success: successfulReliesGET, error: errorAPI});			
		}
	}	
	
	function successfulReliesGET(data){
		var senderFirstname,senderLastname;
    $.mobile.hidePageLoadingMsg();			
		for(var len = 0; len<data.message.length; len++) {
			//if(data.message[len].replies < 1) {
			if(typeof data.message[len].senderFirstname == 'undefined' && typeof data.message[len].senderLastname == 'undefined') {
				senderFirstname = 'Evernym';
			  senderLastname = '';
			} else{
				senderFirstname = data.message[len].senderFirstname;
				senderLastname = data.message[len].senderLastname;
			}
			var reply = '<em>'+senderFirstname+' '+senderLastname+': </em>'+data.message[len].text;
			if(data.message[len].text.length > truncatedTextScreen()) {
			  var replyLess = $.trim(data.message[len].text).substring(0, truncatedTextScreen()*2).split(' ').slice(0, -1).join(' ') + '...';
			}
			else {
				var replyLess = data.message[len].text;					
			}				
			self.msgReplies.push({
				replyId: data.message[len].id,
				senderSubscriberId: data.message[len].senderSubscriberId,
				responseToMsgId: data.message[len].responseToMsgId,		
				created: data.message[len].created,				
				replyTime: formatDate(data.message[len].created, 'short', 'main'),
				reply: reply,
				replyLess: replyLess.replace(/\n/g, '<br/>'),					
				replyFull: data.message[len].text.replace(/\n/g, '<br/>'),
				senderFirstname: data.message[len].senderFirstname,
				senderLastname: data.message[len].senderLastname,										
				replyToReply: data.message[len].replies
			});
			//}
		}
	}; 
	
	function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);
  };
	
	self.showWhoGotIt = function(){
		if(self.broadcastType() != 'REQUEST_ACKNOWLEDGEMENT') {
			var toastobj = {type: 'toast-info', text: 'No iGi requested'};
			showToast(toastobj);						
		}
		else if(self.acks() == '0 Got It') {
			var toastobj = {type: 'toast-info', text: "No iGi's received yet"};
			showToast(toastobj);			
		}
		else {					
			viewNavigate('Replies', 'singleMessageRepliesView', 'whoGotItView');
		}
	};	
	
	self.replyDetail = function(data){	
		ENYM.ctx.setItem('currentReplyData', JSON.stringify(data));									
		viewNavigate('Replies', 'singleMessageRepliesView', 'replyDetailView');
	};	
				
}

SingleMessageRepliesViewModel.prototype = new ENYM.ViewModel();
SingleMessageRepliesViewModel.prototype.constructor = SingleMessageRepliesViewModel;
