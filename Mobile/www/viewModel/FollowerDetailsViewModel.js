/*globals ko*/
/* To do - Pradeep Kumar */
function FollowerDetailsViewModel() {
  var that = this;
  this.template = 'followerDetailsView';
  this.viewid = 'V-35';
  this.viewname = 'FollowerDetails';
  this.displayname = 'Follower Details';
	this.accountName = ko.observable();	
	
  /* Follower observable */	
	this.channelName = ko.observable();			
	this.followerName = ko.observable();
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
		var followerObject = JSON.parse(localStorage.getItem('currentfollowerData'));		
		if(token == '' || token == null) {
			goToView('loginView');
		} else if(!channelObject) {
			goToView('followersListView');							
		} else {
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}			
			that.accountName(localStorage.getItem('accountName'));
			that.channelName(channelObject.channelName);										
			that.followerName(followerObject.followerName+' <em>'+followerObject.accountname+'</em>');												
		}
	}
	
	this.menuCommand = function () {
		pushBackNav('Follower Details', 'followerDetailsView', 'channelMenuView');		
  };
	
	this.removeFollower = function (data) {
		goToView('removeFollowerView');		
  };	
	
	this.userSettings = function () {
		pushBackNav('Follower Details', 'followerDetailsView', 'escalationPlansView');
  };
	
	this.composeCommand = function () {
		pushBackNav('Follower Details', 'followerDetailsView', 'sendMessageView');			
  };			
	
}