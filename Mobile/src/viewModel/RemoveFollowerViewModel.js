function RemoveFollowerViewModel() {	
  var self = this;
	self.template = 'removeFollowerView';
	self.viewid = 'V-35a';
	self.viewname = 'Remove Follower';
	self.displayname = 'Remove Follower';
	
  self.inputObs = [ 'channelId', 'followerId', 'nameClass', 'followerName', 'fullnameClass', 'reachable', 'evernymIconClass' ];
  self.defineObservables();
	
	self.evernymIcon = ko.observable(false);
	self.evernym = ko.observable(false);
	
	self.activate = function() {
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));
		var followerObject = JSON.parse(ENYM.ctx.getItem('currentfollowerData'));
		if(!followerObject) {
			goToView('followersListView');
		} else {
			addExternalMarkup(self.template); // this is for header/overlay message
			self.channelId(channelObject.channelId);
			self.followerId(followerObject.followerId);
			self.evernymIcon(followerObject.evernymIcon);
			self.evernymIconClass(followerObject.evernymIconClass);
			self.nameClass(followerObject.nameClass);
			self.followerName(followerObject.followerName);
			self.fullnameClass(followerObject.fullnameClass);
			self.evernym(followerObject.evernym);			
			self.reachable(followerObject.reachable);
		}
	};

	function successfulDelete(args) {
    $.mobile.hidePageLoadingMsg();
		ES.channelService.getChannel(self.channelId(), {success: successfulGetChannel, error: errorAPI});
  };
	
	function successfulGetChannel(data) {		
		var channel = [];			
		channel.push({
			channelId: data.id, 
			channelName: data.name, 
			channelDescription: data.description,
			longDescription: data.longDescription,			
			followerCount: data.followers
		});
		channel = channel[0];		
		ENYM.ctx.setItem('currentChannelData', JSON.stringify(channel));
		var backText, backNav;
		for(var ctr = 0; ctr <= 1; ctr++) {
			backText = backNavText.pop();
			backNav = backNavView.pop();
		}
		var toastobj = {redirect: backNav, type: '', text: 'Follower removed'};
		showToast(toastobj);						
    	goToView(backNav);					
	}	

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);
  };
	
  self.removeFollowerCommand = function () {
		$.mobile.showPageLoadingMsg('a', 'Removing Follower');
		return ES.channelService.removeFollower(self.channelId(), self.followerId(), { success: successfulDelete, error: errorAPI });
		ENYM.ctx.removeItem('currentChannel');
		//goToView('followerDetailsView');
  };
}

RemoveFollowerViewModel.prototype = new ENYM.ViewModel();
RemoveFollowerViewModel.prototype.constructor = RemoveFollowerViewModel;