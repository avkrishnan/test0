function ResetPasswordViewModel() {
	var self = this;
	self.requiresAuth = false;
	self.template = 'resetPasswordView';
	self.viewid = 'V-03d';
	self.viewname = 'ResetPassword';
	self.displayname = 'ResetPassword';
	
  self.inputObs = [ 'newPassword', 'confirmPassword' ];
	self.errorObs = [ 'errorResetPassword', 'passwordClass', 'confirmPasswordClass', 'changePasswordNotification'];
  self.defineObservables();
		 
	self.activate = function(){
		if((jQuery.mobile.path.get().split('?')[1])) {
			self.accountName(ENYM.ctx.getItem('accountName'));
			$('input').keyup(function (){ 
				self.clearErrorObs();
			});
		}
		else {			
			goToView('forgotPasswordView');
		}
	};
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'resetPasswordView') {
			self.resetPasswordCommand();
		}
	});
	 
	self.resetPasswordCommand = function () {
		if(self.newPassword() == '' &&  self.confirmPassword() == '') {
			self.passwordClass('validationerror');
			self.confirmPasswordClass('validationerror');				 
			self.errorResetPassword('Please enter password and confirm password');
		} else if(self.newPassword() == self.confirmPassword()) {				
			var callbacks = {
				success: resetPasswordSuccess,
				error: resetPasswordError
			}; 
			var resetPasswordModel = {};       
			resetPasswordModel.password = self.newPassword();             
			resetPasswordModel.confirmPassword = self.confirmPassword();
			resetPasswordModel.forgotPasswordRequestKey = (jQuery.mobile.path.get().split('?')[1]).replace('key=','');
			$.mobile.showPageLoadingMsg('a', 'Sending Update Password Request');			
			return ES.loginService.resetPassword(resetPasswordModel, callbacks).then(resetPasswordSuccess);
		} else {
			self.passwordClass('validationerror');
			self.confirmPasswordClass('validationerror');				 
			self.errorResetPassword("Passwords don't match");				
		}
	};
	
	function resetPasswordSuccess (data) {							
		goToView('resetPasswordSuccessView');			
	};
		
	function resetPasswordError(data, status, details){
		self.passwordClass('validationerror');
		self.confirmPasswordClass('validationerror');				
		self.errorResetPassword(details.message);			
	}; 
}

ResetPasswordViewModel.prototype = new ENYM.ViewModel();
ResetPasswordViewModel.prototype.constructor = ResetPasswordViewModel;