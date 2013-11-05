/*globals ko*/
function ChannelMainViewModel() {	
  var that = this;
	this.template = 'channelMainView';
	this.viewid = 'V-46';
	this.viewname = 'ChannelMain';
	this.displayname = 'Channel Main';	
	this.hasfooter = true;    
	this.channels = ko.observableArray([]);
	this.accountName = ko.observable();	
	this.notification = ko.observable();
	
  /* Channel Main observable */	
	this.channelId = ko.observable();		
	this.channelName = ko.observable();		
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  
	
	var token = ES.evernymService.getAccessToken();
	var channelId = localStorage.getItem('currentChannelId');
	this.activate = function() {
		/*if(token == '' || token == null) {
			goToView('loginView');
		} else if(channelId == '' || channelId == null) {
			goToView('channelsIOwnView');
		} else {}*/
			var _accountName = localStorage.getItem('accountName');
			that.accountName(_accountName);
			that.channelId(localStorage.getItem('currentChannelId'));
			return this.getChannelCommand();
			goToView('channelMainView');
	}
	
	this.channelSettings = function(){
		goToView('channelSettingsView');
	};
	
	function successfulGetChannel(data) {
		$.mobile.hidePageLoadingMsg();
		localStorage.setItem('currentChannelName', data.name);
		that.channelName(localStorage.getItem('currentChannelName'));
  };

  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    localStorage.setItem('signUpError', response.message);
    goToView('channelMainView');
  };
	
  this.getChannelCommand = function () {
		$.mobile.showPageLoadingMsg('a', 'Loading Channel');
		return ES.channelService.getChannel(that.channelId(), {success: successfulGetChannel, error: errorAPI});
  };
}