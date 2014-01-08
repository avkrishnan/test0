function NewFollowersSettingsViewModel() {
  var self = this;
	self.template = 'newFollowersSettingsView';
	self.viewid = 'V-??';
	self.viewname = 'Follower settings';
	self.displayname = 'New Followers Notification settings';
	
  self.inputObs = [ 'channelId', 'offText', 'normalText', 'fastText', 'offClass', 'normalClass', 'fastClass', 'escLevel', 'duration', 'activeType'];
	self.defineObservables();	
	
	self.activate = function() {
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));
		if(!channelObject) {
			goToView('channelsIOwnView');
		} else {		
			addExternalMarkup(self.template); // this is for header/overlay message
			self.channelId(channelObject.channelId);
			self.offText('');		
			self.normalText('colornormal');
			self.fastText('');
			self.offClass('');		
			self.normalClass('bgnormal');
			self.fastClass('');
			self.duration("Normal: <em>Send once (usually to email)</em>");
			self.activeType('normalcolor');								
			self.escLevel('N');
		}
	};

	self.offYes = function () {
		self.offText('coloroff');		
		self.normalText('');
		self.fastText('');	
		self.offClass('bgoff');
		self.normalClass('');
		self.fastClass('');
		self.duration('');								
		self.escLevel('O');		
  };
	
	self.normalYes = function () {
		self.offText('');		
		self.normalText('colornormal');
		self.fastText('');
		self.offClass('');		
		self.normalClass('bgnormal');
		self.fastClass('');
    self.duration("Normal: <em>Send once (usually to email)</em>");
		self.activeType('normalcolor');								
		self.escLevel('N');		
  };
	
	self.fastYes = function () {
		self.offText('');		
		self.normalText('');
		self.fastText('colorfast');
		self.offClass('');				
		self.normalClass('');
		self.fastClass('bgfast');
    self.duration("Fast: <em>Send once (usually text or app)</em>");
		self.activeType('fastcolor');							
		self.escLevel('F');						
  };
	
	self.saveCommand = function () {
		if(self.escLevel() == 'O') {
			ES.channelService.removeChnlSetting(self.channelId(), 'NEW_FLWR_NOTIF');
			var toastobj = {redirect: 'channelSettingsView', type: '', text: 'Notify me of new followers no longer required'};
			showToast(toastobj);			
		}
		else {
			var setting = {};
      setting.NEW_FLWR_NOTIF = self.escLevel();				
			ES.channelService.putChnlSettings(self.channelId(), setting);
			var setType = 'Normal';
			if(self.escLevel() == 'F') {
				var setType = 'Fast';
			}
			var toastobj = {redirect: 'channelSettingsView', type: '', text: 'Notify me of new followers is set to '+setType};
			showToast(toastobj);			
		}
		popBackNav();
  };
	
}

NewFollowersSettingsViewModel.prototype = new ENYM.ViewModel();
NewFollowersSettingsViewModel.prototype.constructor = NewFollowersSettingsViewModel;