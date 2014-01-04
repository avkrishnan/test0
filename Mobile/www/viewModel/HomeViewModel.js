function HomeViewModel() {
  var self = this;
  self.template = 'homeView';
  self.viewid = 'V-40';
  self.viewname = 'Home';
  self.displayname = 'Home';
	
  self.activate = function() {
  	addExternalMarkup(self.template); // this is for header/overlay message									
	};
}

HomeViewModel.prototype = new ENYM.ViewModel();
HomeViewModel.prototype.constructor = HomeViewModel;