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
	    
	    return followChannelCommand(channelid).then(function(data){
		
		router.navigateTo('#/channellist');
		
		
	    });
	    

        },
	
	successfulFollow = function(data){
	    //router.navigateTo('#/channellist');
	    logger.log("SUCCESS follow Channel", undefined, "channel", true);
	},
        
	errorAPI = function(data){
	    logger.logError('error listing channels', null, 'channel', true);
	},
	
	followChannelCommand = function(channelid){
	    logger.log("starting follow Channel", undefined, "channels", true);
	  
	    return dataService.channel.followChannel(channelid, {success: successfulFollow, error: errorAPI});
	}
	
	;

    return {
        title: title,
	channel: channel,
        followChannelCommand: followChannelCommand,
        activate: activate
    };
});
