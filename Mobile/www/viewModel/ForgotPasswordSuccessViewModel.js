/*globals ko*/
/* To do - Pradeep Kumar */
function ForgotPasswordSuccessViewModel() {
	var self = this;
	self.requiresAuth = false;
  self.template = 'forgotPasswordSuccessView';
  self.viewid = 'V-03b';
  self.viewname = 'ForgotPasswordSuccess';
  self.displayname = 'Forgot Password Success';
	
  self.activate = function () {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {				
		} else {
			goToView('homeView');
		}		
  };

  self.okayCommand = function () {		
		goToView('loginView');
  };
};

ForgotPasswordSuccessViewModel.prototype = new ENYM.ViewModel();
ForgotPasswordSuccessViewModel.prototype.constructor = ForgotPasswordSuccessViewModel;