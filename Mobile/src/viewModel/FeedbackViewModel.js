function FeedbackViewModel() {
  var self = this;
	self.template = 'feedbackView';
	self.viewid = 'V-47';
	self.viewname = 'Feedback';
	self.displayname = 'Feedback';
	
  self.activate = function() {
  	addExternalMarkup(self.template);// this is for header/overlay message	
  	ENYM.ctx.removeItem("feedbackType"); 		
	};
	
	self.praise = function() {
		ENYM.ctx.setItem("feedbackType", 'feedback');
		viewNavigate('Feedback', 'feedbackView', 'sendFeedbackView');
	}
	
	self.suggestions = function() {
		ENYM.ctx.setItem("feedbackType", 'suggestions');
		viewNavigate('Feedback', 'feedbackView', 'sendFeedbackView');
	}
	
	self.reportABug = function() {
		ENYM.ctx.setItem("feedbackType", 'bug');
		viewNavigate('Feedback', 'feedbackView', 'sendFeedbackView');
	}
}

FeedbackViewModel.prototype = new ENYM.ViewModel();
FeedbackViewModel.prototype.constructor = FeedbackViewModel;