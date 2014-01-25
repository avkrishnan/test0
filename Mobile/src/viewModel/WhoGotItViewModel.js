function WhoGotItViewModel() {
  var self = this;
	self.template = 'whoGotItView';
	self.viewid = 'V-34';
	self.viewname = 'Who Got it';
	self.displayname = 'Who got iGi';

	self.recipients = ko.observableArray([]);
	
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
		'percentageNotGot',
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
			self.recipients.removeAll();		
			self.time('Sent - '+ formatDate(messageObject.created, 'long'));			
			self.singleMessage('<span>'+messageObject.broadcastFull+'</span><em></em>');
			self.broadcastType(messageObject.type);
			self.iGi(messageObject.iGi);
			self.percentageText(messageObject.percentageText);
			self.percentageClass(messageObject.percentageClass);
			self.percentage(messageObject.percentage);
			self.percentageNotGot(messageObject.percentageNotGot);			
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
			if(typeof data.recipients[len].rcvrFirstname == 'undefined' && typeof data.recipients[len].rcvrLastname == 'undefined') {
				rcvrFirstname = '';
				rcvrLastname = '';				
			}
			else if(typeof data.recipients[len].rcvrFirstname == 'undefined') {
				rcvrFirstname = '';
				rcvrLastname = data.recipients[len].rcvrLastname;
			}
			else if(typeof data.recipients[len].rcvrLastname == 'undefined') {
				rcvrFirstname = data.recipients[len].rcvrFirstname;
			  rcvrLastname = '';
			}			
			else {
				rcvrFirstname = data.recipients[len].rcvrFirstname;
				rcvrLastname = data.recipients[len].rcvrLastname+',';
			}
			var recipientsClass = (len % 2 === 0) ? ' even' : ' odd';								
			self.recipients.push({
				recipientId: data.recipients[len].subscriberId,
				recipientsClass: recipientsClass,
				recipient: rcvrFirstname +' '+ rcvrLastname+' <em>'+data.recipients[len].rcvrAccountname+'</em>'
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