function RequestiGiHelpViewModel() {
  var self = this;
  self.template = 'requestiGiHelpView';
  self.viewid = 'V-20b';
  self.viewname = 'iGi Help';
  self.displayname = 'iGi help';

	self.activate = function() {
		if(authenticate()) {
			addExternalMarkup(self.template); // this is for header/overlay message							
		}
	};
}

RequestiGiHelpViewModel.prototype = new ENYM.ViewModel();
RequestiGiHelpViewModel.prototype.constructor = RequestiGiHelpViewModel;