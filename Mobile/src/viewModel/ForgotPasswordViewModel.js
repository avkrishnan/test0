function ForgotPasswordViewModel() {
  var self = this;
	self.requiresAuth = false;	
  self.template = 'forgotPasswordView';
  self.viewid = 'V-03';
  self.viewname = 'ForgotPassword';
  self.displayname = 'Forgot Password';
	
	self.sectionOne = ko.observable(true);
	self.sectionTwo = ko.observable(false);	
	
  self.inputObs = [ 'email'];
  self.errorObs = [ 'errorEmail', 'emailClass'];	
  self.defineObservables();	
	
  self.activate = function () {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			self.sectionOne(true);
			self.sectionTwo(false);					
			$('input').keyup(function () {					
				self.clearErrorObs();
			});
		} else {
			goToView('homeView');
		}
  };
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'forgotPasswordView') {
			self.forgotPasswordCommand();
		}
	});
	
  self.forgotPasswordCommand = function () {
    var emailReg = /^[\+_a-zA-Z0-9-]+(\.[\+_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
    if (self.email() == '') {
      self.emailClass('validationerror');
      self.errorEmail('Please enter your email');
    } else if (self.email() != '' && !emailReg.test(self.email())) {
      self.emailClass('validationerror');
      self.errorEmail('Please enter valid email');
    } else {
      var callbacks = {
        success: forgotPasswordSuccess,
        error: forgotPasswordError
      };
      var forgotPasswordModel = {};
      forgotPasswordModel.emailAddress = self.email();
			$.mobile.showPageLoadingMsg('a', 'Sending Forgot Password Request');
      return ES.loginService.forgotPassword(forgotPasswordModel, callbacks);
    }
  };

  function forgotPasswordSuccess() {
    $.mobile.hidePageLoadingMsg();
		self.sectionOne(false);
		self.sectionTwo(true);		
  };

  function forgotPasswordError(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		self.emailClass('validationerror');
		self.errorEmail(details.message);
  };
	
}

ForgotPasswordViewModel.prototype = new ENYM.ViewModel();
ForgotPasswordViewModel.prototype.constructor = ForgotPasswordViewModel;