define(['services/logger', 'services/dataservice', 'durandal/plugins/router'], function (logger, dataService, router) {
    var
        // Properties
        title = ko.observable(),
        channel = ko.observableArray([]),
	
        // Methods
	
        activate = function () {
	    var that = this;
            var pathname = window.location.href;
            var parts = pathname.split('/');
            var channelid = parts[ parts.length - 1]
	    var that = this;
	    
	    return getChannelCommand(channelid).then(function(data){
		that.channel([data]);
		
		
		that.title("Channel: " + data.name );
	    });
	    

        },
	
        successfulCreate = function(data){
	    logger.log('success listing channels ' , null, 'channel', true);
	},
	successfulDelete = function(data){
	    router.navigateTo('#/channellist');  
	},
	successfulModify= function(data){
	    //router.navigateTo('#/channellist');
	    logger.log("SUCCESS modifyChannel", undefined, "channel", true);
	},
        
	errorAPI = function(data){
	    logger.logError('error listing channels', null, 'channel', true);
	},
	
	getChannelCommand = function (channelid) {
	    
            logger.log("starting getChannel", undefined, "channels", true);
	    return dataService.channel.getChannel(channelid, {success: successfulCreate, error: errorAPI});
            
	},
	deleteChannelCommand = function () {
	    
            logger.log("starting deleteChannel", undefined, "channels", true);
	    return dataService.channel.deleteChannel(channel()[0].id , {success: successfulDelete, error: errorAPI});
            
	},
	modifyChannelCommand = function(){
	    logger.log("starting modifyChannel", undefined, "channels", true);
	    
	    title("Channel: " + channel()[0].name );
	    return dataService.channel.modifyChannel(channel()[0], {success: successfulModify, error: errorAPI});
	}
	
	;

    return {
        title: title,
	channel: channel,
        getChannelCommand: getChannelCommand,
	deleteChannelCommand: deleteChannelCommand,
	modifyChannelCommand: modifyChannelCommand,
        activate: activate
    };
});
