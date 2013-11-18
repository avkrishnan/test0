/*globals ko*/
/* To do - Pradeep Kumar */
function AddInviteFollowersViewModel() {	
  var that = this;
	this.template = 'addInviteFollowersView';
	this.viewid = 'V-27';
	this.viewname = 'AddInviteFollowers';
	this.displayname = 'Add/Invite Followers';	
	this.accountName = ko.observable();	
	this.backText = ko.observable();	
	
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
		var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));		
		if(token == '' || token == null) {
			goToView('loginView');
		} else if(!channelObject) {
			goToView('channelsIOwnView');			
		} else {
			that.accountName(localStorage.getItem('accountName'));
			that.backText('<em></em>'+backNavText[backNavText.length-1]);			
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));								
			that.channelName(channelObject.channelName);
			that.channelWebAddress(channelObject.channelName+'.evernym.dom');			
		}
	}
	
	this.backCommand = function () {
		popBackNav();
  };
	
	this.menuCommand = function () {
		pushBackNav('Add/Invite', 'addInviteFollowersView', 'channelMenuView');		
  };	
	
	this.channelSettings = function(){
		pushBackNav('Add/Invite', 'addInviteFollowersView', 'channelSettingsView');				
	};
	
	this.inviteFollowers = function(){
		showMessage('Feature coming soon!');
	};
	
	this.addFollowers = function(){
		showMessage('Feature coming soon!');
	};
	
	this.userSettings = function () {
		pushBackNav('Add/Invite', 'addInviteFollowersView', 'escalationPlansView');		
  };	
	
	this.composeCommand = function () {
		pushBackNav('Add/Invite', 'addInviteFollowersView', 'sendMessageView');		
  };	
	
}