/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelSettingsViewModel() {	
  var that = this;
	this.template = 'channelSettingsView';
	this.viewid = 'V-16';
	this.viewname = 'Settings';
	this.displayname = 'Channel Settings';	
	this.accountName = ko.observable();	

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
			addExternalMarkup(that.template); // this is for header/overlay message								
			that.accountName(localStorage.getItem('accountName'));
			that.channelId(channelObject.channelId);
			that.channelName(channelObject.channelName);
			that.shortDescription(channelObject.channelDescription);
			localStorage.removeItem('channelOwner');										
		}
	}
	
	this.comingSoon = function() {
		//viewNavigate('Settings', 'channelSettingsView', 'channelChangeIconView');		
		var toastobj = {type: 'toast-info', text: 'Feature coming soon!'};
		showToast(toastobj);		
	}		
	
}
