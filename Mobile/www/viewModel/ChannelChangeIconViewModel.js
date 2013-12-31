function ChannelChangeIconViewModel() {	
  var self = this;
	self.template = 'channelChangeIconView';
	self.viewid = 'V-16';
	self.viewname = 'Change Icon';
	self.displayname = 'Channel Chage Icon Image';
	
  self.inputObs = [ 'channelId', 'picId' ];
  self.defineObservables();	
 
	self.activate = function() {
		var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));		
		if(!channelObject) {
			goToView('channelsIOwnView');
			addExternalMarkup(self.template); // this is for header/overlay message				
			var channelObject = JSON.parse(ENYM.ctx.getItem('currentChannelData'));
			self.channelId(channelObject.channelId);			
		}
	};
	
	function successfulModify(args) {
    goToView('channelSettingsView');
  };

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
  };
	
  self.changeChannelIconCommand = function () {
		var channelObject = {
			id: self.channelId(),
			picId: self.picId()
		};
		$.mobile.showPageLoadingMsg('a', 'Modifying Channel ');
		ES.channelService.modifyChannel(channelObject, {success: successfulModify, error: errorAPI});
  };
}

ChannelChangeIconViewModel.prototype = new ENYM.ViewModel();
ChannelChangeIconViewModel.prototype.constructor = ChannelChangeIconViewModel;