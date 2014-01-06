/* To do - Pradeep Kumar */
function ReplyDetailViewModel() {
  var self = this;
	self.template = 'replyDetailView';
	self.viewid = 'V-56';
	self.viewname = 'Reply Detail';
	self.displayname = 'Reply Detail';
	
  self.inputObs = [
    'channelId',
		'channelName',
		'messageId',
    'senderName', 
    'replyDate', 
    'reply', 
    'moreText'];	
	self.defineObservables();					

  /* Single message observable */			
	self.less = ko.observable(true);		
	self.more = ko.observable(false);	
	self.moreButton = ko.observable(true);
	self.lessButton = ko.observable(false);											  
	
	self.activate = function() {
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));		
		var messageObject = JSON.parse(ENYM.ctx.getItem('currentMessageData'));			
		if(!channelObject || !messageObject) {
			goToView('channelsIOwnView');			
		} else {
			addExternalMarkup(self.template); // this is for header/overlay message								
			var replyObject = JSON.parse(ENYM.ctx.getItem('currentReplyData'));			
			self.less(true);				
			self.more(false);		
			self.moreButton(true);
			self.lessButton(false);																											
			self.channelId(channelObject.channelId);	
			self.channelName(channelObject.channelName);													
			self.messageId(messageObject.messageId);
			self.senderName(replyObject.senderFirstname+' '+replyObject.senderLastname+':');						
			self.replyDate(formatDate(replyObject.created, 'short', 'main'));
			self.reply(replyObject.replyLess);
			self.moreText(replyObject.replyFull);												
		}
	}	
	
	self.showMore = function(){
		self.less(false);
		self.more(true);
		self.moreButton(false);
		self.lessButton(true);																
	};
	
	self.showLess = function(){
		self.less(true);		
		self.more(false);
		self.moreButton(true);
		self.lessButton(false);															
	};		
				
}

ReplyDetailViewModel.prototype = new ENYM.ViewModel();
ReplyDetailViewModel.prototype.constructor = ReplyDetailViewModel;
