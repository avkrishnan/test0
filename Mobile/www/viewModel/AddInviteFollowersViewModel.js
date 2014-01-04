function AddInviteFollowersViewModel() {	
  var self = this;
	self.template = 'addInviteFollowersView';
	self.viewid = 'V-27';
	self.viewname = 'Add/Invite';
	self.displayname = 'Add/Invite Followers';	
	
  self.inputObs = [ 'channelName', 'channelWebAddress'];
	self.defineObservables();		
	
	self.activate = function() {
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));		
		if(!channelObject) {
			goToView('channelsIOwnView');			
		} else {
			addExternalMarkup(self.template); // this is for header/overlay message						
			self.accountName(ENYM.ctx.getItem('accountName'));	
			var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));										
			self.channelName(channelObject.channelName);
			self.channelWebAddress(channelObject.channelName+'.evernym.com');			
		}
	};
	
	self.comingSoon = function(){
		headerViewModel.comingSoon();	
	};
}

AddInviteFollowersViewModel.prototype = new ENYM.ViewModel();
AddInviteFollowersViewModel.prototype.constructor = AddInviteFollowersViewModel;