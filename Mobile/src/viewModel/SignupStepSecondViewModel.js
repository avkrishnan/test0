﻿/* To do - Pradeep Kumar */
function SignupStepSecondViewModel() {
  var that = this;
  this.template = 'signupStepSecondView';
  this.viewid = 'V-02b';
  this.viewname = 'Register';
  this.displayname = 'Register';
	
  this.firstname = ko.observable();
  this.lastname = ko.observable();
  this.errorFirstName = ko.observable();	
  this.errorFirstLastName = ko.observable();
  this.firstnameClass = ko.observable();
  this.lastnameClass = ko.observable();

  this.applyBindings = function () {
    $('#' + this.template).on('pagebeforeshow', function (e, data) {
			that.clearForm();			
      that.activate();
    });
  };
	
	this.clearForm = function () {
    that.firstname('');
    that.lastname('');
    that.errorFirstName('');		
    that.errorFirstLastName('');
  };

	this.activate = function () {
		var token = ES.evernymService.getAccessToken();
		var newUser = ENYM.ctx.getItem('newusername');		
		if(token == '' || token == null) {
			$('input').keyup(function () {
				that.firstnameClass('');
				that.lastnameClass('');
				that.errorFirstName('');				
				that.errorFirstLastName('');
			});
		}	
		else if(newUser == '' || newUser == null) {
			goToView('homeView');
		} 
		else {
			goToView('tutorialView');
		}
	};
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'signupStepSecondView') {
			that.signUpCommand();
		}
	});
	
	/* Create Random AccountName Generator */	
  function generateAccount() {
    return {
      emailaddress: ENYM.ctx.getItem('newuseremail'),
      accountname: ENYM.ctx.getItem('newusername'),		
      password: ENYM.ctx.getItem('newuserpassword'),
      firstname: that.firstname(),
      lastname: that.lastname()
    };
  };
	
  this.signUpCommand = function () {
    if (that.firstname() == '') {
      that.firstnameClass('validationerror');
      that.errorFirstName('<span>Sorry,</span> Please enter first name');
    }
		else if (that.firstname().length > 20) {
      that.firstnameClass('validationerror');
      that.errorFirstName('<span>Sorry,</span> Please enter name of max. 20 characters');
    }
		else if (that.lastname() == '') {
      that.lastnameClass('validationerror');
      that.errorFirstLastName('<span>Sorry,</span> Please enter last name');
    }				 
		else if (that.lastname().length > 20) {
      that.lastnameClass('validationerror');
      that.errorFirstLastName('<span>Sorry,</span> Please enter name of max. 20 characters');
    } 
		else {
      $.mobile.showPageLoadingMsg('a', 'Enrolling');
      var callbacks = {
        success: signUpSuccess,
        error: signUpError
      };
      var account = generateAccount();
      ES.loginService.accountEnroll(account, callbacks);
    }
  };

  function signUpSuccess(args) {
    $.mobile.hidePageLoadingMsg();
		that.loginCommand();
  };

  function signUpError(data, status, details) {
    $.mobile.hidePageLoadingMsg();
    ENYM.ctx.setItem('signUpError', details.message);		
    goToView('signupStepFirstView');
  };
	
	this.loginCommand = function() {
    $.mobile.showPageLoadingMsg('a', 'Logging In With New Credentials');
    var callbacks = {
      success : loginSuccess,
      error : loginError
    };
    var loginModel = {};
    loginModel.accountname = ENYM.ctx.getItem('newusername');
    loginModel.password = ENYM.ctx.getItem('newuserpassword');
    loginModel.appToken = 'sNQO8tXmVkfQpyd3WoNA6_3y2Og=';
    ES.loginService.accountLogin(loginModel, callbacks);
	}
	
	function loginSuccess(args) {		
    $.mobile.hidePageLoadingMsg();
    ES.evernymService.clearAccessToken();
		ES.evernymService.setAccessToken(args.accessToken);
		ENYM.ctx.setItem('accountName', args.account.accountname);
//
		/*
		ES.systemService.getMsgNotifs({
			success: function(responseData) {
				ENYM.ctx.removeItem('enymNotifications');
				ENYM.ctx.setItem('enymNotifications', JSON.stringify(responseData));
				if(JSON.parse(ENYM.ctx.getItem('enymNotifications')).length > 0) {
					headerViewModel.newMessageClass('smsiconwhite');
					headerViewModel.newMessageCount(JSON.parse(ENYM.ctx.getItem('enymNotifications')).length);
					overlayViewModel.showNewMessagesOverlay();
				}
				else {
					headerViewModel.newMessageCount('');
					headerViewModel.newMessageClass('');
				}
				goToView('registrationVerifyView');				
			},
			error: function(data, status, details) {
			}
		});
		*/
//			
		goToView('registrationVerifyView');			
  }

  function loginError(data, status, details) {
    $.mobile.hidePageLoadingMsg();		
		that.errorFirstLastName('<span>Sorry,</span> '+details.message);
    ES.evernymService.clearAccessToken();
  }
	
}