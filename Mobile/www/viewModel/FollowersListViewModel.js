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
			addExternalMarkup(that.template); // this is for header/overlay message			
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));				
				showToast();
				localStorage.removeItem('toastData');				
			}			
			that.accountName(localStorage.getItem('accountName'));		
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
	
	function successfulList(data){
    $.mobile.hidePageLoadingMsg();
		that.followers.removeAll();				
		for(var len = 0; len<data.followers.length; len++) {
			var follower = data.followers.length-1;				
			if(follower == 1) {
				var followers = follower +' follower';
			} else {
				var followers = follower +' followers';
			}				
			that.followerCount(followers);						
			if(data.followers[len].relationship == 'F') {
				that.followers.push({
					followerId: data.followers[len].id,
					followerName: data.followers[len].firstname +' '+ data.followers[len].lastname, 
					accountname: data.followers[len].accountname
				});
			}
		}
	}; 
	
  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		that.toastText(details.message);		
		showToast();		
  };
	
	this.followerDetails = function (data) {
		localStorage.setItem('currentfollowerData', JSON.stringify(data));		
		viewNavigate('Followers', 'followersListView', 'followerDetailsView');
  };		
	
}
