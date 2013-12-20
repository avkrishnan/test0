﻿/*globals ko*/
function ChannelViewModel() {
	var that = this;
	this.template = "channelView";
	this.viewid = "V-18";
	this.viewname = "Landing Page";
	this.displayname = "Channel Landing Page";
	
	this.accountName = ko.observable();	
	
	this.hasfooter = ko.observable(false);
	this.hasheader = ko.observable(false);
	this.settings = ko.observable(true);	
	
	this.isChannelView = true;
	this.title = ko.observable();
	this.channelAction = ko.observable();
	this.channel = ko.observableArray([]);
	this.message = ko.observable();
	this.messages = ko.observableArray([]);
	this.channelid = ko.observable();
	this.channelIconObj = ko.observable();
	this.channelMessage = ko.observable();
	
	this.url = ko.observable('');	
	this.description = ko.observable('');
	this.longdescription = ko.observable('');
	this.moreText = ko.observable('');	
	this.less = ko.observable(true);		
	this.more = ko.observable(false);
	this.moreButton = ko.observable(false);
	this.lessButton = ko.observable(false);			
	this.email = ko.observable('');
	this.followers = ko.observable('');	

	this.applyBindings = function() {
		$("#" + that.template).on("pagebeforeshow", null, function(e, data) {
			//$('.more_messages_button').hide();
			//var action = localStorage.getItem("action");
			if ($.mobile.pageData && $.mobile.pageData.id) {
				that.activate({id:$.mobile.pageData.id});
			}
			else {
				var currentChannel = localStorage.getItem("currentChannel");
				//alert(currentChannel);
				//alert(localStorage.getItem("currentChannelMessages"));
				
				var lchannel = JSON.parse(currentChannel);
				if (!(that.channel()[0] && lchannel.id == that.channel()[0].id)) {
					that.messages([]);
				}

				if(lchannel) {
					that.channel([lchannel]);
					that.title(lchannel.name );
					
					that.relationship(lchannel.relationship);
					
					that.channelid(lchannel.id);
					$.mobile.showPageLoadingMsg("a", "Loading Messages");
					
					that.description(lchannel.description);
					that.longdescription(lchannel.longDescription);
					that.url(lchannel.normName + '.evernym.com');
					that.email(lchannel.normName + '@evernym.com');
					that.showMainIcon(lchannel);
				}
				else {
						//$.mobile.changePage("#" + channelListViewModel.template);
				}
			}
		});
	};
	
	this.showMainIcon = function(lchannel) {
		if (lchannel.picId ){
			var iconJSON = JSON.parse(lchannel.picId);
			if (iconJSON && iconJSON.id){
				var set = iconJSON.set;
				var id = iconJSON.id;
				var mappedIcon2 = selectIconViewModel.mapImage(set, id, 63);
				that.channelIconObj(mappedIcon2);
			}
		}
	};
    
	this.activate = function (channel) {
		that.hasheader(false);			
		that.hasfooter(false);		
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
		}
		else {
			addExternalMarkup(that.template); // this is for header/overlay message
			that.hasheader(true);
			that.hasfooter(true);
		}		
		that.channelid(channel.id);	
		var _accountName = localStorage.getItem("accountName");
		var _name = localStorage.getItem("UserFullName");
		that.accountName(_accountName);		
		that.messages([]);
		that.channelAction(true);
		localStorage.removeItem('channelOwner');
		that.followers('');
		that.description('');
		that.less(true);		
		that.more(false);				
		that.moreButton(false);
		that.lessButton(false);						
		$.mobile.showPageLoadingMsg("a", "Loading The Channel");
		//alert(that.channelid());
		return that.getChannelCommand(that.channelid()).then(gotChannel);
	};
	
	this.channelSettings = function(){
		if(localStorage.getItem('channelOwner') == 'yes') {		
			viewNavigate('Landing Page', 'channelView?id='+that.title(), 'channelSettingsView');
		} else {
			viewNavigate('Landing Page', 'channelView?id='+that.title(), 'channelViewUnfollow');
		}
	}
	
	this.editLongDescription = function() {
		if(localStorage.getItem('channelOwner') == 'yes') {
			viewNavigate('Landing Page', 'channelView?id='+that.title(), 'editLongDescriptionView');
		}
	}			
	
	function gotChannel(data) {
		//alert(JSON.stringify(data));
		$.mobile.hidePageLoadingMsg();
		localStorage.setItem("currentChannel", JSON.stringify(data));
		that.channel([data]);
		that.channelMessage(data);
		that.title(data.name);
		if(data.followers == 1) {
			var followers = data.followers +' follower';
		} else {
			var followers = data.followers +' followers';
		}		
		that.followers(followers);
		that.description(data.description);
		if(typeof data.longDescription != 'undefined') {
			if(data.longDescription.length > truncatedTextScreen()*12) {
				var logDesc = ($.trim(data.longDescription).substring(0, truncatedTextScreen()*7).split(' ').slice(0, -1).join(' ') + '...').replace(/\n/g, '<br/>');
				that.longdescription(logDesc);
				that.moreText(data.longDescription.replace(/\n/g, '<br/>'));
				that.moreButton(true);							
			}
			else {
				that.longdescription(data.longDescription.replace(/\n/g, '<br/>'));			
			}
		}
		else {
			if(data.longDescription == '' || typeof data.longDescription == 'undefined') {
				that.longdescription('This is the web page for '+that.title()+'. To follow '+that.title()+', click the Follow button below.');			
			}
		}
		that.url(data.normName + '.evernym.com');
		that.email(data.normName + '@evernym.com');
		that.showMainIcon(data);
		that.channelid(data.id);
		if(data.relationship == 'F' ) {
			that.channelAction(false);
			that.settings(true);			
			viewNavigate('Channels', 'channelsFollowingListView', 'channelMessagesView');			
		}
		else if(data.relationship == 'O') {
			if(data.longDescription == '' || typeof data.longDescription == 'undefined') {
			var account = JSON.parse(localStorage.getItem('account'));				
				that.longdescription("This is the web page for "+that.title()+". To follow "+that.title()+", click the Follow button below.<br/><br/>Hello, "+account.firstname+"!  Your channel needs a better description than what we came up with for you, so go ahead and type that in this box.<br/>Make sure to include an invitation for visitors to click the Follow button in order to get your channel's broadcasts.");							
			}				
			localStorage.setItem('channelOwner', 'yes');
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
			localStorage.setItem('currentChannelData', JSON.stringify(channel));
			that.settings(true);																
		}
		else {
			that.settings(false);			
			that.channelAction(true);			
		}
	}
    
	function postFollow(data){
	}
		
	function successfulGetChannel(data) {
		$.mobile.hidePageLoadingMsg();
	}
	
	function successfulDelete(data) {
		$.mobile.changePage("#" + channelListViewModel.template);
	}
	
	function successfulModify(data) { ;
	}
	
	function successfulFollowChannel() {
		$.mobile.hidePageLoadingMsg();
		//showMessage("Now Following Channel " + that.title());
		//localStorage.removeItem("currentChannel");
		//$.mobile.changePage("#" + channelsFollowingListViewModel.template);
		var toastobj = {redirect: 'channelMessagesView', type: '', text: 'Now following '+that.title()};
		showToast(toastobj);				
		goToView('channelMessagesView');
	}
	
	function successfulMessageGET(data) {
		$.mobile.hidePageLoadingMsg();
	}
	
	this.logoutCommand = function() {
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
			var toastobj = {redirect: 'channelListView', type: 'toast-error', text: details.message};
			showToast(toastobj);			
			goToView('channelListView');
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
		}
		else if (isBadLogin(details.code)){
			localStorage.setItem("action", 'follow_channel');
			$.mobile.changePage("#" + loginViewModel.template);
		}
		else {
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
	
	this.getChannelCommand = function (lchannelid) {
		//alert(lchannelid);
		$.mobile.showPageLoadingMsg("a", "Loading Channel");
		return ES.channelService.getChannel(lchannelid, {success: successfulGetChannel, error: errorAPIChannel});
	};
    
	this.showMoreMessagesCommand = function(){
		var last_message_id = that.messages()[that.messages().length - 1].id;
		$.mobile.showPageLoadingMsg("a", "Loading Messages");
		return ES.messageService.getChannelMessages(that.channelid(), {before: last_message_id}, {success: successfulMessageGET, error: errorRetrievingMessages}).then(gotMoreMessages);
	}
	
	// follow/unfollow will be called on the basis of channelAction value
	this.actionFollowChannelCommand = function() {
		localStorage.setItem("currentChannel", JSON.stringify(that.channelMessage()));
		if(localStorage.getItem('channelOwner') == 'yes') {
			var toastobj = {type: 'toast-info', text: 'See Channel Settings to receive your own broadcasts.'};
			showToast(toastobj);			
		} else {
			that.followChannelCommand();
		}
	}
	
	this.followChannelCommand = function() {
		that.messages([]);
		$.mobile.showPageLoadingMsg("a", "Requesting to Follow Channel");
		return ES.channelService.followChannel(that.channelid(), {success: successfulFollowChannel, error: errorFollowing});
	};	
	
	this.unfollowChannelCommand = function() {
		$.mobile.showPageLoadingMsg("a", "Requesting to Unfollow Channel");
		var callbacks = {
			success: function(){;},
			error: errorUnfollow
		};
		return ES.channelService.unfollowChannel(that.channelid(),callbacks).then(successfulUnfollowChannel);
	};
	
	function successfulUnfollowChannel(data){
		localStorage.removeItem("currentChannel");
		that.showChannelList();
	}
    
	function errorUnfollow(data, status, details) {
		$.mobile.hidePageLoadingMsg();
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);
	}
	
	this.deleteChannelCommand = function () {
		$.mobile.showPageLoadingMsg("a", "Removing Channel");
		return ES.channelService.deleteChannel(that.channelid(), { success: successfulDelete, error: errorAPI });
	};
    
	this.showMessage = function (message) {
		localStorage.setItem("currentMessage", JSON.stringify(message));
		$.mobile.changePage("#" + messageViewModel.template)
	};
		
	this.showChannelList = function() {
		var lrelationship = 'O';
		if (that.channel()[0]){
			lrelationship = that.channel()[0].relationship;
		}
		if (lrelationship && lrelationship == "F"){
			$.mobile.changePage("#" + channelsFollowingListViewModel.template);
		}
		else {
			$.mobile.changePage("#" + channelListViewModel.template);
		}
	}
	
	this.modifyChannelCommand = function() {
		//that.title("Channel: " + channel()[0].name );
		return ES.channelService.modifyChannel(channel()[0], {success: successfulModify, error: errorAPI});
	};
	
	this.showMore = function(){
		that.less(false);		
		that.more(true);
		that.moreButton(false);	
		that.lessButton(true);															
	};
	
	this.showLess = function(){
		that.less(true);		
		that.more(false);
		that.moreButton(true);
		that.lessButton(false);															
	};		
		
}
