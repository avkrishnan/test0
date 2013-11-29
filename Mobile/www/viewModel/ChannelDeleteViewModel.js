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
	this.toastText = ko.observable();
	this.counter = ko.observable();							
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  
	
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));		
		if(token == '' || token == null) {
			goToView('loginView');
		} else if(!channelObject) {
			goToView('channelsIOwnView');			
		} else {
			addExternalMarkup(that.template); // this is for header/overlay message			
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}			
			that.accountName(localStorage.getItem('accountName'));	
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));
			that.channelId(channelObject.channelId);
			that.channelName(channelObject.channelName);
			that.channelDisplayName(channelObject.channeldescription);
			that.counter(localStorage.getItem('counter'));			
		}
	}	

	function successfulDelete(args) {
    $.mobile.hidePageLoadingMsg();
		for(var ctr = 0; ctr <= that.counter(); ctr++) {
			popBackNav();		
		}
		localStorage.removeItem('counter')
		that.toastText('Channel deleted');		
		localStorage.setItem('toastData', that.toastText());
		goToView('channelsIOwnView');		
  };

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
    localStorage.setItem('signUpError', details.message);
    goToView('channelDeleteView');
  };
	
  this.channelDeleteCommand = function () {
		$.mobile.showPageLoadingMsg('a', 'Removing Channel');
		return ES.channelService.deleteChannel(that.channelId(), { success: successfulDelete, error: errorAPI });
		localStorage.removeItem('currentChannel');
  };	
	
}