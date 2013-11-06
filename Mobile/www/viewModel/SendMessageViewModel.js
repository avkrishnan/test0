/*globals ko*/
function SendMessageViewModel() {
	var that = this;
	this.template = "sendMessageView";
	this.viewid = "V-20";
	this.viewname = "ComposeBroadcast";
	this.displayname = "Compose Broadcast";	
	this.hasfooter = true;    
	this.accountName = ko.observable();
	
  /* Send Message observable */
	this.messageText = ko.observable();
	this.characterCount = ko.observable();		
	this.channels = ko.observableArray([]);			
	this.channelId = ko.observable();	
	this.channelname = ko.observable();
	
	var channelsOptions = function(name, id) {
		this.channelname = name;
		this.channelId = id;
	};
	this.selectedChannels = ko.observable()				
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  
	
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			var _accountName = localStorage.getItem('accountName');
			that.accountName(_accountName);
			that.messageText('Add additional text here . . . ');
			that.characterCount('31');			
			$('textarea').keyup(function () {
				if(that.messageText().length > 0) {
					that.characterCount(that.messageText().length);
				}
			});	
			$.mobile.showPageLoadingMsg('a', 'Loading Channels options');
			return this.listMyChannelsCommand();		
		}
	}
	
	function successfulVerify(data){
		var len = 0;
		for(len; len<data.commethod.length; len++) {
			if(data.commethod[len].name == 'Email' && data.commethod[len].verified == 'Y') {
				that.messageText();
				return that.createChannelMessage();
			} else {
				alert('Please verify your email !');				
			}
		}
	};    
	
	function errorValidation(data, status, details){
		$.mobile.hidePageLoadingMsg();	
		showError('Not authorized ' + details.message);
	};
	
	this.sendMessageCommand = function(){
		return ES.commethodService.getCommethods({success: successfulVerify, error: errorValidation});
	};
	
	function successfulList(data){
		if(data.channel.length < 1) {
			alert('Please create some channels !');				
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
		
	this.listMyChannelsCommand = function () {
		$.mobile.showPageLoadingMsg('a', 'Loading Channels');
		return ES.channelService.listMyChannels({ success: successfulList, error: errorAPI });
	};
	
	function successfulMessage(data){
		alert('Your message is posted successfully');
		localStorage.setItem('currentChannelId', that.selectedChannels())
		goToView('channelMainView');			
	};
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();	
		showError('Error listing my channels: ' + details.message);
	};
	
	this.createChannelMessage = function () {
    $.mobile.showPageLoadingMsg("a", "Posting Message");
		var messageobj = {text: that.messageText(), type: 'FYI'};
		return ES.messageService.createChannelMessage(that.selectedChannels(), messageobj, {success: successfulMessage, error: errorAPI});
	};

}
