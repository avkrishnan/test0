/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelMenuViewModel() {
	var that = this;
	this.template = 'channelMenuView';
	this.viewid = 'V-04';
	this.viewname = 'ChannelMenu';
	this.displayname = 'Channel Menu';	
	this.accountName = ko.observable();
	
	/* Channel Menu observable */
	this.backView = ko.observable();
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
			that.backView(data.prevPage.attr('id'));
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
	
	this.menuHide = function() {
		backNavText.pop();
		backNavView.pop();
		goToView(that.backView());		
	}	
	
}