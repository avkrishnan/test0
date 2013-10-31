/*globals ko*/

function AboutEvernymViewModel() {	
  var that = this;
	this.template = 'aboutEvernymView';
	this.viewid = 'V-46';
	this.viewname = 'AboutEvernym';
	this.displayname = 'About Evernym Channels';	
	this.hasfooter = true;    
	this.channels = ko.observableArray([]);
	this.accountName = ko.observable();	
	this.notification = ko.observable();
	
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
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			var _accountName = localStorage.getItem('accountName');
			that.accountName(_accountName);
		}
	}
}