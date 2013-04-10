define('model.mapper',
['model'],
    function (model) {
        var
            account = {
                getDtoId: function (dto) { return dto.id; },
                fromDto: function (dto, item) {
                    item = item || new model.Account().id(dto.id);
                    item.accountName(dto.accountName)
                        .emailaddress(dto.emailaddress)
                        .firstname(dto.firstname)
                        .lastname(dto.lastname)
                        .nickname(dto.nickname)
                        .password(dto.password);
                    return item;
                }
            },

            login = {
                getDtoId: function (dto) { return dto.id; },
                fromDto: function (dto, item) {
                    item = item || new model.Account().id(dto.id);
                    item.accountName(dto.accountName)
                        .emailaddress(dto.emailaddress)
                        .firstname(dto.firstname)
                        .lastname(dto.lastname)
                        .nickname(dto.nickname)
                        .password(dto.password);
                    return item;
                }
            },

            channel = {
                getDtoId: function (dto) { return dto.id; },
                fromDto: function (dto, item) {
                    item = item || new model.Channel().id(dto.id);
                    item.name(dto.name);
                    return item;
                }
            };

        return {
            channel: channel,
            account: account
        };
    });