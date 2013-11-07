/*globals ko*/
function ChannelListViewModel() {
  var that = this;
  this.template = 'channelListView';
  this.viewid = 'V-40';
  this.viewname = 'ChannelsIOwn';
  this.displayname = 'My Channels';
  this.hasfooter = true;
  this.accountName = ko.observable();
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  
	
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		if(token == '' || token == null) {
			goToView('loginView');
		} 
		else {
			that.accountName(localStorage.getItem('accountName'));
			$.mobile.showPageLoadingMsg('a', 'Loading Channels');
			return ES.channelService.listMyChannels({ success: successfulList, error: errorAPI });
		}
	}
	
	function successfulList(data){
		if(data.channel.length > 0) {
			goToView('channelsIOwnView');			
		}	
	};    
	
	function errorAPI(data, status, response){
		$.mobile.hidePageLoadingMsg();	
		showError('Error listing my channels: ' + response.message);
	};
		
}