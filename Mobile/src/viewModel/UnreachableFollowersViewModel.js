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
		name = fullnameClass = '';
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
					fullnameClass = '';
				} 
				else if(typeof valueFollower.firstname == 'undefined') {
					name = valueFollower.lastname;
					fullnameClass = 'name';				
				}
				else if(typeof valueFollower.lastname == 'undefined') {
					name = valueFollower.firstname;
					fullnameClass = 'name';			
				}	else if(valueFollower.firstname == '' && valueFollower.lastname == '') {
					if(valueFollower.managed == 'Y') {
						name = valueFollower.comMethods[0].address;
						visibleName = false;
					} else {
						name = valueFollower.accountname;
					}
					fullnameClass = '';
				}						
				else {
					name = valueFollower.firstname +' '+ valueFollower.lastname;
					fullnameClass = 'name';
				}
				var evernymIconClass = (evernymIcon == false)?'normalinvitation':'';			
				self.followers.push({
					followerId: valueFollower.id,
					nameClass: nameClass,
					visibleName: visibleName,
					followerName: name,
					fullnameClass: fullnameClass, 
					accountname: valueFollower.accountname,
					reachable: 'Un-reachable Follower',
					evernym: true,					
					evernymIcon: evernymIcon,
					evernymIconClass: evernymIconClass,
					type: valueFollower.managed
				});
				self.unreachCount(self.followers().length);
				ENYM.ctx.setItem('lastStatus', self.followers().length);
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