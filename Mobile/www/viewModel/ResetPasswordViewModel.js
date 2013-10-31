/*globals ko*/

function ResetPasswordViewModel() {
	var that = this;
	this.template = 'resetPasswordView';
	this.viewid = 'V-03b';
	this.viewname = 'ResetPassword';
	this.displayname = 'ResetPassword';
	this.hasfooter = true;
	this.accountName = ko.observable();		
  
	/* New Channel Step First observable */
	this.newPassword = ko.observable();		
	this.confirmPassword = ko.observable();
	this.errorResetPassword = ko.observable();
	this.passwordClass = ko.observable();
	this.confirmPasswordClass = ko.observable();		
	this.changePasswordNotification = ko.observable();
					
	this.applyBindings = function(){
		$('#' + that.template).on('pagebeforeshow', function(e, data){					
			that.clearForm();												
			that.activate();
		});
	};   
	//if ($.mobile.pageData && $.mobile.pageData.key){			
		//that.key = $.mobile.pageData.key;
		//that.activate();
	//}
		 
	this.activate = function(){
		var _accountName = localStorage.getItem("accountName");			
		that.accountName(_accountName);
		$('input').keyup(function ( ){ 
			that.passwordClass('');
			that.confirmPasswordClass('');				
			that.errorResetPassword('');
		});     	 
	};
		
	this.clearForm = function(){
		that.newPassword('');
		that.confirmPassword('');							
	};
	 
	this.resetPasswordCommand = function () {
		if(this.newPassword() == '' &&  this.confirmPassword() == '') {
			that.passwordClass('validationerror');
			that.confirmPasswordClass('validationerror');				 
			that.errorResetPassword('Please enter password and confirm password');
		} else if(this.newPassword() == this.confirmPassword()) {				
			var callbacks = {
				success: resetPasswordSuccess2,
				error: resetPasswordError
			}; 
			var resetPasswordModel = {};       
			resetPasswordModel.password = this.newPassword();             
			resetPasswordModel.confirmPassword = this.confirmPassword();
			resetPasswordModel.forgotPasswordRequestKey = (jQuery.mobile.path.get().split("?")[1]).replace("key=","");
			return ES.loginService.resetPassword(resetPasswordModel, callbacks).then(resetPasswordSuccess);
		} else {
			that.passwordClass('validationerror');
			that.confirmPasswordClass('validationerror');				 
			that.errorResetPassword('Passwords donot match');				
		}
	};
	
	function resetPasswordSuccess (data) {							
		that.changePasswordNotification('Your password has been updated');			
	}
		
	function resetPasswordError(data, status, details){
		that.passwordClass('validationerror');
		that.confirmPasswordClass('validationerror');				
		that.errorPassword('typeerrormsg');
		that.errorConfirmPassword('typeerrormsg'); 
		that.errorResetPassword(details.message);			
	};		       
}
