/*globals ko*/
/* To do - Pradeep Kumar */
function HelpViewModel() {	
  var that = this;
	this.template = 'helpView';
	this.viewid = 'V-45';
	this.viewname = 'Help';
	this.displayname = 'Help and FAQs';	
	this.accountName = ko.observable();	
	this.backText = ko.observable();	
	
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
			that.accountName(localStorage.getItem('accountName'));
			that.backText('<em></em>'+backNavText[backNavText.length-1]);			
		}
	}
	

	this.backCommand = function () {
		popBackNav();
  };
	
	this.menuCommand = function () {
		pushBackNav('Help', 'helpView', 'channelMenuView');
  };
	
	this.userSettings = function () {
		pushBackNav('Help', 'helpView', 'escalationPlansView');
  };	

	this.composeCommand = function () {
		pushBackNav('Help', 'helpView', 'sendMessageView');
  };	
	
}