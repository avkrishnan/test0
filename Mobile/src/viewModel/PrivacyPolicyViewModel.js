function PrivacyPolicyViewModel() {
  var self = this;
	self.requiresAuth = false;
  self.template = 'privacyPolicyView';
  self.viewid = 'V-49';
  self.viewname = 'Privacy Policy';
  self.displayname = 'Privacy Policy';
	
	self.hasheader = ko.observable(false);	
	self.hasfooter = ko.observable(false);

	self.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			self.hasheader(true);
			self.hasfooter(false);
		}
		else {
			addExternalMarkup(self.template); // this is for header/overlay message
			self.hasheader(false);
			self.hasfooter(true);
		}								
	}
}

PrivacyPolicyViewModel.prototype = new ENYM.ViewModel();
PrivacyPolicyViewModel.prototype.constructor = PrivacyPolicyViewModel;