﻿/*globals ko*/
/* To do - Pradeep Kumar */
function SendMessageViewModel() {
	var that = this;
	this.template = "sendMessageView";
	this.viewid = "V-20";
	this.viewname = "ComposeBroadcast";
	this.displayname = "Compose Broadcast";	
	this.accountName = ko.observable();
	
  /* Send Message observable */
	this.messageText = ko.observable();
	this.characterCount = ko.observable();		
	this.channels = ko.observableArray([]);			
	this.channelId = ko.observable();	
	this.channelname = ko.observable();
	
	/* channels options variable */
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
			that.accountName(localStorage.getItem('accountName'));
			that.messageText('Add additional text here . . . ');
			that.characterCount('31');
			$('textarea').click(function () {
				if(that.messageText() == 'Add additional text here . . . ') {
					that.messageText('');				
					that.characterCount('0');				
				}
			});			
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
		var len = 0;
		for(len; len<data.commethod.length; len++) {
			if(data.commethod[len].type == 'EMAIL' && data.commethod[len].verified == 'Y' && data.commethod[len].dflt == 'Y') {
				return that.createChannelMessage();
			} else if(data.commethod[len].type == 'EMAIL' && data.commethod[len].verified == 'N' && data.commethod[len].dflt == 'Y') {
				showMessage('Please verify your email !');				
			}
		}
	};    
	
	function errorValidation(data, status, details){
		$.mobile.hidePageLoadingMsg();	
		showError('Not authorized ' + details.message);
	};
	
	this.sendMessageCommand = function(){
		if(that.messageText() == '') {
			showMessage('Please type some message !');
		} else {
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
		showMessage('Your message is posted successfully');
		localStorage.setItem('currentChannelId', that.selectedChannels())
		goToView('channelMainView');			
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

}
