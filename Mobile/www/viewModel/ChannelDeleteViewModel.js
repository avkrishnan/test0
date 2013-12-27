/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelDeleteViewModel() {	
  var that = this;
	this.template = 'channelDeleteView';
	this.viewid = 'V-16';
	this.viewname = 'Channel Delete';
	this.displayname = 'Channel Delete';	
	this.accountName = ko.observable();		
	
  /* Channel delete observable */
	this.channelId = ko.observable();
	this.channelName = ko.observable();
	this.channelDisplayName = ko.observable();				
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  
	
	this.activate = function() {		
		if(authenticate()) {
			var channelObject = JSON.parse(appCtx.getItem('currentChannelData'));			
			if(!channelObject) {
				goToView('channelsIOwnView');			
			} else {
				addExternalMarkup(that.template); // this is for header/overlay message					
				that.accountName(appCtx.getItem('accountName'));	
				var channelObject = JSON.parse(appCtx.getItem('currentChannelData'));
				that.channelId(channelObject.channelId);
				that.channelName(channelObject.channelName);
				that.channelDisplayName(channelObject.channeldescription);			
			}
		}
	}	

	function successfulDelete(args) {
    $.mobile.hidePageLoadingMsg();
		var counter = appCtx.getItem('counter');
		for(var ctr = 0; ctr <= counter; ctr++) {	
			backNavText.pop();
			backNavView.pop();
		}
		appCtx.removeItem('counter');
		var toastobj = {redirect: 'channelsIOwnView', type: '', text: 'Channel deleted'};
		showToast(toastobj);				
		sendMessageViewModel.clearForm();		
		goToView('channelsIOwnView');		
  };

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);					
  };
	
  this.channelDeleteCommand = function () {
		$.mobile.showPageLoadingMsg('a', 'Removing Channel');
		return ES.channelService.deleteChannel(that.channelId(), { success: successfulDelete, error: errorAPI });
		appCtx.removeItem('currentChannel');
  };	
	
}