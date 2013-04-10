define(function () {
    
    var
        id = ko.observable(0),
        name = ko.observable('');
        
    return {
        id: id,
        name: name
    };
});