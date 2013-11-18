/*globals ko*/
/* To do - Pradeep Kumar */
function PrivacyPolicyViewModel() {
  var that = this;
  this.template = 'privacyPolicyView';
  this.viewid = 'V-49';
  this.viewname = 'PrivacyPolicy';
  this.displayname = 'Privacy Policy';
	this.accountName = ko.observable();	
	
	/* Privacy policy observable */
	this.hasfooter = ko.observable(false);
	this.hasheader = ko.observable(false);
	this.noheader = ko.observable(false);		
	
	/* Methods */
  this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  

	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			that.hasfooter(false);
			that.hasheader(false);
			that.noheader(true);			
		} else {
			that.accountName(localStorage.getItem('accountName'));
			that.hasfooter(true);
			that.hasheader(true);
			that.noheader(false);									
		}
	}
	
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