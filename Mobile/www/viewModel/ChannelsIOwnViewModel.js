/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelsIOwnViewModel() {	
  var that = this;
	this.template = 'channelsIOwnView';
	this.viewid = 'V-19';
	this.viewname = 'Channels';
	this.displayname = 'Channels I Own';	
	this.accountName = ko.observable();		
	
  /* Channels observable */
	this.channels = ko.observableArray([]);
	this.toastText = ko.observable();		

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
			addExternalMarkup(that.template); // this is for header/overlay message			
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');												
			}
			that.accountName(localStorage.getItem('accountName'));
			localStorage.setItem('counter', 1);												
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
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();	
		that.toastText(details.message);		
		showToast();
	};
	
	this.channelSettings = function(data){
		localStorage.removeItem('currentChannelData');				
		localStorage.setItem('currentChannelData', JSON.stringify(data));
		viewNavigate('Channels', 'channelsIOwnView', 'channelSettingsView');		
	};
	
	this.channelMain = function(data){
		localStorage.removeItem('currentChannelData');		
		localStorage.setItem('currentChannelData', JSON.stringify(data));
		viewNavigate('Channels', 'channelsIOwnView', 'channelMainView');					
	};
	
	this.channelFollowers = function(data){
		localStorage.removeItem('currentChannelData');			
		localStorage.setItem('currentChannelData', JSON.stringify(data));	
		viewNavigate('Channels', 'channelsIOwnView', 'followersListView');		
	};	
	
}