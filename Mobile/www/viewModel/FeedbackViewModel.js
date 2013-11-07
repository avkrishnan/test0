/*globals ko*/
function FeedbackViewModel() {	
  var that = this;
	this.template = 'feedbackView';
	this.viewid = 'V-47';
	this.viewname = 'Feedback';
	this.displayname = 'Feedback';	
	this.hasfooter = true;    
	this.channels = ko.observableArray([]);
	this.accountName = ko.observable();	
	this.notification = ko.observable();
	this.shown = false;
		
  /* Feedback observable */
	this.praisewCommand = ko.observable();
	this.suggestionsCommand = ko.observable();
	this.reportABugCommand = ko.observable();
	
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
		}
	}
	
	this.praiseCommand = function () {
		goToView('inviteFollowersIIView');
	}
}

