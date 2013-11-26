/*globals ko*/
/* To do - Pradeep Kumar */
function InviteFollowersIIViewModel() {
  var that = this;
  this.template = 'inviteFollowersIIView';
  this.viewid = 'V-41';
  this.viewname = 'GetFollowersII';
  this.displayname = 'Praise for Evernym Channels';
	this.accountName = ko.observable();		

  /* Feedback value and error observable */
	this.emailaddress = ko.observable();		
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
		that.emailaddress('');
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
	
	this.menuCommand = function () {
		pushBackNav('InviteII', 'inviteFollowersIIView', 'channelMenuView');		
  };	
	
	this.sendFeedbackCommand = function () {
		var feedbackData = $('#'+that.feedbackId()).val();
    if (feedbackData == '') {
			that.feedbackClass('validationerror');
			that.error(true);				
			that.errorFeedback('<span>SORRY:</span> Please give feedback');
    } else {
			showMessage('Testing');		
    }
  };
	
	this.userSettings = function () {
		pushBackNav('InviteII', 'inviteFollowersIIView', 'escalationPlansView');
  };	
	
	this.composeCommand = function () {
		pushBackNav('InviteII', 'inviteFollowersIIView', 'sendMessageView');
  };	
		
}