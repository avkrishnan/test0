/*globals ko*/

function ChannelsFollowingListViewModel() {
	/// <summary>
	/// A view model that represents a single tweet
	/// </summary>
	
	// --- properties
	
	this.template = "channelsFollowingListView";
    this.viewid = "V-30";
    this.viewname = "ChannelsIFollow";
	this.hasfooter = true;
	this.channels = ko.observableArray([]);
	var that = this;
	this.shown = false;
    
    
    this.applyBindings = function(){
        $("#" + that.template).live("pagebeforeshow", function (e, data) {
                                    
                                    
                                    if (!that.shown) {
                                    that.activate();
                                    }
                                    
                                    });
    };
    

	
   

	
   
	
	var  dataService = new EvernymChannelService();
	
	// Methods
	this.activate = function() {
		
		console.log("trying to get channels");
		
		if ( that.channels() && that.channels().length){
			that.channels.removeAll();
		}
		$.mobile.showPageLoadingMsg("a", "Loading Channels");
		return this.listFollowingChannelsCommand().then(gotChannels);
	};
	
	
	function successfulCreate(data){
		
		//logger.log('success listing channels ' , null, 'dataservice', true);
	};
	
	function gotChannels(data){
		$.mobile.hidePageLoadingMsg();
		//that.shown = true;
		//that.channels.removeAll();
		
		if (data.channel && data.channel.constructor == Object){
			
			data.channel = [data.channel];
		}
		
		if (!data.channel) {
		    // TODO:  What do we do when there are no channels that we are following?

			//$.mobile.changePage("#" + channelNewViewModel.template);
			//$("#no_channels_notification").show();
			return;
		}
		
		$("#no_channels_notification").hide();
		
		that.channels(data.channel);
	};
	
	function errorListChannels(data, status, details){
		$.mobile.hidePageLoadingMsg();
        
        if (loginPageIfBadLogin(details.code)){
			
            //showMessage("Please log in or register to view channels.");
		}
        else {
            showError("Error listing my channels I'm Following: " + details.message);
            
            
        }
	};
	
	this.listFollowingChannelsCommand = function () {
		return dataService.listFollowingChannels({ success: successfulCreate, error: errorListChannels });
	};
	
	this.logoutCommand = function(){
		loginViewModel.logoutCommand();
		$.mobile.changePage("#" + loginViewModel.template)
	}
	
	this.showChannel = function (channel) {
        localStorage.setItem("currentChannel", JSON.stringify(channel));
		
		$.mobile.changePage("#" + channelBroadcastsViewModel.template)
	};
	
	this.newChannelCommand = function () {
		channelNewViewModel.activate();
		$.mobile.changePage("#" + channelNewViewModel.template)
	};
	
	
}
