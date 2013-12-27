/* To do - Pradeep Kumar */
function SingleMessageViewModel() {
  var self = this;
	self.template = 'singleMessageView';
	self.viewid = 'V-23';
	self.viewname = 'Broadcast Details';
	self.displayname = 'Broadcast Details';
	
  self.inputObs = [
    'channelName',
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

  /* Single message observable */		
	self.noacksVisibility = ko.observable(false);
	self.acksVisibility = ko.observable(false);			
	self.escalateTime = ko.observable(false);					  
	
  self.activate = function () {
		var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));	
		var messageObject = JSON.parse(localStorage.getItem('currentMessageData'));			
		if(!channelObject || !messageObject) {
			goToView('channelsIOwnView');			
		} else {
			addExternalMarkup(self.template); // this is for header/overlay message																		
			self.channelName(channelObject.channelName);		
			//that.time('Sent '+ formatDate(messageObject.created, 'short') + ' ('+messageObject.time+'):');
			self.time('Sent - '+ formatDate(messageObject.created, 'long'));
			if(messageObject.broadcastFull.length > truncatedTextScreen()) {
				var message = $.trim(messageObject.broadcastFull).substring(0, truncatedTextScreen()).split(' ').slice(0, -1).join(' ') + '...';
			}
			else {
				var message = messageObject.broadcastFull;					
			}				
			self.singleMessage(message+'<em></em>');
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
		}
	}
	
	self.showReplies = function(){
		if(self.replies() == '0 Replies') {
			var toastobj = {type: 'toast-info', text: 'No replies to display'};
			showToast(toastobj);			
		}
		else {						
			viewNavigate('Broadcast Details', 'singleMessageView', 'singleMessageRepliesView');
		}
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
			viewNavigate('Broadcast Details', 'singleMessageView', 'whoGotItView');
		}
	};					
				
}

SingleMessageViewModel.prototype = new AppCtx.ViewModel();
SingleMessageViewModel.prototype.constructor = SingleMessageViewModel;
