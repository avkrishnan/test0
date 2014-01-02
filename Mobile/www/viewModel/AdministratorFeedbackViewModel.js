function AdministratorFeedbackViewModel() {
  var self = this;
	self.template = 'administratorFeedbackView';
	self.viewid = 'V-47';
	self.viewname = 'Administrator Feedbacks';
	self.displayname = 'Administrator Feedbacks';
	
	self.submittedFeedbacks = ko.observableArray([]);
	
  self.activate = function() {
  	addExternalMarkup(self.template); // this is for header/overlay message
		self.getFeedbacks().then(showFeedback);
	};
	
	self.getFeedbacks = function() {
		return ES.systemService.getFeedback();
	}
	
	function showFeedback(data) {
		self.submittedFeedbacks(data);
	}
}

AdministratorFeedbackViewModel.prototype = new ENYM.ViewModel();
AdministratorFeedbackViewModel.prototype.constructor = AdministratorFeedbackViewModel;