/*globals ko*/
/* To do - Pradeep Kumar */
function ChannelsIOwnViewModel() {	
  var that = this;
	this.template = 'channelsIOwnView';
	this.viewid = 'V-19';
	this.viewname = 'Channels';
	this.displayname = 'Channels I Own';	
	this.accountName = ko.observable();		
	
  /* Channels observable */
	this.sectionOne = ko.observable(false);
	this.sectionTwo = ko.observable(false);	
	this.channels = ko.observableArray([]);		

	/* Methods */
	this.applyBindings = function(){	
		$('#' + that.template).on('pagebeforeshow', null, function (e, data) {	
			that.activate();	
		});		
	};
	
  this.activate = function() {
		if(authenticate()) {
			addExternalMarkup(that.template); // this is for header/overlay message				
			that.accountName(appCtx.getItem('accountName'));
			that.sectionOne(false);
			that.sectionTwo(false);			
			appCtx.setItem('counter', 1);												
			that.channels.removeAll();			
			$.mobile.showPageLoadingMsg('a', 'Loading Channels');
			return ES.channelService.listMyChannels({ success: successfulList, error: errorAPI });
		}
	};				    	
	
	function successfulList(data){	
    $.mobile.hidePageLoadingMsg();
		that.channels.removeAll();
		if(data.channel.length == 0) {
			that.sectionOne(true);			
		}
		else {
			that.sectionTwo(true);				
			for(var channelslength = 0; channelslength<data.channel.length; channelslength++) {
				if(data.channel[channelslength].followers == 1) {
					var followers = data.channel[channelslength].followers +' follower';
				} else {
					var followers = data.channel[channelslength].followers +' followers';
				}			
				that.channels.push({
					channelId: data.channel[channelslength].id, 
					channelName: data.channel[channelslength].name, 
					channelDescription: data.channel[channelslength].description,
					longDescription: data.channel[channelslength].longDescription,
					followerCount: followers
				});
			}			
		}
	};    
	
	function errorAPI(data, status, details){
		$.mobile.hidePageLoadingMsg();	
		var toastobj = {type: 'toast-error', text: details.message};
		showToast(toastobj);
	};
	
	this.channelSettings = function(data){
		appCtx.removeItem('currentChannelData');				
		appCtx.setItem('currentChannelData', JSON.stringify(data));
		viewNavigate('Channels', 'channelsIOwnView', 'channelSettingsView');		
	};
	
	this.channelMain = function(data){
		appCtx.removeItem('currentChannelData');		
		appCtx.setItem('currentChannelData', JSON.stringify(data));
		viewNavigate('Channels', 'channelsIOwnView', 'channelMainView');					
	};
	
	this.channelFollowers = function(data){
		appCtx.removeItem('currentChannelData');			
		appCtx.setItem('currentChannelData', JSON.stringify(data));	
		viewNavigate('Channels', 'channelsIOwnView', 'followersListView');		
	};	
	
}