/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelListViewModel() {
  var that = this;
  this.template = 'channelListView';
  this.viewid = 'V-40';
  this.viewname = 'ChannelsIOwn';
  this.displayname = 'My Channels';
  this.accountName = ko.observable();
	this.responseData = ko.observable();
	this.newMessagesCount = ko.observable();
	
  /* Home view observable top row */
	this.createFirstChannel = ko.observable(false);
	this.addInviteFollowers = ko.observable(false);
	this.composeBroadcast = ko.observable(false);
	this.channelDetails = ko.observable(false);
	this.channelsIOwn = ko.observable(false);
	
  /* Home view observable bottm row */	
	this.findChannels = ko.observable(false);
	this.createChannel = ko.observable(false);
	this.channelMessages = ko.observable(false);
	this.channelsIFollow = ko.observable(false);
	
  /* Home view observable */	
  this.firstChannelId = ko.observable(false);
  this.channelWebAddress = ko.observable();	
  this.followWebAddress = ko.observable();
	this.toastText = ko.observable();													
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};	  
	
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} 
		else {
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}			
			that.newMessagesCount(showNewMessages(localStorage.getItem('enymNotifications')));
			that.accountName(localStorage.getItem('accountName'));
			$.mobile.showPageLoadingMsg('a', 'Getting user details');
			return ES.channelService.listMyChannels({ success: successfulList, error: errorAPI }).then(ES.channelService.listFollowingChannels({ success: getChannelsIFollow, error: errorAPI }));			
		}
	}
	
	this.menuCommand = function () {
		pushBackNav('Home', 'channelListView', 'channelMenuView');		
  };	
	
	function successfulList(data){	
    $.mobile.hidePageLoadingMsg();	
		if(data.channel.length < 1) {
			that.createFirstChannel(true);
			that.addInviteFollowers(false);
			that.composeBroadcast (false);
			that.channelDetails(false);
			that.channelsIOwn(false);									
		} else if(data.channel.length == 1) {
      that.firstChannelId(data.channel[0].id);
			that.channelWebAddress(data.channel[0].name+'.evernym.com');
			
			if(data.channel[0].followers == 1) {
				var followers = data.channel[0].followers +' follower';
			} else {
				var followers = data.channel[0].followers +' followers';
			}		
			var channel = [];			
			channel.push({
				channelId: data.channel[0].id, 
				channelName: data.channel[0].name, 
				channelDescription: data.channel[0].description,
				followerCount: followers
			});
			channel = channel[0];		
			localStorage.setItem('currentChannelData', JSON.stringify(channel));
			return ES.channelService.getFollowers(data.channel[0].id, { success: getFollowers, error: errorAPI });
		}	else {
			that.createFirstChannel(false);
			that.addInviteFollowers(false);
			that.composeBroadcast (false);
			that.channelDetails(false);
			that.channelsIOwn(true);							
		}
	};
	
	function getFollowers(data){	
		$.mobile.hidePageLoadingMsg();
		if(data.followers.length < 2) {
			that.createFirstChannel(false);
			that.addInviteFollowers(true);
			that.composeBroadcast (false);
			that.channelDetails(false);
			that.channelsIOwn(false);						
		} else {						
			return ES.messageService.getChannelMessages(that.firstChannelId(), undefined, {success: getMessages, error: errorAPI});
		}	
	};
	
	function getMessages(data){
		$.mobile.hidePageLoadingMsg();
		if(data.message.length < 1) {
			that.createFirstChannel(false);
			that.addInviteFollowers(false);
			that.composeBroadcast (true);
			that.channelDetails(false);
			that.channelsIOwn(false);	
		} else {
			that.createFirstChannel(false);
			that.addInviteFollowers(false);
			that.composeBroadcast (false);
			that.channelDetails(true);
			that.channelsIOwn(false);		
		}
	}
	
	function getChannelsIFollow(responseData){	
		$.mobile.hidePageLoadingMsg();
		if(responseData.channel.length == 1) {		
			that.findChannels(false);
			that.createChannel(false);
			that.channelMessages(true);
			that.channelsIFollow(false);
			that.followWebAddress(responseData.channel[0].name+'.evernym.com');			
		} else if(responseData.channel.length > 1) {
			that.findChannels(false);
			that.createChannel(false);
			that.channelMessages(false);
			that.channelsIFollow(true);
		} else if (that.createFirstChannel() == false){
			that.findChannels(false);
			that.createChannel(true);
			that.channelMessages(false);
			that.channelsIFollow(false);			
		} else {
			that.findChannels(false);
			that.createChannel(false);
			that.channelMessages(false);
			that.channelsIFollow(true);			
		}
	}
	
	function errorAPI(data, status, response){
		$.mobile.hidePageLoadingMsg();	
		showError(response.message);
	};
	
	this.goCreateFirstChannel = function() {
		pushBackNav('Home', 'channelListView', 'channelNewView');		
	}	
	
	this.goAddInviteFollowers = function() {
		pushBackNav('Home', 'channelListView', 'addInviteFollowersView');		
	}
	
	this.goComposeBroadcast = function() {
		pushBackNav('Home', 'channelListView', 'sendMessageView');		
	}
	
	this.goChannelDetails = function() {
		pushBackNav('Home', 'channelListView', 'channelMainView');		
	}				
	
	this.goChannelsIOwn = function() {
		pushBackNav('Home', 'channelListView', 'channelsIOwnView');		
	}	
	
	this.goFindChannels = function() {
		showMessage('Feature coming soon!');		
		//pushBackNav('Home', 'channelListView', 'channelView?id=channel2828');		
	}
	
	this.goCreateChannel = function() {
		pushBackNav('Home', 'channelListView', 'channelNewView');		
	}	
	
	this.goChannelMessages = function() {
		//showMessage('Feature coming soon!');		
		//pushBackNav('Home', 'channelListView', 'channelMessagesView');
		pushBackNav('Home', 'channelListView', 'channelView?id='+that.followWebAddress());		
	}	
	
	this.goChannelsIFollow = function() {
		pushBackNav('Home', 'channelListView', 'channelsFollowingListView');		
	}	
	
	this.userSettings = function () {
		pushBackNav('Home', 'channelListView', 'escalationPlansView');
  };	
	
	this.composeCommand = function () {
		pushBackNav('Home', 'channelListView', 'sendMessageView');
  };	
	
}