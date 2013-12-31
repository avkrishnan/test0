function ChannelViewModel() {
	var self = this;
	self.template = "channelView";
	self.viewid = "V-18";
	self.viewname = "Landing Page";
	self.displayname = "Channel Landing Page";
	
	self.hasfooter = ko.observable(false);
	self.hasheader = ko.observable(false);
	self.settings = ko.observable(true);	
	self.less = ko.observable(true);		
	self.more = ko.observable(false);
	self.moreButton = ko.observable(false);
	self.lessButton = ko.observable(false);		
	self.isChannelView = true;

	self.channel = ko.observableArray([]);
	self.messages = ko.observableArray([]);
	
  self.inputObs = [ 'title', 'channelAction', 'url' , 'message', 'description', 'channelid', 'channelIconObj', 'channelMessage', 'longdescription', 'moreText', 'email', 'followers' ]; 
  //self.errorObs = [ 'currentpasswordClass', 'newpasswordClass', 'confirmpasswordClass', 'errorMessageCurrent', 'errorMessageNew', 'errorMessageConfirm' ];
  self.defineObservables();
	
	self.showMainIcon = function(lchannel) {
		if (lchannel.picId ){
			var iconJSON = JSON.parse(lchannel.picId);
			if (iconJSON && iconJSON.id){
				var set = iconJSON.set;
				var id = iconJSON.id;
				var mappedIcon2 = selectIconViewModel.mapImage(set, id, 63);
				self.channelIconObj(mappedIcon2);
			}
		}
	};
    
	self.activate = function (channel) {
//
	if ($.mobile.pageData && $.mobile.pageData.id) {
		self.activate({id:$.mobile.pageData.id});
	}
	else {
		var currentChannel = ENYM.ctx.getItem("currentChannel");
		
		var lchannel = JSON.parse(currentChannel);
		if (!(self.channel()[0] && lchannel.id == self.channel()[0].id)) {
			self.messages([]);
		}
	
		if(lchannel) {
			self.channel([lchannel]);
			self.title(lchannel.name );
			
			self.relationship(lchannel.relationship);
			
			self.channelid(lchannel.id);
			$.mobile.showPageLoadingMsg("a", "Loading Messages");
			
			self.description(lchannel.description);
			self.longdescription(lchannel.longDescription);
			self.url(lchannel.normName + '.evernym.com');
			self.email(lchannel.normName + '@evernym.com');
			self.showMainIcon(lchannel);
		}
		else {
				//$.mobile.changePage("#" + channelListViewModel.template);
		}
	}
//		
		self.hasheader(false);			
		self.hasfooter(false);		
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
		}
		else {
			addExternalMarkup(self.template); // this is for header/overlay message
			self.hasheader(true);
			self.hasfooter(true);
		}		
		self.channelid(channel.id);	
		var _name = ENYM.ctx.getItem("UserFullName");
		self.messages([]);
		self.channelAction(true);
		ENYM.ctx.removeItem('channelOwner');
		self.followers('');
		self.description('');
		self.less(true);		
		self.more(false);				
		self.moreButton(false);
		self.lessButton(false);						
		$.mobile.showPageLoadingMsg("a", "Loading The Channel");
		return self.getChannelCommand(self.channelid()).then(gotChannel);
	};
	
	self.channelSettings = function(){
		if(ENYM.ctx.getItem('channelOwner') == 'yes') {		
			viewNavigate('Landing Page', 'channelView?id='+self.title(), 'channelSettingsView');
		} else {
			viewNavigate('Landing Page', 'channelView?id='+self.title(), 'channelViewUnfollow');
		}
	}
	
	self.editLongDescription = function() {
		if(ENYM.ctx.getItem('channelOwner') == 'yes') {
			viewNavigate('Landing Page', 'channelView?id='+self.title(), 'editLongDescriptionView');
		}
	}			
	
	function gotChannel(data) {
		$.mobile.hidePageLoadingMsg();
		ENYM.ctx.setItem("currentChannel", JSON.stringify(data));
		self.channel([data]);
		self.channelMessage(data);
		self.title(data.name);
		if(data.followers == 1) {
			var followers = data.followers +' follower';
		} else {
			var followers = data.followers +' followers';
		}		
		self.followers(followers);
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
		self.url(data.normName + '.evernym.com');
		self.email(data.normName + '@evernym.com');
		self.showMainIcon(data);
		self.channelid(data.id);
		if(data.relationship == 'F' ) {
			self.channelAction(false);
			self.settings(true);			
			viewNavigate('Channels', 'channelsFollowingListView', 'channelMessagesView');			
		}
		else if(data.relationship == 'O') {
			if(data.longDescription == '' || typeof data.longDescription == 'undefined') {
			var account = JSON.parse(ENYM.ctx.getItem('account'));				
				self.longdescription("This is the web page for "+self.title()+". To follow "+self.title()+", click the Follow button below.<br/><br/>Hello, "+account.firstname+"!  Your channel needs a better description than what we came up with for you, so go ahead and type self in this box.<br/>Make sure to include an invitation for visitors to click the Follow button in order to get your channel's broadcasts.");							
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
	}
    
	function postFollow(data){
	}
		
	function successfulGetChannel(data) {
		$.mobile.hidePageLoadingMsg();
	}
	
	function successfulDelete(data) {
		$.mobile.changePage("#" + homeViewModel.template);
	}
	
	function successfulModify(data) { ;
	}
	
	function successfulFollowChannel() {
		ENYM.ctx.removeItem('action');		
		$.mobile.hidePageLoadingMsg();
		var toastobj = {redirect: 'channelMessagesView', type: '', text: 'Now following '+self.title()};
		showToast(toastobj);				
		goToView('channelMessagesView');
	}
	
	function successfulMessageGET(data) {
		$.mobile.hidePageLoadingMsg();
	}
	
	self.logoutCommand = function() {
		loginViewModel.logoutCommand();
		$.mobile.changePage("#" + loginViewModel.template);
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
	}
    
	function errorAPI(data, status, details) {
		$.mobile.hidePageLoadingMsg();
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);
	}
    
	function errorFollowing(data, status, details) {
		$.mobile.hidePageLoadingMsg();
		if (details.code == 100601){ // we are already following this channel
			var toastobj = {type: 'toast-error', text: details.message};
			showToast(toastobj);		
		} else if (isBadLogin(details.code)){
			ENYM.ctx.setItem("action", 'follow_channel');
			$.mobile.changePage("#" + loginViewModel.template);
		} else {
			var toastobj = {type: 'toast-error', text: details.message};
			showToast(toastobj);
		}
	}
	
	function errorPostingMessage(data, status, details){
		$.mobile.hidePageLoadingMsg();
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);
	}
	
	function errorRetrievingMessages(data, status, details) {
		$.mobile.hidePageLoadingMsg();
		loginPageIfBadLogin(details.code);
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);
	}
	
	self.getChannelCommand = function (lchannelid) {
		//alert(lchannelid);
		$.mobile.showPageLoadingMsg("a", "Loading Channel");
		return ES.channelService.getChannel(lchannelid, {success: successfulGetChannel, error: errorAPIChannel});
	};
    
	self.showMoreMessagesCommand = function(){
		var last_message_id = self.messages()[self.messages().length - 1].id;
		$.mobile.showPageLoadingMsg("a", "Loading Messages");
		return ES.messageService.getChannelMessages(self.channelid(), {before: last_message_id}, {success: successfulMessageGET, error: errorRetrievingMessages}).then(gotMoreMessages);
	}
	
	// follow/unfollow will be called on the basis of channelAction value
	self.actionFollowChannelCommand = function() {
		ENYM.ctx.setItem("currentChannel", JSON.stringify(self.channelMessage()));
		var account = JSON.parse(ENYM.ctx.getItem('account'));
		ENYM.ctx.setItem("action", 'follow_channel');
		if(ENYM.ctx.getItem('channelOwner') == 'yes') {
			var toastobj = {type: 'toast-info', text: 'See Channel Settings to receive your own broadcasts.'};
			showToast(toastobj);			
		} else if(ENYM.ctx.getItem('accountName') == '' || ENYM.ctx.getItem('accountName') == null){
			goToView('signupStepFirstView');
		} else if (account && account.firstname && account.lastname) {
			self.followChannelCommand();
		} else {
			goToView('nameRequiredView');
		}
	}
	
	self.followChannelCommand = function() {
		self.messages([]);
		$.mobile.showPageLoadingMsg("a", "Requesting to Follow Channel");
		return ES.channelService.followChannel(self.channelid(), {success: successfulFollowChannel, error: errorFollowing});
	};	
	
	self.unfollowChannelCommand = function() {
		$.mobile.showPageLoadingMsg("a", "Requesting to Unfollow Channel");
		var callbacks = {
			success: function(){;},
			error: errorUnfollow
		};
		return ES.channelService.unfollowChannel(self.channelid(),callbacks).then(successfulUnfollowChannel);
	};
	
	function successfulUnfollowChannel(data){
		ENYM.ctx.removeItem("currentChannel");
		self.showChannelList();
	}
    
	function errorUnfollow(data, status, details) {
		$.mobile.hidePageLoadingMsg();
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);
	}
	
	self.deleteChannelCommand = function () {
		$.mobile.showPageLoadingMsg("a", "Removing Channel");
		return ES.channelService.deleteChannel(self.channelid(), { success: successfulDelete, error: errorAPI });
	};
    
	self.showMessage = function (message) {
		ENYM.ctx.setItem("currentMessage", JSON.stringify(message));
		$.mobile.changePage("#" + messageViewModel.template)
	};
		
	self.showChannelList = function() {
		var lrelationship = 'O';
		if (self.channel()[0]){
			lrelationship = self.channel()[0].relationship;
		}
		if (lrelationship && lrelationship == "F"){
			$.mobile.changePage("#" + channelsFollowingListViewModel.template);
		} else {
			$.mobile.changePage("#" + homeViewModel.template);
		}
	}
	
	self.modifyChannelCommand = function() {
		//self.title("Channel: " + channel()[0].name );
		return ES.channelService.modifyChannel(channel()[0], {success: successfulModify, error: errorAPI});
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
}

ChannelViewModel.prototype = new ENYM.ViewModel();
ChannelViewModel.prototype.constructor = ChannelViewModel;