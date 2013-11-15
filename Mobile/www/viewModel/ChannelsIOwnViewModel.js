/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelsIOwnViewModel() {	
  var that = this;
	this.template = 'channelsIOwnView';
	this.viewid = 'V-19';
	this.viewname = 'ChannelsIOwn';
	this.displayname = 'My Channels';	
	this.accountName = ko.observable();	
	
  /* Channels observable */
	this.channels = ko.observableArray([]);
	this.channelId = ko.observable();
	this.channelName = ko.observable();
	this.channelDescription = ko.observable();
	this.followerCount = ko.observable();	

	/* Methods */
	this.applyBindings = function(){	
		$('#' + that.template).on('pagebeforeshow', null, function (e, data) {	
			that.activate();	
		});		
	};
	
  this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			that.accountName(localStorage.getItem('accountName'));			
			localStorage.removeItem('currentChannelData');			
			that.channels.removeAll();			
			$.mobile.showPageLoadingMsg('a', 'Loading Channels');
			return ES.channelService.listMyChannels({ success: successfulList, error: errorAPI });
		}
	};	    	
	
	function successfulList(data){	
    $.mobile.hidePageLoadingMsg();
		that.channels.removeAll();	
		for(var channelslength = 0; channelslength<data.channel.length; channelslength++) {
			if(data.channel[channelslength].followers == 1) {
				var followers = data.channel[channelslength].followers +' follower';
			} else {
				var followers = data.channel[channelslength].followers +' followers';
			}			
			that.channels.push({
				channelId: data.channel[channelslength].id, 
				channelName: data.channel[channelslength].name, 
				channelDescription: data.channel[channelslength].description,
				longDescription: data.channel[channelslength].longDescription,
				followerCount: followers
			});
		}	
	};    
	
	function errorAPI(data, status, response){
		$.mobile.hidePageLoadingMsg();	
		showError('Error listing my channels: ' + response.message);
	};
	
	this.channelSettings = function(data){		
		localStorage.setItem('currentChannelData', JSON.stringify(data));	
		goToView('channelSettingsView');
	};
	
	this.channelMain = function(data){
		localStorage.setItem('currentChannelData', JSON.stringify(data));				
		goToView('channelMainView');
	};
	
	this.channelFollowers = function(data){	
		localStorage.setItem('currentChannelData', JSON.stringify(data));	
		goToView('followersListView');
	};
	
}