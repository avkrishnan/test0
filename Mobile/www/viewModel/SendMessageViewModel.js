/*globals ko*/
/* To do - Pradeep Kumar */
function SendMessageViewModel() {
	var that = this;
	this.template = "sendMessageView";
	this.viewid = "V-20";
	this.viewname = "Compose";
	this.displayname = "Compose Broadcast";	
	this.accountName = ko.observable();		
	
  /* Send Message observable */
	this.messageText = ko.observable();
	this.characterCount = ko.observable();		
	this.channels = ko.observableArray([]);			
	this.channelId = ko.observable();	
	this.channelName = ko.observable();
	this.normalText = ko.observable();
	this.fastText = ko.observable();	
	this.escalateText = ko.observable();	
	this.normalClass = ko.observable();
	this.fastClass = ko.observable();	
	this.escalateClass = ko.observable();
	this.normalActive = ko.observable();	
	this.fastActive = ko.observable();					
	this.escalateActive = ko.observable();	
	this.escDuration = ko.observable();	
	this.escLevel = ko.observable();	
	this.duration = ko.observable();
	this.activeType = ko.observable();
	this.escalateEdit = ko.observable(false);	
	this.igiClass = ko.observable();	
	this.iGiYes = ko.observable();
	this.iGiNo = ko.observable();				
	this.yesClass = ko.observable();
	this.noClass = ko.observable();
	this.broadcastType = ko.observable();	
	this.toastText = ko.observable();
	this.toastClass = ko.observable();	
	
	/* channels options variable */
	var channelsOptions = function(name, id, followers) {
		this.channelName = name;
		this.channelId = id;
		this.followerCount = followers;		
	};
	this.selectedChannels = ko.observable();				
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {			
      that.activate();
    });	
	};
	
	this.clearForm = function () {
		that.channels.removeAll();
		that.selectedChannels('');				
		that.messageText('');		
  };		  
	
	this.activate = function() {			
		var token = ES.evernymService.getAccessToken();
		monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June','July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];				
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			addExternalMarkup(that.template); // this is for header/overlay message
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');												
			}
			that.normalText('normalcolor');
			that.fastText('');
			that.escalateText('');								
			that.normalClass('normalcoloricon');
			that.fastClass('');
			that.escalateClass('');
			that.duration("Normal: <em>Send once (usually to email)</em>");
			that.activeType('normalcolor');				
			that.yesClass('yesbutton');
			that.noClass('nobutton');					
			that.escalateEdit(false);
			that.escLevel('N');				
			that.igiClass('igiimageoff');
			that.characterCount('0');										
			that.escLevel(localStorage.getItem('escLevel'));				
			if(that.escLevel() == 'H') {
				escalate = 'Hound';
			} else if(that.escLevel() == 'C') {
				escalate = 'Chase';
			} else {
				escalate = 'Remind';
			}																									
			if(localStorage.getItem('escalate') == 'yes') {
				that.normalText('');
				that.fastText('');
				that.escalateText('escalatecolor');				
				that.normalClass('');
				that.fastClass('');
				that.escalateClass('escalatecoloricon');										
				if(localStorage.getItem('escDuration')) {
					that.escDuration(new Date(localStorage.getItem('escDuration')));					
					var DateTime = localStorage.getItem('escDuration').split('/');
					var day = DateTime[2].split(' ');
					var time = day[1].split(':');						
					var durationText = '"'+escalate+'" until '+DateTime[1]+' '+day[0]+', '+DateTime[0]+', '+time[0]+':'+time[1]+' '+day[2];
					that.duration(durationText);
					that.activeType('escalatecolor');
					that.escalateEdit(true);																								
				}		
				localStorage.removeItem('escalate');																											
			} else {				
				that.normalText('normalcolor');
				that.fastText('');
				that.escalateText('');								
				that.normalClass('normalcoloricon');
				that.fastClass('');
				that.escalateClass('');
				that.duration("Normal: <em>Send once (usually to email)</em>");
				that.activeType('normalcolor');				
				that.yesClass('yesbutton');
				that.noClass('nobutton');					
				that.escalateEdit(false);
				localStorage.removeItem('escDuration');
				that.escLevel('N');				
				that.igiClass('igiimageoff');										
			}			
			that.broadcastType('FYI');
			if(localStorage.getItem('iGiStatus')) {
				that.igiClass('igiimage');		
				that.yesClass('nobutton');
				that.noClass('yesbutton');
				that.broadcastType('RAC');															
			}
			that.toastClass('');																	
			that.accountName(localStorage.getItem('accountName'));			
			$('textarea').keyup(function () {								
				that.characterCount(that.messageText().length);
			});
			if(typeof that.selectedChannels() == 'undefined' || that.selectedChannels() == '') {
				that.channels.removeAll();										
				$.mobile.showPageLoadingMsg('a', 'Loading Channels options');
				return ES.channelService.listMyChannels({ success: successfulList, error: errorAPI });					
			}
		}
	}
	
	$(document).keyup(function (e) {	
		if (e.keyCode == 13 && e.target.nodeName != 'TEXTAREA' && $.mobile.activePage.attr('id') == 'sendMessageView') {
			that.sendMessageCommand();
		}
	});			
	
	function successfulVerify(data){
		if(data.commethod.length >= 1) {
			var len = 0;			
			for(len; len<data.commethod.length; len++) {
				if(data.commethod[len].verified == 'Y') {
					that.createChannelMessage();
					return true;
				}
				else if(len == data.commethod.length-1 && data.commethod[len].verified == 'N') {
					that.toastClass('toast-error');									
					that.toastText('Please verify your email !');
					showToast();			
				}
			}
		} else {
			that.toastClass('toast-error');
			that.toastText('Please add a default email !');
			showToast();
		}
	};    
	
	function errorValidation(data, status, details){
		$.mobile.hidePageLoadingMsg();	
		that.toastText(details.message);		
		showToast();
	};
	
	this.sendMessageCommand = function(){
		if(that.messageText() == '' || typeof that.messageText() == 'undefined') {
			that.toastClass('toast-error');			
			that.toastText('Please type a message to broadcast.');
			showToast();			
		} else if(that.selectedChannels().followerCount == 0) {
			that.toastClass('toast-info');			
			that.toastText('Message not sent - Zero followers on '+ that.selectedChannels().channelName);
			showToast();				
		} else {
			$.mobile.showPageLoadingMsg('a', 'Posting Message');			
			return ES.commethodService.getCommethods({success: successfulVerify, error: errorValidation});
		}
	};
	
	function successfulList(data){
		if(data.channel.length < 1) {
			that.toastClass('toast-info');			
			that.toastText('Please create some channels !');
			showToast();			
		} else {	
			$.mobile.hidePageLoadingMsg();	
			for(var channelslength = 0; channelslength<data.channel.length; channelslength++) {
				that.channels.push(
					new channelsOptions(data.channel[channelslength].name, data.channel[channelslength].id, data.channel[channelslength].followers)
				);
			}
		}
	};    
	
	function successfulMessage(data){
		localStorage.removeItem('escDuration');		
		localStorage.removeItem('escLevel');
		localStorage.removeItem('iGiStatus');										
		that.toastText('Broadcast sent');		
		localStorage.setItem('toastData', that.toastText());					
		localStorage.setItem('currentChannelId', that.selectedChannels().channelId);
		that.clearForm();		
		backNavText.pop();
		backNavView.pop();		
		goToView('channelMainView');									
	};
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();
		localStorage.removeItem('escDuration');		
		localStorage.removeItem('escLevel');
		localStorage.removeItem('iGiStatus');								
		that.toastText(details.message);		
		showToast();			
	};
	
	this.createChannelMessage = function () {
		$.mobile.showPageLoadingMsg('a', 'Posting Message');		
		if(that.escLevel() == 'N' || that.escLevel() == 'F') {
			var messageobj = {text: that.messageText(), escLevelId: that.escLevel(), type: that.broadcastType()};																	
		} else {
			var messageobj = {text: that.messageText(), escUntil: that.escDuration(), escLevelId: that.escLevel(), type: that.broadcastType()};			
		}
		return ES.messageService.createChannelMessage(that.selectedChannels().channelId, messageobj, {success: successfulMessage, error: errorAPI});
	};

	this.requestiGiHelp = function () {				
		viewNavigate('Compose', 'sendMessageView', 'requestiGiHelpView');		
  };
	
	this.escalateHelp = function () {			
		viewNavigate('Compose', 'sendMessageView', 'escalateHelpView');		
  };
	
	this.normalYes = function () {
		that.normalText('normalcolor');
		that.fastText('');
		that.escalateText('');		
		that.normalClass('normalcoloricon');
		that.fastClass('');
		that.escalateClass('');
    that.duration("Normal: <em>Send once (usually to email)</em>");
		that.activeType('normalcolor');		
		that.escalateEdit(false);
		localStorage.removeItem('escLevel');
		localStorage.removeItem('escDuration');						
		that.escLevel('N');		
  };
	
	this.fastYes = function () {
		that.normalText('');
		that.fastText('fastcolor');
		that.escalateText('');		
		that.normalClass('');
		that.fastClass('fastcoloricon');
		that.escalateClass('');
    that.duration("Fast: <em>Send once (usually text or app)</em>");
		that.activeType('fastcolor');
		that.escalateEdit(false);
		localStorage.removeItem('escLevel');
		localStorage.removeItem('escDuration');								
		that.escLevel('F');						
  };		
	
	this.escalateYes = function () {	
		viewNavigate('Compose', 'sendMessageView', 'escalateSettingsView');		
  };
	
	this.iGiYes = function () {
		that.igiClass('igiimage');		
		that.yesClass('nobutton');
		that.noClass('yesbutton');
		that.broadcastType('RAC');
		localStorage.setItem('iGiStatus', 'yes');													
  };
	
	this.iGiNo = function () {
		that.igiClass('igiimageoff');		
		that.yesClass('yesbutton');
		that.noClass('nobutton');
		that.broadcastType('FYI');
		localStorage.removeItem('iGiStatus');													
  };								

}
