/*globals ko*/
/* To do - Pradeep Kumar */
function ReplyDetailViewModel() {
  var that = this;
	this.template = 'replyDetailView';
	this.viewid = 'V-56';
	this.viewname = 'ReplyDetail';
	this.displayname = 'Reply Detail';	
	this.accountName = ko.observable();		

  /* Single message observable */		
	this.channelId = ko.observable();
	this.channelName = ko.observable();
	this.messageId = ko.observable();
	//this.replyAuthor = ko.observable();			
	this.replyDate = ko.observable();	
	this.reply = ko.observable();	
	this.moreText = ko.observable();	
	this.more = ko.observable(false);
	this.moreButton = ko.observable(true);										

	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  
	
	this.activate = function() {
		var token = ES.evernymService.getAccessToken();
		var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));		
		var messageObject = JSON.parse(localStorage.getItem('currentMessageData'));			
		if(token == '' || token == null) {
			goToView('loginView');
		} else if(!channelObject || !messageObject) {
			goToView('channelsIOwnView');			
		} else {
			that.accountName(localStorage.getItem('accountName'));		
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));			
			var messageObject = JSON.parse(localStorage.getItem('currentMessageData'));
			var replyObject = JSON.parse(localStorage.getItem('currentReplyData'));
			that.more(false);		
			that.moreButton(true);																								
			that.channelId(channelObject.channelId);	
			that.channelName(channelObject.channelName);													
			that.messageId(messageObject.messageId);						
			that.replyDate(_date(replyObject.created));
			that.reply(replyObject.reply);
			that.moreText(replyObject.reply);												
		}
	}
	
	this.menuCommand = function () {
		pushBackNav('Reply detail', 'replyDetailView', 'channelMenuView');		
  };	
	
	function _date(created) {	
		var date  = new Date(created);
		var monthNames = [ "January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December" ];
    return ( ((date.getMonth()+1)<10?'0':'') + (monthNames[date.getMonth()]) + " " +(date.getDate()<10?'0':'')+date.getDate()) + 
		", " +((date.getHours()<10?'0':'')+date.getHours()-12) + ":" + 
		(date.getMinutes()<10?'0':'') +  date.getMinutes() + " " + (date.getMinutes()>12?'PM':'AM'); 
	}
	
	this.showMore = function(){
		that.more(true);
		that.moreButton(false);														
	};
	
	this.userSettings = function () {
		pushBackNav('Reply detail', 'replyDetailView', 'escalationPlansView');
  };	
	
	this.composeCommand = function () {
		pushBackNav('Reply detail', 'replyDetailView', 'sendMessageView');
  };	
				
}
