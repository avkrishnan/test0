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
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			that.accountName(localStorage.getItem('accountName'));
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));			
			var messageObject = JSON.parse(localStorage.getItem('currentMessageData'));
			var replyObject = JSON.parse(localStorage.getItem('currentReplyData'));
			that.more(false);		
			that.moreButton(true);																								
			that.channelId(channelObject.channelId);	
			that.channelName(channelObject.channelname);													
			that.messageId(messageObject.messageId);						
			that.replyDate(_date(replyObject.created));
			that.reply(replyObject.reply);
			that.moreText(replyObject.reply);												
		}
	}
	
	function _date(created) {	
		var date  = new Date(created);
		var monthNames = [ "January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December" ];
    return ( ((date.getMonth()+1)<10?'0':'') + (monthNames[date.getMonth()+1]) + " " +(date.getDate()<10?'0':'')+date.getDate()) + 
		", " +((date.getHours()<10?'0':'')+date.getHours()-12) + ":" + 
		(date.getMinutes()<10?'0':'') +  date.getMinutes() + " " + (date.getMinutes()>12?'PM':'AM'); 
	}
	
	this.showMore = function(data){
		that.more(true);
		that.moreButton(false);														
	};
	
	this.replyButton = function(data){							
		goToView('replyDetailViewModel');
	};
				
}
