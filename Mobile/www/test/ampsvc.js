(function() {
  QUnit.config.testTimeout = 10000;
  QUnit.config.reorder = false;

  var hlpr = new ApiTestHelper();

  var SCEN = hlpr.TestScenario();

  asyncTest('Test single channel fetch', function() {
    $.when(SCEN.ES.request("getChnl", {id: "nancystigers"}))
    .then(function(data) {
      console.log(data);
      expect(0);
    })
  .then(start);
  });

  asyncTest('Test enroll', function() {
    var acct = hlpr.generateAccount();
    $.when(SCEN.ES.request("enroll", acct))
    .then(function(data) {
        console.log(data);
        expect(0);
      })
    .then(start); 
  });
  
})();
