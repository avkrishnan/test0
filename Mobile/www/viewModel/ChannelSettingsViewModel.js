function ChannelSettingsViewModel() {	
  var self = this;
	self.template = 'channelSettingsView';
	self.viewid = 'V-16';
	self.viewname = 'Settings';
	self.displayname = 'Channel Settings';
	
  self.inputObs = [ 'channelId', 'channelName', 'shortDescription', 'yesShare', 'noShare' ];
	self.defineObservables();		
	  
	self.activate = function() {				
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));			
		if(!channelObject) {
			goToView('channelsIOwnView');
		} else {
			addExternalMarkup(self.template); // this is for header/overlay message
			self.channelId(channelObject.channelId);
			self.channelName(channelObject.channelName);
			self.shortDescription(channelObject.channelDescription);
			self.yesShare('yesbutton');
			self.noShare('nobutton');				
			ENYM.ctx.removeItem('channelOwner');
			var data = ES.channelService.getChnlSettings(self.channelId());
			var setting = {};
			setting.SHARE_NAME = 'Y';
			//return ES.channelService.putChnlSettings(self.channelId(), setting);								
		}
	};	
	
	self.comingSoon = function() {
		headerViewModel.comingSoon();		
	};
	
	self.requiredYes = function() {
		self.yesShare('nobutton');
		self.noShare('yesbutton');		
	};
	
	self.requiredNo = function() {
		self.yesShare('yesbutton');
		self.noShare('nobutton');				
	};	
		
}

ChannelSettingsViewModel.prototype = new ENYM.ViewModel();
ChannelSettingsViewModel.prototype.constructor = ChannelSettingsViewModel;