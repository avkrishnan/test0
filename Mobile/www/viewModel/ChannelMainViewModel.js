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
	this.toastClass = ko.observable();				
	
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
		} else if(!channelObject && !localStorage.getItem('currentChannelId')) {
			goToView('channelsIOwnView');		
		} else {
			addExternalMarkup(that.template); // this is for header/overlay message	
			that.broadcasts.removeAll();					
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');												
			}
			that.toastClass('');						
			that.accountName(localStorage.getItem('accountName'));
			if(localStorage.getItem('counter') == 1) {
				localStorage.setItem('counter', 2);
			} else {		
				localStorage.setItem('counter', 1)
			}								
			localStorage.removeItem('currentMessageData');			
			that.broadcasts.removeAll();
			if(localStorage.getItem('currentChannelId')) {
				that.channelId(localStorage.getItem('currentChannelId'));								
				return ES.channelService.getChannel(that.channelId(), {success: successfulGetChannel, error: errorAPI}).then(that.getMessagesCommand());								
			}
			else {									
				that.channelId(channelObject.channelId);
				that.channelName(channelObject.channelName);
				that.followerCount(channelObject.followerCount+'<a class="add-followers" href="#">Add Followers</a>');											
			}
			that.getMessagesCommand();
		}
	}
	
	function successfulGetChannel(data) {
		$.mobile.hidePageLoadingMsg();								
		that.channelName(data.name);
		if(data.followers == 1) {
			var followers = data.followers +' follower';
		} 
		else {
			var followers = data.followers +' followers';
		}					
		that.followerCount(followers+'<a class="add-followers" href="#">Add Followers</a>');
		if(data.followers == 1) {
			var followers = data.followers +' follower';
		} else {
			var followers = data.followers +' followers';
		}		
		var channel = [];			
		channel.push({
			channelId: data.id, 
			channelName: data.name, 
			channelDescription: data.description,
			followerCount: followers
		});
		channel = channel[0];		
		localStorage.setItem('currentChannelData', JSON.stringify(channel));
		localStorage.removeItem('currentChannelId')					
  };			
	
	function successfulMessageGET(data){
		$.mobile.hidePageLoadingMsg();			
		var len = 0;
		for(len; len<data.message.length; len++) {
			var message_sensitivity = 'icon-'+data.message[len].escLevelId.toLowerCase();
			var broadcast = '<strong class='+message_sensitivity+'></strong>'+data.message[len].text+'<em></em>';			
			if(data.message[len].escLevelId == 'N') {
        var broadcast = data.message[len].text+'<em></em>';				
				var sensitivityText = 'NORMAL';
			} else if(data.message[len].escLevelId == 'F') {
        var broadcast = data.message[len].text+'<em></em>';				
				var sensitivityText = 'FAST';				
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
				var percentage = (Math.round(Math.ceil(data.message[len].acks*100)/(data.message[len].acks+data.message[len].noacks)))+'%';										
				if(data.message[len].acks == 0) {
					var iGi = '0%. . . no responses yet';
					var noiGi = '';
					var percentageClass = 'zero-percentage';
					var percentage = '';
				  var percentageText = '';														 					
				} else if(percentage == '100%') {
					var iGi = 'All followers Got it '+percentage;
					var noiGi = '';
					var percentageClass = '';
					var percentageText = '';						
				} else if(!data.message[len].acks) {
					var iGi = '';
					var percentageClass = 'norequested';				
					var percentage = '100%';
					var percentageText = 'No followers to acknowledge iGi!';													
					var noiGi = '';								
				} else {
					var iGi = data.message[len].acks+' Got it <em class="percentage-text">'+percentage+'</em>';
					var noiGi = data.message[len].noacks+" Haven't";
					var percentageClass = '';
					var percentageText = '';														 					
				}																	
			} else {			
				var iGi = '';
				var percentageClass = 'norequested';				
				var percentage = '100%';
				var percentageText = 'No iGi requested<em class="norequestedican"></em>';													
				var noiGi = '';															
			}			
			that.broadcasts.push({
				messageId: data.message[len].id,
				sensitivity: message_sensitivity,
				sensitivityText: sensitivityText,
				broadcast: broadcast,				
				broadcastFull: data.message[len].text, 
				time: msToTime(data.message[len].created),
				created: data.message[len].created,
				escUntil: data.message[len].escUntil,
				iGi: iGi,
				percentageText: percentageText,				
				percentage: percentage,
				percentageClass: percentageClass,				
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
	
	this.showWhoGotIt = function(data){		
		if(data.acks == 0) {
			that.toastClass('toast-info');			
			that.toastText("No iGi's received yet");		
			showToast();			
		}
		else {
			localStorage.setItem('currentMessageData', JSON.stringify(data));									
			viewNavigate('Main', 'channelMainView', 'whoGotItView');
		}
	};
	
	this.iGiPercentage = function(data){
		localStorage.setItem('currentMessageData', JSON.stringify(data));
		if(data.percentageClass != '') {							
			viewNavigate('Main', 'channelMainView', 'singleMessageView');
		}
		else {
			viewNavigate('Main', 'channelMainView', 'whoGotItView');			
		}
	};	
	
	this.showNotGotIt = function(data){
		localStorage.setItem('currentMessageData', JSON.stringify(data));								
		viewNavigate('Main', 'channelMainView', 'notGotItView');
	};
	
	this.showReplies = function(data){	
		if(data.replies == '0 Replies') {
			that.toastClass('toast-info');			
			that.toastText('No replies to display');		
			showToast();			
		}
		else {
			localStorage.setItem('currentMessageData', JSON.stringify(data));									
			viewNavigate('Main', 'channelMainView', 'singleMessageRepliesView');
		}
	};				
	
}