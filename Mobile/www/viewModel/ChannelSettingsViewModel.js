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
			self.yesShare('nobutton');
			self.noShare('yesbutton');				
			ENYM.ctx.removeItem('channelOwner');
			return ES.channelService.getFollowerReq(self.channelId()).then(getSuccess);				
		}
	};	
	
	function getSuccess(data) {
		if(data == '') {
			self.yesShare('yesbutton');
			self.noShare('nobutton');		
		}
	}
	
	self.comingSoon = function() {
		headerViewModel.comingSoon();		
	};
	
	self.requiredYes = function() {
		self.yesShare('nobutton');
		self.noShare('yesbutton');
		var toastobj = {type: '', text: 'First/Last name now required'};
		showToast(toastobj);		
		ES.channelService.addFollowerReq(self.channelId(), 'SHARE_NAME');					
	};
	
	self.requiredNo = function() {
		self.yesShare('yesbutton');
		self.noShare('nobutton');
		var toastobj = {type: '', text: 'First/Last name no longer required'};
		showToast(toastobj);		
		ES.channelService.removeFollowerReq(self.channelId(), 'SHARE_NAME');				
	};	
		
}

ChannelSettingsViewModel.prototype = new ENYM.ViewModel();
ChannelSettingsViewModel.prototype.constructor = ChannelSettingsViewModel;