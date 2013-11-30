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
	this.escalateClass = ko.observable();	
	this.yesNoClass = ko.observable();
	this.noYesClass = ko.observable();
	this.duration = ko.observable();		
	this.escalateActive = ko.observable(false);	
	this.escDuration = ko.observable();	
	this.escLevel = ko.observable();	
	this.toastText = ko.observable();
	
	/* channels options variable */
	var channelsOptions = function(name, id) {
		this.channelName = name;
		this.channelId = id;
	};
	this.selectedChannels = ko.observable()				
	
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
			if(localStorage.getItem('messageText')) {
				that.messageText(localStorage.getItem('messageText'));
				localStorage.removeItem('messageText');												
			}												
			that.escalateClass('');
			that.yesNoClass('yesbutton');
			that.noYesClass('nobutton');						
			that.escalateActive(false);						
			if(localStorage.getItem('escalate') == 'yes') {
				that.escalateClass('escalate-activesetting');
				that.yesNoClass('nobutton');
				that.noYesClass('yesbutton');														
				that.escalateActive(true);
				that.escLevel(localStorage.getItem('escLevel'));							
				localStorage.removeItem('escalate');																						
			} else {
				that.escLevel('N');
			}
			if(that.escLevel() == 'R') {
				escalate = 'Remind';
			} else if(that.escLevel() == 'C') {
				escalate = 'Chase';
			} else {
				escalate = 'Hound';
			}			
			if(localStorage.getItem('escDuration')) {
				var DateTime = localStorage.getItem('escDuration').split('/');
				var day = DateTime[2].split(' ');
				var time = day[1].split(':');						
				var durationText = '"'+escalate+'" until '+DateTime[1]+' '+day[0]+', '+DateTime[0]+', '+time[0]+':'+time[1]+' '+day[2].toLowerCase();
				that.duration(durationText);														
			} else {
				tomorrow = new Date(tomorrow);
				var hours = tomorrow.getHours();
				hours = (hours<10?'0':'')+(hours>12?hours-12:hours);			
				var mins = tomorrow.getMinutes();
				mins = ((mins<10?'0':'')+mins);			
				var meridiem = tomorrow.getHours()>12?'PM':'AM';
				var durationText = '"'+escalate+'" until '+monthNames[tomorrow.getMonth()]+' '+tomorrow.getDate()+', '+tomorrow.getFullYear()+', '+hours+':'+mins+' '+meridiem.toLowerCase();
				that.duration(durationText);												
			}									
			that.accountName(localStorage.getItem('accountName'));		
			that.characterCount('0');		
			$('textarea').keyup(function () {								
				that.characterCount(that.messageText().length);
			});							
			$.mobile.showPageLoadingMsg('a', 'Loading Channels options');
			return ES.channelService.listMyChannels({ success: successfulList, error: errorAPI });		
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
				if(data.commethod[len].type == 'EMAIL' && data.commethod[len].verified == 'Y' && data.commethod[len].dflt == 'Y') {
					return that.createChannelMessage();
				} else if(data.commethod[len].type == 'EMAIL' && data.commethod[len].verified == 'N' && data.commethod[len].dflt == 'Y') {
					that.toastText('Please verify your email !');
					showToast();				
				} else if(data.commethod[len].type == 'EMAIL' && data.commethod[len].verified == 'N' && data.commethod[len].dflt == 'N') {
					that.toastText('Please add a default email !');
					showToast();				
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
			$.mobile.showPageLoadingMsg("a", "Checking email verification !");			
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
		that.toastText('Broadcast sent');		
		localStorage.setItem('toastData', that.toastText());		
		popBackNav();							
	};
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();
		localStorage.removeItem('escDuration');		
		localStorage.removeItem('escLevel');						
		that.toastText(details.message);		
		showToast();			
	};
	
	this.createChannelMessage = function () {
		$.mobile.showPageLoadingMsg("a", "Posting Message");
		if(localStorage.getItem('escLevel') == '' || localStorage.getItem('escLevel') == null) {
			var messageobj = {text: that.messageText(), escLevelId: 'N', type: 'FYI'};															
		} else if(localStorage.getItem('escDuration') == '' || localStorage.getItem('escDuration') == null) {					
			that.escDuration(tomorrow);			
			var messageobj = {text: that.messageText(), escUntil: that.escDuration(), escLevelId: that.escLevel(), type: 'FYI'};			
		} else {
			that.escDuration(new Date(localStorage.getItem('escDuration')));
			var messageobj = {text: that.messageText(), escUntil: that.escDuration(), escLevelId: that.escLevel(), type: 'FYI'};			
		}
		return ES.messageService.createChannelMessage(that.selectedChannels(), messageobj, {success: successfulMessage, error: errorAPI});
	};

	this.requestiGiHelp = function () {
		localStorage.setItem('messageText', that.messageText());				
		viewNavigate('Compose', 'sendMessageView', 'requestiGiHelpView');		
  };
	
	this.escalateHelp = function () {
		localStorage.setItem('messageText', that.messageText());			
		viewNavigate('Compose', 'sendMessageView', 'escalateHelpView');		
  };	
	
	this.escalateYes = function () {
		localStorage.setItem('messageText', that.messageText());		
		viewNavigate('Compose', 'sendMessageView', 'escalateSettingsView');		
  };
	
	this.escalateNo = function () {
		localStorage.setItem('messageText', that.messageText());		
		localStorage.removeItem('escDuration');
		localStorage.removeItem('escLevel');				
		goToView('sendMessageView');		
  };			

}
