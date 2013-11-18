/*globals ko*/
/* To do - Pradeep Kumar */
function PrivacyPolicyViewModel() {
  var that = this;
  this.template = 'privacyPolicyView';
  this.viewid = 'V-49';
  this.viewname = 'PrivacyPolicy';
  this.displayname = 'Privacy Policy';
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
		pushBackNav('Settings', 'privacyPolicyView', 'channelMenuView');		
  };
	
	this.userSettings = function () {
		pushBackNav('Settings', 'privacyPolicyView', 'escalationPlansView');
  };	

	this.composeCommand = function () {
		pushBackNav('Settings', 'privacyPolicyView', 'sendMessageView');
  };	
	
}