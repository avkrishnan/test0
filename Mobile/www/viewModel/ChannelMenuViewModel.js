/*globals ko*/
function ChannelMenuViewModel() {
	var that = this;
	this.template = 'channelMenuView';
	this.viewid = 'V-04';
	this.viewname = 'ChannelMenu';
	this.displayname = 'Channel Menu';	
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