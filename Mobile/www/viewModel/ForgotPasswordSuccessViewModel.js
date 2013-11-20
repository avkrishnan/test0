/*globals ko*/
/* To do - Pradeep Kumar */
function ForgotPasswordSuccessViewModel() {
  var that = this;
  this.template = 'forgotPasswordSuccessView';
  this.viewid = 'V-03b';
  this.viewname = 'ForgotPasswordSuccess';
  this.displayname = 'Forgot Password Success';
	
	/* Methods */
  this.applyBindings = function () {
    $('#' + that.template).on('pagebeforeshow', null, function (e, data) {
      that.activate();					
    });
  };
	
  this.activate = function () {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {				
		} else {
			goToView('channelListView');
		}		
  };

  this.okayCommand = function () {		
		goToView('loginView');
  };
	
}