/*globals ko*/
/* To do - Pradeep Kumar */
/* This ViewModel is for edit short description */
function ChannelEditDisplayNameViewModel() {	
  var that = this;
	this.template = 'channelEditDisplayNameView';
	this.viewid = 'V-16';
	this.viewname = 'ChannelEditDisplayName';
	this.displayname = 'Channel Edit Display Name';	  
	this.accountName = ko.observable();	
	this.notification = ko.observable();
	
  /* Edit Channel Display observable */
	this.channelId = ko.observable();
	this.channelEditDisplayName = ko.observable();	
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
    that.channelEditDisplayName('');
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
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'channelEditDisplayNameView') {
			that.changeChannelDisplayNameCommand();
		}
	});
	
	function successfulModify(args) {
    $.mobile.hidePageLoadingMsg();
    goToView('channelSettingsView');
  };

  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    goToView('channelEditDisplayNameView');
		that.message('');
		that.errorChannel('<span>SORRY :</span> '+response.message);
  };
	
  this.changeChannelDisplayNameCommand = function () {
		if (that.channelEditDisplayName() == '') {
      that.errorChannel('<span>SORRY :</span> Please enter channel display name');
    } else {
			var channelObject = {
				id: that.channelId(),
				description: that.channelEditDisplayName()
			};
			$.mobile.showPageLoadingMsg('a', 'Modifying Channel ');
			ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
		}
  };
	
}