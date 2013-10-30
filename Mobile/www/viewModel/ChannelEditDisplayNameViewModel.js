﻿/*globals ko*/

function ChannelEditDisplayNameViewModel() {	
  var that = this;
	this.template = 'channelEditDisplayNameView';
	this.viewid = 'V-16';
	this.viewname = 'ChannelEditDisplayName';
	this.displayname = 'Channel Edit Display Name';	
	this.hasfooter = true;    
	this.accountName = ko.observable();	
	this.notification = ko.observable();
	
  /* Edit Channel Display observable */
	this.channelEditDisplayName = ko.observable('');	
	this.message = ko.observable();	
	this.errorChannel = ko.observable();
	
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      if ($.mobile.pageData && $.mobile.pageData.a) {
        if ($.mobile.pageData.a == 'logout') {
          that.logoutCommand();
        }
      }
      that.activate();
    });	
	};  
	this.activate = function() {
		var _accountName = localStorage.getItem('accountName');
		that.accountName(_accountName);
		$('input').keyup(function () {
      that.message('');
			that.errorChannel('');
    });
	}
	this.clearForm = function () {
    that.channelEditDisplayName('');
  };
	function successfulModify(args) {
    $.mobile.hidePageLoadingMsg();
    goToView('channelsIOwnView');
  };

  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    goToView('channelEditDisplayNameView');
		that.message('');
		that.errorChannel('<span>SORRY:</span> '+response.message);
  };
	
  this.changeChannelDisplayNameCommand = function () {
		if (that.channelEditDisplayName() == '') {
      that.errorChannel('<span>SORRY:</span> Please enter channel display name');
    } else {
			var channelObject = {
				id: localStorage.getItem('currentChannelId'),
				description: that.channelEditDisplayName()
			};
			$.mobile.showPageLoadingMsg("a", "Modifying Channel ");
			ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
		}
  };
}