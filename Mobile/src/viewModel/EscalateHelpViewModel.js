function EscalateHelpViewModel() {
  var self = this;
  self.template = 'escalateHelpView';
  self.viewid = 'V-20b';
  self.viewname = 'Escalate Help';
  self.displayname = 'Escalate help';

	self.activate = function() {
		addExternalMarkup(self.template); // this is for header/overlay message													
	}
}

EscalateHelpViewModel.prototype = new ENYM.ViewModel();
EscalateHelpViewModel.prototype.constructor = EscalateHelpViewModel;