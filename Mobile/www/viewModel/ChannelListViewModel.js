/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelListViewModel() {
  var that = this;
  this.template = 'channelListView';
  this.viewid = 'V-40';
  this.viewname = 'Home';
  this.displayname = 'Home';
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
			addExternalMarkup(that.template); // this is for header/overlay message
			//$('#' + that.template + ' header.logged-in').load('header.html');
			//$('#' + that.template + ' .active-overlay').load('overlaymessages.html');
				
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');
			}
			that.accountName(localStorage.getItem('accountName'));
			localStorage.setItem('counter', 0);
			$.mobile.showPageLoadingMsg('a', 'Getting user details');
			return ES.channelService.listMyChannels({ success: successfulList, error: errorAPI }).then(ES.channelService.listFollowingChannels({ success: getChannelsIFollow, error: errorAPI }));			
		}
	}
	
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
			//{"id":"1900bcaa-138b-4f7b-872a-5f270dfb058f","name":"karateclass","normName":"karateclass","description":"All about the karate...","followers":4,"relationship":"F"}
			var channel = [];			
			channel.push({
				id: responseData.channel[0].id, 
				name: responseData.channel[0].name,
				normName: responseData.channel[0].normName, 
				description: responseData.channel[0].description,
				longDescription: responseData.channel[0].longDescription,			
				followers: responseData.channel[0].followers,
				relationship: responseData.channel[0].relationship
			});
			channel = channel[0];		
			localStorage.setItem('currentChannel', JSON.stringify(channel));					
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
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();	
		that.toastText(details.message);		
		showToast();
	};		
	
}