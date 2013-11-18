/*globals ko*/
/* To do - Pradeep Kumar */
function SingleMessageViewModel() {
  var that = this;
	this.template = 'singleMessageView';
	this.viewid = 'V-23';
	this.viewname = 'Message';
	this.displayname = 'Message';	
	this.accountName = ko.observable();
	this.backText = ko.observable();		

  /* Single message observable */		
	this.channelName = ko.observable();		
	this.time = ko.observable();	
	this.singleMessage = ko.observable();	
	this.replies = ko.observable();		
	
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
			that.accountName(localStorage.getItem('accountName'));
			that.backText('<em></em>'+backNavText[backNavText.length-1]);			
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));			
			var messageObject = JSON.parse(localStorage.getItem('currentMessageData'));										
			that.channelName(channelObject.channelName);					
			that.time('Sent '+ _date(messageObject.created) +' ('+messageObject.time+'):');	
			that.singleMessage(messageObject.broadcast);	
			that.replies(messageObject.replies);							
		}
	}
	
	this.backCommand = function () {
		popBackNav();
  };
	
	this.menuCommand = function () {
		pushBackNav('Broadcast Details', 'singleMessageView', 'channelMenuView');		
  };	
	
	function _date(created) {	
		var date  = new Date(created);
    return ((date.getDate()<10?'0':'')+date.getDate()) + "/"+ (((date.getMonth()+1)<10?'0':'') + (date.getMonth()+1)) + "/" + 
		date.getFullYear()  + ", " +((date.getHours()<10?'0':'')+date.getHours()-12) + ":" + 
		(date.getMinutes()<10?'0':'') +  date.getMinutes() + " " + (date.getMinutes()>12?'PM':'AM'); 
	}
	
	this.messageFullText = function(){
		pushBackNav('Broadcast Details', 'singleMessageView', 'singleMessageFullTextView');										
	};
	
	this.messageReplies = function(){
		pushBackNav('Broadcast Details', 'singleMessageView', 'singleMessageRepliesView');										
	};
	
	this.userSettings = function () {
		pushBackNav('Broadcast Details', 'singleMessageView', 'escalationPlansView');				
  };	
	
	this.composeCommand = function () {
		pushBackNav('Broadcast Details', 'singleMessageView', 'sendMessageView');				
  };	
				
}
