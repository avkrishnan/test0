function FollowersListViewModel() {
  var self = this;
	self.template = 'followersListView';
	self.viewid = 'V-26';
	self.viewname = 'Followers';
	self.displayname = 'Followers';

  self.inputObs = [ 'channelId', 'channelName', 'followerCount'];
	self.defineObservables();	
  self.followers = ko.observableArray([]);
	  
	self.activate = function() {			
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));				
		if(!channelObject) {
			goToView('channelsIOwnView');			
		} else {				
			addExternalMarkup(self.template); // this is for header/overlay message	
			self.followers.removeAll();
			self.followerCount('0 followers');								
			self.accountName(ENYM.ctx.getItem('accountName'));																		
			self.channelId(channelObject.channelId);
			self.channelName(channelObject.channelName);																						
			$.mobile.showPageLoadingMsg('a', 'Loading Followers');		
			return ES.channelService.getFollowers(self.channelId(), { success: successfulList, error: errorAPI });
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
			self.followerCount(followers);						
			if(data.followers[len].relationship == 'F') {
				self.followers.push({
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
	
	self.followerDetails = function (data) {
		ENYM.ctx.setItem('currentfollowerData', JSON.stringify(data));		
		viewNavigate('Followers', 'followersListView', 'followerDetailsView');
  };
}

FollowersListViewModel.prototype = new ENYM.ViewModel();
FollowersListViewModel.prototype.constructor = FollowersListViewModel;