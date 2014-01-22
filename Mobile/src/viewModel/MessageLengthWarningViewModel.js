function MessageLengthWarningViewModel() {
  var self = this;
	self.template = 'messageLengthWarningView';
	self.viewid = 'V-46';
	self.viewname = 'Message Warning';
	self.displayname = 'Message Length Warning';
	
	self.activate = function() {
		addExternalMarkup(self.template); // this is for header/overlay message
	};
}

MessageLengthWarningViewModel.prototype = new ENYM.ViewModel();
MessageLengthWarningViewModel.prototype.constructor = MessageLengthWarningViewModel;