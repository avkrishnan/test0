﻿/*globals ko*/
/* To do - Pradeep Kumar */
function AboutEvernymViewModel() {	
  var that = this;
	this.template = 'aboutEvernymView';
	this.viewid = 'V-46';
	this.viewname = 'AboutEvernym';
	this.displayname = 'About Evernym Channels';	
	this.accountName = ko.observable();	
	
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
		}
	}
	
}