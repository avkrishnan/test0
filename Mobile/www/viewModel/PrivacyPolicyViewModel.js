/*globals ko*/
function PrivacyPolicyViewModel() {
  var that = this;
  this.template = "privacyPolicyView";
  this.viewid = "V-49";
  this.viewname = "PrivacyPolicy";
  this.displayname = "Privacy Policy";
  this.hasfooter = true;
	this.accountName = ko.observable();	
	
	/* Methods */
  this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      if ($.mobile.pageData && $.mobile.pageData.a) {
        if ($.mobile.pageData.a == 'logout') {
          that.logoutCommand();
        }
      }
      that.activate();
    });	
	};  

	this.activate = function() {
		var _accountName = localStorage.getItem('accountName');
		that.accountName(_accountName);
	}
}