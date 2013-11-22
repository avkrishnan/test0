/*globals ko*/
/* To do - Pradeep Kumar */
function ResetPasswordSuccessViewModel() {
	var that = this;
	this.template = 'resetPasswordSuccessView';
	this.viewid = 'V-03e';
	this.viewname = 'ResetPasswordSuccess';
	this.displayname = 'Reset password success';
	this.accountName = ko.observable();		
	
	/* Methods */				
	this.applyBindings = function(){
		$('#' + that.template).on('pagebeforeshow', function(e, data){																	
			that.activate();
		});
	};
		 
	this.activate = function(){
		var resetAccount = localStorage.getItem('resetAccount');		
		if(resetAccount == '' || resetAccount == null) {
			goToView('forgotPasswordView');
		} else {					
			that.accountName(localStorage.getItem("accountName"));
		}
	};
	
	this.okayResetCommand = function () {
		localStorage.removeItem('resetAccount');						
		goToView('loginView');
  };		       
}
