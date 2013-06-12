/*globals ko*/

function ChannelListViewModel() {
	/// <summary>
	/// A view model that displays the list of channels with the user owns
	/// </summary>
	
	// --- properties
	
	this.template = "channelListView";
	
	this.channels = ko.observableArray([]);
    
    this.notification = ko.observable();
    
	var that = this;
	this.shown = false;
	
	$("#" + this.template).live("pagebeforeshow", function (e, data) {
	    
	    if (!that.shown) {
	        that.activate();
	    }

	});
    
    //$('#channelNotifications').popup('close');
	// Methods
	
	var  dataService = new EvernymChannelService();
		
	this.activate = function() {
		console.log("trying to get channels");
		
		if ( that.channels() && that.channels().length){
			that.channels.removeAll();
		}
		$.mobile.showPageLoadingMsg("a", "Loading Channels");
		return this.listMyChannelsCommand().then(gotChannels);
	};
	
	function successfulCreate(data){
		$.mobile.hidePageLoadingMsg();
		//logger.log('success listing channels ' , null, 'dataservice', true);
		
		
	};
	
	function gotChannels(data){
		$.mobile.hidePageLoadingMsg();
		
        //that.shown = true;
		//that.channels.removeAll();
		
		if (data.channel && data.channel.constructor == Object){
			
			data.channel = [data.channel];
		}
				if (!data.channel.length ){
			
			$.mobile.changePage("#" + channelNewViewModel.template);
			$("#no_channels_notification").show();
			return;
		}
		
		$("#no_channels_notification").hide();
		that.channels.removeAll();
		that.channels(data.channel);
	};
	
	function errorListChannels(data, status, details){
		$.mobile.hidePageLoadingMsg();
				
        if (details.code == 100202 || status == 401){
			$.mobile.changePage("#" + loginViewModel.template);
            showMessage("Please log in or register to view channels.");
		}
        else {
            showMessage("Error listing my channels: " + details.message);
        }
        
		//logger.logError('error listing channels', null, 'dataservice', true);
	};
	
	this.listMyChannelsCommand = function () {
		
		//logger.log("starting listChannels", undefined, "channels", true);
		return dataService.listMyChannels({ success: successfulCreate, error: errorListChannels });
	};
	
	this.logoutCommand = function(){
		loginViewModel.logoutCommand();
		$.mobile.changePage("#" + loginViewModel.template)
		
	}
	
	this.showChannel = function (channel) {
        localStorage.setItem("currentChannel", JSON.stringify(channel));
        
		
		$.mobile.changePage("#" + channelViewModel.template)
	};
	
	this.newChannelCommand = function () {
		channelNewViewModel.activate();
		$.mobile.changePage("#" + channelNewViewModel.template)
	};
	
	
	
	
	
}
