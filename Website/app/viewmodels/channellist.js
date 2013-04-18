define(['services/logger', 'services/dataservice'], function (logger, dataService) {
    var
        // Properties
        title = 'Channels',
        channels = ko.observableArray([]),
	
	
        // Methods
	
        activate = function () {
	    var that = this;
	    return listChannelsCommand().then(function(data){
		
		that.channels.removeAll();
                that.channels(data.channel);
		
		
		});  
        },
	

        successfulCreate = function(data){
	    logger.log('success listing channels ' , null, 'dataservice', true);
            
	},
        

	errorCreate = function(data){
	    logger.logError('error listing channels', null, 'dataservice', true);
	},

	listChannelsCommand = function () {
	    
            logger.log("starting listChannels", undefined, "channels", true);
	    return dataService.channel.listChannels({success: successfulCreate, error: errorCreate});
            
	};


    return {
        title: title,
        listChannelsCommand: listChannelsCommand,
        activate: activate,
        channels: channels
    };
});
