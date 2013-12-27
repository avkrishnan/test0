/*globals ko*/
/* To do - Pradeep Kumar */
function RemoveFollowerViewModel() {	
  var that = this;
	this.template = 'removeFollowerView';
	this.viewid = 'V-35a';
	this.viewname = 'Remove Follower';
	this.displayname = 'Remove Follower';	
	this.accountName = ko.observable();		
	
  /* Remove followers observable */
	this.channelId = ko.observable();	
	this.followerId = ko.observable();	
	this.followerName = ko.observable();
	this.followerAccount = ko.observable();							
	
	/* Methods */
	this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  
	
	this.activate = function() {
		if(authenticate()) {
			var channelObject = JSON.parse(appCtx.getItem('currentChannelData'));			
			var followerObject = JSON.parse(appCtx.getItem('currentfollowerData'));;		
			if(!followerObject) {
				goToView('followersListView');			
			} else {
				addExternalMarkup(that.template); // this is for header/overlay message						
				that.accountName(appCtx.getItem('accountName'));	
				that.channelId(channelObject.channelId);			
				that.followerId(followerObject.followerId);
				that.followerName(followerObject.followerName);			
				that.followerAccount(followerObject.accountname);												
			}
		}
	}

	function successfulDelete(args) {
    $.mobile.hidePageLoadingMsg();
		for(var ctr = 0; ctr <= 1; ctr++) {
			backNavText.pop();
			backNavView.pop();
		}
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
		appCtx.setItem('currentChannelData', JSON.stringify(channel));
		var toastobj = {redirect: 'followersListView', type: '', text: 'Follower deleted'};
		showToast(toastobj);						
    goToView('followersListView');					
	}	

  function errorAPI(data, status, details) {
    $.mobile.hidePageLoadingMsg();
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);
  };
	
  this.removeFollowerCommand = function () {
		$.mobile.showPageLoadingMsg('a', 'Removing Follower');
		return ES.channelService.removeFollower(that.channelId(), that.followerId(), { success: successfulDelete, error: errorAPI });
		appCtx.removeItem('currentChannel');
  };	
	
}