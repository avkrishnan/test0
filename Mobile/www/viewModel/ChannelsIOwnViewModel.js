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
	/*this.followerCount = ko.observable();		*/	

	this.applyBindings = function(){	
		$('#' + that.template).on('Xpagebeforecreate', null, function (e, data) {});
		$('#' + this.template).on('pagebeforeshow', null, function (e, data) {	
			if (!that.shown) {
				that.activate();
			}		
		});		
	};
  this.activate = function() {
		var _accountName = localStorage.getItem('accountName');
		that.accountName(_accountName);
		that.channels.removeAll();	
		$.mobile.showPageLoadingMsg('a', 'Loading Channels');
		return this.listMyChannelsCommand();
		goToView('channelsIOwnView');       		
	};	    	
	
	function successfulList(data){	
    $.mobile.hidePageLoadingMsg();
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
		if (loginPageIfBadLogin(details.code)){
		//showMessage('Please log in or register to view channels.');
		} else {
			showError('Error listing my channels: ' + details.message);
		}
	};	
	this.listMyChannelsCommand = function () {
		$.mobile.showPageLoadingMsg('a', 'Loading Channels');
		return ES.channelService.listMyChannels({ success: successfulList, error: errorAPI });
	};
		
	this.logoutCommand = function(){
		loginViewModel.logoutCommand();
		$.mobile.changePage('#' + loginViewModel.template)
	}	
	
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
	/*this.showChannel = function (channel) {
		localStorage.setItem('currentChannel', JSON.stringify(channel));
		$.mobile.changePage('#' + channelMenuViewModel.template);
	};*/
	/*
	this.populateChannelList = function(){
		$.mobile.showPageLoadingMsg('a', 'Loading Channels');
		return this.listMyChannelsCommand().then(gotChannelList);	
	};	
	this.refreshChannelList = function(){
		$.mobile.showPageLoadingMsg('a', 'Loading Channels');
		return this.listMyChannelsCommand().then(gotChannels);	
	};	
	this.clearForm = function(){
		that.name('');
		that.channels.removeAll();
	};	
	function gotChannels(data){
		$.mobile.hidePageLoadingMsg();	
		if (data.channel && data.channel.constructor == Object){
			data.channel = [data.channel];
		}
		if (!data.channel.length ){
			$.mobile.changePage('#' + channelNewViewModel.template);
			$('#no_channels_notification').show();
			return;
		}        
		//populatePanel(data.channel);	
		//var panelhtml = $('#globalpanel').find('#mypanel').html();
		//$.mobile.activePage.find('#mypanel').html(panelhtml);
		//$.mobile.activePage.find('#mypanel').panel();
		//$.mobile.activePage.find('#mypanel').trigger('create');	
		//$.mobile.activePage.find('#mypanel').trigger('updatelayout');        
		$('#no_channels_notification').hide();	
		that.channels.removeAll();
		that.channels(data.channel);	
	};	    
  function gotChannelList(data){
		$.mobile.hidePageLoadingMsg();	
		//that.shown = true;
		//that.channels.removeAll();	
		if (data.channel && data.channel.constructor == Object){	
			data.channel = [data.channel];
		}	
		$('#no_channels_notification').hide();	
		that.channels.removeAll();
		that.channels(data.channel);	
	};*/        
	/*this.showChannelStartMessage = function (channel) {
		that.showChannel(channel);
		channelMenuViewModel.initiateNewBroadcast();
	};    
	this.newChannelCommand = function () {
		channelNewViewModel.activate();
		$.mobile.changePage('#' + channelNewViewModel.template);
	};*/	
	/*function successfulCreate(data){
		$.mobile.hidePageLoadingMsg();
		$.mobile.changePage('#' + channelListViewModel.template);
		channelListViewModel.activate();
	};    
	function errorCreate(data, status, response){
		$.mobile.hidePageLoadingMsg();        
		console.log('error creating channel: ' + response.message);
		showError('Error creating channel: ' + response.message);
		loginPageIfBadLogin(details.code);        
	};  
	this.logoutCommand = function(){
		return loginViewModel.logoutCommand();
		$.mobile.changePage('#' + loginViewModel.template)
	};   */   
	/*this.createChannelCommand = function () {	
		$.mobile.showPageLoadingMsg('a', 'Creating Channel ' + that.name());
		return ES.channelService.createChannel({name: that.name()}, {success: successfulCreate, error: errorCreate});
	};*/
}
