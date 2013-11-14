﻿/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelSettingsViewModel() {	
  var that = this;
	this.template = 'channelSettingsView';
	this.viewid = 'V-16';
	this.viewname = 'ChannelSettings';
	this.displayname = 'Channel Settings';	
	this.accountName = ko.observable();	

  /* Channel Settings observable */
	this.channelId = ko.observable();	
	this.channelName = ko.observable();
	this.channelDisplayName = ko.observable();
	
	/* Methods */	
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};
	  
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();		
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			that.accountName(localStorage.getItem('accountName'));
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));
			that.channelId(channelObject.channelId);
			that.channelName(channelObject.channelName);
			that.channelDisplayName(channelObject.channelDescription);									
		}
	}
	
	this.editChannelName = function () {
		goToView('channelChangeNameView');
  };
	
	this.editShortDescription = function () {
		goToView('editShortDescriptionView');
  };
	
	this.editLongDescription = function () {
		goToView('editLongDescriptionView');
	};	
	
	this.deleteChannel = function () {
		goToView('channelDeleteView');
  };
	
	this.changeChannelIcon = function () {
		goToView('channelChangeIconView');
  };
	
}
