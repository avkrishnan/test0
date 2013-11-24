(function() {
  QUnit.config.testTimeout = 90000;
  QUnit.config.reorder = false;

  var hlpr = new ApiTestHelper();

  var SCEN_A = hlpr.TestScenario();

  asyncTest('ENROLL', hlpr.enroll(SCEN_A));

  asyncTest('LOGIN', hlpr.login(SCEN_A));

  asyncTest('GET COMMUNICATION METHODS', function() {
    $.when(SCEN_A.ES.commethodService.getCommethods())
    .then(hlpr.CHECK.success, hlpr.CHECK.shouldNotFail)
    .then( function(data) {
        ok(!hlpr.is_empty(data), 'check for communication settings: ' + JSON.stringify(data));
      }, hlpr.CHECK.shouldNotFail)
    .then(start, start);
  });

  asyncTest('FETCH CHANNELS WHEN THERE ARE NONE', function() {
    $.when(SCEN_A.ES.channelService.listMyChannels())
    .then(hlpr.CHECK.success, hlpr.CHECK.shouldNotFail)
    .then(start,start);
  });

  asyncTest('CREATE CHANNEL', hlpr.createChannelF(SCEN_A, 'channel'));

  asyncTest('FETCH A CHANNEL I OWN', function() {
    $.when(SCEN_A.ES.channelService.getChannel(SCEN_A.channel.id))
    .then(hlpr.CHECK.success, hlpr.CHECK.shouldNotFail)
    .then(function(data) {
        equal(data.followers,0);
      }, hlpr.CHECK.shouldNotFail)
    .then(start, start);
  });

  asyncTest('MODIFY CHANNEL SHORT DESCRIPTION', function() {
    var newChnl = {
      id: SCEN_A.channel.id,
      description: SCEN_A.channel.description + "<modified>"
    };
    $.when(SCEN_A.ES.channelService.modifyChannel(newChnl))
    .then(hlpr.CHECK.successNoContent, hlpr.CHECK.shouldNotFail)
    .then(hlpr.fetchChannelAndCheckF(SCEN_A, 'channel', newChnl), hlpr.CHECK.shouldNotFail)
    .then(function() {
          SCEN_A.channel.description = newChnl.description;
        }, hlpr.CHECK.shouldNotFail)
    .then(start,start);
  });

  asyncTest('MODIFY CHANNEL LONG DESCRIPTION', function() {
    var newChnl = {
      id: SCEN_A.channel.id,
      longDescription: SCEN_A.channel.longDescription + "<modified>"
    };
    $.when(SCEN_A.ES.channelService.modifyChannel(newChnl))
    .then(hlpr.CHECK.successNoContent, hlpr.CHECK.shouldNotFail)
    .then(hlpr.fetchChannelAndCheckF(SCEN_A, 'channel', newChnl), hlpr.CHECK.shouldNotFail)
    .then(function() {
          SCEN_A.channel.longDescription = newChnl.longDescription;
        }, hlpr.CHECK.shouldNotFail)
    .then(start,start);
  });

  asyncTest('CREATE A SECOND CHANNEL', hlpr.createChannelF(SCEN_A, 'channel2'));

  asyncTest('FETCH ALL CHANNELS I OWN', function() {
    $.when(SCEN_A.ES.channelService.listMyChannels())
    .then(hlpr.CHECK.success, hlpr.CHECK.shouldNotFail)
    .then(checkChannelsMatch, hlpr.CHECK.shouldNotFail)
    .then(start,start);
  });

  function checkChannelsMatch(data) {
    equal(data.channel.length, 2, "make sure we return two channels");
    var chnl1 = data.channel[0];
    var chnl2 = data.channel[1];
    if (data.channel[0].name != SCEN_A.channel.name) {
      // swap
      var x = chnl1;
      chnl1 = chnl2;
      chnl2 = x;
    }
    equal(JSON.stringify({
      channel : [ chnl1, chnl2 ]
    }), JSON.stringify({
      channel : [ SCEN_A.channel, SCEN_A.channel2 ]
    }), "and that they match what we expect");
  }

  asyncTest('DELETE CHANNEL', function() {
    $.when(SCEN_A.ES.channelService.deleteChannel(SCEN_A.channel2.id))
    .then(hlpr.CHECK.successNoContent, hlpr.CHECK.shouldNotFail)
    .then(fetchAndCheckChannels, hlpr.CHECK.shouldNotFail)
    .then(start, start);

  });

  function fetchAndCheckChannels(data) {
    return $.when(SCEN_A.ES.channelService.listMyChannels())
    .then(hlpr.CHECK.success, hlpr.CHECK.shouldNotFail)
    .then(checkOneChannel, hlpr.CHECK.shouldNotFail);
  }

  function checkOneChannel(data) {
    equal(data.channel.length, 1, "only one channel remains");
    equal(SCEN_A.channel.id, data.channel[0].id, "the correct channel is remaining");
  }

  asyncTest('CREATE ANOTHER SECOND CHANNEL', hlpr.createChannelF(SCEN_A, 'channel2'));

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
    testCreateChannelWithFail(SCEN_A.ES.evernymService.getAccessToken(), hlpr.CHECK.badRequest, SCEN_A.channel);
  });

})();
