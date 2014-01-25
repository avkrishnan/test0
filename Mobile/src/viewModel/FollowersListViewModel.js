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
		name = accountname = fullnameClass = '';		
		$.each(data.followers, function(indexFollower, valueFollower) {
			if(valueFollower.relationship != 'O') {
				if(valueFollower.relationship == 'I') {
					invites++;
				}
				else if(valueFollower.relationship == 'D') {
					declines++;
				}				
				if(valueFollower.relationship == 'F') {
					if(valueFollower.reachable == 'N' && valueFollower.managed == 'N') {
						unreachs++;
					}
					var visibleName = true				
					var evernymIcon = false;
					if(valueFollower.managed == 'N') {
						var nameClass = 'normalfollowers';
						var evernym = true
						var evernymIcon = true;
					} else {						
						var nameClass = 'provisionalicon noname';
						var evernym = false																			
					}
					if(typeof valueFollower.firstname == 'undefined' && typeof valueFollower.lastname == 'undefined') {
						if(valueFollower.managed == 'Y') {
							name = valueFollower.comMethods[0].address;
							visibleName = false;
						} else {
							name = '';
							nameClass = nameClass+' noname';
						}
						fullnameClass = '';
					} else if(typeof valueFollower.firstname == 'undefined') {
						name = valueFollower.lastname;
						fullnameClass = 'name';
					} else if(typeof valueFollower.lastname == 'undefined') {
						name = valueFollower.firstname;
						fullnameClass = 'name';
					}	else if(valueFollower.firstname == '' && valueFollower.lastname == '') {
						if(valueFollower.managed == 'Y') {
							name = valueFollower.comMethods[0].address;
							visibleName = false;
						} else {
							name = '';
							nameClass = nameClass+' noname';
						}
						fullnameClass = '';
					}
					else {
						name = valueFollower.firstname +' '+ valueFollower.lastname;
						fullnameClass = 'name';
					}
					if(valueFollower.reachable == 'N' && valueFollower.managed == 'N') {
						var nameClass = 'normalfollowers noverified';						
						reachable = 'Un-reachable Follower';
						var evernym = true;
						if(name == '' && valueFollower.managed == 'N') {
							name = valueFollower.accountname;
						}
					} else {
						reachable = valueFollower.accountname;					
					}
					var evernymIconClass = (evernymIcon == false)?'normalinvitation':'';				
					self.followers.push({
						followerId: valueFollower.id,
						nameClass: nameClass,
						visibleName: visibleName,
						followerName: name,
						fullnameClass: fullnameClass,
						accountname: valueFollower.accountname,
						reachable: reachable,
						evernym: evernym,
						evernymIcon: evernymIcon,
						evernymIconClass: evernymIconClass,
						type: valueFollower.managed
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
		var followers = (self.followers().length == 1)? 'Follower': 'Followers';
		self.followerCount(followers+' ('+self.followers().length+')');
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