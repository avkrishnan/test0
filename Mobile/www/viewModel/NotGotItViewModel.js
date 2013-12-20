/*globals ko*/
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
			that.recipients.removeAll();						
			localStorage.removeItem('currentRecipientData');					
			that.accountName(localStorage.getItem('accountName'));											
			that.channelId(channelObject.channelId);			
			that.channelName(channelObject.channelName);
			that.messageId(messageObject.messageId);								
			that.noacks(messageObject.noacks+" Haven't Got It Yet");
			$.mobile.showPageLoadingMsg("a", "Loading Followers");
			return ES.messageService.getMessageRecipients(that.channelId(), that.messageId(), 'N', {success: successfulList, error: errorAPI});																				
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
		that.toastText(details.message);		
		showToast();
  };
	
	this.recipientDetails = function(data){
		localStorage.setItem('currentRecipientData', JSON.stringify(data));							
		viewNavigate('Not Got it', 'notGotItView', 'recipientDetailsView');
	};				
				
}
