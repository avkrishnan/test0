﻿/*globals ko*/
function ChannelsFollowingListViewModel() {
	this.template = "channelsFollowingListView";
	this.viewid = "V-30";
	this.viewname = "ChannelsIFollow";
	this.displayname = "Channels I Follow";
	this.hasfooter = true;
	this.accountName = ko.observable();
	this.channels = ko.observableArray([]);
	this.toastText = ko.observable();		
	
	var that = this;
	this.shown = false;
	this.applyBindings = function() {	
		$("#" + that.template).on("pagebeforeshow", null, function (e, data) {
			if (!that.shown) {
				localStorage.removeItem("currentChannel");
				that.activate();
			}
		});
	};
	
	/* Methods */
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
			that.accountName(localStorage.getItem("accountName"));
			localStorage.setItem('counter', 1);					
			console.log("trying to get channels");
			that.channels.removeAll();
			if ( that.channels() && that.channels().length){
				that.channels.removeAll();
			}
			$.mobile.showPageLoadingMsg("a", "Loading Channels");
			return this.listFollowingChannelsCommand().then(gotChannels);
		}
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
		that.toastText(details.message);		
		showToast();			  
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
		//goToView('channelViewUnfollow');
		viewNavigate('Channels', 'channelsFollowingListView', 'channelViewUnfollow');		
	}
	
	this.actionFollowChannelCommand = function(data) {
		localStorage.setItem("currentChannel", JSON.stringify(data));
		viewNavigate('Channels', 'channelsFollowingListView', 'channelMessagesView');				
	}	
	
}