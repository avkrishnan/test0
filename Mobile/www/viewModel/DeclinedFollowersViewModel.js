function DeclinedFollowersViewModel() {
  var self = this;
	self.template = 'declinedFollowersView';
	self.viewid = 'V-??';
	self.viewname = 'Declined Followers';
	self.displayname = 'Declined Followers';
	
	self.evernymIcon = ko.observable(false);	
  self.inputObs = [ 'channelId', 'channelName', 'declinesCount'];
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
			self.declinesCount('');																										
			self.channelId(channelObject.channelId);
			self.channelName(channelObject.channelName);																						
			$.mobile.showPageLoadingMsg('a', 'Loading Declined Followers');		
			return ES.channelService.getFollowers(self.channelId(), { success: successfulList, error: errorAPI });
		}
	};
	
	function successfulList(data){
    $.mobile.hidePageLoadingMsg();
		$.each(data.followers, function(indexFollower, valueFollower) {
			if(valueFollower.relationship == 'D') {
				var evernymIcon = false;
				if(valueFollower.managed == 'N') {
					var nameClass = 'normalfollowers';
					var evernym = true
					var evernymIcon = true;
				}
				else {						
					var nameClass = 'provisionalicon noname';
					var evernym = false																			
				}
				if(typeof valueFollower.firstname == 'undefined' && typeof valueFollower.lastname == 'undefined') {
					if(valueFollower.managed == 'Y') {
						name = 'Guest';
					}
					else {
						name = '';
						nameClass = nameClass+' noname';
					}
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
					evernym: evernym,					
					evernymIcon: evernymIcon
				});
				self.declinesCount(self.followers().length);
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
		viewNavigate('Declined Followers', 'declinedFollowersView', 'followerDetailsView');
  };
}

DeclinedFollowersViewModel.prototype = new ENYM.ViewModel();
DeclinedFollowersViewModel.prototype.constructor = DeclinedFollowersViewModel;