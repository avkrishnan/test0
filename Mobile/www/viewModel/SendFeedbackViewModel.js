function SendFeedbackViewModel() {
  var self = this;
  self.template = 'sendFeedbackView';
  self.viewid = 'V-41';
  self.viewname = 'Send Feedback';
  self.displayname = 'Send Feedback';
	
  self.inputObs = [ 'feedbackType', 'feedbackLabel', 'feedbackClass', 'feedback', 'feedbackContext', 'error', 'errorFeedback' ];
  self.defineObservables();	

	self.activate = function() {
		addExternalMarkup(self.template); // this is for header/overlay message			
		if(feedbackType == 'feedback') {
			self.feedbackType('Praise for Evernym Channels');
			self.feedbackLabel('Your feedback:');
			self.feedbackContext('feedback');									
		} else if(feedbackType == 'suggestions') {
			self.feedbackType('Suggestions for Evernym Channels');
			self.feedbackLabel('Your Suggestions:');
			self.feedbackContext('suggestions');								
		} else {
			self.feedbackType('Report a Bug for Evernym Channels');
			self.feedbackLabel('Report a Bug:');
			self.feedbackContext('bug');								
		} feedbackType = '';						
		self.accountName(ENYM.ctx.getItem('accountName'));			
		$('textarea').keyup(function () {
			self.feedbackClass('');
			self.error(false);				
			self.errorFeedback('');													
		});
	}
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && e.target.nodeName != 'TEXTAREA' && $.mobile.activePage.attr('id') == 'sendFeedbackView') {
			self.sendFeedbackCommand();
		}
	});	
	
	self.sendFeedbackCommand = function () {
    if (self.feedback() == '' || typeof self.feedback() == 'undefined') {
			self.feedbackClass('validationerror');
			self.error(true);				
			self.errorFeedback('<span>SORRY:</span> Please enter text above');
    } else {
      $.mobile.showPageLoadingMsg("a", "Sending Feedback");			
			var feedbackObject = {};
      feedbackObject.comments = self.feedback();
      feedbackObject.context = self.feedbackContext();				
			return ES.systemService.sendFeedback(feedbackObject, {success: successfulSend, error: errorAPI});			
    }
  };
	
	function successfulSend(data){	
    $.mobile.hidePageLoadingMsg();
		var toastobj = {redirect: 'feedbackView', type: '', text: 'Feedback sent successfully'};
		showToast(toastobj);			
		backNavText.pop();
		backNavView.pop();		
		goToView('feedbackView');
	};    
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();	
		self.feedbackClass('validationerror');
		self.error(true);				
		self.errorFeedback('<span>SORRY:</span> '+details.message);		
	};
}

SendFeedbackViewModel.prototype = new ENYM.ViewModel();
SendFeedbackViewModel.prototype.constructor = SendFeedbackViewModel;