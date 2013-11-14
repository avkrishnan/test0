﻿/*globals ko*/
/* To do - Pradeep Kumar */
function EditShortDescriptionViewModel() {	
  var that = this;
	this.template = 'editShortDescriptionView';
	this.viewid = 'V-66';
	this.viewname = 'EditShortDescription';
	this.displayname = 'Edit Short Description';	  
	this.accountName = ko.observable();	
	this.notification = ko.observable();
	
  /* Edit Channel Display observable */
	this.channelId = ko.observable();
	this.shortDescription = ko.observable();	
	this.message = ko.observable();	
	this.errorChannel = ko.observable();
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.clearForm();			
      that.activate();			
    });	
	};  
	
	this.clearForm = function () {
    that.shortDescription('');
		that.message('');
		that.errorChannel('');		
  };
	
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			that.accountName(localStorage.getItem('accountName'));
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));
			that.channelId(channelObject.channelId);			
			$('input').keyup(function () {
				that.message('');
				that.errorChannel('');
			});
		}
	}
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13  && e.target.nodeName != 'TEXTAREA' && $.mobile.activePage.attr('id') == 'editShortDescriptionView') {
			that.shortDescriptionCommand();
		}
	});
	
	function successfulModify(args) {
    $.mobile.hidePageLoadingMsg();
    goToView('channelSettingsView');
  };

  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    goToView('shortDescriptionView');
		that.message('');
		that.errorChannel('<span>SORRY :</span> '+response.message);
  };
	
  this.shortDescriptionCommand = function () {
		if (that.shortDescription() == '') {
      that.errorChannel('<span>SORRY :</span> Please enter short description');
    } else {
			var channelObject = {
				id: that.channelId(),
				description: that.shortDescription()
			};
			$.mobile.showPageLoadingMsg('a', 'Modifying Channel ');
			ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
		}
  };
	
}