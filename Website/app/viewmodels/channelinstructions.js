define(['services/logger'], function (logger) {
    var
        // Properties
        title = 'Channel Instructions',
      
        // Methods
        activate = function () {
            return true;
        },

        submitCommand = function () {

        };

    return {
        title: title,
        activate: activate,
        submitCommand: submitCommand
    };
});