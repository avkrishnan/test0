/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelChangeIconViewModel() {	
  var that = this;
	this.template = 'channelChangeIconView';
	this.viewid = 'V-16';
	this.viewname = 'ChannelChangeIcon';
	this.displayname = 'Channel Chage Icon Image';	   
	this.accountName = ko.observable();	
	
  /* Channel Icon Image observable */
	this.channelId = ko.observable();	
	this.picId = ko.observable();
	this.toastText = ko.observable();	
	
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
		}
	}
	
	this.menuCommand = function () {
		pushBackNav('Change Icon', 'channelChangeIconView', 'channelMenuView');		
  };	
	
	function successfulModify(args) {
		that.toastText('Description changed');		
		localStorage.setItem('toastData', that.toastText());
    goToView('channelSettingsView');
  };

  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    showError(response.message);
  };
	
  this.changeChannelIconCommand = function () {
		var channelObject = {
			id: that.channelId(),
			picId: that.picId()
		};
		$.mobile.showPageLoadingMsg('a', 'Modifying Channel ');
		ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
  };
	
	this.userSettings = function () {
		pushBackNav('Change Icon', 'channelChangeIconView', 'escalationPlansView');		
  };	
	
	this.composeCommand = function () {
		pushBackNav('Change Icon', 'channelChangeIconView', 'sendMessageView');		
  };	
	
}