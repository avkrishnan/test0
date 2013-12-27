function ChangePasswordSuccessViewModel() {
  var self = this;
	
	self.template = 'changePasswordSuccessView';
	self.viewid = 'V-44e';
	self.viewname = 'ChangePasswordSuccess';
	self.displayname = 'Change password success';
		 
	self.activate = function() {
		var changePassword = appCtx.getItem('changePassword');
		if(changePassword == '' || changePassword == null) {
			goToView('changePasswordView');
		}
	};
	
	self.okayChangeCommand = function () {
		appCtx.removeItem('changePassword');
		popBackNav();								
  };		       
}

ChangePasswordSuccessViewModel.prototype = new ENYM.ViewModel();
ChangePasswordSuccessViewModel.prototype.constructor = ChangePasswordSuccessViewModel;