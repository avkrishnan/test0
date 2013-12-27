function ChannelMainViewModel() {	
  var self = this;
	self.template = 'channelMainView';
	self.viewid = 'V-46';
	self.viewname = 'Main';
	self.displayname = 'Channel Main';			
	
  self.inputObs = [ 'channelId', 'channelName', 'followerCount'];
	self.defineObservables();
	self.broadcasts = ko.observableArray([]);				 
	
	self.activate = function() {					
		var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));			
		if(!channelObject && !localStorage.getItem('currentChannelId')) {
			goToView('channelsIOwnView');		
		} else {
			addExternalMarkup(self.template); // this is for header/overlay message	
			self.broadcasts.removeAll();											
			if(localStorage.getItem('counter') == 1) {
				localStorage.setItem('counter', 2);
			} else {
				localStorage.setItem('counter', 1)
			}								
			localStorage.removeItem('currentMessageData');			
			self.broadcasts.removeAll();
			if(localStorage.getItem('currentChannelId')) {
				self.channelId(localStorage.getItem('currentChannelId'));								
				return ES.channelService.getChannel(self.channelId(), {success: successfulGetChannel, error: errorAPI}).then(self.getMessagesCommand());								
			}
			else {									
				self.channelId(channelObject.channelId);
				self.channelName(channelObject.channelName);
				self.followerCount(channelObject.followerCount+'<a class="add-followers" href="#">Add Followers</a>');											
			}
			self.getMessagesCommand();
		}
	}
	
	function successfulGetChannel(data) {
		$.mobile.hidePageLoadingMsg();								
		self.channelName(data.name);
		if(data.followers == 1) {
			var followers = data.followers +' follower';
		} 
		else {
			var followers = data.followers +' followers';
		}					
		self.followerCount(followers+'<a class="add-followers" href="#">Add Followers</a>');		
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
		for(var len = 0; len<data.message.length; len++) {
			if(data.message[len].text.length > truncatedTextScreen()-20) {
				var message = $.trim(data.message[len].text).substring(0, truncatedTextScreen()-20).split(' ').slice(0, -1).join(' ') + '...';
			}
			else {
				var message = data.message[len].text;					
			}			
			var message_sensitivity = 'icon-'+data.message[len].escLevelId.toLowerCase();
			var broadcast = '<strong class='+message_sensitivity+'></strong>'+message+'<em></em>';			
			if(data.message[len].escLevelId == 'N') {
        var broadcast = data.message[len].text+'<em></em>';				
				var sensitivityText = 'NORMAL';
			} else if(data.message[len].escLevelId == 'F') {
        //var broadcast = data.message[len].text+'<em></em>';				
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
					var iGi = 'All followers Got it ('+percentage+')';
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
					var iGi = data.message[len].acks+' Got it <span class="percentage-text">('+percentage+')</span>';
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
			if(data.message[len].replies == 1) {
				var replies = data.message[len].replies +' Reply';
			} else {
				var replies = data.message[len].replies +' Replies';
			}						
			self.broadcasts.push({
				messageId: data.message[len].id,
				sensitivity: message_sensitivity,
				sensitivityText: sensitivityText,
				broadcast: broadcast,				
				broadcastFull: data.message[len].text, 
				//time: msToTime(data.message[len].created),
				time: formatDate(data.message[len].created, 'short', 'main'),
				created: data.message[len].created,
				escUntil: data.message[len].escUntil,
				iGi: iGi,
				percentageText: percentageText,				
				percentage: percentage,
				percentageClass: percentageClass,				
				noiGi: noiGi,		
				replies: replies,
				acks: data.message[len].acks,
				noacks: data.message[len].noacks,
				type: data.message[len].type
			});
		}
	}

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();		
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);		
  };
	
	self.getMessagesCommand = function(){
		$.mobile.showPageLoadingMsg("a", "Loading Messages");
		return ES.messageService.getChannelMessages(self.channelId(), undefined, {success: successfulMessageGET, error: errorAPI});
	};	
	
	self.singleMessage = function(data){
		localStorage.setItem('currentMessageData', JSON.stringify(data));							
		viewNavigate('Main', 'channelMainView', 'singleMessageView');
	};
	
	self.showWhoGotIt = function(data){		
		if(data.acks == 0) {
			var toastobj = {type: 'toast-info', text: "No iGi's received yet"};
			showToast(toastobj);						
		}
		else {
			localStorage.setItem('currentMessageData', JSON.stringify(data));									
			viewNavigate('Main', 'channelMainView', 'whoGotItView');
		}
	};
	
	self.iGiPercentage = function(data){
		localStorage.setItem('currentMessageData', JSON.stringify(data));
		if(data.percentageClass != '') {							
			viewNavigate('Main', 'channelMainView', 'singleMessageView');
		}
		else {
			viewNavigate('Main', 'channelMainView', 'whoGotItView');			
		}
	};	
	
	self.showNotGotIt = function(data){
		localStorage.setItem('currentMessageData', JSON.stringify(data));								
		viewNavigate('Main', 'channelMainView', 'notGotItView');
	};
	
	self.showReplies = function(data){	
		if(data.replies == '0 Replies') {
			var toastobj = {type: 'toast-info', text: 'No replies to display'};
			showToast(toastobj);						
		}
		else if(data.replies == '1 Reply') {
			localStorage.setItem('currentMessageData', JSON.stringify(data));
			$.mobile.showPageLoadingMsg("a", "Loading Message reply");			
			return ES.messageService.getChannelMessages(self.channelId(), {replyto: data.messageId}, {success: successfulReliesGET, error: errorAPI});														
		}
		else {
			localStorage.setItem('currentMessageData', JSON.stringify(data));									
			viewNavigate('Main', 'channelMainView', 'singleMessageRepliesView');
		}
	};
	
	function successfulReliesGET(data){
    $.mobile.hidePageLoadingMsg();			
		for(var len = 0; len<data.message.length; len++) {
			if(data.message[len].replies < 1) {
				if(data.message[len].text.length > truncatedTextScreen()) {
					var reply = '<em>'+data.message[len].senderFirstname+' '+data.message[len].senderLastname+': </em>'+$.trim(data.message[len].text).substring(0, truncatedTextScreen()).split(' ').slice(0, -1).join(' ') + '...';
				  var replyLess = $.trim(data.message[len].text).substring(0, truncatedTextScreen()*2).split(' ').slice(0, -1).join(' ') + '...';
				}
				else {
					var reply = '<em>'+data.message[len].senderFirstname+' '+data.message[len].senderLastname+': </em>'+data.message[len].text;
					var replyLess = data.message[len].text;					
				}				
				var reply = [];			
				reply.push({
					replyId: data.message[len].id,
					senderSubscriberId: data.message[len].senderSubscriberId,
					responseToMsgId: data.message[len].responseToMsgId,		
					created: data.message[len].created,				
					replyTime: msToTime(data.message[len].created),
					replyLess: replyLess,					
					replyFull: data.message[len].text,
					senderFirstname: data.message[len].senderFirstname,
					senderLastname: data.message[len].senderLastname,										
					replyToReply: data.message[len].replies
				});
				reply = reply[0];		
				localStorage.setItem('currentReplyData', JSON.stringify(reply));					
			}
		}
		viewNavigate('Main', 'channelMainView', 'replyDetailView');
		replyDetailViewModel.showMore();				
	}; 
	
	function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);
  };						
	
}

ChannelMainViewModel.prototype = new AppCtx.ViewModel();
ChannelMainViewModel.prototype.constructor = ChannelMainViewModel;