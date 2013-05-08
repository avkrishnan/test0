/*globals ko*/

function ChannelListViewModel() {
    /// <summary>
    /// A view model that represents a single tweet
    /// </summary>
    
    // --- properties
    
    this.template = "channelListView";
    
  
    this.channels = ko.observableArray([]);
    this.chicken = ko.observable();
	var that = this;
	
    // Methods
    
    var  dataService = new EvernymChannelService();
	
    
    this.activate = function() {
	    
        console.log("trying to get channels");
        if ( that.channels() && that.channels().length){
            that.channels.removeAll();
        }
	    return this.listChannelsCommand().then(gotChannels);
    };
	
    
    function successfulCreate(data){
        
	    //logger.log('success listing channels ' , null, 'dataservice', true);
        
        
	};
    
	function gotChannels(data){
        
	    //that.channels.removeAll();
        
        if (data.channel && data.channel.constructor == Object){
            
            data.channel = [data.channel];
        }
        
        
        that.channels(data.channel);
	};
    
	function errorListChannels(data){
        console.log("error listing channels");
        $.mobile.changePage("#" + loginViewModel.template)
	    //logger.logError('error listing channels', null, 'dataservice', true);
	};
    
	this.listChannelsCommand = function () {
        //logger.log("starting listChannels", undefined, "channels", true);
	    return dataService.listChannels({success: successfulCreate, error: errorListChannels});
	};
    
    this.logoutCommand = function(){
        loginViewModel.logoutCommand();
        $.mobile.changePage("#" + loginViewModel.template)
        
    }
    
    this.showChannel = function (channel) {
        
	    channelViewModel.activate(channel);
        $.mobile.changePage("#" + channelViewModel.template)
	};
    
    this.newChannelCommand = function (channel) {
	    channelNewViewModel.activate();
        $.mobile.changePage("#" + channelNewViewModel.template)
	};
    
    
    
    
    
}
