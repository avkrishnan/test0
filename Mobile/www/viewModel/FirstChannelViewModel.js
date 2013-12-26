/*globals ko*/
/* To do - Pradeep Kumar */
function FirstChannelViewModel() {
	var that = this;
	this.template = 'firstChannelView';
	this.viewid = 'V-14';
	this.viewname = 'FollowFirstChannel';
	this.displayname = 'Follow First Channel';
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
	};	
	
}