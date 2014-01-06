function ChannelViewModel() {
	var self = this;
	self.requiresAuth = false;
	self.template = "channelView";
	self.viewid = "V-18";
	self.viewname = "Landing Page";
	self.displayname = "Channel Landing Page";	
	
	self.hasfooter = ko.observable(false);
	self.hasheader = ko.observable(false);
	self.settings = ko.observable(true);	
	
  self.inputObs = [
    'title',
		'channelAction',
    'channelId', 
    'description', 
    'longdescription', 
    'moreText',
		'loggedIn'];		
	self.defineObservables();	
	
	self.less = ko.observable(true);		
	self.more = ko.observable(false);
	self.moreButton = ko.observable(false);
	self.lessButton = ko.observable(false);			
    
	self.activate = function (channel) {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			self.loggedIn('');
			self.hasheader(false);
			self.hasfooter(false);
		}
		else {
			self.loggedIn('Y');
			addExternalMarkup(self.template); // this is for header/overlay message
			self.hasheader(true);
			self.hasfooter(true);
		}
		if((jQuery.mobile.path.get().split('?')[1])) {
			self.channelId((jQuery.mobile.path.get().split('?')[1]).replace('id=',''));
		}
		else {
			var currentChannel = JSON.parse(ENYM.ctx.getItem('currentChannel'));
			self.channelId(currentChannel.id);		
		}
		self.accountName(ENYM.ctx.getItem("accountName"));		
		self.channelAction(true);
		ENYM.ctx.removeItem('channelOwner');
		self.less(true);
		self.more(false);				
		self.moreButton(false);
		self.lessButton(false);						
		$.mobile.showPageLoadingMsg("a", "Loading The Channel");
		return ES.channelService.getChannel(self.channelId(), {success: successfulGetChannel, error: errorAPIChannel});;
	};			
	
	function successfulGetChannel(data) {
		$.mobile.hidePageLoadingMsg();
		ENYM.ctx.setItem("currentChannel", JSON.stringify(data));
		self.title(data.name);
		if(data.followers == 1) {
			var followers = data.followers +' follower';
		} else {
			var followers = data.followers +' followers';
		}		
		self.description(data.description);
		if(typeof data.longDescription != 'undefined') {
			if(data.longDescription.length > truncatedTextScreen()*12) {
				var logDesc = ($.trim(data.longDescription).substring(0, truncatedTextScreen()*7).split(' ').slice(0, -1).join(' ') + '...').replace(/\n/g, '<br/>');
				self.longdescription(logDesc);
				self.moreText(data.longDescription.replace(/\n/g, '<br/>'));
				self.moreButton(true);							
			}
			else {
				self.longdescription(data.longDescription.replace(/\n/g, '<br/>'));			
			}
		}
		else {
			if(data.longDescription == '' || typeof data.longDescription == 'undefined') {
				self.longdescription('This is the web page for '+self.title()+'. To follow '+self.title()+', click the Follow button below.');			
			}
		}
		self.channelId(data.id);
		if(data.relationship == 'F' ) {
			self.channelAction(false);
			self.settings(true);			
			viewNavigate('Channels', 'channelsFollowingListView', 'channelMessagesView');			
		}
		else if(data.relationship == 'O') {
			if(data.longDescription == '' || typeof data.longDescription == 'undefined') {
			var account = JSON.parse(ENYM.ctx.getItem('account'));				
				self.longdescription("This is the web page for "+self.title()+". To follow "+self.title()+", click the Follow button below.<br/><br/>Hello, "+account.firstname+"!  Your channel needs a better description than what we came up with for you, so go ahead and type that in this box.<br/>Make sure to include an invitation for visitors to click the Follow button in order to get your channel's broadcasts.");							
			}				
			ENYM.ctx.setItem('channelOwner', 'yes');
			if(data.followers == 1) {
				var followers = data.followers +' follower';
			} else {
				var followers = data.followers +' followers';
			}		
			var channel = [];			
			channel.push({
				channelId: data.id, 
				channelName: data.name, 
				channelDescription: data.description,
				longDescription: data.longDescription,			
				followerCount: followers
			});
			channel = channel[0];		
			ENYM.ctx.setItem('currentChannelData', JSON.stringify(channel));
			self.settings(true);																
		}
		else {
			self.settings(false);			
			self.channelAction(true);			
		}
	};
	
	
	self.channelSettings = function(){
		if(ENYM.ctx.getItem('channelOwner') == 'yes') {		
			viewNavigate('Landing Page', 'channelView?id='+self.title(), 'channelSettingsView');
		} else {
			viewNavigate('Landing Page', 'channelView?id='+self.title(), 'channelViewUnfollow');
		}
	};
	
	self.editLongDescription = function() {
		if(ENYM.ctx.getItem('channelOwner') == 'yes') {
			viewNavigate('Landing Page', 'channelView?id='+self.title(), 'editLongDescriptionView');
		}
	};	
	
	function successfulFollowChannel() {
		$.mobile.hidePageLoadingMsg();
		ENYM.ctx.removeItem('action');
		var toastobj = {redirect: 'channelMessagesView', type: '', text: 'Now following '+self.title()};
		showToast(toastobj);				
		viewNavigate('Channels', 'channelsFollowingListView', 'channelMessagesView');
	};
	
	function errorAPIChannel(data, status, details) {
		$.mobile.hidePageLoadingMsg();		
		var token = ES.evernymService.getAccessToken();			
		if(token == '' || token == null) {
			var toastobj = {redirect: 'loginView', type: 'toast-error', text: details.message};
			showToast(toastobj);		
			goToView('loginView');
		} else {
			var toastobj = {redirect: 'homeView', type: 'toast-error', text: details.message};
			showToast(toastobj);			
			goToView('homeView');
		}
	};
    
	function errorFollowing(data, status, details) {
		$.mobile.hidePageLoadingMsg();
		if (details.code == 100601){ // we are already following this channel
			var toastobj = {type: 'toast-error', text: details.message};
			showToast(toastobj);		
		}
		else if (isBadLogin(details.code)){
			ENYM.ctx.setItem("action", 'follow_channel');
			$.mobile.changePage("#" + loginViewModel.template);
		}
		else {
			var toastobj = {type: 'toast-error', text: details.message};
			showToast(toastobj);
		}
	};
	
	// follow/unfollow will be called on the basis of channelAction value
	self.actionFollowChannelCommand = function() {
		if(self.loggedIn() == 'Y') {
			var account = JSON.parse(ENYM.ctx.getItem('account'));			
			if(ENYM.ctx.getItem('channelOwner') == 'yes') {
				var toastobj = {type: 'toast-info', text: 'See Channel Settings to receive your own broadcasts.'};
				showToast(toastobj);			
			}
			else if (account && account.firstname && account.lastname){
				self.followChannelCommand();
			}
			else {
				return ES.channelService.getFollowerReq(self.channelId()).then(getSuccessOnLogin);
			}
		}
		else {
			return ES.channelService.getFollowerReq(self.channelId()).then(getSuccess);		
		}
	};
	
	function getSuccessOnLogin(data) {	
		if(data != '') {
			var action = {follow_channel: 'Y', SHARE_NAME: 'Y'};
			ENYM.ctx.setItem('action', JSON.stringify(action));
			goToView('nameRequiredView');
		}
		else {
			self.followChannelCommand();			
		}
	};	
	
	function getSuccess(data) {					
		if(data != '') {
			var action = {follow_channel: 'Y', SHARE_NAME: 'Y'};
		}
		else {
			var action = {follow_channel: 'Y', SHARE_NAME: 'N'};			
		}
		ENYM.ctx.setItem('action', JSON.stringify(action));			
		if(ENYM.ctx.getItem('accountName') == '' || ENYM.ctx.getItem('accountName') == null){
			goToView('signupStepFirstView');
		} 
		else {
			goToView('loginView');
		}
	};	
	
	self.followChannelCommand = function() {
		$.mobile.showPageLoadingMsg("a", "Requesting to Follow Channel");
		return ES.channelService.followChannel(self.channelId(), {success: successfulFollowChannel, error: errorFollowing});
	};	

	self.showMore = function(){
		self.less(false);		
		self.more(true);
		self.moreButton(false);	
		self.lessButton(true);															
	};
	
	self.showLess = function(){
		self.less(true);		
		self.more(false);
		self.moreButton(true);
		self.lessButton(false);															
	};		
		
};

ChannelViewModel.prototype = new ENYM.ViewModel();
ChannelViewModel.prototype.constructor = ChannelViewModel;
