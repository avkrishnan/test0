/*globals ko*/
/* To do - Pradeep Kumar */
function RemoveFollowerViewModel() {	
  var that = this;
	this.template = 'removeFollowerView';
	this.viewid = 'V-35a';
	this.viewname = 'RemoveFollower';
	this.displayname = 'Remove Follower';	
	this.accountName = ko.observable();		
	
  /* Channel delete observable */
	this.channelId = ko.observable();	
	this.followerId = ko.observable();	
	this.followerName = ko.observable();
	this.followerAccount = ko.observable();	
	this.toastText = ko.observable();							
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  
	
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));			
		var followerObject = JSON.parse(localStorage.getItem('currentfollowerData'));;		
		if(token == '' || token == null) {
			goToView('loginView');
		} else if(!followerObject) {
			goToView('followersListView');			
		} else {
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}			
			that.accountName(localStorage.getItem('accountName'));	
			that.channelId(channelObject.channelId);			
			that.followerId(followerObject.followerId);
			that.followerName(followerObject.followerName);			
			that.followerAccount(followerObject.accountname);										
			//that.counter(localStorage.getItem('counter'));			
		}
	}	
	
	this.menuCommand = function () {
		pushBackNav('Remove Follower', 'removeFollowerView', 'channelMenuView');		
  };	

	function successfulDelete(args) {
    $.mobile.hidePageLoadingMsg();
		/*for(var ctr = 1; ctr <= that.counter(); ctr++) {
			that.backCommand();		
		}
		localStorage.removeItem('counter')*/		
		that.toastText('Follower deleted');		
		localStorage.setItem('toastData', that.toastText());
		goToView('followersListView');		
  };

  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    localStorage.setItem('signUpError', response.message);
    goToView('removeFollowerView');
  };
	
  this.removeFollowerCommand = function () {
		$.mobile.showPageLoadingMsg('a', 'Removing Follower');
		return ES.channelService.removeFollower(that.channelId(), that.followerId(), { success: successfulDelete, error: errorAPI });
		localStorage.removeItem('currentChannel');
  };
	
	this.userSettings = function () {
		pushBackNav('Remove Follower', 'removeFollowerView', 'escalationPlansView');		
  };	
	
	this.composeCommand = function () {
		pushBackNav('Remove Follower', 'removeFollowerView', 'sendMessageView');		
  };	
	
}