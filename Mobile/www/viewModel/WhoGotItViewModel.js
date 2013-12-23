/*globals ko*/
/* To do - Pradeep Kumar */
function WhoGotItViewModel() {
  var that = this;
	this.template = 'whoGotItView';
	this.viewid = 'V-34';
	this.viewname = 'Who Got it';
	this.displayname = 'Who got iGi';	
	this.accountName = ko.observable();		

  /* Got it observable */
	this.channelId = ko.observable();				
	this.channelName = ko.observable();
	this.messageId = ko.observable();				
	this.acks = ko.observable();
	this.recipients = ko.observableArray([]);					
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  
	
	this.activate = function() {
		if(authenticate()) {
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));	
			var messageObject = JSON.parse(localStorage.getItem('currentMessageData'));			
			if(!channelObject || !messageObject) {
				goToView('channelsIOwnView');			
			} else {
				addExternalMarkup(that.template); // this is for header/overlay message
				that.recipients.removeAll();						
				localStorage.removeItem('currentRecipientData');						
				that.accountName(localStorage.getItem('accountName'));											
				that.channelId(channelObject.channelId);			
				that.channelName(channelObject.channelName);
				that.messageId(messageObject.messageId);
				if(messageObject.acks) {								
					that.acks(messageObject.acks+' Got It');
				} 
				else if(messageObject.acks == 0) {
					that.acks(messageObject.acks+' Got It');				
				}
				else if(messageObject.type != 'REQUEST_ACKNOWLEDGEMENT') {
					that.acks('No iGi requested');				
				}			
				else {
					that.acks('No followers to acknowledge iGi!');				
				}
				$.mobile.showPageLoadingMsg("a", "Loading Followers");
				return ES.messageService.getMessageRecipients(that.channelId(), that.messageId(), 'Y', {success: successfulList, error: errorAPI});																			
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
				recipient: data.recipients[len].rcvrFirstname +' '+ data.recipients[len].rcvrLastname+', <em>'+data.recipients[len].rcvrAccountname+'</em>'
			});
		}		
	}

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);
  };
	
	this.recipientDetails = function(data){
		localStorage.setItem('currentRecipientData', JSON.stringify(data));							
		viewNavigate('Who Got it', 'whoGotItView', 'recipientDetailsView');
	};			
				
}
