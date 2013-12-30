function ChannelNewViewModel() {	
  var self = this;
	self.template = 'channelNewView';
	self.viewid = 'V-13';
	self.viewname = 'New Chan';
	self.displayname = 'Create a channel';
	
	self.sectionOne = ko.observable(true);
	self.sectionTwo = ko.observable(false);
	
  self.inputObs = [ 'newChannel', 'message', 'channelName', 'channelWebAddress'];
	self.errorObs = [ 'errorNewChannel', 'channelClass'];
  self.defineObservables();
	  
	self.activate = function() {
		addExternalMarkup(self.template); // this is for header/overlay message					
		self.sectionOne(true);
		self.sectionTwo(false);					
		$('input').keyup(function () {
			self.clearErrorObs();
		});							
	}
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13 && $.mobile.activePage.attr('id') == 'channelNewView') {
			self.createChannelCommand();
		}
	});	

	self.createChannelCommand = function () {
		var nameReg = /^[a-zA-Z0-9._-]+$/;
    if (self.newChannel() == '') {
			self.channelClass('validationerror');
      self.errorNewChannel('<span>SORRY:</span> Please enter channel name');
    } else if (self.newChannel().match(/\s/)) {
			self.channelClass('validationerror');
			self.errorNewChannel('<span>SORRY:</span> Please choose a short name with no spaces');
		} else if(!nameReg.test(self.newChannel())) {
			self.channelClass('validationerror');
			self.errorNewChannel('<span>SORRY:</span> Only letters, numbers, (.), (-), and (_) allowed.');
		} else if(self.newChannel().length < 5 || self.newChannel().length > 25) {
			self.channelClass('validationerror');
			self.errorNewChannel('<span>SORRY:</span> Name min. 5 and max. 25 characters');			
		} else {
			$.mobile.showPageLoadingMsg('a', 'Checking channel name availability');
			ES.loginService.checkName(self.newChannel(), { success: successAvailable, error: errorAPI });			
    }
  };
	
	function successfulCreate(data) {
    $.mobile.hidePageLoadingMsg();
		if(data.followers == 1) {
			var followers = data.followers +' follower';
		} else {
			var followers = data.followers +' followers';
		}		
		var channel = [];			
		channel.push({
			channelId: data.id, 
			channelName: data.name, 
			channelDescription: data.description,
			longDescription: data.longDescription,			
			followerCount: followers
		});
		channel = channel[0];		
		ENYM.ctx.setItem('currentChannelData', JSON.stringify(channel));					
		var toastobj = {type: '', text: 'Channel created'};
		showToast(toastobj);				
  };
	
	function successAvailable(data){
		if(data){
			self.channelClass('validationerror');
      self.errorNewChannel('<span>SORRY:</span> This channel name has already been taken');
		} else {
			$.mobile.showPageLoadingMsg('a', 'Creating Channel ');
			ES.channelService.createChannel({name: self.newChannel()}, {success: successfulCreate, error: errorAPI});			
			self.sectionOne(false);
			self.sectionTwo(true);							
			self.channelName(self.newChannel()+' is now live.');			
			self.channelWebAddress(self.newChannel()+'.evernym.com');			
		}
	};
						
  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
    goToView('channelNameView');
		self.sectionOne(true);
		self.sectionTwo(false);
		self.message('');
		self.channelClass('validationerror');
    self.errorNewChannel('<span>SORRY:</span> ' + details.message);		
  };
	
  self.goToNext = function () {
		sendMessageViewModel.clearForm();					
    goToView('channelIntroView');
  };
}

ChannelNewViewModel.prototype = new ENYM.ViewModel();
ChannelNewViewModel.prototype.constructor = ChannelNewViewModel;