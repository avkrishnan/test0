/*globals ko*/
/* To do - Pradeep Kumar */
function InviteFollowersIIViewModel() {
  var that = this;
  this.template = 'inviteFollowersIIView';
  this.viewid = 'V-41';
  this.viewname = 'InviteII';
  this.displayname = 'Praise for Evernym Channels';
	this.accountName = ko.observable();		

  /* Feedback value and error observable */
	this.feedbackType = ko.observable();
	this.feedbackLabel = ko.observable();			
	this.feedbackClass = ko.observable();
	this.feedback = ko.observable();
	this.feedbackId = ko.observable('feedback');
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
			if(localStorage.getItem('feedbackType') == 'praise') {
				that.feedbackType('Praise for Evernym Channels');
				that.feedbackLabel('Your feedback:');					
			}
			else if(localStorage.getItem('feedbackType') == 'suggestions') {
				that.feedbackType('Suggestions for Evernym Channels');
				that.feedbackLabel('Your Suggestions:');				
			}
			else {
				that.feedbackType('Report a Bug for Evernym Channels');
				that.feedbackLabel('Report a Bug:');				
			}			
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
		var feedbackData = $('#'+that.feedbackId()).val();
    if (feedbackData == '') {
			that.feedbackClass('validationerror');
			that.error(true);				
			that.errorFeedback('<span>SORRY:</span> Please give feedback');
    } else {
			that.toastText('Feature coming soon!');
			showToast();			
    }
  };	
		
}