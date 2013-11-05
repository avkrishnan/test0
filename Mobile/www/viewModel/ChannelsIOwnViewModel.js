/*globals ko*/
function ChannelsIOwnViewModel() {	
  var that = this;
	this.template = 'channelsIOwnView';
	this.viewid = 'V-19';
	this.viewname = 'ChannelsIOwn';
	this.displayname = 'My Channels';	
	this.hasfooter = true;    
	this.accountName = ko.observable();	
	this.notification = ko.observable();
	
  /* Channels observable */		
	this.channels = ko.observableArray([]);
	this.channelId = ko.observable();
	this.channelname = ko.observable();
	this.channeldescription = ko.observable();

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
			var _accountName = localStorage.getItem('accountName');
			that.accountName(_accountName);
			that.channels.removeAll();			
			$.mobile.showPageLoadingMsg('a', 'Loading Channels');
			return this.listMyChannelsCommand();
			goToView('channelsIOwnView');
		}
	};	    	
	
	function successfulList(data){
		if(data.channel.length < 1) {
			goToView('channelListView');			
		}	
    $.mobile.hidePageLoadingMsg();
		that.channels.removeAll();	
		for(var channelslength = 0; channelslength<data.channel.length; channelslength++) {
			that.channels.push({
				channelId: data.channel[channelslength].id, 
				channelname: data.channel[channelslength].name, 
				channeldescription: data.channel[channelslength].description
			});
		}	
	};    
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();	
		showError('Error listing my channels: ' + details.message);
	};
		
	this.listMyChannelsCommand = function () {
		$.mobile.showPageLoadingMsg('a', 'Loading Channels');
		return ES.channelService.listMyChannels({ success: successfulList, error: errorAPI });
	};
	
	this.channelSettings = function(data){
		localStorage.removeItem('currentChannelId');
		localStorage.setItem('currentChannelId', data.channelId);
		goToView('channelSettingsView');
	};
	
	this.channelMain = function(data){
		localStorage.removeItem('currentChannelId');
		localStorage.setItem('currentChannelId', data.channelId);
		goToView('channelMainView');
	};
	
	this.channelFollowers = function(data){
		localStorage.removeItem('currentChannelId');
		localStorage.setItem('currentChannelId', data.channelId);
		goToView('followersListView');
	};
}