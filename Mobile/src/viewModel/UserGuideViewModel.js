﻿function UserGuideViewModel() {
  var self = this;
  self.template = 'userGuideView';
  self.viewid = 'V-??';
  self.viewname = 'User Guide';
  self.displayname = 'User Guide';
	
	self.sectionOne = ko.observable(true);
	self.sectionTwo = ko.observable(false);	
	
  self.activate = function() {		
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
		var action = JSON.parse(ENYM.ctx.getItem('action'));			
    if(action && action.follow_channel == 'Y') {
			ENYM.ctx.removeItem('action');
			goToView('channelsFollowingListView');					
		}
		else {
			if(ENYM.ctx.getItem('evernymIntro')) {
				ENYM.ctx.removeItem('evernymIntro')
				goToView('userSettingsView');
			}
			else {
				goToView('homeView');
			}
		}
  };
	
};

UserGuideViewModel.prototype = new ENYM.ViewModel();
UserGuideViewModel.prototype.constructor = UserGuideViewModel;