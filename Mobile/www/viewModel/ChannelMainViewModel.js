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
	this.channelName = ko.observable();		
	
	/* Methods */
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
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			var _accountName = localStorage.getItem('accountName');
			that.accountName(_accountName);
			return this.getChannelCommand();
			goToView('channelMainView');
		}
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
		var channelId = localStorage.getItem('currentChannelId');
		$.mobile.showPageLoadingMsg('a', 'Loading Channel');
		return ES.channelService.getChannel(channelId, {success: successfulGetChannel, error: errorAPI});
  };
}