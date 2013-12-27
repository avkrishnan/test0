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
		if(authenticate()) {
			var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));			
			if(!channelObject) {
				goToView('channelsIOwnView');
			} else {
				addExternalMarkup(that.template); // this is for header/overlay message								
				that.accountName(ENYM.ctx.getItem('accountName'));
				that.channelId(channelObject.channelId);
				that.channelName(channelObject.channelName);
				that.shortDescription(channelObject.channelDescription);
				ENYM.ctx.removeItem('channelOwner');										
			}
		}
	}
	
	this.comingSoon = function() {
		//viewNavigate('Settings', 'channelSettingsView', 'channelChangeIconView');		
		headerViewModel.comingSoon();		
	}		
	
}
