﻿/*globals ko*/
/* To do - Pradeep Kumar */
function SingleMessageViewModel() {
  var that = this;
	this.template = 'singleMessageView';
	this.viewid = 'V-23';
	this.viewname = 'Broadcast Details';
	this.displayname = 'Broadcast Details';	
	this.accountName = ko.observable();		

  /* Single message observable */		
	this.channelName = ko.observable();		
	this.time = ko.observable();	
	this.singleMessage = ko.observable();
	this.iGi = ko.observable();
	this.percentageText = ko.observable();
	this.percentageClass = ko.observable();	
	this.percentage = ko.observable();			
	this.noiGi = ko.observable();
	this.iGivisibility = ko.observable(false);	
	this.noacks = ko.observable();
	this.acks = ko.observable();
	this.replies = ko.observable();		
	this.toastText = ko.observable();
	this.toastClass = ko.observable();				
	
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
			that.channelName(channelObject.channelName);					
			that.time('Sent '+ dateFormat1(messageObject.created) +' ('+messageObject.time+'):');	
			that.singleMessage(messageObject.broadcast);
			that.iGi(messageObject.iGi);
			that.percentageText(messageObject.percentageText);
			that.percentageClass(messageObject.percentageClass);			
			that.percentage(messageObject.percentage);			
			that.noiGi(messageObject.noiGi);				
			that.replies(messageObject.replies);
			that.iGivisibility(false);			
			if(messageObject.type == 'REQUEST_ACKNOWLEDGEMENT' && typeof messageObject.noacks != 'undefined') {
				that.iGivisibility(true);
				that.noacks(messageObject.noacks+" Haven't Got It Yet");
				that.acks(messageObject.acks+' Got It');											
			}							
		}
	}
	
	this.showReplies = function(){
		if(that.replies() == '0 Replies') {
			that.toastClass('toast-error');			
			that.toastText('No replies to display');		
			showToast();			
		}
		else {						
			viewNavigate('Broadcast Details', 'singleMessageView', 'singleMessageRepliesView');
		}
	};			
				
}
