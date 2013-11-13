/*globals ko*/
/* To do - Pradeep Kumar */
function FollowersListViewModel() {	
  var that = this;
	this.template = 'followersListView';
	this.viewid = 'V-26';
	this.viewname = 'Followers';
	this.displayname = 'Followers';	 
	this.accountName = ko.observable();	
	
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
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			that.accountName(localStorage.getItem('accountName'));			
			that.followers.removeAll();	
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));								
			that.channelId(channelObject.channelId);
			that.channelName(channelObject.channelName);
			that.followerCount(channelObject.followerCount);															
			$.mobile.showPageLoadingMsg('a', 'Loading Followers');				
			return ES.channelService.getFollowers(that.channelId(), { success: successfulList, error: errorAPI });
		}
	}
	
	this.channelSettings = function(){
		goToView('channelSettingsView');
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
	
}
