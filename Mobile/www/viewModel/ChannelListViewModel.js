﻿/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelListViewModel() {
  var that = this;
  this.template = 'channelListView';
  this.viewid = 'V-40';
  this.viewname = 'ChannelsIOwn';
  this.displayname = 'My Channels';
  this.accountName = ko.observable();
	this.responseData = ko.observable();
	
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
		} 
		else {
			that.accountName(localStorage.getItem('accountName'));
		}
	}
	
	this.goChannelsIOwn = function() {
		goToView('channelsIOwnView')
	}
	
}