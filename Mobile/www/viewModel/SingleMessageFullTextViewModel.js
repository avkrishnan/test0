/* To do - Pradeep Kumar */
function SingleMessageFullTextViewModel() {
  var self = this;
	self.template = 'singleMessageFullTextView';
	self.viewid = 'V-23';
	self.viewname = 'Full Msg';
	self.displayname = 'Broadcast Full Text';	

  self.inputObs = [
    'channelName',
		'time',
		'sensitivity',
    'singleMessage', 
    'broadcastType', 
    'iGi', 
    'percentageText',
    'percentageClass',
		'percentage',
		'noiGi',
		'fullText',
		'acks'];		
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
			self.sensitivity(messageObject.sensitivity);			
			self.singleMessage('<span>'+messageObject.sensitivityText+'</span><em>'+messageObject.broadcastFull+'</em>');						
			self.iGi(messageObject.iGi);
			self.percentageText(messageObject.percentageText);
			self.percentageClass(messageObject.percentageClass);			
			self.percentage(messageObject.percentage);			
			self.noiGi(messageObject.noiGi);			
			self.fullText(messageObject.broadcastFull);
			self.broadcastType(messageObject.type);
			self.acks(messageObject.acks+' Got It');																
		}
	}
	
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
			viewNavigate('Broadcast Details', 'singleMessageView', 'whoGotItView');
		}
	};			
				
}

SingleMessageFullTextViewModel.prototype = new ENYM.ViewModel();
SingleMessageFullTextViewModel.prototype.constructor = SingleMessageFullTextViewModel;
