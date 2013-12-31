function NotGotItViewModel() {
  var self = this;
	self.template = 'notGotItView';
	self.viewid = 'V-57';
	self.viewname = 'Not Got it';
	self.displayname = 'Did not got iGi';	

	self.recipients = ko.observableArray([]);
	
  self.inputObs = [ 'channelId', 'channelName', 'messageId', 'noacks' ];
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
			self.noacks(messageObject.noacks+" Haven't Got It Yet");
			$.mobile.showPageLoadingMsg("a", "Loading Followers");
			return ES.messageService.getMessageRecipients(self.channelId(), self.messageId(), 'N', {success: successfulList, error: errorAPI});																				
		}
	};
	
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
				recipient: '<span></span>'+data.recipients[len].rcvrFirstname +' '+ data.recipients[len].rcvrLastname+', <em>'+data.recipients[len].rcvrAccountname+'</em>'
			});
		}
	};

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);
  };
	
	self.recipientDetails = function(data){
		ENYM.ctx.setItem('currentRecipientData', JSON.stringify(data));							
		viewNavigate('Not Got it', 'notGotItView', 'recipientDetailsView');
	};	
}

NotGotItViewModel.prototype = new ENYM.ViewModel();
NotGotItViewModel.prototype.constructor = NotGotItViewModel;