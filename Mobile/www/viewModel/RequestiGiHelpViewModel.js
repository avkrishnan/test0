/*globals ko*/
/* To do - Pradeep Kumar */
function RequestiGiHelpViewModel() {
  var that = this;
  this.template = 'requestiGiHelpView';
  this.viewid = 'V-20b';
  this.viewname = 'RequestiGiHelp';
  this.displayname = 'Request iGi help';
	this.accountName = ko.observable();	
	
	/* Request iGi help observable */
	this.toastText = ko.observable();			
	
	/* Methods */
  this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  

	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');					
		} else {
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}			
			that.accountName(localStorage.getItem('accountName'));									
		}
	}
	
	this.menuCommand = function () {
		pushBackNav('Request iGi help', 'escalateHelpView', 'channelMenuView');		
  };
	
	this.userSettings = function () {
		pushBackNav('Request iGi help', 'escalateHelpView', 'escalationPlansView');
  };		
	
}