/*globals ko*/
function ChannelListViewModel() {
  var that = this;
  this.template = 'channelListView';
  this.viewid = 'V-40';
  this.viewname = 'ChannelsIOwn';
  this.displayname = 'My Channels';
  this.hasfooter = true;
  this.accountName = ko.observable();
	this.responseData = ko.observable();
	
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
			return ES.channelService.listMyChannels({ success: successfulList, error: errorAPI });
		}
	}
	
	function successfulList(data){
		that.responseData(data.channel.length);
	};    
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();	
		showError('Error listing my channels: ' + details.message);
	};
	
	this.goChannelsIOwn = function() {
		if(that.responseData() < 1) {
			return false;
		} else {
			goToView('channelsIOwnView')
		}
	}
}