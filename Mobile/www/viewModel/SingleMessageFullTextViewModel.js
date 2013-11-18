/*globals ko*/
/* To do - Pradeep Kumar */
function SingleMessageFullTextViewModel() {
  var that = this;
	this.template = 'singleMessageFullTextView';
	this.viewid = 'V-23';
	this.viewname = 'SingleMessageFullText';
	this.displayname = 'Message Full Text';	
	this.accountName = ko.observable();
	this.backText = ko.observable();		

  /* Single message observable */		
	this.channelName = ko.observable();		
	this.time = ko.observable();	
	this.sensitivityText = ko.observable();	
	this.singleMessage = ko.observable();
	this.fullText = ko.observable();		
	
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
			var fullDate = _date(messageObject.created);					
			that.time('Sent '+ fullDate +' ('+messageObject.time+'):');
			that.sensitivityText(messageObject.sensitivityText);				
			that.singleMessage(messageObject.broadcast);
			that.fullText(messageObject.broadcast);										
		}
	}
	
	this.backCommand = function () {
		popBackNav();
  };
	
	this.menuCommand = function () {
		pushBackNav('Broadcast details', 'singleMessageFullTextView', 'channelMenuView');		
  };	
	
	function _date(created) {	
		var date  = new Date(created);
    return ((date.getDate()<10?'0':'')+date.getDate()) + "/"+ (((date.getMonth()+1)<10?'0':'') + (date.getMonth()+1)) + "/" + 
		date.getFullYear()  + ", " +((date.getHours()<10?'0':'')+date.getHours()-12) + ":" + 
		(date.getMinutes()<10?'0':'') +  date.getMinutes() + " " + (date.getMinutes()>12?'PM':'AM'); 
	}
	
	this.userSettings = function () {
		pushBackNav('Broadcast details', 'singleMessageFullTextView', 'escalationPlansView');
  };	
	
	this.composeCommand = function () {
		pushBackNav('Broadcast details', 'singleMessageFullTextView', 'sendMessageView');
  };	
				
}
