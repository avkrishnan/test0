define(['services/logger', 'services/dataservice', 'durandal/plugins/router'], function (logger, dataService, router) {
    var
        // Properties
        title = ko.observable(),
        channel = {},
	
        // Methods
	
        activate = function () {
	    var that = this;
            var pathname = window.location.href;
            var parts = pathname.split('/');
            var channelid = parts[ parts.length - 1]
	    var that = this;
	    
	    return getChannelCommand(channelid).then(function(data){
		that.channel = data;
		that.channelid = data.id;
		that.title("Channel: " + data.name );
	    });
	    

        },
	
        successfulCreate = function(data){
	    logger.log('success listing channels ' , null, 'dataservice', true);
	},
	successfulDelete = function(data){
	    router.navigateTo('#/channellist');  
	},
        
	errorCreate = function(data){
	    logger.logError('error listing channels', null, 'dataservice', true);
	},
	
	getChannelCommand = function (channelid) {
	    
            logger.log("starting getChannel", undefined, "channels", true);
	    return dataService.channel.getChannel(channelid, {success: successfulCreate, error: errorCreate});
            
	},
	deleteChannelCommand = function () {
	    
	    var pathname = window.location.href;
            var parts = pathname.split('/');
            var channelid = parts[ parts.length - 1];
	    
            logger.log("starting deleteChannel", undefined, "channels", true);
	    return dataService.channel.deleteChannel(channelid, {success: successfulDelete, error: errorCreate});
            
	}
	;

    return {
        title: title,
        getChannelCommand: getChannelCommand,
	deleteChannelCommand: deleteChannelCommand,
        activate: activate
    };
});
