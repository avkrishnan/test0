define('model',
    [
        'model.account',
        'model.login',
        'model.channel'
    ],
    function (account, login, channel) {
        var
            model = {
                Account: account,
                Login: login,
                Channels : channel
            };
        
        return model;
    });