function FollowerDetailsViewModel() {
  var self = this;
  self.template = 'followerDetailsView';
  self.viewid = 'V-35';
  self.viewname = 'Follower Details';
  self.displayname = 'Follower Details';
	
  self.inputObs = [ 'channelName', 'followerName' ]; 
  //self.errorObs = [ 'currentpasswordClass', 'newpasswordClass', 'confirmpasswordClass', 'errorMessageCurrent', 'errorMessageNew', 'errorMessageConfirm' ];
  self.defineObservables();	

	self.activate = function() {
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));		
		var followerObject = JSON.parse(ENYM.ctx.getItem('currentfollowerData'));		
		if(!channelObject) {
			goToView('followersListView');							
		} else {
			addExternalMarkup(self.template); // this is for header/overlay message
			self.channelName(channelObject.channelName);										
			self.followerName(followerObject.followerName+' <em>'+followerObject.accountname+'</em>');												
		}
	};
}

FollowerDetailsViewModel.prototype = new ENYM.ViewModel();
FollowerDetailsViewModel.prototype.constructor = FollowerDetailsViewModel;