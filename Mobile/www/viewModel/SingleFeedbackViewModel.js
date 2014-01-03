function SingleFeedbackViewModel() {
  var self = this;
	self.template = 'singleFeedbackViewModel';
	self.viewid = 'V-47';
	self.viewname = 'Single Feedback';
	self.displayname = 'Single Feedback';
	
	self.submittedFeedbacks = ko.observableArray([]);
	
  self.activate = function() {
  	addExternalMarkup(self.template); // this is for header/overlay message
		self.getFeedbacks().then(showFeedback);
	};
	
	self.getFeedbacks = function() {
		return ES.systemService.getFeedback();
	};
	
	function showFeedback(data) {
		$.each(data, function(indexMessage, valueMessage) {
			valueMessage.context = valueMessage.context + '-icon';
			valueMessage.created = formatDate(valueMessage.created, 'short', 'follow');
		});
		self.submittedFeedbacks(data);
	};
}

SingleFeedbackViewModel.prototype = new ENYM.ViewModel();
SingleFeedbackViewModel.prototype.constructor = SingleFeedbackViewModel;