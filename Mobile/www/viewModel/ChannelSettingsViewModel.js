﻿/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelSettingsViewModel() {	
  var that = this;
	this.template = 'channelSettingsView';
	this.viewid = 'V-16';
	this.viewname = 'Settings';
	this.displayname = 'Channel Settings';	
	this.accountName = ko.observable();	

  /* Channel Settings observable */
	this.channelId = ko.observable();	
	this.channelName = ko.observable();
	this.shortDescription = ko.observable();
	this.toastText = ko.observable();
	this.toastClass = ko.observable();		
	
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
			addExternalMarkup(that.template); // this is for header/overlay message			
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');												
			}					
			that.accountName(localStorage.getItem('accountName'));
			that.channelId(channelObject.channelId);
			that.channelName(channelObject.channelName);
			that.shortDescription(channelObject.channelDescription);
			localStorage.removeItem('channelOwner');										
		}
	}
	
	this.changeChannelIcon = function() {
		//viewNavigate('Settings', 'channelSettingsView', 'channelChangeIconView');
		that.toastClass('toast-info');
		that.toastText('Feature coming soon!');
		showToast();		
	}
	
	this.makeChannelPublic = function() {
		that.toastClass('toast-info');		
		that.toastText('Feature coming soon!');
		showToast();		
	}
	
	this.hideChannelHistory = function() {
		that.toastClass('toast-info');		
		that.toastText('Feature coming soon!');
		showToast();		
	}
	
	this.approvalRequired = function() {
		that.toastClass('toast-info');		
		that.toastText('Feature coming soon!');
		showToast();		
	}			
	
}
