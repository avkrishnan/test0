﻿function RecipientDetailsViewModel() {
  var self = this;
	self.template = 'recipientDetailsView';
	self.viewid = 'V-34a';
	self.viewname = 'Recipient Details';
	self.displayname = 'Recipient Details';
	
	self.channelName = ko.observable();
	self.recipient = ko.observableArray();
	
	self.activate = function() {
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));	
		var recipientObject = JSON.parse(ENYM.ctx.getItem('currentRecipientData'));			
		if(!channelObject || !recipientObject) {
			goToView('channelsIOwnView');			
		} else {
			addExternalMarkup(self.template); // this is for header/overlay message																		
			self.channelName(channelObject.channelName);
			var recipient = recipientObject.recipient.split(',');
			if(typeof recipient[1] == 'undefined'){
				var rcvrName = '';
			} else {
				var rcvrName = recipient[1];
			}
			self.recipient(recipient[0]+' '+rcvrName);								
		}
	};
}

RecipientDetailsViewModel.prototype = new ENYM.ViewModel();
RecipientDetailsViewModel.prototype.constructor = RecipientDetailsViewModel;
