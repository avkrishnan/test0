﻿define(['services/logger'], function (logger) {

    var
        title = 'Welcome to Evernym', // Test Commit

        activate = function activate() {
            return true;
        };

    return {
        title: title,
        activate: activate
    };
});