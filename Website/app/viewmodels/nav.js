define(['services/logger'], function (logger) {

    var
        title = 'chickenbiskit',

        activate = function activate() {
            return true;
        };

    return {
        title: title,
        activate: activate
    };
});
