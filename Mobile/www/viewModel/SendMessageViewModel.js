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
	this.sectionOne = ko.observable(false);
	this.sectionTwo = ko.observable(false);		
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
		localStorage.removeItem('escLevel');
		localStorage.removeItem('escDuration');		
		localStorage.removeItem('iGiStatus');		
  };		  
	
	this.activate = function() {			
		monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June','July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];				
		if(authenticate()) {
			addExternalMarkup(that.template); // this is for header/overlay message
			that.sectionOne(false);
			that.sectionTwo(false);
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
				that.escalateText(escalate);				
				that.normalClass('');
				that.fastClass('');
				that.escalateClass('escalatecoloricon icon-'+escalate);										
				if(localStorage.getItem('escDuration')) {
					that.escDuration(new Date(localStorage.getItem('escDuration')));					
					var DateTime = localStorage.getItem('escDuration').split('/');
					var day = DateTime[2].split(' ');
					var time = day[1].split(':');						
					//var durationText = '"'+escalate+'" until '+DateTime[1]+' '+day[0]+', '+DateTime[0]+', '+time[0]+':'+time[1]+' '+day[2];
					var durationText = '"' + escalate + '" until: ' + time[0] + ':' + time[1] + ' ' + day[2] + ', ' + DateTime[1] + '. ' + day[0] + ', ' + DateTime[0];
					that.duration(durationText);
					that.activeType('escalatecolor '+escalate);
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
			that.accountName(localStorage.getItem('accountName'));			
			$('textarea').keyup(function () {								
				that.characterCount(that.messageText().length);
			});
			if(typeof that.selectedChannels() == 'undefined' || that.selectedChannels() == '') {
				that.channels.removeAll();										
				$.mobile.showPageLoadingMsg('a', 'Loading Channels options');
				return ES.channelService.listMyChannels({ success: successfulList, error: errorAPI });					
			}
			else {
				that.sectionOne(false);
				that.sectionTwo(true);				
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
	
	this.sendMessageCommand = function(){
		if(that.messageText() == '' || typeof that.messageText() == 'undefined') {
			var toastobj = {type: 'toast-error', text: 'Please type a message to broadcast.'};
			showToast(toastobj);					
		} else if(that.selectedChannels().followerCount == 0) {
			var toastobj = {type: 'toast-info', text: 'Message not sent - Zero followers on '+ that.selectedChannels().channelName};
			showToast(toastobj);				
		} else {
			$.mobile.showPageLoadingMsg('a', 'Posting Message');			
			return ES.commethodService.getCommethods({success: successfulVerify, error: errorValidation});
		}
	};
	
	function successfulList(data){
		if(data.channel.length == 0) {
			that.sectionOne(true);								
		} else {			
			that.sectionTwo(true);				
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
		var toastobj = {redirect: 'channelMainView', type: '', text: 'Broadcast sent'};
		showToast(toastobj);									
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
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);						
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
