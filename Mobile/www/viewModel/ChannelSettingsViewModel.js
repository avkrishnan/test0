function ChannelSettingsViewModel() {	
  var self = this;
	self.template = 'channelSettingsView';
	self.viewid = 'V-16';
	self.viewname = 'Settings';
	self.displayname = 'Channel Settings';
	
  self.inputObs = [ 'channelId', 'channelName', 'shortDescription', 'yesShare', 'noShare', 'yesNotify', 'noNotify'];
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
			self.yesNotify('nobutton');
			self.noNotify('yesbutton');								
			ENYM.ctx.removeItem('channelOwner');
			ES.channelService.getFollowerReq(self.channelId()).then(getSuccess);
			ES.channelService.getChnlSettings(self.channelId()).then(getSettings);				
		}
	};	
	
	function getSuccess(data) {	
		if(data == '') {
			self.yesShare('yesbutton');
			self.noShare('nobutton');		
		}
	}
	
	function getSettings(data) {
		if(typeof data.NEW_FLWR_NOTIF == 'undefined') {
			self.yesNotify('yesbutton');
			self.noNotify('nobutton');				
		}		
	}	
	
	self.comingSoon = function() {
		headerViewModel.comingSoon();		
	};
	
	self.requiredYes = function(data) {
		if(data == 'Share') {
			self.yesShare('nobutton');
			self.noShare('yesbutton');
			var toastobj = {type: '', text: 'First/Last name now required'};
			showToast(toastobj);		
			ES.channelService.addFollowerReq(self.channelId(), 'SHARE_NAME');			
		}
		else if(data == 'Notify') {
			viewNavigate('Settings', 'channelSettingsView', 'newFollowersSettingsView');
		}				
	};
	
	self.requiredNo = function(data) {
		if(data == 'Share') {
			self.yesShare('yesbutton');
			self.noShare('nobutton');
			var toastobj = {type: '', text: 'First/Last name no longer required'};
			showToast(toastobj);		
			ES.channelService.removeFollowerReq(self.channelId(), 'SHARE_NAME');			
		}
		else if(data == 'Notify') {
			self.yesNotify('yesbutton');
			self.noNotify('nobutton');
			var toastobj = {type: '', text: 'Notify me of new followers no longer required'};
			showToast(toastobj);
			ES.channelService.removeChnlSetting(self.channelId(), 'NEW_FLWR_NOTIF');		
		}						
	};		
		
}

ChannelSettingsViewModel.prototype = new ENYM.ViewModel();
ChannelSettingsViewModel.prototype.constructor = ChannelSettingsViewModel;