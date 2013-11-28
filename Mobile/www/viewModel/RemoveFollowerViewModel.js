/*globals ko*/
/* To do - Pradeep Kumar */
function RemoveFollowerViewModel() {	
  var that = this;
	this.template = 'removeFollowerView';
	this.viewid = 'V-35a';
	this.viewname = 'RemoveFollower';
	this.displayname = 'Remove Follower';	
	this.accountName = ko.observable();		
	
  /* Remove followers observable */
	this.channelId = ko.observable();	
	this.followerId = ko.observable();	
	this.followerName = ko.observable();
	this.followerAccount = ko.observable();	
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
		var followerObject = JSON.parse(localStorage.getItem('currentfollowerData'));;		
		if(token == '' || token == null) {
			goToView('loginView');
		} else if(!followerObject) {
			goToView('followersListView');			
		} else {
			addExternalMarkup(that.template); // this is for header/overlay message			
			if(localStorage.getItem('toastData')) {
				that.toastText(localStorage.getItem('toastData'));
				showToast();
				localStorage.removeItem('toastData');				
			}			
			that.accountName(localStorage.getItem('accountName'));	
			that.channelId(channelObject.channelId);			
			that.followerId(followerObject.followerId);
			that.followerName(followerObject.followerName);			
			that.followerAccount(followerObject.accountname);												
		}
	}

	function successfulDelete(args) {
    $.mobile.hidePageLoadingMsg();
		popBackNav();	
		that.toastText('Follower deleted');		
		localStorage.setItem('toastData', that.toastText());
		ES.channelService.getChannel(that.channelId(), {success: successfulGetChannel, error: errorAPI});			
  };
	
	function successfulGetChannel(data) {
		if(data.followers == 1) {
			var followers = data.followers +' follower';
		} else {
			var followers = data.followers +' followers';
		}		
		var channel = [];			
		channel.push({
			channelId: data.id, 
			channelName: data.name, 
			channelDescription: data.description,
			longDescription: data.longDescription,			
			followerCount: followers
		});
		channel = channel[0];		
		localStorage.setItem('currentChannelData', JSON.stringify(channel));		
    goToView('followersListView');					
	}	

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
    localStorage.setItem('signUpError', details.message);
    goToView('removeFollowerView');
  };
	
  this.removeFollowerCommand = function () {
		$.mobile.showPageLoadingMsg('a', 'Removing Follower');
		return ES.channelService.removeFollower(that.channelId(), that.followerId(), { success: successfulDelete, error: errorAPI });
		localStorage.removeItem('currentChannel');
  };	
	
}