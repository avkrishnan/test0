/*globals ko*/
/* To do - Pradeep Kumar */
function ChangePasswordSuccessViewModel() {
	var that = this;
	this.prototype = AppCtx.ViewModelProto;
	this.template = 'changePasswordSuccessView';
	this.viewid = 'V-44e';
	this.viewname = 'ChangePasswordSuccess';
	this.displayname = 'Change password success';
	
	/* Methods */				
	this.applyBindings = function(){
		$('#' + that.template).on('pagebeforeshow', function(e, data){																	
			that.activate();
		});
	};
		 
	this.activate = function(){
		var changePassword = localStorage.getItem('changePassword');
		if(changePassword == '' || changePassword == null) {
			goToView('changePasswordView');
		} else {					
			that.accountName(localStorage.getItem("accountName"));
		}
	};
	
	this.okayChangeCommand = function () {
		localStorage.removeItem('changePassword');
		popBackNav();								
  };		       
}
