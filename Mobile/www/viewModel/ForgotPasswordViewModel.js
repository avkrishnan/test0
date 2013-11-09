/*globals ko*/
function ForgotPasswordViewModel() {
  var that = this;
  this.template = 'forgotPasswordView';
  this.viewid = 'V-03';
  this.viewname = 'ForgotPassword';
  this.displayname = 'Forgot Password';
	
	/* Forgot password observable */
  this.accountName = ko.observable();	
  this.email = ko.observable();
  this.errorForgotPassword = ko.observable();
  this.usernameClass = ko.observable();
  this.emailClass = ko.observable();
	
	/* Methods */
  this.applyBindings = function () {
    $('#' + that.template).on('pagebeforeshow', null, function (e, data) {
      that.clearForm();	      
			that.activate();		
    });
  };
	
	this.clearForm = function () {
    that.email('');
    that.accountName('');
		that.usernameClass('');		
		that.emailClass('');		
    that.errorForgotPassword('');		
  };
	
  this.activate = function () {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {		
			$('input').keyup(function () {
				that.errorForgotPassword('');
				that.usernameClass('');
				that.emailClass('');
			});
		} else {
			goToView('channelListView');
		}
  };
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'forgotPasswordView') {
			that.forgotPasswordCommand();
		}
	});
	
  this.forgotPasswordCommand = function () {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (this.accountName() == '' && this.email() == '') {
      that.usernameClass('validationerror');
      that.emailClass('validationerror');
      that.errorForgotPassword('Please enter username or email');
    } else if (!emailReg.test(this.email())) {
      that.emailClass('validationerror');
      that.errorForgotPassword('Please enter valid email');
    } else {
      var callbacks = {
        success: forgotPasswordSuccess,
        error: forgotPasswordError
      };
      var forgotPasswordModel = {};
      forgotPasswordModel.accountname = that.accountName();
      forgotPasswordModel.emailAddress = that.email();
			$.mobile.showPageLoadingMsg('a', 'Sending Forgot Password Request');
      return ES.loginService.forgotPassword(forgotPasswordModel, callbacks);
    }
  };

  function forgotPasswordSuccess(args) {
    $.mobile.hidePageLoadingMsg();
		if(that.accountName() == '') {
			localStorage.setItem('resetAccount', that.email());	
		} else {
			localStorage.setItem('resetAccount', that.accountName());				
		}
		goToView('forgotPasswordSuccessView');		
  }

  function forgotPasswordError(data, status, details) {
    $.mobile.hidePageLoadingMsg();
    loginPageIfBadLogin(details.code);
    if (details) {
      that.usernameClass('validationerror');
      that.emailClass('validationerror');
      that.errorForgotPassword(details.message);
    } else {
      showError('Error Sending Forgot Password Request: ' + details.message);
    }
  }
}