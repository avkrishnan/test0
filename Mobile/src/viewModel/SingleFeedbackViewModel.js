function SingleFeedbackViewModel() {
  var self = this;
	self.template = 'singleFeedbackView';
	self.viewid = 'V-47';
	self.viewname = 'Single Feedback';
	self.displayname = 'Single Feedback';
	
  self.inputObs = [ 'created', 'feedback', 'context' ];
  self.defineObservables();	
	
  self.activate = function() {
  	addExternalMarkup(self.template); // this is for header/overlay message
		self.showFeedback();
	};
	
	self.showFeedback = function() {
		var currentFeedback = ENYM.ctx.getItem('singleFeedback');
		self.feedback(currentFeedback.comments);
		self.created(currentFeedback.created);
		self.context(currentFeedback.context);
	};
}

SingleFeedbackViewModel.prototype = new ENYM.ViewModel();
SingleFeedbackViewModel.prototype.constructor = SingleFeedbackViewModel;