/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelMainViewModel() {	
  var that = this;
	this.template = 'channelMainView';
	this.viewid = 'V-46';
	this.viewname = 'ChannelMain';
	this.displayname = 'Channel Main';	
	this.accountName = ko.observable();	
	
  /* Channel Main observable */	
	this.channelId = ko.observable();		
	this.channelName = ko.observable();
	this.followerCount = ko.observable();
	this.broadcasts = ko.observableArray([]);	
	this.messageId = ko.observable();	
	this.sensitivity = ko.observable();	
	this.broadcast = ko.observable();
	this.time = ko.observable();	
	this.replies = ko.observable();			
	
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
		} else {
			that.accountName(localStorage.getItem('accountName'));
			localStorage.removeItem('currentMessageData');			
			that.broadcasts.removeAll();
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));								
			that.channelId(channelObject.channelId);
			that.channelName(channelObject.channelname);
			that.followerCount(channelObject.followerCount);											
			that.getMessagesCommand();
		}
	}
	
	function msToTime(ms){
		var ms = new Date().getTime() - ms;	
		var secs = Math.floor(ms / 1000);
		var msleft = ms % 1000;
		var totalHours = Math.floor(secs / (60 * 60));
		var days = Math.floor(totalHours / 24);
		var hours = totalHours % 24;
		var divisor_for_minutes = secs % (60 * 60);
		var minutes = Math.floor(divisor_for_minutes / 60);
		var divisor_for_seconds = divisor_for_minutes % 60;
		var seconds = Math.ceil(divisor_for_seconds);
		if(days > 0) {
			return days+' days ago';
		} else if(hours > 0) {
			return hours+' hrs ago';
		} else if(minutes > 0) {
			return minutes+' mins ago';
		} else if(seconds > 0) {
			return  seconds+' secs ago';
		} else {
			return  'just now';
		}
	}
	
	function successfulMessageGET(data){
		$.mobile.hidePageLoadingMsg();
		that.broadcasts.removeAll();			
		var len = 0;
		for(len; len<data.message.length; len++) {
			if(data.message[len].urgencyId == 'N ') {
				var message_sensitivity = 'broadcastnormal';
				var sensitivityText = 'NORMAL';
			} else if(data.message[len].urgencyId == 'L ') {
				var message_sensitivity = 'broadcastlow';
				var sensitivityText = 'LOW';
			} else if(data.message[len].urgencyId == 'TS') {
				var message_sensitivity = 'broadcasttimesensitive';
				var sensitivityText = 'TIME-SENSITIVE';
			} else if(data.message[len].urgencyId == 'E ') {
				var message_sensitivity = 'broadcastemergency';
				var sensitivityText = 'EMERGENCY';
			} else if(data.message[len].urgencyId == 'U ') {
				var message_sensitivity = 'broadcasturgent';
				var sensitivityText = 'URGENT';
			} else {
				var message_sensitivity = '';
				var sensitivityText = '';				
			}
			that.broadcasts.push({
				messageId: data.message[len].id,
				sensitivity: message_sensitivity,
				sensitivityText: sensitivityText,			
				broadcast: '<strong></strong>'+data.message[len].text+'<em></em>',
				time: msToTime(data.message[len].created),
				created: data.message[len].created,				
				replies: data.message[len].replies+' replies'
			});
		}
	}

  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    showError(response.message);
    goToView('channelsIOwnView');
  };
	
	this.getMessagesCommand = function(){
		$.mobile.showPageLoadingMsg("a", "Loading Messages");
		return ES.messageService.getChannelMessages(that.channelId(), undefined, {success: successfulMessageGET, error: errorAPI});
	};
	
	this.channelSettings = function(){
		goToView('channelSettingsView');
	};	
	
	this.channelFollowers = function(data){	
		goToView('followersListView');
	};	
	
	this.singleMessage = function(data){
		localStorage.setItem('currentMessageData', JSON.stringify(data));							
		goToView('singleMessageView');
	};
	
}