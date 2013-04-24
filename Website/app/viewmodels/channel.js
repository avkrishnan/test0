define(['services/logger', 'services/dataservice', 'durandal/plugins/router'], function (logger, dataService, router) {
    var
        // Properties
        title = ko.observable(),
        channel = ko.observableArray([]),
	message = ko.observable(),
	messages = ko.observableArray([]),
	that = this,
	foopoo = ko.observable(""),
	channelid = '',
	count = 0,
        // Methods
	
        activate = function () {
	    var that = this;
            var pathname = window.location.href;
            var parts = pathname.split('/');
            channelid = parts[ parts.length - 1]
	    that = this;
	    
	     getChannelCommand(channelid).then(gotChannel);
	     getMessagesCommand(channelid).then(gotMessages);
	     
	     return true;
	    
        },
	
	gotChannel = function(data){
		channel([data]);
		title("Channel: " + data.name );
		
	    },
	    
	gotMessages = function(data){
	    messages(data.message);
	    foopoo('THIS IS THE STUFF ' + (count++));
	},
	
        successfulGetChannel = function(data){
	    logger.log('success Getting Channel ' , null, 'channel', true);
	    
	    
	},
	successfulDelete = function(data){
	    router.navigateTo('#/channellist');  
	},
	successfulModify= function(data){
	    //router.navigateTo('#/channellist');
	    logger.log("SUCCESS MODIFY", undefined, "channel", true);
	},
	successfulMessage= function(data){
	    //router.navigateTo('#/channellist');
	    logger.log("SUCCESS MESSAGE", undefined, "channel", true);
	    
	    
	    
	},
	successfulMessageGET = function(data){
	    
	    logger.log("SUCCESS GET MESSAGES" + JSON.stringify(data), undefined, "channel", true);
	    
	    
	},
        
	errorAPI = function(data){
	    logger.logError('error listing channels', null, 'channel', true);
	},
	
	getChannelCommand = function (channelid) {
	    
            logger.log("starting getChannel", undefined, "channels", true);
	    return dataService.channel.getChannel(channelid, {success: successfulGetChannel, error: errorAPI});
            
	},
	
	deleteChannelCommand = function () {
	    
            logger.log("starting deleteChannel", undefined, "channels", true);
	    return dataService.channel.deleteChannel(channel()[0].id , {success: successfulDelete, error: errorAPI});
            
	},
	
	modifyChannelCommand = function(){
	    logger.log("starting modifyChannel", undefined, "channels", true);
	    
	    title("Channel: " + channel()[0].name );
	    return dataService.channel.modifyChannel(channel()[0], {success: successfulModify, error: errorAPI});
	},
	
	postMessageCommand = function(){
	    logger.log("postMessageCommand", undefined, "channels", true);
	    var messageobj = {text: message(), type: 'FYI'};
	    return dataService.message.createChannelMessage(channelid, messageobj, {success: successfulMessage, error: errorAPI});
	},
	
	fooPooCommand = function(){
	    
	    messages([]);
	    
	    var dood = setTimeout(shizbizkit, 5000);
	    
	    
	},
	
	shizbizkit = function(){
	    getMessagesCommand(channelid).then(gotMessages);
	},
	
	getMessagesCommand = function(){
	    logger.log("getMessagesCommand", undefined, "channels", true);
	    return dataService.message.getChannelMessages(channelid, {success: successfulMessageGET, error: errorAPI});
	};

    return {
        title: title,
	channel: channel,
        getChannelCommand: getChannelCommand,
	deleteChannelCommand: deleteChannelCommand,
	modifyChannelCommand: modifyChannelCommand,
        activate: activate,
	postMessageCommand: postMessageCommand,
	message: message,
	messages: messages,
	foopoo:foopoo,
	fooPooCommand: fooPooCommand,
	shizbizkit: shizbizkit
    };
});
