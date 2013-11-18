/*globals ko*/
/* To do - Pradeep Kumar */
function ChangePasswordViewModel() {
  var that = this;
  this.template = 'changePasswordView';
  this.viewid = 'V-03';
  this.viewname = 'ChangePassword';
  this.displayname = 'Change Password';
	
  this.accountName = ko.observable();	
	this.newPassword = ko.observable();
	this.newConfirmPassword = ko.observable();
	this.errorMessageNew = ko.observable();
	this.errorMessageConfirm = ko.observable();
	
	/* Methods */
  this.applyBindings = function () {
    $('#' + that.template).on('pagebeforeshow', null, function (e, data) {     
			that.newPassword('');
			that.newConfirmPassword('');
			that.activate();	
    });
		$('#changePasswordView input').on("keyup", that.inputKeyUp);
  };
	
	this.inputKeyUp = function () {
		that.errorMessageNew('');
		that.errorMessageConfirm('');
	}	
	
  this.activate = function () {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			that.accountName(localStorage.getItem("accountName"));  
		} 
		else {
			//goToView('loginView');
			that.accountName(localStorage.getItem("accountName"));
		}
  };
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'changePasswordView') {
			that.changePassword();
		}
	});
	
  this.changePassword = function () {
		if(that.newPassword() == '') {
			that.errorMessageNew("Please input new password!");
		}
		else if(that.newConfirmPassword() == '') {
			that.errorMessageConfirm("Please input new confirm password!");
		}
		else if(that.newPassword() != that.newConfirmPassword()) {
			that.errorMessageConfirm("Password's don't match");
		}
		else {
			alert('matching');
			return api.callAPI('PUT', '/account/forgot', resetPasswordModel, callbacks);
		}
	};
	
}