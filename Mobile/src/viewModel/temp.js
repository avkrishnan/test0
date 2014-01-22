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
		var tempName = [];
		invites = declines = unreachs = 0;
		name = nameClass = evernymIcon = evernym = '';		
		$.each(data.followers, function(indexFollower, valueFollower) {
			if(valueFollower.relationship != 'O') {
				if(valueFollower.relationship == 'I') {
					invites == invites++;
				}
				else if(valueFollower.relationship == 'D') {
					declines == declines++;
				}
				else if(valueFollower.relationship == 'U') {
					unreachs == unreachs++;
				}				
				if(valueFollower.relationship == 'F') {
					evernymIcon = false;
					if(valueFollower.managed == 'N') {
						nameClass = 'normalfollowers';
						evernym = true
						evernymIcon = true;
					}
					else {						
						nameClass = 'provisionalicon noname';
						evernym = false																			
					}
					if(typeof valueFollower.firstname == 'undefined' && typeof valueFollower.lastname == 'undefined') {
						if(valueFollower.managed == 'Y') {
							$.mobile.showPageLoadingMsg('a', 'Loading Invited Guests');
							$.when(ES.commethodService.getCommethodsForProvis(valueFollower.accountname).then(function(data) {
								//name = data.commethod[0].address;
								alert(JSON.stringify(data));
								tempName.push({
									followerId: valueFollower.id,
									nameClass: nameClass,
									followerName: data.commethod[0].address,
									accountname: valueFollower.accountname,
									evernym: evernym,
									evernymIcon: evernymIcon,
									type:valueFollower.managed									
								});
								self.followers.push(tempName); 
							}));
							return true;							
							//name = 'Guest';
						}
						else {
							name = '';
							nameClass = nameClass+' noname';
						}
					} 
					else if(typeof valueFollower.firstname == 'undefined') {
						name = valueFollower.lastname;
					}
					else if(typeof valueFollower.lastname == 'undefined') {
						name = valueFollower.firstname;
					}			
					else {
						name = valueFollower.firstname +' '+ valueFollower.lastname;
					}	
					self.followers.push({
						followerId: valueFollower.id,
						nameClass: nameClass,
						followerName: name,
						accountname: valueFollower.accountname,
						evernym: evernym,
						evernymIcon: evernymIcon,
						type:valueFollower.managed
					});
				}
			}
		});
		//alert(JSON.stringify(self.followers()));
		//alert(JSON.stringify(tempName));
		
		//alert(JSON.stringify(tempName));
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