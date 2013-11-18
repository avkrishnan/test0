/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelDeleteViewModel() {	
  var that = this;
	this.template = 'channelDeleteView';
	this.viewid = 'V-16';
	this.viewname = 'ChannelDeleteView';
	this.displayname = 'Channel Delete';	
	this.accountName = ko.observable();		
	
  /* Channel delete observable */
	this.channelId = ko.observable();
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
		var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));		
		if(token == '' || token == null) {
			goToView('loginView');
		} else if(!channelObject) {
			goToView('channelsIOwnView');			
		} else {
			that.accountName(localStorage.getItem('accountName'));	
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));
			that.channelId(channelObject.channelId);
			that.channelName(channelObject.channelName);
			that.channelDisplayName(channelObject.channeldescription);			
		}
	}
	
	this.menuCommand = function () {
		pushBackNav('Channel Delete', 'ChannelDeleteView', 'channelMenuView');		
  };	

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
	
	this.userSettings = function () {
		pushBackNav('Channel Delete', 'ChannelDeleteView', 'escalationPlansView');		
  };	
	
	this.composeCommand = function () {
		pushBackNav('Channel Delete', 'ChannelDeleteView', 'sendMessageView');		
  };	
	
}