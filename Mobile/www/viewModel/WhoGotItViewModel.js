function WhoGotItViewModel() {
  var self = this;
	self.template = 'whoGotItView';
	self.viewid = 'V-34';
	self.viewname = 'Who Got it';
	self.displayname = 'Who got iGi';

	self.recipients = ko.observableArray([]);
	
  self.inputObs = [ 'channelId', 'channelName', 'messageId', 'acks' ];
  self.defineObservables();	
	
	self.activate = function() {
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));
		var messageObject = JSON.parse(ENYM.ctx.getItem('currentMessageData'));			
		if(!channelObject || !messageObject) {
			goToView('channelsIOwnView');			
		} else {
			addExternalMarkup(self.template); // this is for header/overlay message
			self.recipients.removeAll();						
			ENYM.ctx.removeItem('currentRecipientData');										
			self.channelId(channelObject.channelId);			
			self.channelName(channelObject.channelName);
			self.messageId(messageObject.messageId);
			if(messageObject.acks) {								
				self.acks(messageObject.acks+' Got It');
			} 
			else if(messageObject.acks == 0) {
				self.acks(messageObject.acks+' Got It');				
			}
			else if(messageObject.type != 'REQUEST_ACKNOWLEDGEMENT') {
				self.acks('No iGi requested');				
			}			
			else {
				self.acks('No followers to acknowledge iGi!');				
			}
			$.mobile.showPageLoadingMsg("a", "Loading Followers");
			return ES.messageService.getMessageRecipients(self.channelId(), self.messageId(), 'Y', {success: successfulList, error: errorAPI});																			
		}
	}	
	
	function successfulList(data){
		$.mobile.hidePageLoadingMsg();						
		for(var len = 0; len<data.recipients.length; len++) {
			if (len % 2 === 0) {
				var recipientsClass = 'even';
      }
			else {
				var recipientsClass = 'odd';
			}								
			self.recipients.push({
				recipientId: data.recipients[len].subscriberId,
				recipientsClass: recipientsClass,
				recipient: data.recipients[len].rcvrFirstname +' '+ data.recipients[len].rcvrLastname+', <em>'+data.recipients[len].rcvrAccountname+'</em>'
			});
		}		
	}

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);
  };
	
	self.recipientDetails = function(data){
		ENYM.ctx.setItem('currentRecipientData', JSON.stringify(data));							
		viewNavigate('Who Got it', 'whoGotItView', 'recipientDetailsView');
	};	
}

WhoGotItViewModel.prototype = new ENYM.ViewModel();
WhoGotItViewModel.prototype.constructor = WhoGotItViewModel;