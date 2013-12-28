function FollowersListViewModel() {
  var that = this;
	this.template = 'followersListView';
	this.viewid = 'V-26';
	this.viewname = 'Followers';
	this.displayname = 'Followers';

  self.inputObs = [ 'channelId', 'channelName', 'followerCount'];
	self.defineObservables();	
  this.followers = ko.observableArray([]);
	  
	this.activate = function() {			
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));				
		if(!channelObject) {
			goToView('channelsIOwnView');			
		} else {				
			addExternalMarkup(that.template); // this is for header/overlay message	
			that.followers.removeAll();
			that.followerCount('0 followers');								
			that.accountName(ENYM.ctx.getItem('accountName'));		
			if(ENYM.ctx.getItem('counter') == 1) {
				ENYM.ctx.setItem('counter', 2);
			} else if(ENYM.ctx.getItem('counter') == 2){		
				ENYM.ctx.setItem('counter', 3);
			}	else {
				ENYM.ctx.setItem('counter', 1);
			}																
			that.channelId(channelObject.channelId);
			that.channelName(channelObject.channelName);																						
			$.mobile.showPageLoadingMsg('a', 'Loading Followers');		
			return ES.channelService.getFollowers(that.channelId(), { success: successfulList, error: errorAPI });
		}
	};	
	
	function successfulList(data){
    $.mobile.hidePageLoadingMsg();				
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
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);		
  };
	
	this.followerDetails = function (data) {
		ENYM.ctx.setItem('currentfollowerData', JSON.stringify(data));		
		viewNavigate('Followers', 'followersListView', 'followerDetailsView');
  };
}