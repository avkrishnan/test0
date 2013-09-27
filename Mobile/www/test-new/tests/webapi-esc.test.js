(function() {
	QUnit.config.testTimeout = 90000;
	QUnit.config.reorder = false;

	var api = new EvernymAPI();
	var hlpr = new ApiTestHelper(api);

	var SCEN_A = {};

	asyncTest('A enrolls', hlpr.enroll(SCEN_A));
	asyncTest('A logs in', hlpr.login(SCEN_A));

	asyncTest('A retrieves escalation plan', function() {
		$.when(api.fetchEscPlan(SCEN_A.accessToken))
		.then(api.CHECK.success)
		.then(function(data) {console.log(data);})
		.then(start);
	});

})();
