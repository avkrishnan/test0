/*globals ko*/
function ChannelMainViewModel() {	
  var that = this;
	this.template = 'channelMainView';
	this.viewid = 'V-46';
	this.viewname = 'ChannelMain';
	this.displayname = 'Channel Main';	
	this.hasfooter = true;    
	this.channels = ko.observableArray([]);
	this.accountName = ko.observable();	
	this.notification = ko.observable();
	
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
	
	var token = ES.evernymService.getAccessToken();
	var channelId = localStorage.getItem('currentChannelId');
	this.activate = function() {
		/*if(token == '' || token == null) {
			goToView('loginView');
		} else if(channelId == '' || channelId == null) {
			goToView('channelsIOwnView');
		} else {}*/
			var _accountName = localStorage.getItem('accountName');
			that.accountName(_accountName);
			that.broadcasts.removeAll();				
			that.channelId(localStorage.getItem('currentChannelId'));
			return this.getChannelCommand().then(this.getFollowersCommand()).then(this.getMessagesCommand());
			goToView('channelMainView');
	}
	
	this.channelSettings = function(){
		goToView('channelSettingsView');
	};
	
	function successfulGetChannel(data) {
		$.mobile.hidePageLoadingMsg();
		localStorage.setItem('currentChannelName', data.name);
		that.channelName(localStorage.getItem('currentChannelName'));
  };
	
	function successfulList(data){
    $.mobile.hidePageLoadingMsg();
		that.followerCount(data.followers.length+' followers');
	}; 
	
	function successfulMessageGET(data){
		$.mobile.hidePageLoadingMsg();
		that.broadcasts.removeAll();			
		var len = 0;
		for(len; len<data.message.length; len++) {
			if(data.message[len].urgencyId == 'N ') {
				var message_sensitivity = 'broadcastnormal';
			} else if(data.message[len].urgencyId == 'L ') {
				var message_sensitivity = 'broadcastlow';
			} else if(data.message[len].urgencyId == 'TS') {
				var message_sensitivity = 'broadcasttimesensitive';
			} else if(data.message[len].urgencyId == 'E ') {
				var message_sensitivity = 'broadcastemergency';
			} else if(data.message[len].urgencyId == 'U ') {
				var message_sensitivity = 'broadcasturgent';
			} else {
				var message_sensitivity = '';				
			}
			var timeAgo = new Date().getTime() - data.message[len].created;
			function msToTime(ms){
				var secs = Math.floor(ms / 1000);
				var msleft = ms % 1000;
				var hours = Math.floor(secs / (60 * 60));
				var divisor_for_minutes = secs % (60 * 60);
				var minutes = Math.floor(divisor_for_minutes / 60);
				var divisor_for_seconds = divisor_for_minutes % 60;
				var seconds = Math.ceil(divisor_for_seconds);
				if(hours > 0) {
					return hours+' hrs ago';
				} else if(minutes > 0) {
					return minutes+' mins ago';
				} else if(seconds > 0) {
					return  seconds+' secs ago';
				} else {
					return  '0 secs ago';
				}
			}
			var timeago = msToTime(timeAgo);
			that.broadcasts.push({
				messageId: data.message[len].id,
				sensitivity: message_sensitivity,			
				broadcast: data.message[len].text,
				time: timeago,				
				replies: data.message[len].replies+' replies'
			});
		}
	}

  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    localStorage.setItem('signUpError', response.message);
    goToView('channelMainView');
  };
	
  this.getChannelCommand = function () {
		$.mobile.showPageLoadingMsg('a', 'Loading Channel');
		return ES.channelService.getChannel(that.channelId(), {success: successfulGetChannel, error: errorAPI});
  };
	
	this.getFollowersCommand = function () {
		$.mobile.showPageLoadingMsg('a', 'Loading Followers');				
    return ES.channelService.getFollowers(that.channelId(), { success: successfulList, error: errorAPI });
  };
	
	this.channelFollowers = function(data){	
		goToView('followersListView');
	};
	
	this.getMessagesCommand = function(){
		$.mobile.showPageLoadingMsg("a", "Loading Messages");
		return ES.messageService.getChannelMessages(that.channelId(), undefined, {success: successfulMessageGET, error: errorAPI});
	};
	
	this.singleMessage = function(data){
		localStorage.removeItem('currentMessageId');
		localStorage.setItem('currentMessageId', data.messageId);	
		//goToView('singleMessageView');
	};
	
}