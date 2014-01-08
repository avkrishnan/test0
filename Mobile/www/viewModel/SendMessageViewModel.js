function SendMessageViewModel() {
	var self = this;
	self.template = "sendMessageView";
	self.viewid = "V-20";
	self.viewname = "Compose";
	self.displayname = "Compose Broadcast";
	
	self.sectionOne = ko.observable(false);
	self.sectionTwo = ko.observable(false);
	self.noWarning = ko.observable(true);
	self.warning = ko.observable(false);		
	self.escalateEdit = ko.observable(false);
	self.channels = ko.observableArray([]);
	self.messageText = ko.observable();
	self.igiClass = ko.observable();
	self.iGiYes = ko.observable();
	self.iGiNo = ko.observable();
	self.yesClass = ko.observable();
	self.noClass = ko.observable();	

  self.inputObs = [ 'channelId', 'channelName', 'characterCount', 'characterClass', 'normalText', 'fastText', 'escalateText', 'normalClass', 'fastClass', 'escalateClass', 
	'normalActive', 'fastActive', 'escalateActive', 'escDuration', 'escLevel', 'duration', 'activeType', 'escalateEdit', 'broadcastType', 'selectedChannels'];
	self.defineObservables();	
	
	/* channels options variable */
	var channelsOptions = function(name, id, followers) {
		this.channelName = name;
		this.channelId = id;
		this.followerCount = followers;
	};
	
	self.composeForm = function() {
		self.messageText('');		
		self.channels.removeAll();		
		ENYM.ctx.removeItem('msgLenWarn');
		ENYM.ctx.removeItem('escDuration');		
		ENYM.ctx.removeItem('escLevel');				
		ENYM.ctx.removeItem('iGiStatus');				
	};
	
	self.activate = function() {			
		monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June','July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];				
		addExternalMarkup(self.template); // this is for header/overlay message
		self.sectionOne(false);
		self.sectionTwo(false);
		self.noWarning(true);
		self.warning(false);		
		self.normalText('normalcolor');
		self.fastText('');
		self.escalateText('');								
		self.normalClass('normalcoloricon');
		self.fastClass('');
		self.escalateClass('');
		self.duration("Normal: <em>Send once (usually to email)</em>");
		self.activeType('normalcolor');				
		self.yesClass('yesbutton');
		self.noClass('nobutton');					
		self.escalateEdit(false);
		self.escLevel('N');				
		self.igiClass('igiimageoff');
		self.characterCount('0');
		self.characterClass('');
		self.escLevel(ENYM.ctx.getItem('escLevel'));				
		if(self.escLevel() == 'H') {
			escalate = 'Hound';
		} else if(self.escLevel() == 'C') {
			escalate = 'Chase';
		} else {
			escalate = 'Remind';
		}																									
		if(ENYM.ctx.getItem('escalate') == 'yes') {
			self.normalText('');
			self.fastText('');
			self.escalateText(escalate);				
			self.normalClass('');
			self.fastClass('');
			self.escalateClass('escalatecoloricon icon-'+escalate);										
			if(ENYM.ctx.getItem('escDuration')) {
				self.escDuration(new Date(ENYM.ctx.getItem('escDuration')));					
				var DateTime = ENYM.ctx.getItem('escDuration').split('/');
				var day = DateTime[2].split(' ');
				var time = day[1].split(':');
				var durationText = '"' + escalate + '" until: ' + time[0] + ':' + time[1] + ' ' + day[2] + ', ' + DateTime[1] + '. ' + day[0] + ', ' + DateTime[0];
				self.duration(durationText);
				self.activeType('escalatecolor '+escalate);
				self.escalateEdit(true);																								
			}		
			ENYM.ctx.removeItem('escalate');																											
		} else {				
			self.normalText('normalcolor');
			self.fastText('');
			self.escalateText('');								
			self.normalClass('normalcoloricon');
			self.fastClass('');
			self.escalateClass('');
			self.duration("Normal: <em>Send once (usually to email)</em>");
			self.activeType('normalcolor');				
			self.yesClass('yesbutton');
			self.noClass('nobutton');					
			self.escalateEdit(false);
			ENYM.ctx.removeItem('escDuration');
			self.escLevel('N');				
			self.igiClass('igiimageoff');										
		}			
		self.broadcastType('FYI');
		if(ENYM.ctx.getItem('iGiStatus') == 'yes') {
			self.igiClass('igiimage');		
			self.yesClass('nobutton');
			self.noClass('yesbutton');
			self.broadcastType('RAC');															
		}		
		if(ENYM.ctx.getItem('msgLenWarn')) {
			self.noWarning(false);
			self.warning(true)				
			self.characterClass('length-warning')
			self.characterCount(ENYM.ctx.getItem('msgLenWarn'));
			ENYM.ctx.removeItem('msgLenWarn');		
		}		
		$('textarea').keyup(function () {								
			self.characterCount(self.messageText().length);
			var chanLength = self.selectedChannels().channelName.length;
			var limitLength = 302-chanLength; //char lim=320, pging1,2 char+spaces=12, elipsis pg1,2=6 & chanLength=ch.name+3(space & square brackets) i.e. cal=320-18-(chanLength+3)			
			if(self.messageText().length >= limitLength) {
				self.noWarning(false);
				self.warning(true)				
				self.characterClass('length-warning');
			} 
			else {
				self.noWarning(true);
				self.warning(false)				
				self.characterClass('');				
			}
		});
		if(typeof self.selectedChannels() == 'undefined' || self.selectedChannels() == '') {
			self.channels.removeAll();										
			$.mobile.showPageLoadingMsg('a', 'Loading Channels options');
			return ES.channelService.listMyChannels({ success: successfulList, error: errorAPI });					
		}
		else {
			self.sectionOne(false);
			self.sectionTwo(true);				
		}
	};
	
	$(document).keyup(function (e) {	
		if (e.keyCode == 13 && e.target.nodeName != 'TEXTAREA' && $.mobile.activePage.attr('id') == 'sendMessageView') {
			self.sendMessageCommand();
		}
	});			
	
	function successfulVerify(data){
		if(data.commethod.length >= 1) {
			var len = 0;			
			for(len; len<data.commethod.length; len++) {
				if(data.commethod[len].verified == 'Y') {
					self.createChannelMessage();
					return true;
				}
				else if(len == data.commethod.length-1 && data.commethod[len].verified == 'N') {
					var toastobj = {type: 'toast-error', text: 'Please verify your email !'};
					showToast(toastobj);								
				}
			}
		} else {
			var toastobj = {type: 'toast-error', text: 'Please add a default email !'};
			showToast(toastobj);
		}
	};    
	
	function errorValidation(data, status, details){
		$.mobile.hidePageLoadingMsg();		
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);		
	};
	
	self.sendMessageCommand = function(){
		if(self.messageText() == '' || typeof self.messageText() == 'undefined') {
			var toastobj = {type: 'toast-error', text: 'Please type a message to broadcast.'};
			showToast(toastobj);					
		} else if(self.selectedChannels().followerCount == 0) {
			var toastobj = {type: 'toast-info', text: 'Message not sent - Zero followers on '+ self.selectedChannels().channelName};
			showToast(toastobj);				
		} else {
			$.mobile.showPageLoadingMsg('a', 'Posting Message');			
			return ES.commethodService.getCommethods({success: successfulVerify, error: errorValidation});
		}
	};
	
	function successfulList(data){
		if(data.channel.length == 0) {
			self.sectionOne(true);								
		} else {			
			self.sectionTwo(true);				
			$.mobile.hidePageLoadingMsg();	
			for(var channelslength = 0; channelslength<data.channel.length; channelslength++) {
				self.channels.push(
					new channelsOptions(data.channel[channelslength].name, data.channel[channelslength].id, data.channel[channelslength].followers)
				);
			}
		}
	};    
	
	function successfulMessage(data){
		$.mobile.hidePageLoadingMsg();
		self.messageText('');			
		ENYM.ctx.removeItem('escDuration');		
		ENYM.ctx.removeItem('escLevel');
		ENYM.ctx.removeItem('iGiStatus');										
		var toastobj = {redirect: 'channelMainView', type: '', text: 'Your message has been sent.'};
		showToast(toastobj);									
		ENYM.ctx.setItem('currentChannelId', self.selectedChannels().channelId);	
		backNavText.pop();
		backNavView.pop();		
		goToView('channelMainView');									
	};
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();
		ENYM.ctx.removeItem('escDuration');		
		ENYM.ctx.removeItem('escLevel');
		ENYM.ctx.removeItem('iGiStatus');								
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);						
	};
	
	self.createChannelMessage = function () {
		$.mobile.showPageLoadingMsg('a', 'Posting Message');		
		if(self.escLevel() == 'N' || self.escLevel() == 'F') {
			var messageobj = {text: self.messageText(), escLevelId: self.escLevel(), type: self.broadcastType()};																	
		} else {
			var messageobj = {text: self.messageText(), escUntil: self.escDuration(), escLevelId: self.escLevel(), type: self.broadcastType()};			
		}
		return ES.messageService.createChannelMessage(self.selectedChannels().channelId, messageobj, {success: successfulMessage, error: errorAPI});
	};
	
	self.seeWarning = function () {
		ENYM.ctx.setItem('msgLenWarn', self.characterCount());
		viewNavigate('Compose', 'sendMessageView', 'messageLengthWarningView');										
  };	

	self.requestiGiHelp = function () {				
		viewNavigate('Compose', 'sendMessageView', 'requestiGiHelpView');		
  };
	
	self.escalateHelp = function () {			
		viewNavigate('Compose', 'sendMessageView', 'escalateHelpView');		
  };
	
	self.normalYes = function () {
		self.normalText('normalcolor');
		self.fastText('');
		self.escalateText('');		
		self.normalClass('normalcoloricon');
		self.fastClass('');
		self.escalateClass('');
    self.duration("Normal: <em>Send once (usually to email)</em>");
		self.activeType('normalcolor');		
		self.escalateEdit(false);
		ENYM.ctx.removeItem('escLevel');
		ENYM.ctx.removeItem('escDuration');						
		self.escLevel('N');		
  };
	
	self.fastYes = function () {
		self.normalText('');
		self.fastText('fastcolor');
		self.escalateText('');		
		self.normalClass('');
		self.fastClass('fastcoloricon');
		self.escalateClass('');
    self.duration("Fast: <em>Send once (usually text or app)</em>");
		self.activeType('fastcolor');
		self.escalateEdit(false);
		ENYM.ctx.removeItem('escLevel');
		ENYM.ctx.removeItem('escDuration');								
		self.escLevel('F');						
  };		
	
	self.escalateYes = function () {	
		viewNavigate('Compose', 'sendMessageView', 'escalateSettingsView');		
  };
	
	self.iGiYes = function () {
		self.igiClass('igiimage');		
		self.yesClass('nobutton');
		self.noClass('yesbutton');
		self.broadcastType('RAC');
		ENYM.ctx.setItem('iGiStatus', 'yes');									
  };
	
	self.iGiNo = function () {
		self.igiClass('igiimageoff');		
		self.yesClass('yesbutton');
		self.noClass('nobutton');
		self.broadcastType('FYI');
		ENYM.ctx.removeItem('iGiStatus');													
  };
}

SendMessageViewModel.prototype = new ENYM.ViewModel();
SendMessageViewModel.prototype.constructor = SendMessageViewModel;