/*globals ko*/
/* To do - Pradeep Kumar */
function ChangePasswordViewModel() {

  var self = this;

  self.template = 'changePasswordView';
  self.viewid = 'V-44';
  self.viewname = 'Change Password';
  self.displayname = 'Change Password';

  self.inputObs = [ 
    'currentPassword', 
    'newPassword', 
    'newConfirmPassword' ]; 
  
  self.errorObs = [ 
    'currentpasswordClass',
    'newpasswordClass', 
    'confirmpasswordClass', 
    'errorMessageCurrent', 
    'errorMessageNew',
    'errorMessageConfirm' ];

  $.each(self.allObs(), function(i,v) {self[v] = ko.observable();});

  self.toastText = ko.observable();
  

	/* Methods */
	
  self.activate = function () {
    self.clearForm();
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');  
		} 
		else {
			addExternalMarkup(self.template); // this is for header/overlay message			
			if(localStorage.getItem('toastData')) {
				self.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}			
			$('input').keyup(function () {
			  self.clearErrorObs();
			});			
			self.accountName(localStorage.getItem("accountName"));			
		}
  };
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'changePasswordView') {
			self.changePassword();
		}
	});
	
	self.menuCommand = function () {
		viewNavigate('Change password', 'changePasswordView', 'channelMenuView');		
  };	
	
  self.changePassword = function () {
		if(self.currentPassword() == '') {
			self.currentpasswordClass('validationerror');			
			self.errorMessageCurrent("Please input your current password!");
		}		
		else if(self.newPassword() == '') {
			self.newpasswordClass('validationerror');			
			self.errorMessageNew("Please input new password!");
		}
		else if(self.newConfirmPassword() == '') {
			self.confirmpasswordClass('validationerror');			
			self.errorMessageConfirm("Please input new confirm password!");
		}
		else if(self.newPassword() != self.newConfirmPassword()) {
			self.newpasswordClass('validationerror');				
			self.confirmpasswordClass('validationerror');			
			self.errorMessageConfirm("Password's don't match");
		}
		else {
      $.mobile.showPageLoadingMsg("a", "Sending change password request");			
			var passwordChangeRequest = {};
      passwordChangeRequest.currentPassword = self.currentPassword();
      passwordChangeRequest.newPassword = self.newPassword();				
			return ES.loginService.changePassword(passwordChangeRequest, { success: successfulChange, error: errorAPI });
		}
	};	

  function successfulChange(args) {
    $.mobile.hidePageLoadingMsg();
		localStorage.setItem('changePassword', self.newPassword());		
		goToView('changePasswordSuccessView');
  };

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		self.currentpasswordClass('validationerror');
		self.newpasswordClass('validationerror');
		self.confirmpasswordClass('validationerror');		
		self.errorMessageConfirm(details.message);		
  };		
	
}

ChangePasswordViewModel.prototype = new AppCtx.ViewModel();
