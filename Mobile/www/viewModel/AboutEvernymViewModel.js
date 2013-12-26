function AboutEvernymViewModel() {
  var self = this;
	self.template = 'aboutEvernymView';
	self.viewid = 'V-46';
	self.viewname = 'About Evernym';
	self.displayname = 'About Evernym Channels';
	
	self.activate = function() {
		addExternalMarkup(self.template); // this is for header/overlay message
	};
}

AboutEvernymViewModel.prototype = new AppCtx.ViewModel();
AboutEvernymViewModel.prototype.constructor = AboutEvernymViewModel;