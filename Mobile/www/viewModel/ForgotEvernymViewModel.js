function ForgotEvernymViewModel() {
  var self = this;
	self.requiresAuth = false;	
  self.template = 'forgotEvernymView';
  self.viewid = 'V-??';
  self.viewname = 'ForgotEvernym';
  self.displayname = 'Forgot Evernym';
	
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
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'forgotEvernymView') {
			self.forgotEvernymCommand();
		}
	});
	
  self.forgotEvernymCommand = function () {
    var emailReg = /^[\+_a-zA-Z0-9-]+(\.[\+_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/;
    if (self.email() == '') {
      self.emailClass('validationerror');
      self.errorEmail('Please enter your email');
    } else if (self.email() != '' && !emailReg.test(self.email())) {
      self.emailClass('validationerror');
      self.errorEmail('Please enter valid email');
    } else {
			self.sectionOne(false);
			self.sectionTwo(true);
      /*var callbacks = {
        success: forgotEvernymSuccess,
        error: forgotEvernymError
      };
      var forgotEvernymModel = {};
      forgotEvernymModel.emailAddress = self.email();
			$.mobile.showPageLoadingMsg('a', 'Sending Forgot Evernym Request');
      return ES.loginService.forgotEvernym(forgotEvernymModel, callbacks);*/
    }
  };

  function forgotEvernymSuccess() {
    $.mobile.hidePageLoadingMsg();	
		goToView('forgotEvernymSuccessView');		
  };

  function forgotEvernymError(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		self.emailClass('validationerror');
		self.errorEmail(details.message);
  };
	
}

ForgotEvernymViewModel.prototype = new ENYM.ViewModel();
ForgotEvernymViewModel.prototype.constructor = ForgotEvernymViewModel;