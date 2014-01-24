function UnreachableHelpViewModel() {
  var self = this;
  self.template = 'unreachableHelpView';
  self.viewid = 'V-??';
  self.viewname = 'Unreachable help';
  self.displayname = 'Unreachable followers help';

	self.activate = function() {
		if(authenticate()) {
			addExternalMarkup(self.template); // this is for header/overlay message							
		}
	};
}

UnreachableHelpViewModel.prototype = new ENYM.ViewModel();
UnreachableHelpViewModel.prototype.constructor = UnreachableHelpViewModel;