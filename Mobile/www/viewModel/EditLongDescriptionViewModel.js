﻿/*globals ko*/
/* To do - Pradeep Kumar */
function EditLongDescriptionViewModel() {	
  var that = this;
	this.template = 'editLongDescriptionView';
	this.viewid = 'V-67';
	this.viewname = 'EditLongDescription';
	this.displayname = 'Edit Long Description';	  
	this.accountName = ko.observable();	
	this.notification = ko.observable();
	
  /* Edit Channel Display observable */
	this.channelId = ko.observable();
	this.longDescription = ko.observable();	
	this.errorMessage = ko.observable(false);	
	this.errorChannel = ko.observable();
	this.toastText = ko.observable();	
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.clearForm();			
      that.activate();			
    });	
	};  
	
	this.clearForm = function () {
    that.longDescription('');
		that.errorMessage(false);		
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
			that.longDescription(channelObject.longDescription);						
			$('textarea').keyup(function () {
				that.errorMessage(false);				
				that.errorChannel('');
			});
		}
	}
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13  && e.target.nodeName != 'TEXTAREA' && $.mobile.activePage.attr('id') == 'editLongDescriptionView') {
			that.longDescriptionCommand();
		}
	});
	
	this.menuCommand = function () {
		pushBackNav('Edit Long Descriptiono', 'editLongDescriptionView', 'channelMenuView');
  };	
	
	function successfulModify(args) {
		that.toastText('Description changed');		
		localStorage.setItem('toastData', that.toastText());		
		$.mobile.showPageLoadingMsg('a', 'Loading channel settings');
		ES.channelService.getChannel(that.channelId(), {success: successfulGetChannel, error: errorAPI});		
  };
	
	function successfulGetChannel(data) {
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
    goToView('channelSettingsView');					
	}

  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    goToView('longDescriptionView');
		that.errorMessage(true);	
		that.errorChannel('<span>SORRY:</span> '+response.message);
  };
	
  this.longDescriptionCommand = function () {
		if (that.longDescription() == '' || typeof that.longDescription() == 'undefined') {
			that.errorMessage(true);						
      that.errorChannel('<span>SORRY:</span> Please enter long description');
    } else {
			var channelObject = {
				id: that.channelId(),
				longDescription: that.longDescription()
			};
			$.mobile.showPageLoadingMsg('a', 'Modifying Channel ');
			ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
		}
  };
	
	this.userSettings = function () {
		pushBackNav('Edit Long Descriptiono', 'editLongDescriptionView', 'escalationPlansView');
		goToView('escalationPlansView');
  };	
	
	this.composeCommand = function () {
		pushBackNav('Edit Long Descriptiono', 'editLongDescriptionView', 'sendMessageView');
		goToView('sendMessageView');
  };	
	
}