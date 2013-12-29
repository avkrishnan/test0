function FeedbackViewModel() {
  var self = this;
	self.template = 'feedbackView';
	self.viewid = 'V-47';
	self.viewname = 'Feedback';
	self.displayname = 'Feedback';
	
  self.activate = function() {
  	addExternalMarkup(self.template); // this is for header/overlay message			
	};
	
	self.praise = function() {
		feedbackType = 'feedback';
		viewNavigate('Feedback', 'feedbackView', 'sendFeedbackView');
	}
	
	self.suggestions = function() {
		feedbackType = 'suggestions';
		viewNavigate('Feedback', 'feedbackView', 'sendFeedbackView');
	}
	
	self.reportABug = function() {
		feedbackType = 'bug';
		viewNavigate('Feedback', 'feedbackView', 'sendFeedbackView');
	}
}

FeedbackViewModel.prototype = new ENYM.ViewModel();
FeedbackViewModel.prototype.constructor = FeedbackViewModel;