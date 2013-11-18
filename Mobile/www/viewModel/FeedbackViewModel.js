/*globals ko*/
/* To do - Pradeep Kumar */
function FeedbackViewModel() {	
  var that = this;
	this.template = 'feedbackView';
	this.viewid = 'V-47';
	this.viewname = 'Feedback';
	this.displayname = 'Feedback';	 
	this.accountName = ko.observable();	
	this.backText = ko.observable();	
	
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
			that.accountName(localStorage.getItem('accountName'));
			that.backText('<em></em>'+backNavText[backNavText.length-1]);			
		}
	}
	
	this.backCommand = function () {
		popBackNav();
  };
	
	this.menuCommand = function () {
		pushBackNav('Feedback', 'feedbackView', 'channelMenuView');		
  };	
	
	this.praiseCommand = function () {
		goToView('inviteFollowersIIView');
	}
	
	this.suggestionsCommand = function () {
		goToView('inviteFollowersIIView');
	}
	
	this.reportABugCommand = function () {
		goToView('inviteFollowersIIView');
	}
	
	this.userSettings = function () {
		pushBackNav('Feedback', 'feedbackView', 'escalationPlansView');		
  };	
	
	this.composeCommand = function () {
		pushBackNav('Feedback', 'feedbackView', 'sendMessageView');		
  };	
	
}

