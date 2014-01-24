function FollowerDetailsViewModel() {
  var self = this;
  self.template = 'followerDetailsView';
  self.viewid = 'V-35';
  self.viewname = 'Follower Details';
  self.displayname = 'Follower Details';
	
	self.followerCommethods = ko.observable([]);
  self.inputObs = [ 'channelName', 'nameClass', 'followerName', 'fullnameClass', 'reachable', 'followerEvernym', 'evernymType' ];
  self.defineObservables();
	
	self.evernymIcon = ko.observable(false);	
	self.visibleEvernym = ko.observable(true);
	self.visibleName = ko.observable(false);
	self.evernym = ko.observable(false);			

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
			self.evernymType(false);
			self.followerCommethods([]);
			self.visibleName(followerObject.visibleName);
			self.evernym(followerObject.evernym);			
			self.reachable(followerObject.reachable);		
			if(followerObject.visibleName == true) {
				if(typeof followerObject.followerName == 'undefined' || followerObject.followerName == '') {
					self.followerName(followerObject.accountname);
				} else {
					self.followerName(followerObject.followerName);
				}
			}
			self.fullnameClass(followerObject.fullnameClass);
			if(followerObject.type == 'Y') {
				self.evernymType(true);
			}
		}
		if(followerObject.evernymIcon == false) {
			$.when(ES.commethodService.getCommethodsForProvis(followerObject.accountname).then(function(data) {
				self.followerCommethods(data.commethod);
			}));
		}
	};
}

FollowerDetailsViewModel.prototype = new ENYM.ViewModel();
FollowerDetailsViewModel.prototype.constructor = FollowerDetailsViewModel;