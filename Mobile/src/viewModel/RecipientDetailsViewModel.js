function RecipientDetailsViewModel() {
  var self = this;
	self.template = 'recipientDetailsView';
	self.viewid = 'V-34a';
	self.viewname = 'Recipient Details';
	self.displayname = 'Recipient Details';
	
	self.channelName = ko.observable();
	self.recipient = ko.observableArray();

	 self.inputObs = [
		'time',
    'singleMessage', 
    'iGi', 
    'percentageText',
    'percentageClass',
		'percentage',
		'percentageNotGot',
		'noiGi',
		'igiReceivedTime',
		'escalateUntil',
		'escalateTime',
		'notIgiReceived'
		];		
	self.defineObservables();	
	self.escalateTime = ko.observable(false);
	self.igiReceived = ko.observable(false);

	self.activate = function() {
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));	
		var recipientObject = JSON.parse(ENYM.ctx.getItem('currentRecipientData'));
		messageObject = JSON.parse(ENYM.ctx.getItem('currentMessageData'));	
		if(!channelObject || !recipientObject) {
			goToView('channelsIOwnView');			
		} else {
			addExternalMarkup(self.template); // this is for header/overlay message																		
			self.channelName(channelObject.channelName);
			self.time('Sent - '+ formatDate(messageObject.created, 'long'));
			self.singleMessage('<span>'+messageObject.broadcastFull+'</span><em></em>');
			self.iGi(messageObject.iGi);
			self.percentageText(messageObject.percentageText);
			self.percentageClass(messageObject.percentageClass);
			self.percentage(messageObject.percentage);
			self.percentageNotGot(messageObject.percentageNotGot);			
			self.noiGi(messageObject.noiGi);
			self.escalateTime(false);
			if(messageObject.escUntil != '' &&  typeof messageObject.escUntil != 'undefined') {
				self.escalateTime(true);								
				self.escalateUntil('<span class="singlemsgicon '+messageObject.sensitivity+'"></span>"'+messageObject.sensitivityText+'" until '+formatDate(messageObject.escUntil, 'short', 'main'));			
			}
			var recipient = recipientObject.recipient.split(',');
			if(typeof recipient[1] == 'undefined'){
				var rcvrName = '';
			} else {
				var rcvrName = recipient[1];
			}
			self.igiReceivedTime('');
			self.recipient(recipient[0]+' '+rcvrName);	
			self.notIgiReceived('noigi');
		}
	};
	
	self.showWhoGotIt = function(){
		if(messageObject.type != 'REQUEST_ACKNOWLEDGEMENT') {
			var toastobj = {type: 'toast-info', text: 'No iGi requested'};
			showToast(toastobj);						
		}
		else if(messageObject.acks == '0 Got It') {
			var toastobj = {type: 'toast-info', text: "No iGi's received yet"};
			showToast(toastobj);			
		}
		else {					
			viewNavigate('Broadcast Details', 'singleMessageView', 'whoGotItView');
		}
	};	

}

RecipientDetailsViewModel.prototype = new ENYM.ViewModel();
RecipientDetailsViewModel.prototype.constructor = RecipientDetailsViewModel;
