/*globals ko*/
/* To do - Pradeep Kumar */
function WhoGotItViewModel() {
  var that = this;
	this.template = 'whoGotItView';
	this.viewid = 'V-34';
	this.viewname = 'Who Got it';
	this.displayname = 'Who got iGi';	
	this.accountName = ko.observable();		

  /* Not got it observable */
	this.channelId = ko.observable();				
	this.channelName = ko.observable();
	this.messageId = ko.observable();				
	this.acks = ko.observable();
	this.followers = ko.observableArray([]);		
	this.toastText = ko.observable();			
	
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
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}			
			that.accountName(localStorage.getItem('accountName'));											
			that.channelId(channelObject.channelId);			
			that.channelName(channelObject.channelName);
			that.messageId(messageObject.messageId);								
			that.noacks(messageObject.acks+" Got It");
			$.mobile.showPageLoadingMsg("a", "Loading Followers");
			return ES.messageService.getChannelMessages(that.channelId(), undefined, {success: successfulList, error: errorAPI});																				
		}
	}	
	
	function successfulList(data){			
		that.followers.push({
			followerId: data.followers[len].id,
			follower: '<span class="timeundeliver">9/16, 3:35 PM</span>'+data.followers[len].firstname +' '+ data.followers[len].lastname+', <em>'+data.followers[len].accountname+'</em>'
		});
	}

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		that.toastText(details.message);		
		showToast();
  };		
				
}
