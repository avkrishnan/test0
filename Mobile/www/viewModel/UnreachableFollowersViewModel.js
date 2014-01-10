function InvitedFollowersViewModel() {
  var self = this;
	self.template = 'unreachableFollowersView';
	self.viewid = 'V-??';
	self.viewname = 'Unreachable Followers';
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
			self.unreachCount('0');																										
			self.channelId(channelObject.channelId);
			self.channelName(channelObject.channelName);																						
			$.mobile.showPageLoadingMsg('a', 'Loading Invited Followers');		
			return ES.channelService.getFollowers(self.channelId(), { success: successfulList, error: errorAPI });
		}
	};
	
	function successfulList(data){
    $.mobile.hidePageLoadingMsg();
		$.each(data.followers, function(indexFollower, valueFollower) {
			if(valueFollower.relationship == 'I') {		
				var evernymIcon = false;
				var nameClass = 'provisionalicon';
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
				self.followers.push({
					followerId: valueFollower.id,
					nameClass: nameClass,
					followerName: name, 
					accountname: valueFollower.accountname,
					evernymIcon: evernymIcon
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
		viewNavigate('Unreachable Followers', 'unreachableFollowersView', 'followerDetailsView');
  };
}

InvitedFollowersViewModel.prototype = new ENYM.ViewModel();
InvitedFollowersViewModel.prototype.constructor = InvitedFollowersViewModel;