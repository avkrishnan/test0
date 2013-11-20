﻿/*globals ko*/
/* To do - Pradeep Kumar */
function AddInviteFollowersViewModel() {	
  var that = this;
	this.template = 'addInviteFollowersView';
	this.viewid = 'V-27';
	this.viewname = 'AddInviteFollowers';
	this.displayname = 'Add/Invite Followers';	
	this.accountName = ko.observable();	
	this.backText = ko.observable();	
	
  /* Add/Invite Followers observable */
	this.channelName = ko.observable();	
	this.channelWebAddress = ko.observable();
	this.toastText = ko.observable();				
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  
	
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));		
		if(token == '' || token == null) {
			goToView('loginView');
		} else if(!channelObject) {
			goToView('channelsIOwnView');			
		} else {
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}			
			that.accountName(localStorage.getItem('accountName'));
			that.backText('<em></em>'+backNavText[backNavText.length-1]);			
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));
			if(localStorage.getItem('counter') == 1) {
				localStorage.setItem('counter', 2);
			} else if(localStorage.getItem('counter') == 2){		
				localStorage.setItem('counter', 3);
			}	else if(localStorage.getItem('counter') == 3){
				localStorage.setItem('counter', 4);
			}	else {
				localStorage.setItem('counter', 1);
			}										
			that.channelName(channelObject.channelName);
			that.channelWebAddress(channelObject.channelName+'.evernym.com');			
		}
	}
	
	this.backCommand = function () {
		popBackNav();
  };
	
	this.menuCommand = function () {
		pushBackNav('Add/Invite', 'addInviteFollowersView', 'channelMenuView');		
  };	
	
	this.channelSettings = function(){
		pushBackNav('Add/Invite', 'addInviteFollowersView', 'channelSettingsView');				
	};
	
	this.inviteFollowers = function(){
		showMessage('Feature coming soon!');		
	};
	
	this.addFollowers = function(){
		showMessage('Feature coming soon!');
	};
	
	this.userSettings = function () {
		pushBackNav('Add/Invite', 'addInviteFollowersView', 'escalationPlansView');		
  };	
	
	this.composeCommand = function () {
		pushBackNav('Add/Invite', 'addInviteFollowersView', 'sendMessageView');		
  };	
	
}