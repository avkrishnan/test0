function ChannelDeleteViewModel() {	
  var self = this;
	self.template = 'channelDeleteView';
	self.viewid = 'V-16';
	self.viewname = 'Channel Delete';
	self.displayname = 'Channel Delete';
	
  self.inputObs = [ 'channelId', 'channelName', 'channelDisplayName' ];
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
			self.channelDisplayName(channelObject.channeldescription);			
		}
	};

	function successfulDelete(args) {
    $.mobile.hidePageLoadingMsg();
		while (backNavView[backNavView.length-1] != 'channelsIOwnView') {
			backNavText.pop();
			backNavView.pop();
		}
		if (backNavView[backNavView.length-1] == 'channelsIOwnView') {
			backNavText.pop();
			backNavView.pop();			
		}
		var toastobj = {redirect: 'channelsIOwnView', type: '', text: 'Channel deleted'};
		showToast(toastobj);				
		sendMessageViewModel.channels.removeAll();
		ENYM.ctx.removeItem('currentChannelData');	
		goToView('channelsIOwnView');		
  };

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);					
  };
	
  self.channelDeleteCommand = function () {
		$.mobile.showPageLoadingMsg('a', 'Removing Channel');
		return ES.channelService.deleteChannel(self.channelId(), { success: successfulDelete, error: errorAPI });
		ENYM.ctx.removeItem('currentChannel');
  };
}

ChannelDeleteViewModel.prototype = new ENYM.ViewModel();
ChannelDeleteViewModel.prototype.constructor = ChannelDeleteViewModel;