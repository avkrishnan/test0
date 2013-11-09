(function() {
  QUnit.config.testTimeout = 90000;
  QUnit.config.reorder = false;

  var hlpr = new ApiTestHelper();

  var SCEN1 = hlpr.TestScenario();

  asyncTest('ENROLL', hlpr.enroll(SCEN1));

  asyncTest('LOGIN', hlpr.login(SCEN1));

  asyncTest('GET COMMUNICATION METHODS', function() {
    $.when(SCEN1.ES.commethodService.getCommethods())
    .then(hlpr.CHECK.success, hlpr.CHECK.shouldNotFail)
    .then( function(data) {
        ok(!hlpr.is_empty(data), 'check for communication settings: ' + JSON.stringify(data));
      }, hlpr.CHECK.shouldNotFail)
    .then(start, start);
  });

  asyncTest('FETCH CHANNELS WHEN THERE ARE NONE', function() {
    $.when(SCEN1.ES.channelService.listMyChannels())
    .then(hlpr.CHECK.success, hlpr.CHECK.shouldNotFail)
    .then(start,start);
  });

  asyncTest('CREATE CHANNEL', hlpr.createChannelF(SCEN1, 'channel'));

  asyncTest('FETCH A CHANNEL I OWN', function() {
    $.when(SCEN1.ES.channelService.getChannel(SCEN1.channel.id))
    .then(hlpr.CHECK.success, hlpr.CHECK.shouldNotFail)
    .then(start, start);
  });

  asyncTest('MODIFY CHANNEL DESCRIPTION', function() {
    var newChnl = {
      id: SCEN1.channel.id,
      description: SCEN1.channel.description + "<modified>"
    };
    $.when(SCEN1.ES.channelService.modifyChannel(newChnl))
    .then(hlpr.CHECK.successNoContent, hlpr.CHECK.shouldNotFail)
    .then(hlpr.fetchChannelAndCheckF(SCEN1, 'channel', newChnl), hlpr.CHECK.shouldNotFail)
    .then(function() {
          SCEN1.channel.description = newChnl.description;
        }, hlpr.CHECK.shouldNotFail)
    .then(start,start);
  });

  asyncTest('CREATE A SECOND CHANNEL', hlpr.createChannelF(SCEN1, 'channel2'));

  asyncTest('FETCH ALL CHANNELS I OWN', function() {
    $.when(SCEN1.ES.channelService.listMyChannels())
    .then(hlpr.CHECK.success, hlpr.CHECK.shouldNotFail)
    .then(checkChannelsMatch, hlpr.CHECK.shouldNotFail)
    .then(start,start);
  });

  function checkChannelsMatch(data) {
    equal(data.channel.length, 2, "make sure we return two channels");
    var chnl1 = data.channel[0];
    var chnl2 = data.channel[1];
    if (data.channel[0].name != SCEN1.channel.name) {
      // swap
      var x = chnl1;
      chnl1 = chnl2;
      chnl2 = x;
    }
    equal(JSON.stringify({
      channel : [ chnl1, chnl2 ]
    }), JSON.stringify({
      channel : [ SCEN1.channel, SCEN1.channel2 ]
    }), "and that they match what we expect");
  }

  asyncTest('DELETE CHANNEL', function() {
    $.when(SCEN1.ES.channelService.deleteChannel(SCEN1.channel2.id))
    .then(hlpr.CHECK.successNoContent, hlpr.CHECK.shouldNotFail)
    .then(fetchAndCheckChannels, hlpr.CHECK.shouldNotFail)
    .then(start, start);

  });

  function fetchAndCheckChannels(data) {
    return $.when(SCEN1.ES.channelService.listMyChannels())
    .then(hlpr.CHECK.success, hlpr.CHECK.shouldNotFail)
    .then(checkOneChannel, hlpr.CHECK.shouldNotFail);
  }

  function checkOneChannel(data) {
    equal(data.channel.length, 1, "only one channel remains");
    equal(SCEN1.channel.id, data.channel[0].id, "the correct channel is remaining");
  }

  asyncTest('CREATE ANOTHER SECOND CHANNEL', hlpr.createChannelF(SCEN1, 'channel2'));

  function testCreateChannelWithFail(accessToken, checkFuncOvd, chnlOvd) {
    var scenario = hlpr.TestScenario();
    if (accessToken == undefined) {
      scenario.ES.evernymService.clearAccessToken();
    } else {
      scenario.ES.evernymService.setAccessToken(accessToken);
    }
    var channel = chnlOvd ? chnlOvd : hlpr.generateChannel();
    $.when(scenario.ES.channelService.createChannel(channel))
    .then(hlpr.CHECK.shouldFail, checkFuncOvd ? checkFuncOvd : hlpr.CHECK.unauthorized)
    .then(start,start);
  }

  asyncTest('CREATE CHANNEL WITH NO AUTH', function() {
    testCreateChannelWithFail(undefined);
  });

  asyncTest('CREATE CHANNEL WITH EMPTY AUTH', function() {
    testCreateChannelWithFail('');
  });

  asyncTest('CREATE CHANNEL WITH BAD AUTH', function() {
    testCreateChannelWithFail('asdfasdf', hlpr.CHECK.badRequest);
  });

  asyncTest('CREATE DUPLICATE CHANNEL', function() {
    testCreateChannelWithFail(SCEN1.ES.evernymService.getAccessToken(), hlpr.CHECK.badRequest, SCEN1.channel);
  });

})();
