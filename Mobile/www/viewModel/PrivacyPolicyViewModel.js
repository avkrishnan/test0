function PrivacyPolicyViewModel() {
  var self = this;
  self.template = 'privacyPolicyView';
  self.viewid = 'V-49';
  self.viewname = 'Privacy Policy';
  self.displayname = 'Privacy Policy';
	
	self.hasfooter = ko.observable(false);
	self.noheader = ko.observable(false);

	self.activate = function() {
		addExternalMarkup(self.template); // this is for header/overlay message					
		self.accountName(ENYM.ctx.getItem('accountName'));
		self.hasfooter(true);								
	}
}

PrivacyPolicyViewModel.prototype = new ENYM.ViewModel();
PrivacyPolicyViewModel.prototype.constructor = PrivacyPolicyViewModel;