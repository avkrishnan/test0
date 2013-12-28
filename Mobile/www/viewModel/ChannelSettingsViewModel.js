function ChannelSettingsViewModel() {	
  var self = this;
	self.template = 'channelSettingsView';
	self.viewid = 'V-16';
	self.viewname = 'Settings';
	self.displayname = 'Channel Settings';
	
  self.inputObs = [ 'channelId', 'channelName', 'shortDescription'];
	self.defineObservables();		
	  
	self.activate = function() {				
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));			
		if(!channelObject) {
			goToView('channelsIOwnView');
		} else {
			addExternalMarkup(self.template); // this is for header/overlay message								
			self.accountName(ENYM.ctx.getItem('accountName'));
			self.channelId(channelObject.channelId);
			self.channelName(channelObject.channelName);
			self.shortDescription(channelObject.channelDescription);
			ENYM.ctx.removeItem('channelOwner');										
		}
	};
	
	self.comingSoon = function() {
		headerViewModel.comingSoon();		
	};
}

ChannelSettingsViewModel.prototype = new ENYM.ViewModel();
ChannelSettingsViewModel.prototype.constructor = ChannelSettingsViewModel;