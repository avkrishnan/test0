function UnreachableFollowersViewModel() {
  var self = this;
	self.template = 'unreachableFollowersView';
	self.viewid = 'V-??';
	self.viewname = 'Unreachable';
	self.displayname = 'Unreachable Followers';
	
	self.evernymIcon = ko.observable(false);	
  self.inputObs = [ 'channelId', 'channelName', 'unreachCount'];
	self.defineObservables();	
  self.followers = ko.observableArray([]);
	  
	self.activate = function() {			
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));				
		if(!channelObject) {
			goToView('channelsIOwnView');			
		} else {				
			addExternalMarkup(self.template); // this is for header/overlay message
			self.evernymIcon(false);
			self.followers.removeAll();
			self.unreachCount('');																										
			self.channelId(channelObject.channelId);
			self.channelName(channelObject.channelName);																						
			$.mobile.showPageLoadingMsg('a', 'Loading Invited Followers');		
			return ES.channelService.getFollowers(self.channelId(), { success: successfulList, error: errorAPI });
		}
	};
	
	function successfulList(data){
    $.mobile.hidePageLoadingMsg();
		name = '';
		$.each(data.followers, function(indexFollower, valueFollower) {
			if(valueFollower.reachable == 'N' && valueFollower.relationship == 'F') {
				var visibleName = true;		
				var evernymIcon = false;
				var nameClass = 'normalfollowers noverified';				
				if(valueFollower.managed == 'N') {
					var evernymIcon = true;
				}
				if(typeof valueFollower.firstname == 'undefined' && typeof valueFollower.lastname == 'undefined') {
					if(valueFollower.managed == 'Y') {
						name = valueFollower.comMethods[0].address;
						visibleName = false;
					}
					else {
						if(valueFollower.reachable == 'N') {
							name = valueFollower.accountname;
						}						
					}
				} 
				else if(typeof valueFollower.firstname == 'undefined') {
					name = valueFollower.lastname;				
				}
				else if(typeof valueFollower.lastname == 'undefined') {
					name = valueFollower.firstname;			
				}	else if(valueFollower.firstname == '' && valueFollower.lastname == '') {
					if(valueFollower.managed == 'Y') {
						name = valueFollower.comMethods[0].address;
						visibleName = false;
					} else {
						name = valueFollower.accountname;
					}
				}						
				else {
					name = valueFollower.firstname +' '+ valueFollower.lastname;
				}			
				self.followers.push({
					followerId: valueFollower.id,
					nameClass: nameClass,
					visibleName: visibleName,
					followerName: name, 
					accountname: valueFollower.accountname,
					reachable: 'Un-reachable Follower',
					evernym: true,					
					evernymIcon: evernymIcon,
					type: valueFollower.managed
				});
				self.unreachCount(self.followers().length);
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
		viewNavigate('Unreachable', 'unreachableFollowersView', 'followerDetailsView');
  };
}

UnreachableFollowersViewModel.prototype = new ENYM.ViewModel();
UnreachableFollowersViewModel.prototype.constructor = UnreachableFollowersViewModel;