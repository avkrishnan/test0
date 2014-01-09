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
		self.followerCount(data.followers.length - 1);
		if(self.followerCount() == 1) {
			self.followerCount(self.followerCount() + ' follower');
		} else {
			self.followerCount(self.followerCount() + ' followers');
		}	
		$.each(data.followers, function(indexFollower, valueFollower) {
			if(typeof valueFollower.firstname == 'undefined' && typeof valueFollower.lastname == 'undefined') {
				var name = '';
				var nameClass = 'noname';
			} 
			else if(typeof valueFollower.firstname == 'undefined') {
				var name = valueFollower.lastname;
				var nameClass = '';				
			}
			else if(typeof valueFollower.lastname == 'undefined') {
				var name = valueFollower.firstname;
				var nameClass = '';				
			}			
			else {
				var name = valueFollower.firstname +' '+ valueFollower.lastname;
				var nameClass = '';
			}
			if(valueFollower.relationship != 'O') {
				self.followers.push({
					followerId: valueFollower.id,
					nameClass: nameClass,
					followerName: name, 
					accountname: valueFollower.accountname
				});
			}
		});
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