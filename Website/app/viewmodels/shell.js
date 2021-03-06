﻿define(['durandal/system', 'durandal/plugins/router', 'services/logger'],
    function (system, router, logger) {
        var shell = {
            activate: activate,
            router: router
        };

        return shell;

        //#region Internal Methods
        function activate() {
            return boot();
        }

        function boot() {

            router.mapAuto();

            router.mapNav('home');
            router.mapNav('login');
            router.mapNav('signup');
            router.mapNav('channellist');
            router.mapNav('channelnew');

//            router.mapNav('channelnew');

            log('Welcome to Evernym!', null, true);
            return router.activate('home');
        }

        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(shell), showToast);
        }
        //#endregion
    });
