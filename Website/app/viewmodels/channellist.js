define(['services/logger', 'services/dataservice'], function (logger, dataService) {
    var
        // Properties
        title = 'Channels',
        channels = ko.observableArray(),

        // Methods
        activate = function () {
            logger.log("starting shiz", undefined, "channels", true);
            return true;
        },

        successfulCreate = function(data){
	    logger.log('success listing channels', null, 'dataservice', true);
	},

	errorCreate = function(data){
	    logger.log('error listing channels', null, 'dataservice', true);
	},

	listChannelsCommand = function () {
	    logger.log('start creating channel ' + this.name() , null, 'dataservice', true);
	    dataService.channel.createChannel(this.name(), {success: successfulCreate, error: errorCreate});
	};


    return {
        title: title,
        activate: activate,
        channels: channels 
    };
});
