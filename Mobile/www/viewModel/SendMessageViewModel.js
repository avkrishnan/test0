/*globals ko*/
/* To do - Pradeep Kumar */
function SendMessageViewModel() {
	var that = this;
	this.template = "sendMessageView";
	this.viewid = "V-20";
	this.viewname = "ComposeBroadcast";
	this.displayname = "Compose Broadcast";	
	this.accountName = ko.observable();
	this.backText = ko.observable();		
	
  /* Send Message observable */
	this.messageText = ko.observable();
	this.characterCount = ko.observable();		
	this.channels = ko.observableArray([]);			
	this.channelId = ko.observable();	
	this.channelName = ko.observable();		
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
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			that.accountName(localStorage.getItem('accountName'));
			that.backText('<em></em>'+backNavText[backNavText.length-1]);			
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
	
	this.backCommand = function () {
		popBackNav();
  };
	
	this.menuCommand = function () {
		pushBackNav('Compose', 'sendMessageView', 'channelMenuView');		
  };	
	
	function successfulVerify(data){
		if(data.commethod.length >= 1) {
			var len = 0;			
			for(len; len<data.commethod.length; len++) {
				if(data.commethod[len].type == 'EMAIL' && data.commethod[len].verified == 'Y' && data.commethod[len].dflt == 'Y') {
					return that.createChannelMessage();
				} else if(data.commethod[len].type == 'EMAIL' && data.commethod[len].verified == 'N' && data.commethod[len].dflt == 'Y') {
					showMessage('Please verify your email !');				
				} else if(data.commethod[len].type == 'EMAIL' && data.commethod[len].verified == 'N' && data.commethod[len].dflt == 'N') {
					showMessage('Please add a default email !');				
				}
			}
		}
		else {
			showMessage('Please add a default email !');
		}
	};    
	
	function errorValidation(data, status, details){
		$.mobile.hidePageLoadingMsg();	
		showError('Not authorized ' + details.message);
	};
	this.sendMessageCommand = function(){
		if(that.messageText() == '' || typeof that.messageText() == 'undefined') {
			showMessage('Please type some message !');
		} else {
			$.mobile.showPageLoadingMsg("a", "Checking email verification !");			
			return ES.commethodService.getCommethods({success: successfulVerify, error: errorValidation});
		}
	};
	
	function successfulList(data){
		if(data.channel.length < 1) {
			showMessage('Please create some channels !');
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
		that.toastText('Broadcast sent');		
		localStorage.setItem('toastData', that.toastText());
		that.backCommand();							
	};
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();	
		showError(details.message);
	};
	
	this.createChannelMessage = function () {
		$.mobile.showPageLoadingMsg("a", "Posting Message");
		var messageobj = {text: that.messageText(), type: 'FYI'};
		return ES.messageService.createChannelMessage(that.selectedChannels(), messageobj, {success: successfulMessage, error: errorAPI});
	};
	
	this.escalateYes = function () {
		localStorage.setItem('escalate', 'yes');
		goToView('escalateSettingsView');		
  };
	
	this.escalateNo = function () {
		localStorage.setItem('escalate', 'no');		
		goToView('sendMessageView');		
  };		
	
	this.userSettings = function () {
		pushBackNav('Compose', 'sendMessageView', 'escalationPlansView');
  };	

}
