/*globals ko*/
/* To do - Pradeep Kumar */
function SingleMessageFullTextViewModel() {
  var that = this;
	this.template = 'singleMessageFullTextView';
	this.viewid = 'V-23';
	this.viewname = 'Full Msg';
	this.displayname = 'Broadcast Full Text';	
	this.accountName = ko.observable();		

  /* Single message observable */		
	this.channelName = ko.observable();		
	this.time = ko.observable();	
	this.sensitivity = ko.observable();	
	this.sensitivityText = ko.observable();	
	this.singleMessage = ko.observable();
	this.iGi = ko.observable();
	this.percentageText = ko.observable();
	this.percentageClass = ko.observable();	
	this.percentage = ko.observable();			
	this.noiGi = ko.observable();	
	this.fullText = ko.observable();
	this.broadcastType = ko.observable();
	this.acks = ko.observable();					
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  
	
	this.activate = function() {
		if(authenticate()) {
			var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));		
			var messageObject = JSON.parse(localStorage.getItem('currentMessageData'));			
			if(!channelObject || !messageObject) {
				goToView('channelsIOwnView');			
			} else {
				addExternalMarkup(that.template); // this is for header/overlay message						
				that.accountName(localStorage.getItem('accountName'));			
				var channelObject = JSON.parse(localStorage.getItem('currentChannelData'));			
				var messageObject = JSON.parse(localStorage.getItem('currentMessageData'));										
				that.channelName(channelObject.channelName);
				var fullDate = formatDate(messageObject.created,'long');					
				//that.time('Sent '+ fullDate +' ('+messageObject.time+'):');
				that.time('Sent - '+ fullDate);
				that.sensitivity(messageObject.sensitivity);			
				that.sensitivityText(messageObject.sensitivityText);
				if(messageObject.broadcastFull.length > truncatedTextScreen()) {
					that.singleMessage('<strong class='+messageObject.sensitivity+'></strong>'+$.trim(messageObject.broadcastFull).substring(0, truncatedTextScreen()).split(' ').slice(0, -1).join(' ') + '...<em></em>');
				}
				else {
					that.singleMessage('<strong class='+messageObject.sensitivity+'></strong>'+messageObject.broadcastFull+'<em></em>');				
				}							
				that.iGi(messageObject.iGi);
				that.percentageText(messageObject.percentageText);
				that.percentageClass(messageObject.percentageClass);			
				that.percentage(messageObject.percentage);			
				that.noiGi(messageObject.noiGi);			
				that.fullText(messageObject.broadcastFull);
				that.broadcastType(messageObject.type);
				that.acks(messageObject.acks+' Got It');																
			}
		}
	}
	
	this.showWhoGotIt = function(){
		if(that.broadcastType() != 'REQUEST_ACKNOWLEDGEMENT') {
			var toastobj = {type: 'toast-info', text: 'No iGi requested'};
			showToast(toastobj);						
		}
		else if(that.acks() == '0 Got It') {
			var toastobj = {type: 'toast-info', text: "No iGi's received yet"};
			showToast(toastobj);			
		}
		else {					
			viewNavigate('Broadcast Details', 'singleMessageView', 'whoGotItView');
		}
	};			
				
}
