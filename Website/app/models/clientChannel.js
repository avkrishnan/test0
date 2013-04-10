define(function () {

    var
        id = ko.observable(0),
        name = ko.observable(''),
        relationship = ko.observable('');

    return {
        id: id,
        name: name,
        relationship: relationship
    };
});