/*globals ko*/
/* To do - Pradeep Kumar */
function ChangePasswordViewModel() {
  var that = this;
  this.template = 'changePasswordView';
  this.viewid = 'V-44';
  this.viewname = 'Change Password';
  this.displayname = 'Change Password';
  this.accountName = ko.observable();	
		
	this.currentPassword = ko.observable();	
	this.newPassword = ko.observable();
	this.newConfirmPassword = ko.observable();
	this.currentpasswordClass = ko.observable();
	this.newpasswordClass = ko.observable();
	this.confirmpasswordClass = ko.observable();			
	this.errorMessageCurrent = ko.observable();	
	this.errorMessageNew = ko.observable();
	this.errorMessageConfirm = ko.observable();
	
	/* Methods */
  this.applyBindings = function () {
    $('#' + that.template).on('pagebeforeshow', null, function (e, data) {
      that.clearForm();			     
			that.activate();	
    });
  };
	
	this.clearForm = function () {
		that.currentPassword('');		
		that.newPassword('');
		that.newConfirmPassword('');
		that.currentpasswordClass('');
		that.newpasswordClass('');
		that.confirmpasswordClass('');		
		that.errorMessageCurrent('');	
		that.errorMessageNew('');
		that.errorMessageConfirm('');
  };
	
  this.activate = function () {
		if(authenticate()) {
			addExternalMarkup(that.template); // this is for header/overlay message					
			$('input').keyup(function () {
				that.currentpasswordClass('');
				that.newpasswordClass('');
				that.confirmpasswordClass('');		
				that.errorMessageCurrent('');	
				that.errorMessageNew('');
				that.errorMessageConfirm('');				
			});			
			that.accountName(localStorage.getItem("accountName"));			
		}
  };
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'changePasswordView') {
			that.changePassword();
		}
	});
	
	this.menuCommand = function () {
		viewNavigate('Change password', 'changePasswordView', 'channelMenuView');		
  };	
	
  this.changePassword = function () {
		if(that.currentPassword() == '') {
			that.currentpasswordClass('validationerror');			
			that.errorMessageCurrent("Please input your current password!");
		}		
		else if(that.newPassword() == '') {
			that.newpasswordClass('validationerror');			
			that.errorMessageNew("Please input new password!");
		}
		else if(that.newConfirmPassword() == '') {
			that.confirmpasswordClass('validationerror');			
			that.errorMessageConfirm("Please input new confirm password!");
		}
		else if(that.newPassword() != that.newConfirmPassword()) {
			that.newpasswordClass('validationerror');				
			that.confirmpasswordClass('validationerror');			
			that.errorMessageConfirm("Password's don't match");
		}
		else {
      $.mobile.showPageLoadingMsg("a", "Sending change password request");			
			var passwordChangeRequest = {};
      passwordChangeRequest.currentPassword = that.currentPassword();
      passwordChangeRequest.newPassword = that.newPassword();				
			return ES.loginService.changePassword(passwordChangeRequest, { success: successfulChange, error: errorAPI });
		}
	};	

  function successfulChange(args) {
    $.mobile.hidePageLoadingMsg();
		localStorage.setItem('changePassword', that.newPassword());				
		goToView('changePasswordSuccessView');
  };

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		that.currentpasswordClass('validationerror');
		that.newpasswordClass('validationerror');
		that.confirmpasswordClass('validationerror');		
		that.errorMessageConfirm(details.message);		
  };		
	
}