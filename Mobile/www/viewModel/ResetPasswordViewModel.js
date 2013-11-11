/*globals ko*/
/* To do - Pradeep Kumar */
function ResetPasswordViewModel() {
	var that = this;
	this.template = 'resetPasswordView';
	this.viewid = 'V-03d';
	this.viewname = 'ResetPassword';
	this.displayname = 'ResetPassword';
	this.accountName = ko.observable();		
  
	/* Reset Password observable */
	this.newPassword = ko.observable();		
	this.confirmPassword = ko.observable();
	this.errorResetPassword = ko.observable();
	this.passwordClass = ko.observable();
	this.confirmPasswordClass = ko.observable();		
	this.changePasswordNotification = ko.observable();
	
	/* Methods */				
	this.applyBindings = function(){
		$('#' + that.template).on('pagebeforeshow', function(e, data){																	
			that.clearForm();			
			that.activate();		
		});
	};
	
	this.clearForm = function(){
		that.newPassword('');
		that.confirmPassword('');
		that.passwordClass('');
		that.confirmPasswordClass('');				
		that.errorResetPassword('');									
	};
		 
	this.activate = function(){
		var resetAccount = localStorage.getItem('resetAccount');
		if(resetAccount == '' || resetAccount == null) {
			goToView('forgotPasswordView');
		} else {			
			that.accountName(localStorage.getItem('accountName'));
			$('input').keyup(function (){ 
				that.passwordClass('');
				that.confirmPasswordClass('');				
				that.errorResetPassword('');
			});
		}
	};
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'resetPasswordView') {
			that.resetPasswordCommand();
		}
	});
	 
	this.resetPasswordCommand = function () {
		if(this.newPassword() == '' &&  this.confirmPassword() == '') {
			that.passwordClass('validationerror');
			that.confirmPasswordClass('validationerror');				 
			that.errorResetPassword('Please enter password and confirm password');
		} else if(this.newPassword() == this.confirmPassword()) {				
			var callbacks = {
				success: resetPasswordSuccess,
				error: resetPasswordError
			}; 
			var resetPasswordModel = {};       
			resetPasswordModel.password = this.newPassword();             
			resetPasswordModel.confirmPassword = this.confirmPassword();
			resetPasswordModel.forgotPasswordRequestKey = (jQuery.mobile.path.get().split('?')[1]).replace('key=','');
			$.mobile.showPageLoadingMsg('a', 'Sending Update Password Request');			
			return ES.loginService.resetPassword(resetPasswordModel, callbacks).then(resetPasswordSuccess);
		} else {
			that.passwordClass('validationerror');
			that.confirmPasswordClass('validationerror');				 
			that.errorResetPassword("Passwords don't match");				
		}
	};
	
	function resetPasswordSuccess (data) {							
		goToView('resetPasswordSuccessView');			
	}
		
	function resetPasswordError(data, status, details){
		that.passwordClass('validationerror');
		that.confirmPasswordClass('validationerror');				
		that.errorResetPassword(details.message);			
	};		
	       
}
