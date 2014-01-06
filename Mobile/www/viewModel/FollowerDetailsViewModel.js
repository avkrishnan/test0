function FollowerDetailsViewModel() {
  var self = this;
  self.template = 'followerDetailsView';
  self.viewid = 'V-35';
  self.viewname = 'Follower Details';
  self.displayname = 'Follower Details';
	
  self.inputObs = [ 'channelName', 'followerName', 'followerEvernym', 'followerEmail', 'followerPhone' ]; 
  self.defineObservables();
	self.visibleName = ko.observable(true);
	self.visibleEvernym = ko.observable(true);	
	self.visibleEmail = ko.observable(true);
	self.visiblePhone = ko.observable(true);		

	self.activate = function() {
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));		
		var followerObject = JSON.parse(ENYM.ctx.getItem('currentfollowerData'));		
		if(!channelObject) {
			goToView('followersListView');							
		} else {
			addExternalMarkup(self.template); // this is for header/overlay message
			self.channelName(channelObject.channelName);
			self.followerName(followerObject.followerName);
			self.followerEvernym(followerObject.accountname);
			self.followerEmail(followerObject.followerEmail);
			self.followerPhone(followerObject.followerPhone);																			
		}
	};
	
}

FollowerDetailsViewModel.prototype = new ENYM.ViewModel();
FollowerDetailsViewModel.prototype.constructor = FollowerDetailsViewModel;