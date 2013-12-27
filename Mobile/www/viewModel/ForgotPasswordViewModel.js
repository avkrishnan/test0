function ForgotPasswordViewModel() {
  var that = this;
  this.template = 'forgotPasswordView';
  this.viewid = 'V-03';
  this.viewname = 'ForgotPassword';
  this.displayname = 'Forgot Password';
	
	/* Forgot password observable */
  this.email = ko.observable();	
  this.errorEmail = ko.observable();
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
		that.emailClass('');				
    that.errorEmail('');		
  };
	
  this.activate = function () {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {		
			$('input').keyup(function () {					
				that.errorEmail('');
				that.emailClass('');
			});
		} else {
			goToView('homeView');
		}
  };
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'forgotPasswordView') {
			that.forgotPasswordCommand();
		}
	});
	
  this.forgotPasswordCommand = function () {
    var emailReg = /^[\+_a-zA-Z0-9-]+(\.[\+_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
    if (that.email() == '') {
      that.emailClass('validationerror');
      that.errorEmail('Please enter your email');
    } else if (that.email() != '' && !emailReg.test(that.email())) {
      that.emailClass('validationerror');
      that.errorEmail('Please enter valid email');
    } else {
      var callbacks = {
        success: forgotPasswordSuccess,
        error: forgotPasswordError
      };
      var forgotPasswordModel = {};
      forgotPasswordModel.emailAddress = that.email();
			$.mobile.showPageLoadingMsg('a', 'Sending Forgot Password Request');
      return ES.loginService.forgotPassword(forgotPasswordModel, callbacks);
    }
  };

  function forgotPasswordSuccess(args) {
    $.mobile.hidePageLoadingMsg();
		appCtx.setItem('resetAccount', that.email());	
		goToView('forgotPasswordSuccessView');		
  }

  function forgotPasswordError(data, status, details) {
    $.mobile.hidePageLoadingMsg();
    loginPageIfBadLogin(details.code);
		that.emailClass('validationerror');
		that.errorEmail(details.message);
  }
	
}