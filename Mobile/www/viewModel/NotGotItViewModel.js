function NotGotItViewModel() {
  var self = this;
	self.template = 'notGotItView';
	self.viewid = 'V-57';
	self.viewname = 'Not Got it';
	self.displayname = 'Did not got iGi';	

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
			self.noacks(messageObject.noacks+" Haven't Got It Yet");
			$.mobile.showPageLoadingMsg("a", "Loading Followers");
			return ES.messageService.getMessageRecipients(self.channelId(), self.messageId(), 'N', {success: successfulList, error: errorAPI});																				
		}
	};
	
	function successfulList(data){
		var rcvrFirstname,rcvrLastname;
		$.mobile.hidePageLoadingMsg();	
		for(var len = 0; len<data.recipients.length; len++) {
			if(typeof (data.recipients[len].rcvrFirstname) == 'undefined' && typeof(data.recipients[len].rcvrLastname) == 'undefined') {
				rcvrFirstname = '';
			  rcvrLastname = '';
			} else{
				rcvrFirstname = data.recipients[len].rcvrFirstname;
				rcvrLastname = data.recipients[len].rcvrLastname+',';
			}
			if (len % 2 === 0) {
				var recipientsClass = 'even';
      }
			else {
				var recipientsClass = 'odd';
			}								
			self.recipients.push({
				recipientId: data.recipients[len].subscriberId,
				recipientsClass: recipientsClass,
				recipient: '<span></span>'+rcvrFirstname +' '+ rcvrLastname+' <em>'+data.recipients[len].rcvrAccountname+'</em>'
			});
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
			viewNavigate('Not Got it', 'notGotItView', 'whoGotItView');
		}
	};	
	
	self.recipientDetails = function(data){
		ENYM.ctx.setItem('currentRecipientData', JSON.stringify(data));							
		viewNavigate('Not Got it', 'notGotItView', 'recipientDetailsView');
	};	
}

NotGotItViewModel.prototype = new ENYM.ViewModel();
NotGotItViewModel.prototype.constructor = NotGotItViewModel;