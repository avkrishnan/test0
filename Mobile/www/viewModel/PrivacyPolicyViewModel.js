/*globals ko*/
function PrivacyPolicyViewModel() {
  var that = this;
  this.template = 'privacyPolicyView';
  this.viewid = 'V-49';
  this.viewname = 'PrivacyPolicy';
  this.displayname = 'Privacy Policy';
  this.hasfooter = true;
	this.accountName = ko.observable();	
	
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
		}
	}
}