function SingleMessageFullTextViewModel() {
  var self = this;
	self.template = 'singleMessageFullTextView';
	self.viewid = 'V-23';
	self.viewname = 'Full Msg';
	self.displayname = 'Broadcast Full Text';	

  self.inputObs = [
    'channelName',
		'time',
		'fullText'];		
	self.defineObservables();					  
	
	self.activate = function() {
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));		
		var messageObject = JSON.parse(ENYM.ctx.getItem('currentMessageData'));			
		if(!channelObject || !messageObject) {
			goToView('channelsIOwnView');			
		} else {
			addExternalMarkup(self.template); // this is for header/overlay message								
			var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));			
			var messageObject = JSON.parse(ENYM.ctx.getItem('currentMessageData'));										
			self.channelName(channelObject.channelName);
			var fullDate = formatDate(messageObject.created,'long');					
			self.time('Sent - '+ fullDate);			
			self.fullText(messageObject.broadcastFull.replace(/\n/g, '<br/>'));																
		}
	};			
				
};

SingleMessageFullTextViewModel.prototype = new ENYM.ViewModel();
SingleMessageFullTextViewModel.prototype.constructor = SingleMessageFullTextViewModel;
