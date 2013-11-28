/*globals ko*/
/* To do - Pradeep Kumar */
function HelpViewModel() {	
  var that = this;
	this.template = 'helpView';
	this.viewid = 'V-45';
	this.viewname = 'Help';
	this.displayname = 'Help and FAQs';	
	this.accountName = ko.observable();
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
			addExternalMarkup(that.template); // this is for header/overlay message			
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}			
			that.accountName(localStorage.getItem('accountName'));			
		}
	}
	
	this.menuCommand = function () {
		viewNavigate('Help', 'helpView', 'channelMenuView');
  };
	
	this.userSettings = function () {
		viewNavigate('Help', 'helpView', 'escalationPlansView');
  };	

	this.composeCommand = function () {
		viewNavigate('Help', 'helpView', 'sendMessageView');
  };	
	
}