/*globals ko*/

function ForgotPasswordViewModel() {
  var that = this;
  this.template = "forgotPasswordView";
  this.viewid = "V-03";
  this.viewname = "ForgotPassword";
  this.displayname = "Forgot Password";
  this.hasfooter = false;
  this.accountName = ko.observable();
  this.email = ko.observable();
  this.errorForgotPassword = ko.observable();
  this.usernameClass = ko.observable();
  this.emailClass = ko.observable();
  this.notification = ko.observable();
  this.applyBindings = function () {
    $("#" + that.template).on("pagebeforeshow", null, function (e, data) {
      that.clearForm();
      that.activate();
    });
  };
	
  this.activate = function () {
    that.errorForgotPassword('');
    $(document).keypress(function (e) {
      if (e.keyCode == 13) {
        that.forgotPasswordCommand();
      }
    });
    $('input').keyup(function () {
      that.errorForgotPassword('');
      that.usernameClass('');
      that.emailClass('');
    });
  };
	
  this.clearForm = function () {
    that.email('');
    that.accountName('');
    that.notification('');
  };

  function gotForgotPassword(data, status, details) {
    that.notification('We have sent you an email with a link to change your password');
  }
	
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
      return ES.loginService.forgotPassword(forgotPasswordModel, callbacks).then(gotForgotPassword);
    }
  };

  function forgotPasswordSuccess(args) {
    $.mobile.hidePageLoadingMsg();
  }

  function forgotPasswordError(data, status, details) {
    $.mobile.hidePageLoadingMsg();
    loginPageIfBadLogin(details.code);
    if (details) {
      that.usernameClass('validationerror');
      that.emailClass('validationerror');
      that.errorForgotPassword(details.message);
    } else {
      showError("Error Sending Forgot Password Request: " + details.message);
    }
  }
}