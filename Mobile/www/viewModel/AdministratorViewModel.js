function AdministratorViewModel() {
  var self = this;
	self.template = 'administratorView';
	self.viewid = 'V-47';
	self.viewname = 'Administrator';
	self.displayname = 'Administrator';
	
  self.activate = function() {
  	addExternalMarkup(self.template); // this is for header/overlay message			
	};
	
	self.comingSoon = function() {
		headerViewModel.comingSoon();
	};	
}

AdministratorViewModel.prototype = new ENYM.ViewModel();
AdministratorViewModel.prototype.constructor = AdministratorViewModel;