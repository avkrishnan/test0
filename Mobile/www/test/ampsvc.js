(function() {
  QUnit.config.testTimeout = 10000;
  QUnit.config.reorder = false;

  var hlpr = new ApiTestHelper();

  var svc = new EnymAmpSvc();
  
  asyncTest('Test amplify', function() {
    $.when(svc.request("getChnl", {id: "nancystigers"}))
    .then(function(data) {
      console.log(data);
      expect(0);
    })
  .then(start); 
  });

  asyncTest('Test amplify', function() {
    var acct = hlpr.generateAccount();
    $.when(svc.request("enroll", acct))
    .then(function(data) {
        console.log(data);
        expect(0);
      })
    .then(start); 
  });
  
})();
