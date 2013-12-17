/*globals ko*/
/* To do - Pradeep Kumar */
function InviteFollowersIIViewModel() {
  var that = this;
  this.template = 'inviteFollowersIIView';
  this.viewid = 'V-41';
  this.viewname = 'Send Feedback';
  this.displayname = 'Send Feedback';
	this.accountName = ko.observable();		

  /* Feedback value and error observable */
	this.feedbackType = ko.observable();
	this.feedbackLabel = ko.observable();			
	this.feedbackClass = ko.observable();
	this.feedback = ko.observable();
	this.feedbackContext = ko.observable();
	this.error = ko.observable(false);									
	this.errorFeedback = ko.observable();
	this.toastText = ko.observable();		
	
	/* Methods */
  this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.clearForm();						
      that.activate();
    });	
	};
	
	this.clearForm = function () {
		that.feedback('');
		that.feedbackClass('');
		that.error(false);		
		that.errorFeedback('');				
	};  

	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			addExternalMarkup(that.template); // this is for header/overlay message			
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}
			if(feedbackType == 'praise') {
				that.feedbackType('Praise for Evernym Channels');
				that.feedbackLabel('Your feedback:');
				that.feedbackContext('praise');									
			}
			else if(feedbackType == 'suggestions') {
				that.feedbackType('Suggestions for Evernym Channels');
				that.feedbackLabel('Your Suggestions:');
				that.feedbackContext('suggestions');								
			}
			else {
				that.feedbackType('Report a Bug for Evernym Channels');
				that.feedbackLabel('Report a Bug:');
				that.feedbackContext('bug');								
			}
			feedbackType = '';						
			that.accountName(localStorage.getItem('accountName'));			
			$('textarea').keyup(function () {
				that.feedbackClass('');
				that.error(false);				
				that.errorFeedback('');													
			});					
		}
	}
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && e.target.nodeName != 'TEXTAREA' && $.mobile.activePage.attr('id') == 'inviteFollowersIIView') {
			that.sendFeedbackCommand();
		}
	});	
	
	this.sendFeedbackCommand = function () {
    if (that.feedback() == '' || typeof that.feedback() == 'undefined') {
			that.feedbackClass('validationerror');
			that.error(true);				
			that.errorFeedback('<span>SORRY:</span> Please give feedback');
    } else {
      $.mobile.showPageLoadingMsg("a", "Sending Feedback");			
			var feedbackObject = {};
      feedbackObject.comments = that.feedback();
      feedbackObject.context = that.feedbackContext();				
			return ES.systemService.sendFeedback(feedbackObject, {success: successfulSend, error: errorAPI});			
    }
  };
	
	function successfulSend(data){	
    $.mobile.hidePageLoadingMsg();
		that.toastText('Feedback sent successfully');		
		localStorage.setItem('toastData', that.toastText());
		popBackNav();
	};    
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();	
		that.toastText(details.message);		
		showToast();
	};	
	
		
}