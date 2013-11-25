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
		if(token == '' || token == null) {
			goToView('loginView');
		} else if(!channelObject) {
			goToView('channelsIOwnView');			
		} else {
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');												
			}			
			that.accountName(localStorage.getItem('accountName'));		
			that.backText('<em></em>'+backNavText[backNavText.length-1]);
			if(localStorage.getItem('counter') == 1) {
				localStorage.setItem('counter', 2);
			} else if(localStorage.getItem('counter') == 2){		
				localStorage.setItem('counter', 3);
			}	else {
				localStorage.setItem('counter', 1);
			}																
			that.channelId(channelObject.channelId);
			that.channelName(channelObject.channelName);																			
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
		that.followers.removeAll();			
		var len = 0;
		var follower = 0;		
		for(len; len<data.followers.length; len++) {			
			if(data.followers[len].relationship == 'F') {
				that.followers.push({
					followerId: data.followers[len].id,
					followerName: data.followers[len].firstname +' '+ data.followers[len].lastname, 
					accountname: data.followers[len].accountname
				});
			follower == follower++;				
			if(follower == 1) {
				var followers = follower +' follower';
			} else {
				var followers = follower +' followers';
			}				
			that.followerCount(followers);
			}
		}
	}; 
	
  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    localStorage.setItem('signUpError', response.message);
    goToView('followersListView');
  };
	
	this.followerDetails = function (data) {
		localStorage.setItem('currentfollowerData', JSON.stringify(data));		
		pushBackNav('Followers', 'followersListView', 'followerDetailsView');
  };	
	
	this.userSettings = function () {
		pushBackNav('Followers', 'followersListView', 'escalationPlansView');
  };	
	
	this.composeCommand = function () {
		pushBackNav('Followers', 'followersListView', 'sendMessageView');
  };	
	
}
