/*globals ko*/
/* To do - Pradeep Kumar */
function SingleMessageViewModel() {
  var that = this;
	this.template = 'singleMessageView';
	this.viewid = 'V-23';
	this.viewname = 'Message';
	this.displayname = 'Message';	
	this.accountName = ko.observable();	

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
		if(token == '' || token == null) {
			goToView('loginView');
		} else {
			that.accountName(localStorage.getItem('accountName'));
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));			
			var messageObject = JSON.parse(localStorage.getItem('currentMessageData'));										
			that.channelName(channelObject.channelname);					
			that.time('Sent '+ _date(messageObject.created) +' ('+messageObject.time+'):');	
			that.singleMessage(messageObject.broadcast);	
			that.replies(messageObject.replies);							
		}
	}
	
	function _date(created) {	
		var date  = new Date(created);
    return ((date.getDate()<10?'0':'')+date.getDate()) + "/"+ (((date.getMonth()+1)<10?'0':'') + (date.getMonth()+1)) + "/" + 
		date.getFullYear()  + ", " +((date.getHours()<10?'0':'')+date.getHours()-12) + ":" + 
		(date.getMinutes()<10?'0':'') +  date.getMinutes() + " " + (date.getMinutes()>12?'PM':'AM'); 
	}
	
	this.messageFullText = function(){						
		goToView('singleMessageFullTextView');
	};
	
	this.messageReplies = function(){						
		goToView('singleMessageRepliesView');
	};
				
}
