﻿/*globals ko*/

function ChannelListViewModel() {
	/// <summary>
	/// A view model that displays the list of channels with the user owns
	/// </summary>
	
	// --- properties
	
	this.template = "channelListView";
	
	this.channels = ko.observableArray([]);
    
    this.notification = ko.observable();
    this.name = ko.observable();
    
	var that = this;
	this.shown = false;
	
	$("#" + this.template).live("pagebeforeshow", function (e, data) {
	    
	    if (!that.shown) {
	        that.activate();
	    }

	});
    
    //$('#channelNotifications').popup('close');
	// Methods
	
	var  dataService = new EvernymChannelService();
		
	this.activate = function() {
		console.log("trying to get channels");
        that.clearForm();
		
		if ( that.channels() && that.channels().length){
			that.channels.removeAll();
		}
		$.mobile.showPageLoadingMsg("a", "Loading Channels");
		return this.listMyChannelsCommand().then(gotChannels);
	};
	
	function successfulList(data){
		$.mobile.hidePageLoadingMsg();
		//logger.log('success listing channels ' , null, 'dataservice', true);
		
		
	};
    
    this.clearForm = function(){
        that.name('');
    };
	
	function gotChannels(data){
		$.mobile.hidePageLoadingMsg();
		
        //that.shown = true;
		//that.channels.removeAll();
		
		if (data.channel && data.channel.constructor == Object){
			
			data.channel = [data.channel];
		}
				if (!data.channel.length ){
			
			$.mobile.changePage("#" + channelNewViewModel.template);
			$("#no_channels_notification").show();
			return;
		}
		
		$("#no_channels_notification").hide();
		that.channels.removeAll();
		that.channels(data.channel);
	};
	
	function errorListChannels(data, status, details){
		$.mobile.hidePageLoadingMsg();
				
        if (loginPageIfBadLogin(details.code)){
			
            //showMessage("Please log in or register to view channels.");
		}
        else {
            showMessage("Error listing my channels: " + details.message);
        }
        
		//logger.logError('error listing channels', null, 'dataservice', true);
	};
	
	this.listMyChannelsCommand = function () {
		
		//logger.log("starting listChannels", undefined, "channels", true);
		return dataService.listMyChannels({ success: successfulList, error: errorListChannels });
	};
	
	this.logoutCommand = function(){
		loginViewModel.logoutCommand();
		$.mobile.changePage("#" + loginViewModel.template)
		
	}
	
	this.showChannel = function (channel) {
        localStorage.setItem("currentChannel", JSON.stringify(channel));
        
        $.mobile.changePage("#" + channelMenuViewModel.template);
	};

	
    this.showChannelStartMessage = function (channel) {
        that.showChannel(channel);
        channelMenuViewModel.initiateNewBroadcast();
	};
    
    
    
	this.newChannelCommand = function () {
		channelNewViewModel.activate();
		$.mobile.changePage("#" + channelNewViewModel.template);
	};
	
    
    
    
    function successfulCreate(data){
        $.mobile.hidePageLoadingMsg();
        //logger.log('success creating channel', null, 'dataservice', true);
        //router.navigateTo('#/channellist');
        
        $.mobile.changePage("#" + channelListViewModel.template);
        channelListViewModel.activate();
        
    };
    
    function errorCreate(data, status, response){
        $.mobile.hidePageLoadingMsg();
        //that.notifications("error creating channel " + JSON.stringify(data));
        console.log("error creating channel: " + response.message);
        showMessage("Error creating channel: " + response.message);
        loginPageIfBadLogin(details.code);
        //logger.log('error creating channel', null, 'dataservice', true);
    };
    
    this.logoutCommand = function(){
        loginViewModel.logoutCommand();
        $.mobile.changePage("#" + loginViewModel.template)
    }
    
    this.createChannelCommand = function () {
        //inputChannelName
        //logger.log('start creating channel ' + this.name() , null, 'dataservice', true);
        $.mobile.showPageLoadingMsg("a", "Creating Channel " + that.name());
        dataService.createChannel({name: that.name()}, {success: successfulCreate, error: errorCreate});
    };
    
    
    
	
	
	
	
}
