define(['services/logger'], function (logger) {

    var
        title = 'Account',

        activate = function activate() {
        logger.log('on postlogin page!', null, 'account', true);
            return true;
        };

    return {
        title: title,
        activate: activate
    };
});
