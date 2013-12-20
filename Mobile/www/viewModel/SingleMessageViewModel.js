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
	this.broadcastType = ko.observable();	
	this.iGi = ko.observable();
	this.percentageText = ko.observable();
	this.percentageClass = ko.observable();	
	this.percentage = ko.observable();			
	this.noiGi = ko.observable();
	this.noacksVisibility = ko.observable(false);
	this.acksVisibility = ko.observable(false);			
	this.noacks = ko.observable();
	this.acks = ko.observable();
	this.escalateUntil = ko.observable();	
	this.escalateTime = ko.observable(false);	
	this.replies = ko.observable();					
	
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
			that.accountName(localStorage.getItem('accountName'));											
			that.channelName(channelObject.channelName);		
			that.time('Sent '+ formatDate(messageObject.created, 'short') + ' ('+messageObject.time+'):');	
			that.singleMessage(messageObject.broadcastFull);
			that.broadcastType(messageObject.type);
			that.iGi(messageObject.iGi);
			that.percentageText(messageObject.percentageText);
			that.percentageClass(messageObject.percentageClass);			
			that.percentage(messageObject.percentage);			
			that.noiGi(messageObject.noiGi);
			that.noacksVisibility(false);
			that.acksVisibility(false);			
			that.escalateTime(false);			
			if(messageObject.escUntil != '' &&  typeof messageObject.escUntil != 'undefined') {
				that.escalateTime(true);								
				that.escalateUntil('<span class="singlemsgicon '+messageObject.sensitivity+'"></span>"'+messageObject.sensitivityText+'" until '+shortFormatYear(messageObject.escUntil));			
			}
			that.replies(messageObject.replies);						
			if(messageObject.type == 'REQUEST_ACKNOWLEDGEMENT' && typeof messageObject.noacks != 'undefined') {
				if(messageObject.acks+messageObject.noacks == messageObject.acks){
					that.noacksVisibility(false);
					that.acksVisibility(true);					
					that.acks(messageObject.acks+' Got It');										
				}
				else {
					that.noacksVisibility(true);
					that.acksVisibility(true);	
					that.noacks(messageObject.noacks+" Haven't Got It Yet");
					that.acks(messageObject.acks+' Got It');					
				}
			}							
		}
	}
	
	this.showReplies = function(){
		if(that.replies() == '0 Replies') {
			var toastobj = {type: 'toast-info', text: 'No replies to display'};
			showToast(toastobj);			
		}
		else {						
			viewNavigate('Broadcast Details', 'singleMessageView', 'singleMessageRepliesView');
		}
	};
	
	this.showWhoGotIt = function(){
		if(that.broadcastType() != 'REQUEST_ACKNOWLEDGEMENT') {
			var toastobj = {type: 'toast-info', text: 'No iGi requested'};
			showToast(toastobj);						
		}
		else if(that.acks() == '0 Got It') {
			var toastobj = {type: 'toast-info', text: "No iGi's received yet"};
			showToast(toastobj);			
		}
		else {					
			viewNavigate('Broadcast Details', 'singleMessageView', 'whoGotItView');
		}
	};					
				
}
