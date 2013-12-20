/*globals ko*/
/* To do - Pradeep Kumar */
function FeedbackViewModel() {	
  var that = this;
	this.template = 'feedbackView';
	this.viewid = 'V-47';
	this.viewname = 'Feedback';
	this.displayname = 'Feedback';	 
	this.accountName = ko.observable();		
	
	/* Methods */			
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};
	  
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			addExternalMarkup(that.template); // this is for header/overlay message						
			that.accountName(localStorage.getItem('accountName'));			
		}
	}
	
	this.praise = function() {
		feedbackType = 'feedback';
		viewNavigate('Feedback', 'feedbackView', 'inviteFollowersIIView');		
	}
	
	this.suggestions = function() {
		feedbackType = 'suggestions';		
		localStorage.setItem('feedbackType', 'suggestions');
		viewNavigate('Feedback', 'feedbackView', 'inviteFollowersIIView');		
	}
	
	this.reportABug = function() {
		feedbackType = 'bug';		
		viewNavigate('Feedback', 'feedbackView', 'inviteFollowersIIView');		
	}				
	
}

