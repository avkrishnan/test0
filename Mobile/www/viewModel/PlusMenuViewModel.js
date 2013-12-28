function PlusMenuViewModel() {
  var self = this;
  self.template = 'plusMenuView';
  self.viewid = 'V-??';
  self.viewname = 'Plus Menu';
  self.displayname = 'Plus Menu';
	
  self.activate = function() {
  	addExternalMarkup(self.template); // this is for header/overlay message									
	};
}

PlusMenuViewModel.prototype = new ENYM.ViewModel();
PlusMenuViewModel.prototype.constructor = PlusMenuViewModel;