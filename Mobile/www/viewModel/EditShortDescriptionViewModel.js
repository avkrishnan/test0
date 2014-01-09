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
		$.mobile.showPageLoadingMsg('a', 'Loading channel Infomation');
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
			longDescription: data.longDescription,
			followerCount: followers
		});
		channel = channel[0];		
		ENYM.ctx.setItem('currentChannelData', JSON.stringify(channel));
		var toastobj = {redirect: self.previousViewID(), type: '', text: 'Channel Tagline updated'};
		showToast(toastobj);
		popBackNav();							
	}

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		self.errorMessage(true);			
		self.errorChannel('<span>Sorry,</span> '+details.message);
  };

  self.shortDescriptionCommand = function () {
		if (self.shortDescription() == '' || typeof self.shortDescription() == 'undefined') {
			self.errorMessage(true);			
      self.errorChannel('<span>Sorry,</span> Please enter channel tagline');
    } else {
    	if(self.shortDescription().length <=80){
    		var channelObject = {
					id: self.channelId(),
					description: self.shortDescription()
				};
				$.mobile.showPageLoadingMsg('a', 'Modifying Channel ');
				ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
    	} else {
    		self.errorMessage(true);			
      	self.errorChannel('<span>Sorry,</span> Please enter tagline of max. 80 characters');
    	}
		}
  };
}


EditShortDescriptionViewModel.prototype = new ENYM.ViewModel();
EditShortDescriptionViewModel.prototype.constructor = EditShortDescriptionViewModel;