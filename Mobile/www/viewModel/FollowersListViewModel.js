function FollowersListViewModel() {
  var self = this;
	self.template = 'followersListView';
	self.viewid = 'V-26';
	self.viewname = 'Followers';
	self.displayname = 'Followers';

  self.inputObs = [ 'channelId', 'channelName', 'invitesCount', 'declinesCount', 'followerCount'];
	self.defineObservables();	
  self.followers = ko.observableArray([]);
	  
	self.activate = function() {			
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));				
		if(!channelObject) {
			goToView('channelsIOwnView');			
		} else {				
			addExternalMarkup(self.template); // this is for header/overlay message	
			self.followers.removeAll();
			self.invitesCount(0);
			self.declinesCount(0);			
			self.followerCount('Followers (0)');								
			self.accountName(ENYM.ctx.getItem('accountName'));																		
			self.channelId(channelObject.channelId);
			self.channelName(channelObject.channelName);																						
			$.mobile.showPageLoadingMsg('a', 'Loading Followers');		
			return ES.channelService.getFollowers(self.channelId(), { success: successfulList, error: errorAPI });
		}
	};
	
	function successfulList(data){
    $.mobile.hidePageLoadingMsg();
		invites = declines = 0;
		$.each(data.followers, function(indexFollower, valueFollower) {
			if(valueFollower.relationship != 'O') {
				if(valueFollower.relationship == 'I') {
					invites == invites++;
				}
				else if(valueFollower.relationship == 'N') {
					declines == declines++;
				}
				else if(valueFollower.relationship == 'F') {
					var prov = '';
				}
				var evernymIcon = false;
				if(typeof valueFollower.firstname == 'undefined' && typeof valueFollower.lastname == 'undefined') {
					var name = '';
					var nameClass = 'noname';
				} 
				else if(typeof valueFollower.firstname == 'undefined') {
					var name = valueFollower.lastname;
					var nameClass = 'provisionalicon';				
				}
				else if(typeof valueFollower.lastname == 'undefined') {
					var name = valueFollower.firstname;
					var nameClass = 'provisionalicon';				
				}			
				else {
					var name = valueFollower.firstname +' '+ valueFollower.lastname;
					var nameClass = '';
				}
				if(valueFollower.managed == 'N') {
					var evernymIcon = true;
					var nameClass = '';
				}		
				self.followers.push({
					followerId: valueFollower.id,
					nameClass: nameClass,
					followerName: name,
					provClass: prov, 
					accountname: valueFollower.accountname,
					evernymIcon: evernymIcon
				});
			}
		});
		self.invitesCount(invites);
		self.declinesCount(declines);		
		if(self.followers().length == 1) {
			self.followerCount('Follower ('+self.followers().length+')');
		} else {
			self.followerCount('Followers ('+self.followers().length+')');
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