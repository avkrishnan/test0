/*globals ko*/
/* To do - Pradeep Kumar */
function ChangePasswordViewModel() {
  var that = this;
  this.template = 'changePasswordView';
  this.viewid = 'V-03';
  this.viewname = 'ChangePassword';
  this.displayname = 'Change Password';
	
  this.accountName = ko.observable();	
  this.email = ko.observable();
  this.errorForgotPassword = ko.observable();
  this.usernameClass = ko.observable();
  this.emailClass = ko.observable();
	
	/* Methods */
  this.applyBindings = function () {
    $('#' + that.template).on('pagebeforeshow', null, function (e, data) {     
			that.activate();		
    });
  };
	
  this.activate = function () {
		alert(localStorage.getItem("accountName"));
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			that.accountName(localStorage.getItem("accountName"));  
		} 
		else {
			//goToView('loginView');
			that.accountName(localStorage.getItem("accountName"));
		}
  };
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'forgotPasswordView') {
			that.forgotPasswordCommand();
		}
	});
	
  this.forgotPasswordCommand = function () {
    var emailReg = /^[\+_a-zA-Z0-9-]+(\.[\+_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
    if (that.accountName() == '' && that.email() == '') {
      that.usernameClass('validationerror');
      that.emailClass('validationerror');
      that.errorForgotPassword('Please enter username or email');
    } else if (that.email() != '' && !emailReg.test(that.email())) {
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
      showError(details.message);
    }
  }
	
}