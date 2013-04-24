define(['services/dataservice.account', 'services/dataservice.channel', 'services/dataservice.channelMessage'],
    function (account, channel, message) {
        return {
            account: account,
            channel: channel,
            message: message
            
        };
    });