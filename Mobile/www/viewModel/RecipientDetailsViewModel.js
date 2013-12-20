/*globals ko*/
/* To do - Pradeep Kumar */
function RecipientDetailsViewModel() {
  var that = this;
	this.template = 'recipientDetailsView';
	this.viewid = 'V-34a';
	this.viewname = 'Recipient Details';
	this.displayname = 'Recipient Details';	
	this.accountName = ko.observable();		

  /* Not got it observable */				
	this.channelName = ko.observable();
	this.recipient = ko.observableArray();						
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  
	
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));	
		var recipientObject = JSON.parse(localStorage.getItem('currentRecipientData'));			
		if(token == '' || token == null) {
			goToView('loginView');
		} else if(!channelObject || !recipientObject) {
			goToView('channelsIOwnView');			
		} else {
			addExternalMarkup(that.template); // this is for header/overlay message						
			that.accountName(localStorage.getItem('accountName'));													
			that.channelName(channelObject.channelName);
			var recipient = recipientObject.recipient.split(',');
			that.recipient(recipient[0]+' '+recipient[1]);								
		}
	}					
				
}
