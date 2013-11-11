/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelSettingsViewModel() {	
  var that = this;
	this.template = 'channelSettingsView';
	this.viewid = 'V-16';
	this.viewname = 'ChannelSettings';
	this.displayname = 'Channel Settings';	
	this.accountName = ko.observable();	

  /* Channel Settings observable */
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
			return this.getChannelCommand();
			goToView('channelSettingsView');
		}
	}
	
	this.editChannelName = function () {
		goToView('channelChangeNameView');
  };
	
	this.editChannelDisplayName = function () {
		goToView('channelEditDisplayNameView');
  };
	
	this.deleteChannel = function () {
		goToView('channelDeleteView');
  };
	
	this.changeChannelIcon = function () {
		goToView('channelChangeIconView');
  };
	
	function successfulGetChannel(data) {
		$.mobile.hidePageLoadingMsg();
		localStorage.setItem('currentChannelName', data.name);
		localStorage.setItem('currentChannelDescription', data.description);
		that.channelName(localStorage.getItem('currentChannelName'));
		that.channelDisplayName(localStorage.getItem('currentChannelDescription'));
  };

  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    localStorage.setItem('signUpError', response.message);
    goToView('channelSettingsView')
  };
	
  this.getChannelCommand = function () {
		var channelId = localStorage.getItem('currentChannelId');
		$.mobile.showPageLoadingMsg('a', 'Loading Channel');
		return ES.channelService.getChannel(channelId, {success: successfulGetChannel, error: errorAPI});
  };
	
}
