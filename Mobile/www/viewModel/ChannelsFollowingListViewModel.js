﻿/*globals ko*/
function ChannelsFollowingListViewModel() {
	this.template = "channelsFollowingListView";
	this.viewid = "V-30";
	this.viewname = "ChannelsIFollow";
	this.displayname = "Channels I Follow";
	this.hasfooter = true;
	this.accountName = ko.observable();
	this.backText = ko.observable();			
	this.channels = ko.observableArray([]);
	
	var that = this;
	this.shown = false;
	this.applyBindings = function(){
		$("#" + that.template).on("pagebeforeshow", null, function (e, data) {
			if (!that.shown) {
				localStorage.removeItem("currentChannel");
				that.activate();
			}
		});
	};
	
	/* Methods */
	this.activate = function() {
		that.accountName(localStorage.getItem("accountName"));
		that.backText('<em></em>'+backNavText[backNavText.length-1]);		
		console.log("trying to get channels");
		that.channels.removeAll();
		if ( that.channels() && that.channels().length){
			that.channels.removeAll();
		}
		$.mobile.showPageLoadingMsg("a", "Loading Channels");
		return this.listFollowingChannelsCommand().then(gotChannels);
	};
	
	this.backCommand = function () {
		popBackNav();
  };
	
	this.menuCommand = function () {
		pushBackNav('Channels', 'channelsFollowingListView', 'channelMenuView');
  };	
	
	function successfulCreate(data){
		//logger.log('success listing channels ' , null, 'channelService', true);
	};
	
	function gotChannels(data){
		$.mobile.hidePageLoadingMsg();
		//that.shown = true;
		//that.channels.removeAll();
		if (data.channel && data.channel.constructor == Object){
			data.channel = [data.channel];
		}
		if (!data.channel) {
			// TODO:  What do we do when there are no channels that we are following?
			//$.mobile.changePage("#" + channelNewViewModel.template);
			//$("#no_channels_notification").show();
			return;
		}
		$("#no_channels_notification").hide();
		if(data.channel.length) {
			$.each(data.channel, function(indexChannel, valueChannel) {
				if(typeof valueChannel.description == 'undefined') {
					valueChannel.description = '';			
				}
			});
			that.channels(data.channel);
		}
	};
	
	function errorListChannels(data, status, details){
		$.mobile.hidePageLoadingMsg();
		if (loginPageIfBadLogin(details.code)){
			//showMessage("Please log in or register to view channels.");
		}
		else {
			showError("Error listing my channels I'm Following: " + details.message);  
		}
	};
	
	this.mapImage = function(jsonText){
			 var mappedIcon = undefined;
			 if (jsonText ){
			
			var iconJSON = JSON.parse(jsonText);
			if (iconJSON && iconJSON.id){
				var set = iconJSON.set;
				var id = iconJSON.id;
				mappedIcon = selectIconViewModel.mapImage(set, id, 63);
			}
		}
		return mappedIcon;
	};
	
	this.listFollowingChannelsCommand = function () {
		return ES.channelService.listFollowingChannels({ success: successfulCreate, error: errorListChannels });
	};
		
	this.logoutCommand = function(){
		loginViewModel.logoutCommand();
		$.mobile.changePage("#" + loginViewModel.template)
	}
		
	this.showChannel = function (channel) {
		localStorage.setItem("currentChannel", JSON.stringify(channel));
		$.mobile.changePage("#" + channelBroadcastsViewModel.template)
	};
	
	this.newChannelCommand = function () {
		channelNewViewModel.activate();
		$.mobile.changePage("#" + channelNewViewModel.template)
	};
	
	this.channelViewUnfollow = function(data) {
		var channel = JSON.stringify(data);
		localStorage.setItem("currentChannel", channel);
		goToView('channelViewUnfollow');
	}
	
	this.actionFollowChannelCommand = function(data) {
		localStorage.setItem("currentChannel", JSON.stringify(data));
		goToView('channelMessagesView');		
	}	
	
	this.userSettings = function () {
		pushBackNav('Channels', 'channelsFollowingListView', 'escalationPlansView');		
  };	
	
	this.composeCommand = function () {
		pushBackNav('Channels', 'channelsFollowingListView', 'sendMessageView');		
  };
	
}