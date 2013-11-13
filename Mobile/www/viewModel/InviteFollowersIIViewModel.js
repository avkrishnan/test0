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
	this.errorFeedback = ko.observable();	
	
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
		that.errorFeedback('');				
	};  

	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			that.accountName(localStorage.getItem('accountName'));
			that.feedback('Add additional text here . . . ');			
			$('textarea').click(function () {
				if(that.feedback() == 'Add additional text here . . . ') {
					that.feedback('');											
				}
			});
			$('textarea').keyup(function () {
				if(that.feedback() == 'Add additional text here . . . ') {
					that.feedback('');						
				}
				that.feedbackClass('');
				that.errorFeedback('');													
			});					
			$('input').keyup(function () {
				that.emailClass('');
				that.errorEmail('');				
			});
		}
	}
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && e.target.nodeName != 'TEXTAREA' && $.mobile.activePage.attr('id') == 'inviteFollowersIIView') {
			that.sendFeedbackCommand();
		}
	});
	
	this.sendFeedbackCommand = function () {
    var emailReg = /^[\+_a-zA-Z0-9-]+(\.[\+_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
		var feedbackData = $('#'+that.feedbackId()).val();
    if (feedbackData == '') {
			that.feedbackClass('validationerror');
			that.errorFeedback('<span>SORRY :</span> Please give feedback');
    } else {
			showMessage('Testing');		
    }
  };
		
}