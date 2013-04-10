define(['services/logger'], function (logger) {
    var
        // Properties
        title = 'Channels',
        channels = ko.observableArray(),

        // Methods
        activate = function () {
            return true;
        }

    return {
        title: title,
        activate: activate,
        channels: channels 
    };
});