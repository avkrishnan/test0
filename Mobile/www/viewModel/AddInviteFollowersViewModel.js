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
			if(ENYM.ctx.getItem('counter') == 1) {
				ENYM.ctx.setItem('counter', 2);
			} else if(ENYM.ctx.getItem('counter') == 2){		
				ENYM.ctx.setItem('counter', 3);
			}	else if(ENYM.ctx.getItem('counter') == 3){
				ENYM.ctx.setItem('counter', 4);
			}	else {
				ENYM.ctx.setItem('counter', 1);
			}										
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