/*globals ko*/

function ChannelDeleteViewModel() {	
  var that = this;
	this.template = 'channelDeleteView';
	this.viewid = 'V-16';
	this.viewname = 'ChannelDeleteView';
	this.displayname = 'Channel Delete';	
	this.hasfooter = true;    
	this.accountName = ko.observable();	
	this.notification = ko.observable();
	
  /* Channel delete observable */
	this.channelId = ko.observable();
	this.channelName = ko.observable();
	this.channelDisplayName = ko.observable();					
	
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
			that.channelId(localStorage.getItem('currentChannelId'));
			that.channelName(localStorage.getItem('currentChannelName'));
			that.channelDisplayName(localStorage.getItem('currentChannelDescription'));
		}
	}

	function successfulDelete(args) {
    $.mobile.hidePageLoadingMsg();
    goToView('channelsIOwnView');
  };

  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    localStorage.setItem('signUpError', response.message);
    goToView('channelDeleteView');
  };
	
  this.channelDeleteCommand = function () {
		$.mobile.showPageLoadingMsg('a', 'Removing Channel');
		return ES.channelService.deleteChannel(that.channelId(), { success: successfulDelete, error: errorAPI });
		localStorage.removeItem('currentChannel');
  };
}