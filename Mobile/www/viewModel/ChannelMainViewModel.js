/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelMainViewModel() {	
  var that = this;
	this.template = 'channelMainView';
	this.viewid = 'V-46';
	this.viewname = 'Main';
	this.displayname = 'Channel Main';	
	this.accountName = ko.observable();		
	
  /* Channel Main observable */	
	this.channelId = ko.observable();		
	this.channelName = ko.observable();
	this.followerCount = ko.observable();
	this.broadcasts = ko.observableArray([]);	
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
			if(localStorage.getItem('counter') == 1) {
				localStorage.setItem('counter', 2);
			} else {		
				localStorage.setItem('counter', 1)
			}								
			localStorage.removeItem('currentMessageData');			
			that.broadcasts.removeAll();							
			that.channelId(channelObject.channelId);
			that.channelName(channelObject.channelName);
			that.followerCount(channelObject.followerCount+'<a class="add-followers" href="#">Add Followers</a>');											
			that.getMessagesCommand();
		}
	}		
	
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
			if(data.message[len].type == 'REQUEST_ACKNOWLEDGEMENT') {
				var iGiClass = '';
				var noiGiClass = 'broadcastmsgunsend';				
				var iGi = data.message[len].acks+' Got it<em class="percentage"></em></span>';
				var percentage = data.message[len].acks+'%';			
				var noiGi = data.message[len].noacks+" Haven't";												
			} else {
				var iGiClass = 'norequested';
				var noiGiClass = 'norequestedican';				
				var iGi = 'No iGi requested';
				var percentage = '84%';								
				var noiGi = '';															
			}			
			that.broadcasts.push({
				messageId: data.message[len].id,
				sensitivity: message_sensitivity,
				sensitivityText: sensitivityText,			
				broadcast: '<strong class='+message_sensitivity+'></strong>'+data.message[len].text+'<em></em>',
				time: msToTime(data.message[len].created),
				created: data.message[len].created,
				iGi: iGi,
				iGiClass: iGiClass,
				percentage: percentage,
				noiGiClass: noiGiClass,
				noiGi: noiGi,		
				replies: data.message[len].replies+' Replies',
				acks: data.message[len].acks,
				noacks: data.message[len].noacks,
				type: data.message[len].type
			});
		}
	}

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		that.toastText(details.message);		
		showToast();
  };
	
	this.getMessagesCommand = function(){
		$.mobile.showPageLoadingMsg("a", "Loading Messages");
		return ES.messageService.getChannelMessages(that.channelId(), undefined, {success: successfulMessageGET, error: errorAPI});
	};	
	
	this.singleMessage = function(data){
		localStorage.setItem('currentMessageData', JSON.stringify(data));							
		viewNavigate('Main', 'channelMainView', 'singleMessageView');
	};	
	
}