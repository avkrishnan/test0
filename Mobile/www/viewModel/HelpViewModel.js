/*globals ko*/
function HelpViewModel() {	
  var that = this;
	this.template = 'helpView';
	this.viewid = 'V-45';
	this.viewname = 'Help';
	this.displayname = 'Help and FAQs';	
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