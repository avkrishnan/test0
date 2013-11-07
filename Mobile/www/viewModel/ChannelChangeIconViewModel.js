/*globals ko*/
function ChannelChangeIconViewModel() {	
  var that = this;
	this.template = 'channelChangeIconView';
	this.viewid = 'V-16';
	this.viewname = 'ChannelChangeIcon';
	this.displayname = 'Channel Chage Icon Image';	
	this.hasfooter = true;    
	this.accountName = ko.observable();	
	
  /* Channel Icon Image observable */
	this.picId = ko.observable();
	
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
	function successfulModify(args) {
    $.mobile.hidePageLoadingMsg();
    goToView('channelSettingsView');
  };

  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    goToView('channelChangeIconView');
  };
	
  this.changeChannelIconCommand = function () {
		var channelObject = {
			id: localStorage.getItem('currentChannelId'),
			picId: that.picId()
		};
		$.mobile.showPageLoadingMsg('a', 'Modifying Channel ');
		ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
  };
}