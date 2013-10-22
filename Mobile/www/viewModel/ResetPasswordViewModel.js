/*globals ko*/

function ResetPasswordViewModel() {
    /// <summary>
    /// A view model that represents a single tweet
    /// </summary>
    
    // --- properties	
		 
    var that = this;
    this.template = "resetPasswordView";
    this.viewid = "V-03b";
    this.viewname = "ResetPassword";
    this.displayname = "ResetPassword";
    
    this.hasfooter = true;
		
		this.key = '';    
		
		this.accountName = ko.observable();
		
		this.newPassword = ko.observable();
				
		this.confirmPassword = ko.observable();
		this.errorResetPassword = ko.observable();
		
		this.passwordClass = ko.observable();
		this.confirmPasswordClass = ko.observable();		
		
		this.changePasswordNotification = ko.observable();
				    
    this.applyBindings = function(){
			$("#" + that.template).on("pagebeforeshow", function(e, data){					
				that.clearForm();										
			});
    };   
		if ($.mobile.pageData && $.mobile.pageData.key){			
			that.key = $.mobile.pageData.key;
			this.activate();
		}
       
    this.activate = function(){
			$('input').keyup(function ( ){ 
				that.passwordClass('');
				that.confirmPasswordClass('');				
				that.errorResetPassword('');
			});     	 
    };
		  
		this.clearForm = function(){
			that.newPassword('');
			that.confirmPassword('');
			that.key = '';								
		}; 
		this.resetPasswordCommand = function () {
			if(this.newPassword() == '' &&  this.confirmPassword() == '') {
				that.passwordClass('validationerror');
				that.confirmPasswordClass('validationerror');				 
				that.errorResetPassword('Please enter password and confirm password');
			}						
			else if(this.newPassword() == this.confirmPassword()) {				
				var callbacks = {
					success: resetPasswordSuccess2,
					error: resetPasswordError
				};
						 
				var resetPasswordModel = {};       
				resetPasswordModel.password = this.newPassword();             
				resetPasswordModel.confirmPassword = this.confirmPassword();
				resetPasswordModel.forgotPasswordRequestKey = that.key;
				return ES.loginService.resetPassword(resetPasswordModel, callbacks).then(resetPasswordSuccess);
			}
			else {
				that.passwordClass('validationerror');
				that.confirmPasswordClass('validationerror');				
				that.errorPassword('typeerrormsg');
				that.errorConfirmPassword('typeerrormsg'); 
				that.errorResetPassword('Passwords donot match');				
			}
    };
		
		function resetPasswordSuccess (data) {							
			that.changePasswordNotification('Your password has been updated');			
		}
		function resetPasswordSuccess2() {				
		}		
		function resetPasswordError(data, status, details){
			that.passwordClass('validationerror');
			that.confirmPasswordClass('validationerror');				
			that.errorPassword('typeerrormsg');
			that.errorConfirmPassword('typeerrormsg'); 
			that.errorResetPassword(details.message);			
		};		       
}
