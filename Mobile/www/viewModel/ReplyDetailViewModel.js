/*globals ko*/
/* To do - Pradeep Kumar */
function ReplyDetailViewModel() {
  var that = this;
	this.template = 'replyDetailView';
	this.viewid = 'V-56';
	this.viewname = 'Reply Detail';
	this.displayname = 'Reply Detail';	
	this.accountName = ko.observable();		

  /* Single message observable */		
	this.channelId = ko.observable();
	this.channelName = ko.observable();
	this.messageId = ko.observable();
	this.senderName = ko.observable();			
	this.replyDate = ko.observable();	
	this.reply = ko.observable();		
	this.moreText = ko.observable();	
	this.less = ko.observable(true);		
	this.more = ko.observable(false);	
	this.moreButton = ko.observable(true);
	this.lessButton = ko.observable(false);											

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
			addExternalMarkup(that.template); // this is for header/overlay message						
			that.accountName(localStorage.getItem('accountName'));		
			var replyObject = JSON.parse(localStorage.getItem('currentReplyData'));			
			that.less(true);				
			that.more(false);		
			that.moreButton(true);
			that.lessButton(false);																											
			that.channelId(channelObject.channelId);	
			that.channelName(channelObject.channelName);													
			that.messageId(messageObject.messageId);
			that.senderName(replyObject.senderFirstname+' '+replyObject.senderLastname+':');						
			that.replyDate(dateFormat2(replyObject.created));
			that.reply(replyObject.replyLess);
			that.moreText(replyObject.replyFull);												
		}
	}
	
	this.menuCommand = function () {
		viewNavigate('Reply detail', 'replyDetailView', 'channelMenuView');		
  };	
	
	this.showMore = function(){
		that.less(false);		
		that.more(true);
		that.moreButton(false);
		that.lessButton(true);																
	};
	
	this.showLess = function(){
		that.less(true);		
		that.more(false);
		that.moreButton(true);
		that.lessButton(false);															
	};		
				
}
