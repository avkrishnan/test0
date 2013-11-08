/*globals ko*/
function ForgotPasswordSuccessViewModel() {
  var that = this;
  this.template = 'forgotPasswordSuccessView';
  this.viewid = 'V-03b';
  this.viewname = 'ForgotPasswordSuccess';
  this.displayname = 'Forgot Password Success';
	
	/* Forgot password success observable */
  this.resetAccount = ko.observable();	
	
	/* Methods */
  this.applyBindings = function () {
    $('#' + that.template).on('pagebeforeshow', null, function (e, data) {
      that.activate();					
    });
  };
	
  this.activate = function () {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {		
			that.resetAccount(localStorage.getItem('resetAccount'));		
			$(document).keyup(function (e) {
				if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'forgotPasswordSuccessView') {
					that.okayCommand();
				}
			});
		} else {
			goToView('channelListView');
		}		
  };

  this.okayCommand = function () {		
		goToView('loginView');
  };
}