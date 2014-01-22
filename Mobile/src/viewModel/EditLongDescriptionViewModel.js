function EditLongDescriptionViewModel() {	
  var self = this;
	self.template = 'editLongDescriptionView';
	self.viewid = 'V-67';
	self.viewname = 'Edit Long Desc';
	self.displayname = 'Edit Long Desc';	  

  self.inputObs = [ 'channelId', 'channelName', 'longDescription', 'errorChannel', 'notification' ];
	self.defineObservables();		
	self.errorMessage = ko.observable(false);
	
	self.activate = function() {		
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));			
		if(!channelObject) {
			goToView('channelsIOwnView');			
		} else {
			addExternalMarkup(self.template); // this is for header/overlay message					
			self.channelId(channelObject.channelId);
			self.channelName(channelObject.channelName);			
			self.longDescription(channelObject.longDescription);						
			$('textarea').keyup(function () {
				self.errorMessage(false);				
				self.errorChannel('');
			});
		}
	};
	
	$(document).keyup(function(e) {
		if (e.keyCode == 13  && e.target.nodeName != 'TEXTAREA' && $.mobile.activePage.attr('id') == 'editLongDescriptionView') {
			self.longDescriptionCommand();
		}
	});	
	
	function successfulModify(args) {		
		$.mobile.showPageLoadingMsg('a', 'Loading channel Infomation');
		ES.channelService.getChannel(self.channelId(), {success: successfulGetChannel, error: errorAPI});		
  };
	
	function successfulGetChannel(data) {	
		var channel = [];			
		channel.push({
			channelId: data.id, 
			channelName: data.name, 
			channelDescription: data.description,
			longDescription: data.longDescription,			
			followerCount: data.followers
		});
		channel = channel[0];		
		ENYM.ctx.setItem('currentChannelData', JSON.stringify(channel));
		var toastobj = {redirect: self.previousViewID(), type: '', text: 'Description changed'};
		showToast(toastobj);	
		popBackNav();								
	};

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		self.errorMessage(true);	
		self.errorChannel('<span>Sorry,</span> '+details.message);
  };
	
  self.longDescriptionCommand = function () {
		if (self.longDescription() == '' || typeof self.longDescription() == 'undefined') {
			self.errorMessage(true);						
      self.errorChannel('<span>Sorry,</span> Please enter long description');
    } else {
			var channelObject = {
				id: self.channelId(),
				longDescription: self.longDescription()
			};
			$.mobile.showPageLoadingMsg('a', 'Modifying Channel ');
			ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
		}
  };
}

EditLongDescriptionViewModel.prototype = new ENYM.ViewModel();
EditLongDescriptionViewModel.prototype.constructor = EditLongDescriptionViewModel;