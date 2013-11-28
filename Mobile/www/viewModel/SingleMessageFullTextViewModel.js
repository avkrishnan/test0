﻿/*globals ko*/
/* To do - Pradeep Kumar */
function SingleMessageFullTextViewModel() {
  var that = this;
	this.template = 'singleMessageFullTextView';
	this.viewid = 'V-23';
	this.viewname = 'Broadcast Fulltext';
	this.displayname = 'Broadcast Full Text';	
	this.accountName = ko.observable();		

  /* Single message observable */		
	this.channelName = ko.observable();		
	this.time = ko.observable();	
	this.sensitivityText = ko.observable();	
	this.singleMessage = ko.observable();
	this.fullText = ko.observable();
	this.toastText = ko.observable();			
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  
	
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));		
		var messageObject = JSON.parse(localStorage.getItem('currentMessageData'));			
		if(token == '' || token == null) {
			goToView('loginView');
		} else if(!channelObject || !messageObject) {
			goToView('channelsIOwnView');			
		} else {
			addExternalMarkup(that.template); // this is for header/overlay message			
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}			
			that.accountName(localStorage.getItem('accountName'));			
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));			
			var messageObject = JSON.parse(localStorage.getItem('currentMessageData'));										
			that.channelName(channelObject.channelName);
			var fullDate = dateFormat1(messageObject.created);					
			that.time('Sent '+ fullDate +' ('+messageObject.time+'):');
			that.sensitivityText(messageObject.sensitivityText);				
			that.singleMessage(messageObject.broadcast);
			that.fullText(messageObject.broadcast);										
		}
	}
	
	this.menuCommand = function () {
		viewNavigate('Broadcast details', 'singleMessageFullTextView', 'channelMenuView');		
  };		
				
}
