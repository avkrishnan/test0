﻿/*globals ko*/
/* To do - Pradeep Kumar */
function NotGotItViewModel() {
  var that = this;
	this.template = 'notGotItView';
	this.viewid = 'V-57';
	this.viewname = 'Not Got it';
	this.displayname = 'Did not got iGi';	
	this.accountName = ko.observable();		

  /* Not got it observable */
	this.channelId = ko.observable();				
	this.channelName = ko.observable();
	this.messageId = ko.observable();				
	this.noacks = ko.observable();
	this.recipients = ko.observableArray([]);					
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  
	
	this.activate = function() {
		if(authenticate()) {
			var channelObject = JSON.parse(appCtx.getItem('currentChannelData'));	
			var messageObject = JSON.parse(appCtx.getItem('currentMessageData'));			
			if(!channelObject || !messageObject) {
				goToView('channelsIOwnView');			
			} else {
				addExternalMarkup(that.template); // this is for header/overlay message
				that.recipients.removeAll();						
				appCtx.removeItem('currentRecipientData');					
				that.accountName(appCtx.getItem('accountName'));											
				that.channelId(channelObject.channelId);			
				that.channelName(channelObject.channelName);
				that.messageId(messageObject.messageId);								
				that.noacks(messageObject.noacks+" Haven't Got It Yet");
				$.mobile.showPageLoadingMsg("a", "Loading Followers");
				return ES.messageService.getMessageRecipients(that.channelId(), that.messageId(), 'N', {success: successfulList, error: errorAPI});																				
			}
		}
	}
	
	function successfulList(data){
		$.mobile.hidePageLoadingMsg();	
		for(var len = 0; len<data.recipients.length; len++) {
			if (len % 2 === 0) {
				var recipientsClass = 'even';
      }
			else {
				var recipientsClass = 'odd';
			}								
			that.recipients.push({
				recipientId: data.recipients[len].subscriberId,
				recipientsClass: recipientsClass,
				recipient: '<span></span>'+data.recipients[len].rcvrFirstname +' '+ data.recipients[len].rcvrLastname+', <em>'+data.recipients[len].rcvrAccountname+'</em>'
			});
		}
	}

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);
  };
	
	this.recipientDetails = function(data){
		appCtx.setItem('currentRecipientData', JSON.stringify(data));							
		viewNavigate('Not Got it', 'notGotItView', 'recipientDetailsView');
	};				
				
}
