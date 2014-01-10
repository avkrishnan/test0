function FollowerDetailsViewModel() {
  var self = this;
  self.template = 'followerDetailsView';
  self.viewid = 'V-35';
  self.viewname = 'Follower Details';
  self.displayname = 'Follower Details';
	
  self.inputObs = [ 'channelName', 'nameClass', 'followerName', 'followerEvernym', 'followerEmail', 'followerPhone' ];
  self.defineObservables();
	
	self.evernymIcon = ko.observable(false);	
	self.visibleName = ko.observable(true);
	self.visibleEvernym = ko.observable(true);		

	self.activate = function() {
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));		
		var followerObject = JSON.parse(ENYM.ctx.getItem('currentfollowerData'));
		if(!channelObject) {
			goToView('followersListView');							
		} else {
			addExternalMarkup(self.template); // this is for header/overlay message
			self.channelName(channelObject.channelName);
			self.evernymIcon(followerObject.evernymIcon);
			self.nameClass(followerObject.nameClass);
			if(typeof followerObject.followerName == 'undefined' || followerObject.followerName == '') {
				self.visibleName(false);
			} else {
				self.visibleName(true);
				self.followerName(followerObject.followerName);
			}
			if(typeof followerObject.accountname == 'undefined' || followerObject.accountname == '') {
				self.visibleEvernym(false);
			} else {
				self.visibleEvernym(true);
				self.followerEvernym(followerObject.accountname);
			}
		}
		if(followerObject.followerId != '') {
			$.when(ES.channelService.getFollower(followerObject.followerId).then(self.initializeFollowerDetails()));
		}
	};
	
	self.initializeFollowerDetails = function() {
		//alert('here');
	}
}

FollowerDetailsViewModel.prototype = new ENYM.ViewModel();
FollowerDetailsViewModel.prototype.constructor = FollowerDetailsViewModel;