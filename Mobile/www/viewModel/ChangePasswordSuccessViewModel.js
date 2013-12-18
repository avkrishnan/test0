/*globals ko*/
/* To do - Pradeep Kumar */
function ChangePasswordSuccessViewModel() {

  var self = this;
	
	self.template = 'changePasswordSuccessView';
	self.viewid = 'V-44e';
	self.viewname = 'ChangePasswordSuccess';
	self.displayname = 'Change password success';
	
	/* Methods */				
	self.applyBindings = function(){
		$('#' + self.template).on('pagebeforeshow', function(e, data){																	
			self.activate();
		});
	};
		 
	self.activate = function(){
		var changePassword = localStorage.getItem('changePassword');
		if(changePassword == '' || changePassword == null) {
			goToView('changePasswordView');
		} else {					
			self.accountName(localStorage.getItem("accountName"));
		}
	};
	
	self.okayChangeCommand = function () {
		localStorage.removeItem('changePassword');
		popBackNav();								
  };		       
}

ChangePasswordSuccessViewModel.prototype = new AppCtx.ViewModel();
