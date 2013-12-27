/*globals ko*/
/* To do - Pradeep Kumar */
function FollowerDetailsViewModel() {
  var that = this;
  this.template = 'followerDetailsView';
  this.viewid = 'V-35';
  this.viewname = 'Follower Details';
  this.displayname = 'Follower Details';
	this.accountName = ko.observable();	
	
  /* Follower observable */	
	this.channelName = ko.observable();			
	this.followerName = ko.observable();		
	
	/* Methods */
  this.applyBindings = function() {
		$('#' + that.template).on('pagebeforeshow', function (e, data) {
      that.activate();
    });	
	};  

	this.activate = function() {
		if(authenticate()) {
			var channelObject = JSON.parse(appCtx.getItem('currentChannelData'));		
			var followerObject = JSON.parse(appCtx.getItem('currentfollowerData'));		
			if(!channelObject) {
				goToView('followersListView');							
			} else {
				addExternalMarkup(that.template); // this is for header/overlay message					
				that.accountName(appCtx.getItem('accountName'));
				that.channelName(channelObject.channelName);										
				that.followerName(followerObject.followerName+' <em>'+followerObject.accountname+'</em>');												
			}
		}
	}			
	
}