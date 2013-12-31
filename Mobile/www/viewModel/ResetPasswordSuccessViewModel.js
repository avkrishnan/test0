function ResetPasswordSuccessViewModel() {
	var self = this;
	self.template = 'resetPasswordSuccessView';
	self.viewid = 'V-03e';
	self.viewname = 'ResetPasswordSuccess';
	self.displayname = 'Reset password success';
		 
	self.activate = function(){
		var resetAccount = ENYM.ctx.getItem('resetAccount');		
		if(resetAccount == '' || resetAccount == null) {
			goToView('forgotPasswordView');
		}
	};
	
	self.okayResetCommand = function () {
		ENYM.ctx.removeItem('resetAccount');						
		goToView('loginView');
  };		       
}

ResetPasswordSuccessViewModel.prototype = new ENYM.ViewModel();
ResetPasswordSuccessViewModel.prototype.constructor = ResetPasswordSuccessViewModel;
