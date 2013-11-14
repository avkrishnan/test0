/*globals ko*/
/* To do - Pradeep Kumar */
function AddInviteFollowersViewModel() {	
  var that = this;
	this.template = 'addInviteFollowersView';
	this.viewid = 'V-27';
	this.viewname = 'AddInviteFollowers';
	this.displayname = 'Add/Invite Followers';	
	this.accountName = ko.observable();	
	
  /* Add/Invite Followers observable */
	this.channelName = ko.observable();	
	this.channelWebAddress = ko.observable();			
	
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
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));								
			that.channelName(channelObject.channelName);
			that.channelWebAddress(channelObject.channelName+'.evernym.dom');			
		}
	}
	
	this.channelSettings = function(){
		goToView('channelSettingsView');
	};
	
	this.inviteFollowers = function(){
		showMessage('Feature coming soon!');
	};
	
	this.addFollowers = function(){
		showMessage('Feature coming soon!');
	};
	
}