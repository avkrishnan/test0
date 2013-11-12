/*globals ko*/
/* To do - Pradeep Kumar */
function ReplyDetailViewModel() {
  var that = this;
	this.template = 'replyDetailViewModel';
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
			that.channelId(channelObject.channelId);	
			that.channelName(channelObject.channelname);													
			that.messageId(messageObject.messageId);						
			that.replyDate(_date(replyObject.created));
			that.reply(replyObject.reply);						
		}
	}
	
	function _date(created) {	
		var date  = new Date(created);
    return ((date.getDate()<10?'0':'')+date.getDate()) + "/"+ (((date.getMonth()+1)<10?'0':'') + (date.getMonth()+1)) + "/" + 
		date.getFullYear()  + ", " +((date.getHours()<10?'0':'')+date.getHours()-12) + ":" + 
		(date.getMinutes()<10?'0':'') +  date.getMinutes() + " " + (date.getMinutes()>12?'PM':'AM'); 
	}
	
	this.showMore = function(data){							
		goToView('replyDetailViewModel');
	};
	
	this.replyButton = function(data){							
		goToView('replyDetailViewModel');
	};
				
}
