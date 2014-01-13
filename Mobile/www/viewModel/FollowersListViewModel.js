function FollowersListViewModel() {
	var self = this;
	self.template = 'followersListView';
	self.viewid = 'V-26';
	self.viewname = 'Followers';
	self.displayname = 'Followers';
	
  self.inputObs = [ 'channelId', 'channelName', 'invitesCount', 'declinesCount', 'unreachCount', 'followerCount', 'countIsZero' ];
	self.defineObservables();
  self.followers = ko.observableArray([]);
	  
	self.activate = function() {
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));
		if(!channelObject) {
			goToView('channelsIOwnView');
		} else {				
			addExternalMarkup(self.template); // this is for header/overlay message	
			self.followers.removeAll();
			self.followerCount('Followers ()');
			self.accountName(ENYM.ctx.getItem('accountName'));
			self.channelId(channelObject.channelId);
			self.channelName(channelObject.channelName);
			self.countIsZero(false);
			$.mobile.showPageLoadingMsg('a', 'Loading Followers');
			return ES.channelService.getFollowers(self.channelId(), { success: successfulList, error: errorAPI });
		}
	};
	
	function successfulList(data){
    $.mobile.hidePageLoadingMsg();
		invites = declines = unreachs = 0;
		$.each(data.followers, function(indexFollower, valueFollower) {
			if(valueFollower.relationship != 'O') {
				var evernymIcon = false;
				if(valueFollower.relationship == 'I') {
					invites == invites++;
					var nameClass = 'provisionalicon';
				}
				else if(valueFollower.relationship == 'D') {
					declines == declines++;
					var nameClass = 'provisionalicon';
				}
				else if(valueFollower.relationship == 'U') {
					unreachs == unreachs++;
					var nameClass = 'normalfollowers';
				}				
				else if(valueFollower.relationship == 'F') {
					var nameClass = 'normalfollowers';
					var evernymIcon = true;
				}
				if(typeof valueFollower.firstname == 'undefined' && typeof valueFollower.lastname == 'undefined') {
					var name = '';
					nameClass = nameClass+' noname';
				} 
				else if(typeof valueFollower.firstname == 'undefined') {
					var name = valueFollower.lastname;
				}
				else if(typeof valueFollower.lastname == 'undefined') {
					var name = valueFollower.firstname;
				}			
				else {
					var name = valueFollower.firstname +' '+ valueFollower.lastname;
				}
				if(valueFollower.relationship != 'D') {	
					self.followers.push({
						followerId: valueFollower.id,
						nameClass: nameClass,
						followerName: name,
						accountname: valueFollower.accountname,
						evernymIcon: evernymIcon
					});
				}
			}
		});
		self.invitesCount(invites);
		self.declinesCount(declines);
		self.unreachCount(unreachs);
		if(self.invitesCount() != 0 || self.declinesCount() != 0 || self.unreachCount() != 0) {
			self.countIsZero(true);
		}
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