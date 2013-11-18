/*globals ko*/
/* To do - Pradeep Kumar */
function FollowersListViewModel() {	
  var that = this;
	this.template = 'followersListView';
	this.viewid = 'V-26';
	this.viewname = 'Followers';
	this.displayname = 'Followers';	 
	this.accountName = ko.observable();
	this.backText = ko.observable();		
	
  /* Followers observable */
	this.channelId = ko.observable();	
	this.channelName = ko.observable();			
  this.followers = ko.observableArray([]);
	this.followerCount = ko.observable();
	this.followerName = ko.observable();	
	
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
			that.followers.removeAll();									
			that.channelId(channelObject.channelId);
			that.channelName(channelObject.channelName);
			that.followerCount(channelObject.followerCount);																			
			$.mobile.showPageLoadingMsg('a', 'Loading Followers');		
			return ES.channelService.getFollowers(that.channelId(), { success: successfulList, error: errorAPI });
		}
	}
	
	this.backCommand = function () {
		popBackNav();
  };

	this.menuCommand = function () {
		pushBackNav('Followers', 'followersListView', 'channelMenuView');
  };		
	
	this.channelSettings = function(){
		pushBackNav('Followers', 'followersListView', 'channelSettingsView');				
	};
	
	this.addInviteFollowers = function(){
		pushBackNav('Followers', 'followersListView', 'addInviteFollowersView');				
	};	
	
	function successfulList(data){
    $.mobile.hidePageLoadingMsg();
		var len = 0;
		for(len; len<data.followers.length; len++) {
			if(data.followers[len].relationship == 'F') {
				that.followers.push({
					followerName: data.followers[len].firstname +' '+ data.followers[len].lastname, 
					accountname: data.followers[len].accountname
				});
			}
		}
	}; 
	
  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    localStorage.setItem('signUpError', response.message);
    goToView('followersListView');
  };
	
	this.userSettings = function () {
		pushBackNav('Followers', 'followersListView', 'escalationPlansView');
  };	
	
	this.composeCommand = function () {
		pushBackNav('Followers', 'followersListView', 'sendMessageView');
  };	
	
}
