/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelMainViewModel() {	
  var that = this;
	this.template = 'channelMainView';
	this.viewid = 'V-46';
	this.viewname = 'ChannelMain';
	this.displayname = 'Channel Main';	
	this.accountName = ko.observable();
	this.backText = ko.observable();			
	
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
	this.toastText = ko.observable();			
	
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
			that.backText('<em></em>'+backNavText[backNavText.length-1]);
			if(localStorage.getItem('counter') == 1) {
				localStorage.setItem('counter', 2);
			} else {		
				localStorage.setItem('counter', 1)
			}								
			localStorage.removeItem('currentMessageData');			
			that.broadcasts.removeAll();							
			that.channelId(channelObject.channelId);
			that.channelName(channelObject.channelName);
			that.followerCount(channelObject.followerCount);											
			that.getMessagesCommand();
		}
	}
	
	this.backCommand = function () {
		popBackNav();		
  };	
	
	this.menuCommand = function () {
		pushBackNav('Main', 'channelMainView', 'channelMenuView');		
  };	
	
	function successfulMessageGET(data){
		$.mobile.hidePageLoadingMsg();
		that.broadcasts.removeAll();			
		var len = 0;
		for(len; len<data.message.length; len++) {
			var message_sensitivity = 'icon-'+data.message[len].escLevelId.toLowerCase();			
			if(data.message[len].escLevelId == 'N') {
				var sensitivityText = 'NORMAL';
			} else if(data.message[len].escLevelId == 'R') {
				var sensitivityText = 'REMIND';
			} else if(data.message[len].escLevelId == 'C') {
				var sensitivityText = 'CHASE';
			} else if(data.message[len].escLevelId == 'H') {
				var sensitivityText = 'HOUND';
			} else if(data.message[len].escLevelId == 'E') {
				var sensitivityText = 'EMERGENCY';
			} else {
				var message_sensitivity = '';
				var sensitivityText = '';				
			}
			that.broadcasts.push({
				messageId: data.message[len].id,
				sensitivity: message_sensitivity,
				sensitivityText: sensitivityText,			
				broadcast: '<strong class='+message_sensitivity+'></strong>'+data.message[len].text+'<em></em>',
				time: msToTime(data.message[len].created),
				created: data.message[len].created,				
				replies: 'Replies'
			});
		}
	}

  function errorAPI(data, status, response) {
    $.mobile.hidePageLoadingMsg();
    showError('Error in loading channel: ' + response.message);
    goToView('channelsIOwnView');
  };
	
	this.getMessagesCommand = function(){
		$.mobile.showPageLoadingMsg("a", "Loading Messages");
		return ES.messageService.getChannelMessages(that.channelId(), undefined, {success: successfulMessageGET, error: errorAPI});
	};
	
	this.channelSettings = function(){
		pushBackNav('Main', 'channelMainView', 'channelSettingsView');					
	};	
	
	this.channelFollowers = function(data){
		pushBackNav('Main', 'channelMainView', 'followersListView');					
	};	
	
	this.singleMessage = function(data){
		localStorage.setItem('currentMessageData', JSON.stringify(data));							
		goToView('singleMessageView');
	};
	
	this.userSettings = function () {
		pushBackNav('Main', 'channelMainView', 'escalationPlansView');		
  };	
	
	this.composeCommand = function () {
		pushBackNav('Main', 'channelMainView', 'sendMessageView');		
  };	
	
}