 (function () {
  QUnit.config.testTimeout = 30000;
  
  
  
  module('Web API Account Tests', {
         setup: function () {
         //testUrl = stringformat('{0}/account/enroll', baseUrl);
         }
         });
  
  var timoutms = 30000;
  
  
  test('CREATE CHANNEL',  function () {
       stop(timoutms); //tell qunit to wait 5 seconds before timing out
       
       var api = new EvernymAPI();
       var account = api.generateAccount();
       var channel = api.generateChannel();
       var accessToken;
       api.enroll(account, api.HANDLER.expectSuccessNoContent, step1);
       function step1(){
       api.checkEmailAndVerify(account.emailaddress, step2);
       }
       function step2() {
       api.login(api.generateLogin(account), api.HANDLER.expectSuccess, step3);
       }
       function step3(data) {
       accessToken = data.accessToken;
       api.createChannel(accessToken, channel, api.HANDLER.expectCreated, step4);
       }
       function step4(data) {
       api.getChannel(accessToken, data.id, api.HANDLER.expectSuccess, step5);
       }
       function step5(data) {
       equal(channel.name, data.name);
       equal(channel.description, data.description);
       start();
       }
       });
  
  test('MODIFY CHANNEL NAME',  function () {
       ok(false,"not yet implemented");
       });
  
  test('MODIFY CHANNEL DESCRIPTION',  function () {
       stop(timoutms); //tell qunit to wait 5 seconds before timing out
       
       var api = new EvernymAPI();
       var account = api.generateAccount();
       var channel = api.generateChannel();
       
       var chnlId;
       var newDesc;
       
       var accessToken;
       
       api.enroll(account, api.HANDLER.expectSuccessNoContent, step1);
       
       function step1(){
       api.checkEmailAndVerify(account.emailaddress, step2);
       }
       function step2() {
       api.login(api.generateLogin(account), api.HANDLER.expectSuccess, step3);
       }
       function step3(data) {
       accessToken = data.accessToken;
       api.createChannel(accessToken, channel, api.HANDLER.expectCreated, step4);
       }
       function step4(data) {
       newDesc = channel.description + "<modified>";
       chnlId = data.id;
       var newChannel = {
       description: newDesc
       };
       api.modifyChannel(accessToken, chnlId, newChannel, api.HANDLER.expectSuccess, step5);
       }
       function step5(data) {
       api.getChannel(accessToken, chnlId, api.HANDLER.expectSuccess, step6);
       }
       function step6(data) {
       equal(data.description, newDesc);
       start();
       }
       });
  
  
  test('DELETE CHANNEL', function () {
       stop(timoutms); //tell qunit to wait 5 seconds before timing out
       var api = new EvernymAPI();
       var account = api.generateAccount();
       var channel1 = api.generateChannel();
       var channel2 = api.generateChannel();
       var channelid1 = '';
       var channelid2 = '';
       var accessToken;
       api.enroll(account, api.HANDLER.expectSuccessNoContent, step1);
       
       function step1(){
       console.log('check email and verify');
       api.checkEmailAndVerify(account.emailaddress, step2);
       }
       
       function step2() {
       console.log('login');
       api.login(api.generateLogin(account), api.HANDLER.expectSuccess, step3a);
       }
       
       function step3a(data) {
       accessToken = data.accessToken;
       console.log('create channel');
       api.createChannel(accessToken, channel1, api.HANDLER.expectCreated, step3b);
       }
       function step3b(data) {
       channelid1 = data.id;
       console.log('create second channel');
       api.createChannel(accessToken, channel2, api.HANDLER.expectCreated, step4);
       }
       function step4(data) {
       channelid2 = data.id;
       // delete the second channel
       console.log('delete second channel');
       api.deleteChannel(accessToken, channelid2, api.HANDLER.expectSuccessNoContent, step5);
       }
       function step5(data) {
       console.log('list owner channels');
       api.listOwnerChannels(accessToken, api.HANDLER.expectSuccess, step6);
       }
       function step6(data) {
       equal(data.channel.length, 1, "only one channel remains");
       
       equal(channelid1, data.channel[0].id, "the correct channel is remaining");
       start();
       }
       
       });
  
  test('DELETE WITH MESSAGES', function () {
       stop(timoutms); //tell qunit to wait 5 seconds before timing out
       var api = new EvernymAPI();
       var account = api.generateAccount();
       var channel1 = api.generateChannel();
       var channel2 = api.generateChannel();
       var channelid1 = '';
       var channelid2 = '';
       var accessToken;
       api.enroll(account, api.HANDLER.expectSuccessNoContent, step1);
       function step1(){
       console.log('check email and verify');
       api.checkEmailAndVerify(account.emailaddress, step2);
       }
       function step2() {
       api.login(api.generateLogin(account), api.HANDLER.expectSuccess, step3a);
       }
       function step3a(data) {
       accessToken = data.accessToken;
       // create channel 1
       api.createChannel(accessToken, channel1, api.HANDLER.expectCreated, step3b);
       }
       function step3b(data) {
       channelid1 = data.id;
       // create channel 2
       api.createChannel(accessToken, channel2, api.HANDLER.expectCreated, step4);
       }
       function step4(data) {
       channelid2 = data.id;
       // send a message on channel 2
       api.sendMessage(accessToken, channelid2, { text: 'HERE IS A TEST MESSAGE ON CHANNEL 2', type: 'FYI' }, api.HANDLER.expectCreated, step5);
       }
       function step5(data) {
       // delete Channel 2 which contains a message
       api.deleteChannel(accessToken, channelid2, api.HANDLER.expectSuccessNoContent, step6);
       }
       function step6(data) {
       api.listOwnerChannels(accessToken, api.HANDLER.expectSuccess, step8);
       }
       function step8(data) {
       equal(data.channel.length, 1, "only one channel remains");
       
       equal(channelid1, data.channel[0].id, "the correct channel is remaining");
       start();
       }
       });
  
  test('NO AUTH WITH CREATE CHANNEL', function () {
       stop(timoutms); //tell qunit to wait 5 seconds before timing out
       var api = new EvernymAPI();
       var channel = api.generateChannel();
       var accessToken = 'asdfasdf';
       api.createChannel(accessToken, channel, api.HANDLER.expectUnauthorized);
       });
  
  test('CREATE DUPLICATE CHANNEL FAIL', function () {
       stop(timoutms); //tell qunit to wait 5 seconds before timing out
       var api = new EvernymAPI();
       var account = api.generateAccount();
       var channel = api.generateChannel();
       var accessToken;
       api.enroll(account, api.HANDLER.expectSuccessNoContent, step2);
       function step2() {
       api.login(api.generateLogin(account), api.HANDLER.expectSuccess, step3);
       }
       function step3(data) {
       accessToken = data.accessToken;
       api.createChannel(accessToken, channel, api.HANDLER.expectCreated, step4);
       }
       function step4(data) {
       api.createChannel(accessToken, channel, api.HANDLER.expectBadRequest );
       start();
       }
       });
  
  
  test('GET A CHANNEL I OWN', function () {
       stop(timoutms); //tell qunit to wait 5 seconds before timing out
       var api = new EvernymAPI();
       var account = api.generateAccount();
       var accessToken;
       var channel = api.generateChannel();
       
       api.enroll(account, api.HANDLER.expectSuccessNoContent, step1);
       function step1(){
       api.checkEmailAndVerify(account.emailaddress, step2);
       }
       
       function step2() {
       api.login(api.generateLogin(account), api.HANDLER.expectSuccess, step3);
       }
       function step3(data) {
       accessToken = data.accessToken;
       api.createChannel(accessToken, channel, api.HANDLER.expectCreated, step4);
       }
       function step4(data) {
       
       api.getChannel(accessToken, data.id, api.HANDLER.expectSuccess, step5);
       }
       function step5(data){
       ok(true, JSON.stringify(data));
       start();
       
       }
       });
  
  test('LIST CHANNELS', function () {
       stop(timoutms); //tell qunit to wait 5 seconds before timing out
       var api = new EvernymAPI();
       var account = api.generateAccount();
       var accessToken;
       api.enroll(account, api.HANDLER.expectSuccessNoContent, step2);
       var channel = api.generateChannel();
       function step2() {
       api.login(api.generateLogin(account), api.HANDLER.expectSuccess, step3);
       }
       function step3(data) {
       accessToken = data.accessToken;
       api.createChannel(accessToken, channel, api.HANDLER.expectCreated, step4);
       }
       function step4(data) {
       api.listOwnerChannels(accessToken, api.HANDLER.expectSuccess);
       start();
       }
       });
  
  
  test('ZERO CHANNELS', function () {
       stop(timoutms); //tell qunit to wait 5 seconds before timing out
       var api = new EvernymAPI();
       var account = api.generateAccount();
       var accessToken;
       api.enroll(account, api.HANDLER.expectSuccessNoContent, step2);
       // var channel = api.generateChannel();
       function step2() {
       api.login(api.generateLogin(account), api.HANDLER.expectSuccess, step3);
       }
       function step3(data) {
       accessToken = data.accessToken;
       
       api.listOwnerChannels(accessToken, api.HANDLER.expectSuccess);
       start();
       }
       });
  
  test('SEND MESSAGE ON CHANNEL', function () {
       stop(timoutms); //tell qunit to wait 5 seconds before timing out
       var api = new EvernymAPI();
       var account = api.generateAccount();
       var accessToken;
       api.enroll(account, api.HANDLER.expectSuccessNoContent, step1);
       var channel = api.generateChannel();
       var channelid = '';
       
       function step1(){
       api.checkEmailAndVerify(account.emailaddress, step2);
       }
       
       
       function step2() {
       api.login(api.generateLogin(account), api.HANDLER.expectSuccess, step3);
       }
       function step3(data) {
       accessToken = data.accessToken;
       api.createChannel(accessToken, channel, api.HANDLER.expectCreated, step4);
       }
       function step4(data) {
       api.listOwnerChannels(accessToken, api.HANDLER.expectSuccess, step5);
       }
       function step5(data){
       ok(true, JSON.stringify(data));
       channelid = data.channel[0].id;
       api.sendMessage(accessToken, channelid, {text: 'HERE IS A MESSAGE 01', type: 'FYI'}, api.HANDLER.expectCreated ); // 'FYI','RAC','ACK'
       start();
       }
       });
  
  
  test('GET MESSAGES ON CHANNEL', function () {
       stop(timoutms); //tell qunit to wait 5 seconds before timing out
       var api = new EvernymAPI();
       var account = api.generateAccount();
       var accessToken;
       var channel = api.generateChannel();
       var channelid = '';
       
       api.enroll(account, api.HANDLER.expectSuccessNoContent, step1);
       
       function step1(){
       api.checkEmailAndVerify(account.emailaddress, step2);
       }
       
       
       function step2() {
       api.login(api.generateLogin(account), api.HANDLER.expectSuccess, step3);
       }
       function step3(data) {
       accessToken = data.accessToken;
       api.createChannel(accessToken, channel, api.HANDLER.expectCreated, step4);
       }
       function step4(data) {
       api.listOwnerChannels(accessToken, api.HANDLER.expectSuccess, step5);
       }
       function step5(data){
       ok(true, JSON.stringify(data));
       channelid = data.channel[0].id;
       api.sendMessage(accessToken, channelid, {text: 'HERE IS A MESSAGE 01', type: 'FYI'}, api.HANDLER.expectCreated, step6 ); // 'FYI','RAC','ACK'
       }
       function step6(data){
       ok(true, JSON.stringify(data));
       api.getMessages(accessToken, channelid, api.HANDLER.expectSuccess, step7 ); // 'FYI','RAC','ACK'
       }
       function step7(data){
       ok(true, JSON.stringify(data));
       start();
       }
       });
  
  
  test('NO MESSAGES ON CHANNEL', function () {
       stop(timoutms); //tell qunit to wait 5 seconds before timing out
       var api = new EvernymAPI();
       var account = api.generateAccount();
       var accessToken;
       api.enroll(account, api.HANDLER.expectSuccessNoContent, step2);
       var channel = api.generateChannel();
       var channelid = '';
       function step2() {
       api.login(api.generateLogin(account), api.HANDLER.expectSuccess, step3);
       }
       function step3(data) {
       accessToken = data.accessToken;
       api.createChannel(accessToken, channel, api.HANDLER.expectCreated, step4);
       }
       function step4(data) {
       api.listOwnerChannels(accessToken, api.HANDLER.expectSuccess, step5);
       }
       function step5(data) {
       ok(true, JSON.stringify(data));
       channelid = data.channel[0].id;
       
       api.getMessages(accessToken, channelid, api.HANDLER.expectSuccess, step7); // 'FYI','RAC','ACK'
       }
       function step7(data) {
       ok(true, JSON.stringify(data));
       start();
       }
       });
  
  
  
  
  
  
  
  
  })();
