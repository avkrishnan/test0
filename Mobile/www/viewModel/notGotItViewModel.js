/*globals ko*/
/* To do - Pradeep Kumar */
function NotGotItViewModel() {
  var that = this;
	this.template = 'notGotItView';
	this.viewid = 'V-57';
	this.viewname = 'Not Got it';
	this.displayname = 'Did not got iGi';	
	this.accountName = ko.observable();		

  /* Not got it observable */
	this.channelId = ko.observable();				
	this.channelName = ko.observable();
	this.messageId = ko.observable();				
	this.noacks = ko.observable();
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
			that.noacks(messageObject.noacks+" Haven't Got It Yet");
			$.mobile.showPageLoadingMsg("a", "Loading Followers");
			return ES.messageService.getChannelMessages(that.channelId(), undefined, {success: successfulList, error: errorAPI});																				
		}
	}	
	
	function successfulList(data){			
		that.followers.push({
			followerId: data.followers[len].id,
			follower: '<span></span>'+data.followers[len].firstname +' '+ data.followers[len].lastname+', <em>'+data.followers[len].accountname+'</em>'
		});
	}

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		that.toastText(details.message);		
		showToast();
  };		
				
}
