/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelSettingsViewModel() {	
  var that = this;
	this.template = 'channelSettingsView';
	this.viewid = 'V-16';
	this.viewname = 'ChannelSettings';
	this.displayname = 'Channel Settings';	
	this.accountName = ko.observable();	
	this.backText = ko.observable();

  /* Channel Settings observable */
	this.channelId = ko.observable();	
	this.channelName = ko.observable();
	this.shortDescription = ko.observable();
	
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
			that.backText('<em></em>'+backNavText[backNavText.length-1]);	
			that.channelId(channelObject.channelId);
			that.channelName(channelObject.channelName);
			that.shortDescription(channelObject.channelDescription);							
		}
	}
	
	this.backCommand = function () {
		popBackNav();
  };
	
	this.menuCommand = function () {
		pushBackNav('Settings', 'channelSettingsView', 'channelMenuView');		
  };	
	
	this.editChannelName = function () {
		goToView('channelChangeNameView');
  };
	
	this.editShortDescription = function () {
		goToView('editShortDescriptionView');
  };
	
	this.editLongDescription = function () {
		goToView('editLongDescriptionView');
	};	
	
	this.deleteChannel = function () {
		goToView('channelDeleteView');
  };
	
	this.changeChannelIcon = function () {
		goToView('channelChangeIconView');
  };
	
	this.userSettings = function () {
		pushBackNav('Settings', 'channelSettingsView', 'escalationPlansView');		
  };	
	
	this.composeCommand = function () {
		pushBackNav('Settings', 'channelSettingsView', 'sendMessageView');		
  };	
	
}
