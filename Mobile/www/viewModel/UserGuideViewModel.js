function UserGuideViewModel() {
  var self = this;
  self.template = 'userGuideView';
  self.viewid = 'V-??';
  self.viewname = 'User Guide';
  self.displayname = 'User Guide';
	
	self.sectionOne = ko.observable(true);
	self.sectionTwo = ko.observable(false);	
	
  self.activate = function() {		
		var newUser = ENYM.ctx.getItem('newusername');
		if(newUser == '' || newUser == null) {
				goToView('homeView');
		}
		self.sectionOne(true);
		self.sectionTwo(false);		
  	addExternalMarkup(self.template); // this is for header/overlay message									
	};

  self.goToNext = function() {
		self.sectionOne(false);
		self.sectionTwo(true);
	};
	
  self.okGotIt = function() {
		ENYM.ctx.removeItem('newuseremail');
		ENYM.ctx.removeItem('newusername');
		ENYM.ctx.removeItem('newuserpassword');	
    if(ENYM.ctx.getItem("action") == 'follow_channel') {
			var callbacks = {
				success: function() {
					ENYM.ctx.removeItem('action');
					var toastobj = {redirect: 'channelMessagesView', type: '', text: 'Now following '+channel.name};
					showToast(toastobj);
					goToView('channelMessagesView');					
				},
				error: function(data, status, details) {
					var toastobj = {type: 'toast-error', text: details.message};
					showToast(toastobj);
				}
			};						
			var channel = JSON.parse(ENYM.ctx.getItem('currentChannel'));
			ES.channelService.followChannel(channel.id, callbacks);
		}
		else {
			goToView('homeView');
		}
  }	
}

UserGuideViewModel.prototype = new ENYM.ViewModel();
UserGuideViewModel.prototype.constructor = UserGuideViewModel;