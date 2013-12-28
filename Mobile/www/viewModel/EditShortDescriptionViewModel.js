function EditShortDescriptionViewModel() {	
  var self = this;
	self.template = 'editShortDescriptionView';
	self.viewid = 'V-66';
	self.viewname = 'Edit Tagline';
	self.displayname = 'Edit Channel Tagline';	  

	self.errorMessage = ko.observable(false);
	
  self.inputObs = [ 'channelId', 'channelName', 'shortDescription', 'errorChannel', 'notification' ];
	self.defineObservables();
	
	self.activate = function() {
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));						
		if(!channelObject) {
			goToView('channelsIOwnView');			
		} else {
			addExternalMarkup(self.template); // this is for header/overlay message
			self.accountName(ENYM.ctx.getItem('accountName'));
			var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));
			self.channelId(channelObject.channelId);
			self.channelName(channelObject.channelName);	
			self.shortDescription(channelObject.channelDescription);	
			$('textarea').keyup(function () {
				self.errorMessage(false);
				self.errorChannel('');
			});
		}
	}
	
	$(document).keyup(function (e) {
		if (e.keyCode == 13  && e.target.nodeName != 'TEXTAREA' && $.mobile.activePage.attr('id') == 'editShortDescriptionView') {
			self.shortDescriptionCommand();
		}
	});	
	
	function successfulModify(args) {		
		$.mobile.showPageLoadingMsg('a', 'Loading channel settings');
		ES.channelService.getChannel(self.channelId(), {success: successfulGetChannel, error: errorAPI});
  };
	
	function successfulGetChannel(data) {
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
			followerCount: followers
		});
		channel = channel[0];		
		ENYM.ctx.setItem('currentChannelData', JSON.stringify(channel));
		var toastobj = {redirect: 'channelSettingsView', type: '', text: 'Channel Tagline updated'};
		showToast(toastobj);
		backNavText.pop();
		backNavView.pop();		
		goToView('channelSettingsView');							
	}

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		self.errorMessage(true);			
		self.errorChannel('<span>SORRY:</span> '+details.message);
  };
	
  self.shortDescriptionCommand = function () {
		if (self.shortDescription() == '' || typeof self.shortDescription() == 'undefined') {
			self.errorMessage(true);			
      self.errorChannel('<span>SORRY:</span> Please enter channel tagline');
    } else {
			var channelObject = {
				id: self.channelId(),
				description: self.shortDescription()
			};
			$.mobile.showPageLoadingMsg('a', 'Modifying Channel ');
			ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
		}
  };
}

EditShortDescriptionViewModel.prototype = new ENYM.ViewModel();
EditShortDescriptionViewModel.prototype.constructor = EditShortDescriptionViewModel;