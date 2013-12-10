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
	
	/* channels options variable */
	var channelsOptions = function(name, id) {
		this.channelName = name;
		this.channelId = id;
	};
	this.selectedChannels = ko.observable();				
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.clearForm();				
      that.activate();
    });	
	};
	
	this.clearForm = function () {
		that.messageText('');
  };	  
	
	this.activate = function() {			
		var token = ES.evernymService.getAccessToken();
		monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June','July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
		todayDate = new Date();
		today = todayDate.getDate();
		tomorrow = todayDate.setDate(today+1);				
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
			that.duration("Normal: <em>Send one time to follower's preferred device</em>");
			that.activeType('normalcolor');				
			that.yesClass('yesbutton');
			that.noClass('nobutton');					
			that.escalateEdit(false);
			that.escLevel('N');				
			that.igiClass('igiimageoff');
			that.characterCount('0');							
			if(localStorage.getItem('messageText')) {
				that.messageText(localStorage.getItem('messageText'));
				localStorage.removeItem('messageText');
				that.characterCount(that.messageText().length);																
			}			
			that.escLevel(localStorage.getItem('escLevel'));				
			if(that.escLevel() == 'R') {
				escalate = 'Remind';
			} else if(that.escLevel() == 'C') {
				escalate = 'Chase';
			} else {
				escalate = 'Hound';
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
				} else {
					tomorrow = new Date(tomorrow);
					that.escDuration(tomorrow);					
					var hours = tomorrow.getHours();
					hours = (hours<10?'0':'')+(hours>12?hours-12:hours);			
					var mins = tomorrow.getMinutes();
					mins = ((mins<10?'0':'')+mins);			
					var meridiem = tomorrow.getHours()>12?'PM':'AM';
					var durationText = '"'+escalate+'" until '+monthNames[tomorrow.getMonth()]+' '+tomorrow.getDate()+', '+tomorrow.getFullYear()+', '+hours+':'+mins+' '+meridiem;
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
				that.duration("Normal: <em>Send one time to follower's preferred device</em>");
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
			if(selectedChannel == '') {						
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
					return that.createChannelMessage();
				} else {				
					that.toastText('Please verify your email !');
					showToast();
					return false;				
				}
			}
		} else {
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
			that.toastText('Please type a message to broadcast.');
			showToast();			
		} else {
			$.mobile.showPageLoadingMsg('a', 'Checking email verification !');			
			return ES.commethodService.getCommethods({success: successfulVerify, error: errorValidation});
		}
	};
	
	function successfulList(data){
		if(data.channel.length < 1) {
			that.toastText('Please create some channels !');
			showToast();			
		} else {	
			$.mobile.hidePageLoadingMsg();
			that.channels.removeAll();	
			for(var channelslength = 0; channelslength<data.channel.length; channelslength++) {
				that.channels.push(
					new channelsOptions(data.channel[channelslength].name, data.channel[channelslength].id)
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
		selectedChannel = '';				
		localStorage.setItem('currentChannelId', that.selectedChannels().channelId);
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
		localStorage.setItem('messageText', that.messageText());				
		viewNavigate('Compose', 'sendMessageView', 'requestiGiHelpView');		
  };
	
	this.escalateHelp = function () {
		localStorage.setItem('messageText', that.messageText());			
		viewNavigate('Compose', 'sendMessageView', 'escalateHelpView');		
  };
	
	this.normalYes = function () {
		that.normalText('normalcolor');
		that.fastText('');
		that.escalateText('');		
		that.normalClass('normalcoloricon');
		that.fastClass('');
		that.escalateClass('');
    that.duration("Normal: <em>Send one time to follower's preferred device</em>");
		that.activeType('normalcolor');		
		that.escalateEdit(false);
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
    that.duration("Fast: <em>Send one time to follower's mobile devices</em>");
		that.activeType('fastcolor');
		that.escalateEdit(false);
		localStorage.removeItem('escDuration');						
		that.escLevel('F');						
  };		
	
	this.escalateYes = function () {
		selectedChannel = that.selectedChannels().channelId;
		localStorage.setItem('messageText', that.messageText());		
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
