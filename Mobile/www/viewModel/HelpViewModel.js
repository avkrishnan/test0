/* To do - Pradeep Kumar */
function HelpViewModel() {	
  var self = this;
	self.template = 'helpView';
	self.viewid = 'V-45';
	self.viewname = 'Help';
	self.displayname = 'Help and FAQs';	
	
  self.activate = function() {
  	addExternalMarkup(self.template); // this is for header/overlay message									
	};	
	
}

HelpViewModel.prototype = new AppCtx.ViewModel();
HelpViewModel.prototype.constructor = HelpViewModel;